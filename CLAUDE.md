# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn install          # deps + git submodule update
yarn dev              # dev server (port 3000) + mask watch
yarn mask             # rebuild masks (run after changing app/masks/)
yarn lint             # next lint
yarn test:ci          # Jest single run
yarn build            # standalone server build
yarn export           # static export (for Tauri)
yarn app:build        # Tauri desktop exe
bash scripts/build-release.sh  # full release pipeline
```

## Env Vars

Copy `.env.template` to `.env.local`. Essentials: `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `CODE` (access password). `DEFAULT_MODEL` defaults to `deepseek-v4-pro`. `ENABLE_MCP=true` enables MCP.

## Architecture

**Stack**: Next.js 14 App Router + React 18 + TypeScript, Zustand state, SCSS Modules, Yarn v1. Tauri v1 desktop shell (Rust in `src-tauri/`).

**Critical insight — SPA on Next.js**: Despite App Router, routing is client-side only via `react-router-dom` `HashRouter`. `app/page.tsx` renders `<Home />` — the single shell. `app/layout.tsx` and `app/page.tsx` are the only server components; everything else is `"use client"`.

**LLM providers**: `LLMApi` abstract class (`app/client/api.ts`) → implementations in `app/client/platforms/` (OpenAI/Azure, Google, Moonshot, DeepSeek, XAI, 302.AI). `ClientApi` facade picks the right one by `ServiceProvider`. API calls proxy through Next.js API routes (`app/api/`) or use Rust `stream_fetch` (Tauri) to bypass CORS.

**State**: Zustand stores in `app/store/` with `createPersistStore` (localStorage/IndexedDB): `chat.ts` (sessions, messages, streaming, MCP tool execution), `config.ts` (model settings, theme), `mask.ts` (persona/prompt CRUD), `access.ts` (API keys).

**Masks & Skills**: Masks are persona templates — built-in masks in `app/masks/cn.ts`/`en.ts`, built to `public/masks.json` via `yarn mask`. Agency agents from the `agency-agents` git submodule are converted to JSON at build time. Skills (`app/skills/`) loads agency agents filtered by UI language.

**MCP**: Opt-in via `ENABLE_MCP=true`. Wraps `@modelcontextprotocol/sdk`. Tools injected into system prompt → assistant emits MCP JSON → `executeMcpAction` runs tools → results returned as chat messages. Static export stubs out MCP via webpack alias.

**Streaming**: Web uses SSE; Tauri uses Rust `stream_fetch` command with event listeners. Both paths through the same `fetch()` in `app/utils/stream.ts`.

**Build modes**: `standalone` = normal Next.js with SSR API routes. `export` = static HTML/JS/CSS, no code splitting, stubbed MCP, client-side-only API.

## Key Conventions

- **No test files exist yet** despite Jest config being ready
- **Do NOT modify** the attribution comment in `app/client/api.ts` `share()` function
- **SCSS Modules only** — no Tailwind or CSS-in-JS
- **Version** lives in `VERSION` file and `src-tauri/tauri.conf.json`
