# AI 代理检测器 / AI Proxy Inspector

<p align="center">
  <img src="https://img.shields.io/badge/Rust-1.77+-orange.svg" alt="Rust" />
  <img src="https://img.shields.io/badge/Tauri-2.0-blue.svg" alt="Tauri" />
  <img src="https://img.shields.io/badge/React-18-blue.svg" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

> 🇨🇳 专业的 AI 节点检测桌面应用 — 全面测试代理/VPN 对 ChatGPT、Claude、Gemini 及流媒体服务的访问能力。

> 🇺🇸 Professional AI node detection desktop application — comprehensive testing of proxy/VPN access to ChatGPT, Claude, Gemini, and streaming services.

---

## ✨ 功能 / Features

### 🔍 核心检测 / Core Detection
- **IP 信息** — IPv4 地址、ASN、ISP、地理位置、经纬度、时区
- **DNS 检测** — DNS 服务器识别、DNS 泄漏检测
- **WebRTC 检测** — 本地 IP 泄漏检测（浏览器端）
- **AI 服务检测** — ChatGPT、Claude、Gemini、Grok、Perplexity、Copilot、Poe、DeepSeek
- **风险分析** — Google 风险评估、Cloudflare 风险评估、IP 纯净度、黑名单检测
- **流媒体检测** — Netflix、Disney+、Hulu、HBO Max、Prime Video、Apple TV+、Spotify、YouTube Premium
- **网速测试** — 延迟、下载/上传速度、抖动、丢包率
- **综合评分** — 加权评分系统（IP 质量 30%、AI 可用性 25%、流媒体 20%、风险 15%、网络 10%）

### 🌐 国际化 / i18n
- **默认语言：简体中文**
- 运行时一键切换：中文 ⇄ English
- 语言选择自动保存（localStorage）
- 所有界面文本均通过语言文件统一管理，零硬编码

---

## 🛠️ 技术栈 / Tech Stack

| 层 / Layer | 技术 / Technology |
|------------|-------------------|
| 桌面框架 / Desktop Framework | [Tauri 2.0](https://tauri.app/) |
| 后端语言 / Backend | [Rust](https://www.rust-lang.org/) |
| 前端框架 / Frontend | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| 构建工具 / Build Tool | [Vite 5](https://vitejs.dev/) |
| UI 样式 / Styling | [Tailwind CSS 3](https://tailwindcss.com/) |
| 国际化 / i18n | [react-i18next](https://react.i18next.com/) + [i18next](https://www.i18next.com/) |
| 图表 / Charts | [ECharts](https://echarts.apache.org/) |
| 地图 / Map | [Leaflet](https://leafletjs.com/) |
| 数据库 / Database | [SQLite](https://www.sqlite.org/) (via rusqlite) |
| HTTP 客户端 | [reqwest](https://docs.rs/reqwest/) |

---

## 📦 安装与运行 / Installation & Usage

### 前置要求 / Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Rust](https://www.rust-lang.org/tools/install) >= 1.77
- Windows: [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) (C++ desktop workload)
- macOS: Xcode Command Line Tools
- Linux: `build-essential`, `libwebkit2gtk-4.1-dev`, etc.

### 安装依赖 / Install Dependencies

```bash
npm install
```

### 开发模式 / Development

```bash
npm run tauri dev
```

启动后：
- 前端开发服务器：`http://localhost:1420`
- 桌面应用窗口自动打开
- 支持热更新（HMR）

### 生产构建 / Production Build

```bash
npm run tauri build
```

构建产物位于：
```
src-tauri/target/release/bundle/
├── msi/   AI Proxy Inspector_1.0.0_x64_en-US.msi
└── nsis/  AI Proxy Inspector_1.0.0_x64-setup.exe
```

---

## 🗂️ 项目结构 / Project Structure

```
ai-proxy-inspector/
├── index.html                    # 入口 HTML
├── package.json                  # Node 依赖 & 脚本
├── vite.config.ts                # Vite 构建配置
├── tailwind.config.ts            # Tailwind CSS 配置
├── tsconfig.json                 # TypeScript 配置
├── src/                          # 前端源代码
│   ├── main.tsx                  # React 入口
│   ├── App.tsx                   # 根组件
│   ├── index.css                 # 全局样式
│   ├── i18n/index.ts             # i18n 配置
│   ├── locales/                  # 翻译文件
│   │   ├── zh-CN.json            # 简体中文
│   │   └── en-US.json            # English
│   ├── lib/                      # 工具函数
│   │   ├── tauri.ts              # Tauri 命令封装
│   │   └── utils.ts              # 通用工具
│   ├── types/index.ts            # TypeScript 类型定义
│   ├── hooks/                    # React Hooks
│   └── components/               # 组件
│       ├── layout/               # 布局组件
│       ├── dashboard/            # 仪表盘
│       ├── ip/                   # IP 信息
│       ├── dns/                  # DNS 检测
│       ├── webrtc/               # WebRTC 检测
│       ├── ai/                   # AI 服务
│       ├── risk/                 # 风险分析
│       ├── media/                # 流媒体
│       ├── speed/                # 网速测试
│       ├── report/               # 报告中心
│       └── ui/                   # 通用 UI 组件
├── src-tauri/                    # Tauri / Rust 后端
│   ├── Cargo.toml                # Rust 依赖
│   ├── tauri.conf.json           # Tauri 配置
│   ├── build.rs                  # 构建脚本
│   ├── icons/                    # 应用图标
│   ├── capabilities/             # 安全权限
│   └── src/                      # Rust 源代码
│       ├── main.rs               # 入口
│       ├── lib.rs                # 命令注册
│       ├── commands/             # Tauri 命令
│       ├── services/             # 服务层
│       ├── db/                   # SQLite 数据库
│       └── scoring/              # 评分引擎
└── README.md
```

---

## 🎨 界面 / Interface

| 页面 | 中文 | English |
|------|------|---------|
| 仪表盘 | 仪表盘 | Dashboard |
| IP检测 | IP检测 | IP Info |
| DNS检测 | DNS检测 | DNS Check |
| WebRTC检测 | WebRTC检测 | WebRTC |
| AI服务 | AI服务 | AI Services |
| 风险分析 | 风险分析 | Risk Analysis |
| 流媒体 | 流媒体 | Streaming |
| 网速测试 | 网速测试 | Speed Test |
| 报告中心 | 报告中心 | Reports |

---

## 📊 评分系统 / Scoring System

| 维度 / Dimension | 权重 / Weight |
|------------------|---------------|
| IP 质量 / IP Quality | 30% |
| AI 可用性 / AI Availability | 25% |
| 流媒体 / Streaming | 20% |
| 风险等级 / Risk Level | 15% |
| 网络性能 / Network | 10% |

**评分等级 / Score Grades:**

| 等级 | 分数 | 含义 |
|------|------|------|
| S 级 | 95-100 | 卓越 Excellent |
| A 级 | 85-94 | 优秀 Great |
| B 级 | 70-84 | 良好 Good |
| C 级 | 50-69 | 一般 Average |
| D 级 | 30-49 | 较差 Poor |
| F 级 | 0-29 | 极差 Failing |

---

## 🔒 安全 / Security

- 所有网络请求使用 HTTPS (TLS 1.3)
- 无需 API Key，使用公开免费接口
- 本地 SQLite 存储，数据不上传
- Tauri 安全沙箱，最小权限原则

---

## 📄 许可证 / License

MIT License

---

## 👨‍💻 开发者 / Author

AI Proxy Inspector Team

---

<p align="center">
  <sub>Built with ❤️ using Rust + Tauri + React</sub>
</p>
