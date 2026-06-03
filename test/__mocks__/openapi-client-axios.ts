// Stub for openapi-client-axios (requires Node.js APIs, unavailable in jsdom)
const mockApi = {
  initSync: () => {},
  getOperations: () => [],
  getClient: () => ({ paths: {} }),
  definition: { info: { title: "", version: "" } },
};

const OpenAPIClientAxiosMock = function (this: any, _config: any) {
  return mockApi;
} as any;

export default OpenAPIClientAxiosMock;
