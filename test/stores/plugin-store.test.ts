/**
 * Tests for usePluginStore — proxy field and FunctionToolService routing.
 *
 * The plugin store persists via idb-keyval (mocked in jest.setup.ts).
 */
import {
  usePluginStore,
  createEmptyPlugin,
  FunctionToolService,
} from "@/app/store/plugin";
import type { Plugin } from "@/app/store/plugin";
import { act } from "@testing-library/react";

// ── helpers ─────────────────────────────────────────────────────────

function resetStore() {
  // Clear FunctionToolService tool cache
  FunctionToolService.tools = {};

  act(() => {
    usePluginStore.setState({
      plugins: {},
      lastUpdateTime: 0,
      _hasHydrated: true,
    } as any);
  });
}

// ── default values ──────────────────────────────────────────────────

describe("usePluginStore — defaults", () => {
  beforeEach(resetStore);

  test("plugins starts empty", () => {
    expect(usePluginStore.getState().plugins).toEqual({});
  });

  test("createEmptyPlugin sets proxy: true by default", () => {
    const empty = createEmptyPlugin();
    expect(empty.proxy).toBe(true);
  });

  test("create returns plugin with proxy: true", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({ title: "Test Plugin" });
    });
    expect(plugin!.proxy).toBe(true);
  });
});

// ── proxy field ─────────────────────────────────────────────────────

describe("usePluginStore — proxy field", () => {
  beforeEach(resetStore);

  test("updatePlugin sets proxy to false", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({
        title: "Plugin",
        content:
          "openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0\nservers:\n  - url: https://example.com/api",
      });
    });
    act(() => {
      usePluginStore.getState().updatePlugin(plugin!.id, (p: Plugin) => {
        p.proxy = false;
      });
    });
    const updated = usePluginStore.getState().get(plugin!.id);
    expect(updated?.proxy).toBe(false);
  });

  test("updatePlugin sets proxy back to true", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({
        title: "Plugin",
        content:
          "openapi: 3.0.0\ninfo:\n  title: Test\n  version: 1.0.0\nservers:\n  - url: https://example.com/api",
        proxy: false,
      });
    });
    act(() => {
      usePluginStore.getState().updatePlugin(plugin!.id, (p: Plugin) => {
        p.proxy = true;
      });
    });
    const updated = usePluginStore.getState().get(plugin!.id);
    expect(updated?.proxy).toBe(true);
  });

  test("proxy field persists alongside other plugin fields", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({
        title: "Full Plugin",
        version: "2.0.0",
        proxy: false,
      });
    });
    const stored = usePluginStore.getState().get(plugin!.id);
    expect(stored?.title).toBe("Full Plugin");
    expect(stored?.version).toBe("2.0.0");
    expect(stored?.proxy).toBe(false);
  });

  test("getAll returns plugins with proxy field", () => {
    act(() => {
      usePluginStore.getState().create({ title: "P1", proxy: true });
      usePluginStore.getState().create({ title: "P2", proxy: false });
    });
    const all = usePluginStore.getState().getAll();
    expect(all).toHaveLength(2);
    const proxies = all.map((p) => p.proxy).sort();
    expect(proxies).toEqual([false, true]);
  });
});

// ── CRUD ────────────────────────────────────────────────────────────

describe("usePluginStore — CRUD", () => {
  beforeEach(resetStore);

  test("create returns a new plugin with nanoid", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({ title: "New Plugin" });
    });
    expect(plugin!.id).toBeTruthy();
    expect(plugin!.title).toBe("New Plugin");
    expect(plugin!.builtin).toBe(false);
  });

  test("delete removes a plugin", () => {
    const store = usePluginStore.getState();
    let plugin: Plugin;
    act(() => {
      plugin = store.create({ title: "Remove Me" });
    });
    const id = plugin!.id;
    act(() => {
      usePluginStore.getState().delete(id);
    });
    expect(usePluginStore.getState().get(id)).toBeUndefined();
  });

  test("getAll returns plugins sorted by createdAt desc", () => {
    act(() => {
      usePluginStore.getState().create({ title: "Plugin A", createdAt: 100 });
      usePluginStore.getState().create({ title: "Plugin B", createdAt: 200 });
    });
    const all = usePluginStore.getState().getAll();
    expect(all[0].title).toBe("Plugin B"); // most recent first
    expect(all[1].title).toBe("Plugin A");
  });
});
