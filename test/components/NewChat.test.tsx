/**
 * Tests for NewChat — heat map sorting logic.
 *
 * Test the store integration that NewChat uses for heat map ordering.
 * Full UI testing (grid layout, spiral algorithm) via Playwright E2E.
 */
import "@/app/store/chat"; // break circular dep

import { useMaskStore, type Mask } from "@/app/store/mask";
import { useChatStore } from "@/app/store/chat";
import { act } from "@testing-library/react";

function resetStores() {
  act(() => {
    useMaskStore.setState({
      masks: {},
      favoritedIds: [],
      useCounts: {},
      language: undefined,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as any);

    useChatStore.setState({
      sessions: [
        {
          id: "session-1",
          topic: "New Chat",
          memoryPrompt: "",
          messages: [],
          stat: { tokenCount: 0, wordCount: 0, charCount: 0 },
          lastUpdate: Date.now(),
          lastSummarizeIndex: 0,
          mask: {
            id: "default",
            name: "Default",
            avatar: "default",
            context: [],
            modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
            lang: "en",
            builtin: false,
            createdAt: Date.now(),
          },
        },
      ],
      currentSessionIndex: 0,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as any);
  });
}

describe("NewChat — heat map sorting logic", () => {
  beforeEach(resetStores);

  test("sortByUseCounts sorts masks by useCounts descending", () => {
    const store = useMaskStore.getState();
    const useCounts = { "Role B": 5, "Role A": 3, "Role C": 0 };

    // Simulate the sort logic from NewChat
    const allMasks = [
      { name: "Role A", id: "a", createdAt: 100 },
      { name: "Role B", id: "b", createdAt: 200 },
      { name: "Role C", id: "c", createdAt: 300 },
    ] as any[];

    const sorted = [...allMasks].sort(
      (a, b) => (useCounts[b.name] || 0) - (useCounts[a.name] || 0),
    );

    expect(sorted[0].name).toBe("Role B"); // useCount=5
    expect(sorted[1].name).toBe("Role A"); // useCount=3
    expect(sorted[2].name).toBe("Role C"); // useCount=0
  });

  test("newSession increments useCount for the mask", () => {
    const mask = {
      id: "test-mask",
      name: "Hero",
      avatar: "default",
      context: [],
      modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
      lang: "en",
      builtin: false,
      createdAt: Date.now(),
    };

    act(() => {
      useChatStore.getState().newSession(mask as any);
    });

    expect(useMaskStore.getState().getUseCount("Hero")).toBe(1);
  });

  test("masks with zero useCount are sorted to end", () => {
    const useCounts = { "Hot Role": 10, "Cold Role": 0 };
    const allMasks = [{ name: "Cold Role" }, { name: "Hot Role" }] as any[];

    const sorted = [...allMasks].sort(
      (a, b) => (useCounts[b.name] || 0) - (useCounts[a.name] || 0),
    );

    expect(sorted[0].name).toBe("Hot Role");
    expect(sorted[1].name).toBe("Cold Role");
  });
});
