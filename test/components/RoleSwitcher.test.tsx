/**
 * Tests for RoleSwitcher — recordUse on skill apply.
 *
 * Test the store integration that RoleSwitcher uses for usage tracking.
 * Full UI testing (popup, search, grouping) via Playwright E2E.
 */
import "@/app/store/chat"; // break circular dep

import { useMaskStore } from "@/app/store/mask";
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

describe("RoleSwitcher — recordUse on skill apply", () => {
  beforeEach(resetStores);

  test("recordUse increments count for applied skill name", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();

    // Simulate applying "Code Assistant" skill
    act(() => recordUse("Code Assistant"));
    expect(getUseCount("Code Assistant")).toBe(1);

    // Apply again
    act(() => recordUse("Code Assistant"));
    expect(getUseCount("Code Assistant")).toBe(2);
  });

  test("recordUse tracks different skills independently", () => {
    const { recordUse, getUseCount } = useMaskStore.getState();

    act(() => {
      recordUse("Code Assistant");
      recordUse("Writer");
      recordUse("Code Assistant");
      recordUse("Analyst");
    });

    expect(getUseCount("Code Assistant")).toBe(2);
    expect(getUseCount("Writer")).toBe(1);
    expect(getUseCount("Analyst")).toBe(1);
    expect(getUseCount("Unknown")).toBe(0);
  });

  test("applySkill simulation updates session mask", () => {
    const skill = {
      name: "Code Assistant",
      avatar: "code",
      context: [
        { role: "system", content: "You are a coding expert.", date: "" },
      ],
      modelConfig: { model: "gpt-4", temperature: 0.5, top_p: 1 },
      lang: "en",
      builtin: true,
      createdAt: Date.now(),
      id: "skill-1",
    };

    // Simulate applySkill: recordUse + update session
    act(() => {
      useMaskStore.getState().recordUse(skill.name);
      useChatStore
        .getState()
        .updateTargetSession(useChatStore.getState().currentSession(), (s) => {
          s.mask.name = skill.name;
          s.mask.avatar = skill.avatar;
          s.mask.context = skill.context as any;
          s.mask.modelConfig = skill.modelConfig;
          s.topic = skill.name;
        });
    });

    const session = useChatStore.getState().currentSession();
    expect(session.mask.name).toBe("Code Assistant");
    expect(session.mask.avatar).toBe("code");
    expect(session.topic).toBe("Code Assistant");
    expect(useMaskStore.getState().getUseCount("Code Assistant")).toBe(1);
  });
});
