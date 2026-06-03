/**
 * Tests for cross-store interaction: chatStore.newSession() → maskStore.recordUse().
 *
 * Both stores persist via idb-keyval (mocked in jest.setup.ts).
 */
import { useChatStore } from "@/app/store/chat";
import { useMaskStore } from "@/app/store/mask";
import { useAppConfig } from "@/app/store/config";
import { act } from "@testing-library/react";

// ── helpers ─────────────────────────────────────────────────────────

function makeMask(overrides: Record<string, unknown> = {}) {
  return {
    id: "test-mask-id",
    name: "Test Mask",
    avatar: "default",
    context: [],
    modelConfig: { model: "gpt-4", temperature: 0.7, top_p: 1 },
    lang: "en",
    builtin: false,
    createdAt: Date.now(),
    ...overrides,
  };
}

function resetStores() {
  act(() => {
    useMaskStore.setState({
      masks: {},
      favoritedIds: [],
      useCounts: {},
      language: undefined,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as unknown as Partial<ReturnType<typeof useMaskStore.getState>>);

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
    } as unknown as Partial<ReturnType<typeof useChatStore.getState>>);
  });
}

// ── tests ───────────────────────────────────────────────────────────

describe("chatStore.newSession — heat map integration", () => {
  beforeEach(resetStores);

  test("newSession with mask records use of mask.name", () => {
    const mask = makeMask({ name: "hero" }) as any;
    act(() => {
      useChatStore.getState().newSession(mask);
    });
    expect(useMaskStore.getState().getUseCount("hero")).toBe(1);
  });

  test("newSession without mask does NOT record use", () => {
    const before = { ...useMaskStore.getState().useCounts };
    act(() => {
      useChatStore.getState().newSession(undefined);
    });
    expect(useMaskStore.getState().useCounts).toEqual(before);
  });

  test("newSession called 3 times increments count to 3", () => {
    const mask = makeMask({ name: "repeated-role" }) as any;
    act(() => {
      useChatStore.getState().newSession(mask);
      useChatStore.getState().newSession(mask);
      useChatStore.getState().newSession(mask);
    });
    expect(useMaskStore.getState().getUseCount("repeated-role")).toBe(3);
  });

  test("newSession with different masks records each independently", () => {
    const alpha = makeMask({ name: "alpha" }) as any;
    const beta = makeMask({ name: "beta" }) as any;
    act(() => {
      useChatStore.getState().newSession(alpha);
      useChatStore.getState().newSession(beta);
    });
    expect(useMaskStore.getState().getUseCount("alpha")).toBe(1);
    expect(useMaskStore.getState().getUseCount("beta")).toBe(1);
  });

  test("newSession sets session.topic to mask.name", () => {
    const mask = makeMask({ name: "custom-topic" }) as any;
    act(() => {
      useChatStore.getState().newSession(mask);
    });
    const session = useChatStore.getState().currentSession();
    expect(session?.topic).toBe("custom-topic");
  });
});
