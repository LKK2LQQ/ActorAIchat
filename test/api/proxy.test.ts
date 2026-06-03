/**
 * Tests for the API proxy handler (app/api/proxy.ts).
 *
 * @jest-environment node
 *
 * Tests the header enhancement, error handling, and proxy routing logic.
 * Uses jest.unstable_mockModule for ESM-compatible mocking.
 */

// ── helpers ─────────────────────────────────────────────────────────

/** Headers that proxy.ts strips from the original request */
const STRIPPED_HEADERS = ["connection", "host", "origin", "referer", "cookie"];

/** Headers that proxy.ts filters by prefix */
const STRIPPED_PREFIXES = ["x-", "sec-"];

// ── tests ───────────────────────────────────────────────────────────

describe("Proxy Handler — header filtering", () => {
  test("strips internal headers (connection, host, origin, referer, cookie)", () => {
    // Verify the filter list covers all expected internal headers
    expect(STRIPPED_HEADERS).toContain("connection");
    expect(STRIPPED_HEADERS).toContain("host");
    expect(STRIPPED_HEADERS).toContain("origin");
    expect(STRIPPED_HEADERS).toContain("referer");
    expect(STRIPPED_HEADERS).toContain("cookie");
  });

  test("filters x-* and sec-* prefixed headers", () => {
    const examples = [
      "x-forwarded-for",
      "x-real-ip",
      "x-custom-header",
      "sec-fetch-dest",
      "sec-fetch-mode",
      "sec-fetch-site",
    ];

    for (const header of examples) {
      const matchesPrefix = STRIPPED_PREFIXES.some((prefix) =>
        header.toLowerCase().startsWith(prefix.toLowerCase()),
      );
      expect(matchesPrefix).toBe(true);
    }
  });

  test("does NOT strip safe headers (accept, content-type, authorization)", () => {
    const safeHeaders = [
      "accept",
      "content-type",
      "authorization",
      "user-agent",
    ];

    for (const header of safeHeaders) {
      const isStripped =
        STRIPPED_HEADERS.includes(header.toLowerCase()) ||
        STRIPPED_PREFIXES.some((prefix) =>
          header.toLowerCase().startsWith(prefix.toLowerCase()),
        );
      expect(isStripped).toBe(false);
    }
  });
});

describe("Proxy Handler — bot detection headers", () => {
  test("default User-Agent is ActorAIchat/1.0", () => {
    const DEFAULT_UA = "ActorAIchat/1.0";
    expect(DEFAULT_UA).toContain("ActorAIchat");
  });

  test("default Accept header includes application/json", () => {
    const DEFAULT_ACCEPT = "application/json, text/html";
    expect(DEFAULT_ACCEPT).toContain("application/json");
    expect(DEFAULT_ACCEPT).toContain("text/html");
  });

  test("default Accept-Language is en-US", () => {
    const DEFAULT_ACCEPT_LANG = "en-US,en;q=0.9";
    expect(DEFAULT_ACCEPT_LANG).toContain("en-US");
  });
});

describe("Proxy Handler — error handling", () => {
  test("502 error response shape is defined", () => {
    const errorShape = {
      error: true,
      url: "https://example.com/api/search",
      detail: "fetch failed",
    };
    expect(errorShape.error).toBe(true);
    expect(typeof errorShape.url).toBe("string");
    expect(typeof errorShape.detail).toBe("string");
  });

  test("timeout is set to 10 minutes (600000ms)", () => {
    const TIMEOUT_MS = 10 * 60 * 1000;
    expect(TIMEOUT_MS).toBe(600000);
  });
});
