/**
 * Tests for PluginPage — proxy checkbox logic.
 *
 * Test the store integration that PluginPage uses for the proxy toggle.
 * Full UI testing (checkbox rendering, click handling) via Playwright E2E.
 */
import "@/app/store/chat"; // break circular dep

import { usePluginStore, type Plugin } from "@/app/store/plugin";
import { act } from "@testing-library/react";

function resetStore() {
  act(() => {
    usePluginStore.setState({
      plugins: {},
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as any);
  });
}

describe("PluginPage — proxy checkbox logic", () => {
  beforeEach(resetStore);

  test("new plugin has proxy: true (checkbox checked)", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({ title: "Test Plugin" });
    });
    // proxy !== false → checked
    expect(plugin!.proxy !== false).toBe(true);
  });

  test("updatePlugin can set proxy to false (uncheck)", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({
        title: "Plugin",
        content:
          "openapi: 3.0.0\ninfo:\n  title: T\n  version: 1.0.0\nservers:\n  - url: https://example.com/api",
      });
    });
    // Simulate unchecking checkbox
    act(() => {
      store.updatePlugin(plugin!.id, (p: Plugin) => {
        p.proxy = false;
      });
    });
    const updated = store.get(plugin!.id);
    expect(updated?.proxy).toBe(false);
    expect(updated?.proxy !== false).toBe(false); // checkbox unchecked
  });

  test("updatePlugin can set proxy back to true (recheck)", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({
        title: "Plugin",
        proxy: false,
        content:
          "openapi: 3.0.0\ninfo:\n  title: T\n  version: 1.0.0\nservers:\n  - url: https://example.com/api",
      });
    });
    // Simulate rechecking checkbox
    act(() => {
      store.updatePlugin(plugin!.id, (p: Plugin) => {
        p.proxy = true;
      });
    });
    const updated = store.get(plugin!.id);
    expect(updated?.proxy).toBe(true);
    expect(updated?.proxy !== false).toBe(true); // checkbox checked
  });

  test("proxy field defaults to true when undefined", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({ title: "No Proxy Field" });
    });
    // When proxy is not explicitly set, it defaults to true in createEmptyPlugin
    expect(plugin!.proxy).toBe(true);
  });
});
