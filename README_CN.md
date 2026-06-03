<div align="center">

<a href='#企业版'>
  <img src="./docs/images/ent.svg" alt="icon"/>
</a>

<h1 align="center">ActorAIchat</h1>

## 支持的 LLM 提供商

OpenAI · Azure · Google Gemini · Anthropic Claude · DeepSeek · Moonshot (Kimi) · XAI (Grok) · ByteDance (豆包) · Alibaba (千问) · 302.AI · 讯飞星火 · ChatGLM · 百度文心 · SiliconFlow

## 功能特性

- **一键免费部署** — Vercel 1 分钟部署
- 跨平台桌面客户端 (~5MB) — Linux/Windows/MacOS
- 兼容自部署 LLM：[RWKV-Runner](https://github.com/josStorer/RWKV-Runner)、[LocalAI](https://github.com/go-skynet/LocalAI)
- **隐私优先** — 所有数据本地存储（浏览器 IndexedDB）
- Markdown 支持：LaTex、mermaid、代码高亮
- 响应式设计，暗黑模式，PWA
- 首屏加载快 (~100kb)，流式响应
- 提示词模板（面具）— 创建、分享和调试对话工具
- 精选提示词来自 [awesome-chatgpt-prompts-zh](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)
- 自动压缩聊天记录，节省 Token
- 国际化：English, 简体中文, 繁體中文, 日本語, Français, Español, Italiano, Türkçe, Deutsch, Tiếng Việt, Русский, Čeština, 한국어, Indonesia

### 🆕 v1.1.0 — 角色功能增强

- **🔥 热力图** — 角色使用频次追踪。使用次数越多的角色越靠近 NewChat 螺旋网格中心。
- **⭐ 收藏系统** — 在面具页面点击星标收藏/取消收藏。收藏的面具始终排在前面。
- **🔌 插件代理开关** — 每个插件可独立控制是否通过代理访问。需要直连的插件可关闭代理。
- **🌐 API 代理增强** — 自动设置浏览器标识头避免被反爬。内置 `undici` ProxyAgent 支持 VPN/Clash 代理（`PROXY_URL`）。
- **🔍 网络搜索** — 内置 SearXNG、DuckDuckGo、arXiv、Jina Reader、DALL·E 3 插件。
- **🧪 测试套件** — 62 个单元/集成测试，覆盖 store、组件、API。

## 开始使用

1. 准备好你的 [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. 点击右侧按钮开始部署：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&env=GOOGLE_API_KEY&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)，直接使用 Github 账号登录即可，记得在环境变量页填入 API Key 和[页面访问密码](#配置页面访问密码) CODE；
3. 部署完毕后，即可开始使用；
4. （可选）[绑定自定义域名](https://vercel.com/docs/concepts/projects/domains/add-a-domain)：Vercel 分配的域名 DNS 在某些区域被污染了，绑定自定义域名即可直连。

<div align="center">
   
![主界面](./docs/images/cover.png)

</div>

## 保持更新

如果你按照上述步骤一键部署了自己的项目，可能会发现总是提示“存在更新”的问题，这是由于 Vercel 会默认为你创建一个新项目而不是 fork 本项目，这会导致无法正确地检测更新。
推荐你按照下列步骤重新部署：

- 删除掉原先的仓库；
- 使用页面右上角的 fork 按钮，fork 本项目；
- 在 Vercel 重新选择并部署，[请查看详细教程](./docs/vercel-cn.md#如何新建项目)。

### 打开自动更新

> 如果你遇到了 Upstream Sync 执行错误，请[手动 Sync Fork 一次](./README_CN.md#手动更新代码)！

当你 fork 项目之后，由于 Github 的限制，需要手动去你 fork 后的项目的 Actions 页面启用 Workflows，并启用 Upstream Sync Action，启用之后即可开启每小时定时自动更新：

![自动更新](./docs/images/enable-actions.jpg)

![启用自动更新](./docs/images/enable-actions-sync.jpg)

### 手动更新代码

如果你想让手动立即更新，可以查看 [Github 的文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) 了解如何让 fork 的项目与上游代码同步。

你可以 star/watch 本项目或者 follow 作者来及时获得新功能更新通知。

## 环境变量

### `OPENAI_API_KEY` （必填）
OpenAI 密钥，逗号分隔多个 key。

### `CODE` （可选）
访问密码，逗号分隔多个。**不填则任何人可直接使用。**

### `BASE_URL` （可选）
> 默认：`https://api.openai.com`

OpenAI 接口代理 URL。

### `PROXY_URL` （可选）
> 示例：`http://127.0.0.1:7890`

本地 HTTP 代理地址（Clash/V2Ray），使用 undici ProxyAgent。

### 各平台 API Key（均为可选）

| 变量 | 平台 |
|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek |
| `GOOGLE_API_KEY` | Google Gemini Pro |
| `ANTHROPIC_API_KEY` | Anthropic Claude |
| `AZURE_API_KEY` + `AZURE_URL` | Azure OpenAI |
| `BAIDU_API_KEY` + `BAIDU_SECRET_KEY` | 百度文心 |
| `BYTEDANCE_API_KEY` | 字节跳动（豆包） |
| `ALIBABA_API_KEY` | 阿里云（千问） |
| `XAI_API_KEY` | X.AI（Grok） |
| `MOONSHOT_API_KEY` | Moonshot（Kimi） |
| `SILICONFLOW_API_KEY` | SiliconFlow |
| `AI302_API_KEY` | 302.AI |
| `IFLYTEK_API_KEY` + `IFLYTEK_API_SECRET` | 讯飞星火 |
| `CHATGLM_API_KEY` | ChatGLM |

### `HIDE_USER_API_KEY` （可选）
设为 `1` 禁止用户自行填入 API Key。

### `DISABLE_GPT4` （可选）
设为 `1` 隐藏 GPT-4 模型。

### `CUSTOM_MODELS` （可选）
> 示例：`+qwen-7b-chat,+glm-6b,-gpt-3.5-turbo,gpt-4-1106-preview=gpt-4-turbo`

`+` 增加，`-` 隐藏，`名称=展示名` 自定义。`-all` 禁用所有默认模型。Azure: `model@Azure=deployment`。ByteDance: `model@bytedance=deployment`。

### `DEFAULT_MODEL` （可选）
更改默认模型。

### `VISION_MODELS` （可选）
> 示例：`gpt-4-vision,claude-3-opus`

额外添加视觉能力模型（逗号分隔）。

### `ENABLE_MCP` （可选）
设为 `true` 启用 MCP 功能。

### `DEFAULT_INPUT_TEMPLATE` （可选）
自定义默认的用户输入预处理模板。

## 开发

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

项目根目录新建 `.env.local`：

```
OPENAI_API_KEY=<your api key here>
BASE_URL=https://b.nextweb.fun/api/proxy
```

```shell
yarn install && yarn dev
```

### 运行测试

```shell
yarn test:ci        # 单次运行
yarn test           # 监听模式
```

## 部署

### 容器部署（推荐）

> Docker 版本需 >= 20

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   yidadaa/chatgpt-next-web
```

使用代理：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   -e PROXY_URL=http://127.0.0.1:7890 \
   yidadaa/chatgpt-next-web
```

启用 MCP：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY=sk-xxxx \
   -e CODE=页面访问密码 \
   -e ENABLE_MCP=true \
   yidadaa/chatgpt-next-web
```

### 脚本部署

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

## 鸣谢

- [one-api](https://github.com/songquanpeng/one-api): 一站式大模型额度管理平台

## 开源协议

[MIT](https://opensource.org/license/mit/)
