import { NextRequest, NextResponse } from "next/server";
import { getServerSideConfig } from "@/app/config/server";

declare const __non_webpack_require__: NodeRequire | undefined;

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Proxy Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const serverConfig = getServerSideConfig();

  req.nextUrl.searchParams.delete("path");
  req.nextUrl.searchParams.delete("provider");

  const subpath = params.path.join("/");
  const baseUrl = req.headers.get("x-base-url") || "";
  const fetchUrl = `${baseUrl}/${subpath}?${req.nextUrl.searchParams.toString()}`;
  const skipHeaders = ["connection", "host", "origin", "referer", "cookie"];
  const headers = new Headers(
    Array.from(req.headers.entries()).filter((item) => {
      if (
        item[0].indexOf("x-") > -1 ||
        item[0].indexOf("sec-") > -1 ||
        skipHeaders.includes(item[0])
      ) {
        return false;
      }
      return true;
    }),
  );

  // Ensure requests don't look like bots — SearXNG limiter checks these
  if (!headers.get("user-agent")) {
    headers.set("user-agent", "ActorAIchat/1.0");
  }
  if (!headers.get("accept")) {
    headers.set("accept", "application/json, text/html");
  }
  if (!headers.get("accept-language")) {
    headers.set("accept-language", "en-US,en;q=0.9");
  }

  if (baseUrl.includes("api.openai.com")) {
    if (!serverConfig.apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }
    headers.set("Authorization", `Bearer ${serverConfig.apiKey}`);
  }

  const controller = new AbortController();
  const fetchOptions: RequestInit = {
    headers,
    method: req.method,
    body: req.body,
    redirect: "manual" as RequestRedirect,
    // @ts-ignore — duplex required by Node.js fetch for POST with body
    duplex: "half",
    signal: controller.signal,
  };

  // Use local HTTP proxy when configured (e.g. Clash/V2Ray VPN).
  // Node.js global fetch does not accept undici's dispatcher — we must use
  // undici's own fetch() which supports ProxyAgent natively.
  let doFetch: typeof fetch = fetch;
  if (serverConfig.proxyUrl) {
    const _require =
      typeof __non_webpack_require__ !== "undefined"
        ? __non_webpack_require__
        : require;
    const undici = _require("undici");
    (fetchOptions as any).dispatcher = new undici.ProxyAgent(
      serverConfig.proxyUrl,
    );
    doFetch = undici.fetch;
  }

  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000);

  try {
    const res = await doFetch(fetchUrl, fetchOptions);
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    newHeaders.set("X-Accel-Buffering", "no");
    newHeaders.delete("content-encoding");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } catch (e: any) {
    console.error("[Proxy] fetch failed:", fetchUrl, e.message || e);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        url: fetchUrl,
        detail: e.message || String(e),
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
