/**
 * Tests for MaskPage — star/favorite display logic.
 *
 * These test the store integration patterns used by MaskPage
 * rather than full DOM rendering (which requires complex mocking).
 * Full UI testing is covered by Playwright E2E tests.
 */
import "@/app/store/chat"; // break circular dep

import { useMaskStore, type Mask } from "@/app/store/mask";
import { act } from "@testing-library/react";

function makeTestMask(id: string, name: string, createdAt: number): Mask {
  return {
    id,
    name,
    createdAt,
    builtin: false,
    avatar: "default",
    context: [],
    modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
    lang: "en",
  };
}

function resetStore() {
  act(() => {
    useMaskStore.setState({
      masks: {},
      favoritedIds: [],
      useCounts: {},
      language: undefined,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as any);
  });
}

describe("MaskPage — favorites display logic", () => {
  beforeEach(resetStore);

  test("displayMasks sorts favorited masks first", () => {
    const store = useMaskStore.getState();

    // Create 3 masks with different dates
    act(() => {
      store.create({
        id: "m-1",
        name: "Alpha",
        createdAt: 100,
        context: [],
        modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
        lang: "en",
      } as any);
      store.create({
        id: "m-2",
        name: "Beta",
        createdAt: 200,
        context: [],
        modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
        lang: "en",
      } as any);
      store.create({
        id: "m-3",
        name: "Gamma",
        createdAt: 300,
        context: [],
        modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
        lang: "en",
      } as any);
    });

    // Favorite the oldest mask "Alpha"
    act(() => {
      store.toggleFavorite("Alpha");
    });

    // Get all masks and simulate the displayMasks sort logic
    const allMasks = store.getAll().filter((m) => !m.builtin);
    const sorted = [...allMasks].sort((a, b) => {
      const aFav = store.isFavorited(a.name) ? 0 : 1;
      const bFav = store.isFavorited(b.name) ? 0 : 1;
      if (aFav !== bFav) return aFav - bFav;
      return b.createdAt - a.createdAt;
    });

    // "Alpha" (favorited) should be first
    expect(sorted[0].name).toBe("Alpha");
    // Then "Gamma" (most recent), then "Beta"
    expect(sorted[1].name).toBe("Gamma");
    expect(sorted[2].name).toBe("Beta");
  });

  test("displayMasks sorts by createdAt when no favorites", () => {
    const store = useMaskStore.getState();

    act(() => {
      store.create({
        name: "First",
        createdAt: 100,
        context: [],
        modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
        lang: "en",
      } as any);
      store.create({
        name: "Second",
        createdAt: 200,
        context: [],
        modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
        lang: "en",
      } as any);
    });

    const allMasks = store.getAll().filter((m) => !m.builtin);
    const sorted = [...allMasks].sort((a, b) => b.createdAt - a.createdAt);

    expect(sorted[0].name).toBe("Second"); // newer first
    expect(sorted[1].name).toBe("First");
  });

  test("toggleFavorite and isFavorited work correctly", () => {
    const store = useMaskStore.getState();

    expect(store.isFavorited("role-x")).toBe(false);

    act(() => store.toggleFavorite("role-x"));
    expect(store.isFavorited("role-x")).toBe(true);

    act(() => store.toggleFavorite("role-x"));
    expect(store.isFavorited("role-x")).toBe(false);
  });
});
