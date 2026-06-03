import React, { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Render wrapper with MemoryRouter ────────────────────────────────

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  initialEntries?: string[];
}

function AllProviders({
  children,
  initialEntries,
}: {
  children: ReactNode;
  initialEntries?: string[];
}) {
  return (
    <MemoryRouter initialEntries={initialEntries ?? ["/"]}>
      {children}
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries, ...options }: CustomRenderOptions = {},
) {
  return render(ui, {
    wrapper: (props) => (
      <AllProviders {...props} initialEntries={initialEntries} />
    ),
    ...options,
  });
}

// ── Store reset helpers ─────────────────────────────────────────────

// Import chat store FIRST to break circular dependency:
// mask.ts → chat.ts (DEFAULT_TOPIC) → locales → chat.ts → mask.ts
import { useChatStore } from "@/app/store/chat";
import { DEFAULT_MASK_STATE, useMaskStore } from "@/app/store/mask";
import { usePluginStore } from "@/app/store/plugin";

export function resetMaskStore() {
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

export function resetPluginStore() {
  act(() => {
    usePluginStore.setState({
      plugins: {},
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as unknown as Partial<ReturnType<typeof usePluginStore.getState>>);
  });
}

export function resetChatStore() {
  act(() => {
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
          mask: {},
        },
      ],
      currentSessionIndex: 0,
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as unknown as Partial<ReturnType<typeof useChatStore.getState>>);
  });
}

export function resetAllStores() {
  resetMaskStore();
  resetPluginStore();
  resetChatStore();
}

// ── Re-exports ──────────────────────────────────────────────────────

export * from "@testing-library/react";
export { act };
