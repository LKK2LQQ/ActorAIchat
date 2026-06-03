/**
 * Tests for SearXNG plugin config validation.
 *
 * Validates public/plugins/searxng.json is a valid OpenAPI 3.0 spec.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "../../public/plugins/searxng.json");

describe("SearXNG Plugin Config", () => {
  let config: any;

  beforeAll(() => {
    const raw = fs.readFileSync(configPath, "utf-8");
    config = JSON.parse(raw);
  });

  test("file is valid JSON", () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  test("is a valid OpenAPI 3.0 spec", () => {
    expect(config.openapi).toBe("3.0.0");
    expect(config.info).toBeDefined();
    expect(config.info.title).toBe("SearXNG Search");
    expect(config.info.version).toBe("1.0.0");
  });

  test("servers has valid SearXNG instance URL", () => {
    expect(Array.isArray(config.servers)).toBe(true);
    expect(config.servers.length).toBeGreaterThan(0);
    expect(config.servers[0].url).toMatch(/^https?:\/\//);
  });

  test("paths contains /searxng/search endpoint", () => {
    expect(config.paths).toBeDefined();
    expect(config.paths["/searxng/search"]).toBeDefined();
    const endpoint = config.paths["/searxng/search"];
    expect(endpoint.get).toBeDefined();
    expect(endpoint.get.operationId).toBe("SearXNGSearch");
  });

  test("search endpoint has required query params (q, format)", () => {
    const params = config.paths["/searxng/search"].get.parameters;
    const required = params.filter((p: any) => p.required);
    const names = required.map((p: any) => p.name);
    expect(names).toContain("q");
    expect(names).toContain("format");
  });
});
