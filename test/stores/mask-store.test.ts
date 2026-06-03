/**
 * Tests for useMaskStore — heat map (useCounts) and favorites (favoritedIds).
 *
 * The mask store persists via idb-keyval (mocked in jest.setup.ts).
 * We set _hasHydrated: true so the persist layer allows writes immediately.
 */
// Import chat store FIRST to break circular dependency resolution order:
// mask.ts → chat.ts (DEFAULT_TOPIC) → locales → chat.ts → mask.ts
import "@/app/store/chat";

import { useMaskStore, DEFAULT_MASK_STATE } from "@/app/store/mask";
import { useAppConfig } from "@/app/store/config";
import { act } from "@testing-library/react";

// ── helpers ─────────────────────────────────────────────────────────

function resetStore() {
  act(() => {
    useMaskStore.setState({
      masks: {},
      favoritedIds: [],
      useCounts: {},
      language: undefined,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as unknown as Partial<ReturnType<typeof useMaskStore.getState>>);
  });
}

// ── defaults ────────────────────────────────────────────────────────

describe("useMaskStore — default state", () => {
  beforeEach(resetStore);

  test("masks starts as empty object", () => {
    expect(useMaskStore.getState().masks).toEqual({});
  });

  test("favoritedIds starts as empty array", () => {
    expect(useMaskStore.getState().favoritedIds).toEqual([]);
  });

  test("useCounts starts as empty object", () => {
    expect(useMaskStore.getState().useCounts).toEqual({});
  });
});

// ── recordUse / getUseCount (heat map) ──────────────────────────────

describe("useMaskStore — recordUse / getUseCount", () => {
  beforeEach(resetStore);

  test("recordUse increments count from 0 to 1 for new name", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    act(() => recordUse("role-alpha"));
    expect(getUseCount("role-alpha")).toBe(1);
  });

  test("recordUse increments count for existing name", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    act(() => {
      recordUse("role-alpha");
      recordUse("role-alpha");
    });
    expect(getUseCount("role-alpha")).toBe(2);
  });

  test("recordUse tracks multiple names independently", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    act(() => {
      recordUse("role-alpha");
      recordUse("role-beta");
      recordUse("role-alpha");
    });
    expect(getUseCount("role-alpha")).toBe(2);
    expect(getUseCount("role-beta")).toBe(1);
    expect(getUseCount("role-gamma")).toBe(0);
  });

  test("getUseCount returns 0 for never-used name", () => {
    const { getUseCount } = useMaskStore.getState();
    expect(getUseCount("unknown-role")).toBe(0);
  });

  test("recordUse with empty string", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    act(() => recordUse(""));
    expect(getUseCount("")).toBe(1);
  });

  test("recordUse with special characters in name", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    act(() => recordUse("🌟 角色 / 测试"));
    expect(getUseCount("🌟 角色 / 测试")).toBe(1);
  });

  test("recordUse is immutable — useCounts is a new object each time", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();
    const before = useMaskStore.getState().useCounts;
    act(() => recordUse("role-alpha"));
    const after = useMaskStore.getState().useCounts;
    expect(before).not.toBe(after);
    expect(before).toEqual({});
  });
});

// ── toggleFavorite / isFavorited ────────────────────────────────────

describe("useMaskStore — toggleFavorite / isFavorited", () => {
  beforeEach(resetStore);

  test("isFavorited returns false for non-favorited id", () => {
    const { isFavorited } = useMaskStore.getState();
    expect(isFavorited("mask-1")).toBe(false);
  });

  test("toggleFavorite adds id when not favorited", () => {
    const { toggleFavorite } = useMaskStore.getState();
    act(() => toggleFavorite("mask-1"));
    const state = useMaskStore.getState();
    expect(state.isFavorited("mask-1")).toBe(true);
    expect(state.favoritedIds).toContain("mask-1");
  });

  test("toggleFavorite removes id when already favorited", () => {
    const { toggleFavorite, isFavorited } = useMaskStore.getState();
    act(() => {
      toggleFavorite("mask-1");
      toggleFavorite("mask-1");
    });
    expect(isFavorited("mask-1")).toBe(false);
    expect(useMaskStore.getState().favoritedIds).not.toContain("mask-1");
  });

  test("toggleFavorite prepends new favorites", () => {
    const { toggleFavorite } = useMaskStore.getState();
    act(() => {
      toggleFavorite("mask-1");
      toggleFavorite("mask-2");
    });
    const { favoritedIds } = useMaskStore.getState();
    expect(favoritedIds[0]).toBe("mask-2"); // most recently added first
    expect(favoritedIds[1]).toBe("mask-1");
  });

  test("toggleFavorite on existing favorite removes it from array", () => {
    const { toggleFavorite } = useMaskStore.getState();
    act(() => toggleFavorite("mask-1"));
    expect(useMaskStore.getState().favoritedIds).toHaveLength(1);
    act(() => toggleFavorite("mask-1"));
    expect(useMaskStore.getState().favoritedIds).toHaveLength(0);
  });

  test("toggleFavorite is idempotent — toggling twice returns to original", () => {
    const { toggleFavorite } = useMaskStore.getState();
    const before = [...useMaskStore.getState().favoritedIds];
    act(() => {
      toggleFavorite("mask-x");
      toggleFavorite("mask-x");
    });
    expect(useMaskStore.getState().favoritedIds).toEqual(before);
  });
});

// ── CRUD operations ─────────────────────────────────────────────────

describe("useMaskStore — CRUD", () => {
  beforeEach(resetStore);

  test("create returns a new mask with nano id", () => {
    const { create } = useMaskStore.getState();
    let mask: ReturnType<typeof create>;
    act(() => {
      mask = create({ name: "Test Mask" });
    });
    expect(mask!.id).toBeTruthy();
    expect(mask!.name).toBe("Test Mask");
    expect(mask!.builtin).toBe(false);
    expect(useMaskStore.getState().masks[mask!.id]).toEqual(mask);
  });

  test("delete removes a mask", () => {
    const { create, delete: del } = useMaskStore.getState();
    let mask: ReturnType<typeof create>;
    act(() => {
      mask = create({ name: "Delete Me" });
    });
    act(() => del(mask!.id));
    expect(useMaskStore.getState().masks[mask!.id]).toBeUndefined();
  });

  test("get returns mask by id", () => {
    const { create, get } = useMaskStore.getState();
    let mask: ReturnType<typeof create>;
    act(() => {
      mask = create({ name: "Get Me" });
    });
    const found = get(mask!.id);
    expect(found?.name).toBe("Get Me");
  });

  test("get returns undefined for bad id", () => {
    const { get } = useMaskStore.getState();
    expect(get("nonexistent")).toBeUndefined();
  });

  test("updateMask modifies a mask", () => {
    const { create, updateMask, get } = useMaskStore.getState();
    let mask: ReturnType<typeof create>;
    act(() => {
      mask = create({ name: "Old Name" });
    });
    act(() => {
      updateMask(mask!.id, (m) => {
        m.name = "New Name";
      });
    });
    expect(get(mask!.id)?.name).toBe("New Name");
  });
});
