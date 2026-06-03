<div align="center">

<a href='https://nextchat.club'>
  <img src="https://github.com/user-attachments/assets/83bdcc07-ae5e-4954-a53a-ac151ba6ccf3" width="1000" alt="icon"/>
</a>

<h1 align="center">ActorAIchat</h1>

English / [简体中文](./README_CN.md)

✨ Light and Fast AI Assistant — Claude, DeepSeek, GPT-4, Gemini Pro & 8+ providers.

[![Web][Web-image]][web-url]
[![Windows][Windows-image]][download-url]
[![MacOS][MacOS-image]][download-url]
[![Linux][Linux-image]][download-url]

[Web App Demo](https://app.nextchat.club) / [Desktop App](https://github.com/Yidadaa/ChatGPT-Next-Web/releases)

[web-url]: https://app.nextchat.club/
[download-url]: https://github.com/Yidadaa/ChatGPT-Next-Web/releases
[Web-image]: https://img.shields.io/badge/Web-PWA-orange?logo=microsoftedge
[Windows-image]: https://img.shields.io/badge/-Windows-blue?logo=windows
[MacOS-image]: https://img.shields.io/badge/-MacOS-black?logo=apple
[Linux-image]: https://img.shields.io/badge/-Linux-333?logo=ubuntu

[<img src="https://vercel.com/button" alt="Deploy on Vercel" height="30">](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FChatGPTNextWeb%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=nextchat&repository-name=NextChat)

</div>

## Supported LLM Providers

OpenAI · Azure · Google Gemini · Anthropic Claude · DeepSeek · Moonshot · XAI (Grok) · ByteDance (Doubao) · Alibaba (Qwen) · 302.AI · iFlytek Spark · ChatGLM · Baidu · SiliconFlow

## Features

- **Deploy for free with one-click** on Vercel in under 1 minute
- Compact client (~5MB) on Linux/Windows/MacOS
- Fully compatible with self-deployed LLMs: [RWKV-Runner](https://github.com/josStorer/RWKV-Runner), [LocalAI](https://github.com/go-skynet/LocalAI)
- Privacy first — all data stored locally in the browser (IndexedDB)
- Markdown support: LaTex, mermaid, code highlight
- Responsive design, dark mode and PWA
- Fast first screen loading (~100kb), streaming response
- Prompt templates (masks) — create, share and debug chat tools
- Awesome prompts from [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- Auto-compress chat history for long conversations
- I18n: English, 简体中文, 繁體中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia

### 🆕 v1.1.0 — Role Enhancement

- **🔥 Heat Map** — Role usage frequency tracking. Most-used roles gravitate toward the spiral grid center on the NewChat page.
- **⭐ Favorites** — Star/unstar any mask on the MaskPage. Favorited masks always appear first.
- **🔌 Plugin Proxy Toggle** — Per-plugin "Use Proxy" checkbox. Disable proxy for plugins that need direct API access.
- **🌐 API Proxy Upgrades** — Auto-set browser headers to avoid bot detection. Built-in `undici` ProxyAgent for VPN/Clash users (`PROXY_URL`).
- **🔍 Web Search** — SearXNG, DuckDuckGo, arXiv, Jina Reader, DALL·E 3 plugins built-in.
- **🧪 Test Suite** — 62 unit/integration tests covering stores, components, and API.

## Screenshots

![Settings](./docs/images/settings.png)

![More](./docs/images/more.png)

## Features

- **Deploy for free with one-click** on Vercel in under 1 minute
- Compact client (~5MB) on Linux/Windows/MacOS
- Fully compatible with self-deployed LLMs: [RWKV-Runner](https://github.com/josStorer/RWKV-Runner), [LocalAI](https://github.com/go-skynet/LocalAI)
- Privacy first — all data stored locally in the browser (IndexedDB)
- Markdown support: LaTex, mermaid, code highlight
- Responsive design, dark mode and PWA
- Fast first screen loading (~100kb), streaming response
- Prompt templates (masks) — create, share and debug chat tools
- Awesome prompts from [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- Auto-compress chat history for long conversations
- I18n: English, 简体中文, 繁體中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia

### 🆕 v1.1.0 — Role Enhancement

- **🔥 Heat Map** — Role usage frequency tracking. Most-used roles gravitate toward the spiral grid center on the NewChat page.
- **⭐ Favorites** — Star/unstar any mask on the MaskPage. Favorited masks always appear first.
- **🔌 Plugin Proxy Toggle** — Per-plugin "Use Proxy" checkbox. Disable proxy for plugins that need direct API access.
- **🌐 API Proxy Upgrades** — Auto-set browser headers to avoid bot detection. Built-in `undici` ProxyAgent for VPN/Clash users (`PROXY_URL`).
- **🔍 Web Search** — SearXNG, DuckDuckGo, arXiv, Jina Reader, DALL·E 3 plugins built-in.
- **🧪 Test Suite** — 62 unit/integration tests covering stores, components, and API.

<div align="center">
   
![主界面](./docs/images/cover.png)

</div>

## Roadmap

- [x] System Prompt, User Prompt, Prompt Templates
- [x] Share as image, share to ShareGPT
- [x] Desktop App with Tauri
- [x] Self-host Model: compatible with RWKV-Runner, LocalAI
- [x] Artifacts: preview, copy and share generated content
- [x] Plugins: network search, calculator, any other APIs
- [x] Realtime Chat
- [x] Role Favorites & Heat Map (v1.1.0)
- [x] Plugin proxy toggle & API proxy enhancements (v1.1.0)
- [ ] Local knowledge base

## What's New

- 🚀 v1.1.0 Role enhancement — heat map, favorites, plugin proxy toggle, 62 tests
- 🚀 v2.15.8 Realtime Chat support
- 🚀 v2.15.4 Tauri LLM API for better security
- 🚀 v2.15.0 Plugins! [NextChat-Awesome-Plugins](https://github.com/ChatGPTNextWeb/NextChat-Awesome-Plugins)
- 🚀 v2.14.0 Artifacts & Stable Diffusion
- 🚀 v2.10.1 Google Gemini Pro support
- 🚀 v2.9.11 Azure endpoint support
- 🚀 v2.8 Cross-platform desktop client

## Get Started

1. Get [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. Click
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web), remember that `CODE` is your page password;
3. Enjoy :)

## FAQ

[English > FAQ](./docs/faq-en.md)

## Keep Updated

If you have deployed your own project with just one click following the steps above, you may encounter the issue of "Updates Available" constantly showing up. This is because Vercel will create a new project for you by default instead of forking this project, resulting in the inability to detect updates correctly.

We recommend that you follow the steps below to re-deploy:

- Delete the original repository;
- Use the fork button in the upper right corner of the page to fork this project;
- Choose and deploy in Vercel again, [please see the detailed tutorial](./docs/vercel-cn.md).

### Enable Automatic Updates

> If you encounter a failure of Upstream Sync execution, please [manually update code](./README.md#manually-updating-code).

After forking the project, due to the limitations imposed by GitHub, you need to manually enable Workflows and Upstream Sync Action on the Actions page of the forked project. Once enabled, automatic updates will be scheduled every hour:

![Automatic Updates](./docs/images/enable-actions.jpg)

![Enable Automatic Updates](./docs/images/enable-actions-sync.jpg)

### Manually Updating Code

If you want to update instantly, you can check out the [GitHub documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) to learn how to synchronize a forked project with upstream code.

You can star or watch this project or follow author to get release notifications in time.

## Access Password

This project provides limited access control. Please add an environment variable named `CODE` on the vercel environment variables page. The value should be passwords separated by comma like this:

```
code1,code2,code3
```

After adding or modifying this environment variable, please redeploy the project for the changes to take effect.

## Environment Variables

### `OPENAI_API_KEY` (required)
Your OpenAI API key. Join multiple keys with comma.

### `CODE` (optional)
Access password, separated by comma.

### `BASE_URL` (optional)
> Default: `https://api.openai.com`

Override OpenAI API base URL.

### `PROXY_URL` (optional)
> Example: `http://127.0.0.1:7890`

Local HTTP proxy for outbound requests (Clash/V2Ray). Uses undici ProxyAgent.

### Provider API Keys (all optional)

| Variable | Provider |
|----------|----------|
| `DEEPSEEK_API_KEY` | DeepSeek |
| `GOOGLE_API_KEY` | Google Gemini Pro |
| `ANTHROPIC_API_KEY` | Anthropic Claude |
| `AZURE_API_KEY` + `AZURE_URL` | Azure OpenAI |
| `BAIDU_API_KEY` + `BAIDU_SECRET_KEY` | Baidu ERNIE |
| `BYTEDANCE_API_KEY` | ByteDance (Doubao) |
| `ALIBABA_API_KEY` | Alibaba (Qwen) |
| `XAI_API_KEY` | X.AI (Grok) |
| `MOONSHOT_API_KEY` | Moonshot (Kimi) |
| `SILICONFLOW_API_KEY` | SiliconFlow |
| `AI302_API_KEY` | 302.AI |
| `IFLYTEK_API_KEY` + `IFLYTEK_API_SECRET` | iFlytek Spark |
| `CHATGLM_API_KEY` | ChatGLM |

### `HIDE_USER_API_KEY` (optional)
Set to `1` to prevent users from entering their own API key.

### `DISABLE_GPT4` (optional)
Set to `1` to hide GPT-4 models.

### `CUSTOM_MODELS` (optional)
> Example: `+llama,+claude-2,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

Use `+` to add, `-` to hide, `name=displayName` to customize. Use `-all` to disable all defaults. Azure: `model@Azure=deployment`. ByteDance: `model@bytedance=deployment`.

### `DEFAULT_MODEL` (optional)
Change the default model.

### `VISION_MODELS` (optional)
> Example: `gpt-4-vision,claude-3-opus`

Additional models with vision capabilities (comma-separated).

### `ENABLE_MCP` (optional)
Set to `true` to enable Model Context Protocol.

### `DEFAULT_INPUT_TEMPLATE` (optional)
Customize the default User Input Preprocessing template.

## Requirements

NodeJS >= 18, Docker >= 20

## Development

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

Create `.env.local` at project root:

```
OPENAI_API_KEY=<your api key here>
BASE_URL=https://chatgpt1.nextweb.fun/api/proxy
```

```shell
yarn install
yarn dev
```

### Run Tests

```shell
yarn test:ci        # single run
yarn test           # watch mode
```

## Deployment

### Docker (Recommended)

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   yidadaa/chatgpt-next-web
```

With proxy:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   -e PROXY_URL=http://localhost:7890 \
   yidadaa/chatgpt-next-web
```

With MCP:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=your-password \
   -e ENABLE_MCP=true \
   yidadaa/chatgpt-next-web
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

## Documentation

- [Frequent Ask Questions](./docs/faq-en.md)
- [How to add a new translation](./docs/translation.md)
- [How to use Vercel](./docs/vercel-cn.md)

## Translation

Read this [document](./docs/translation.md) to add a new translation.

## LICENSE

[MIT](https://opensource.org/license/mit/)
