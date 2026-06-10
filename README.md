<p align="center">
  <img src="public/logo.jpg" alt="NoteMind AI" width="120" height="120" />
</p>

<h1 align="center">NoteMind AI 🧠</h1>

<p align="center">
  <strong>轻量级 AI 知识笔记引擎 — Google NotebookLM 的开源替代品</strong>
</p>

<p align="center">
  <a href="https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6.svg" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black.svg" alt="Next.js" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-Ready-6C63FF.svg" alt="PWA" /></a>
  <a href="https://github.com/gitstq/NoteMind-AI"><img src="https://img.shields.io/badge/AI-Multi%20Provider-orange.svg" alt="AI" /></a>
</p>

<p align="center">
  <a href="#english-version">English</a> · <a href="#日本語版">日本語</a>
</p>

---

## 🎉 项目介绍

**NoteMind AI** 是一款轻量级 AI 驱动的知识笔记引擎，旨在成为 Google NotebookLM 的完全开源替代方案。它让你能够上传文档、构建知识库，并通过 AI 进行智能对话——所有这一切都在浏览器中完成，无需任何后端服务。

在 AI 时代，知识的组织与检索变得前所未有的重要。然而，市面上的工具要么依赖云端服务存在隐私风险，要么功能臃肿学习成本高。NoteMind AI 以「零后端、隐私优先」为核心理念，将所有数据存储在浏览器的 IndexedDB 中，真正做到你的知识只属于你。同时，它支持 OpenAI、Anthropic、DeepSeek、通义千问、智谱 GLM、Ollama 等多种 AI 模型，无论你偏好哪种 AI 服务，都能无缝接入。

NoteMind AI 特别针对中日韩（CJK）文本进行了深度优化。不同于简单的按字符数切分，它采用智能分块算法，能够识别句子边界和语义完整性，确保知识检索的精准度。配合基于向量相似度的 RAG 检索增强生成，AI 回答始终有据可依，并支持引用溯源。此外，D3.js 驱动的知识图谱可视化让你直观地发现文档之间的隐藏关联，为知识管理带来全新的视角。

## ✨ 核心特性

- 🔒 **零后端架构 · 隐私至上**
  所有数据（文档、笔记、对话记录、向量索引）全部存储在浏览器 IndexedDB 中，无需注册账号，无需搭建服务器，你的知识资产完全由你自己掌控。

- 🤖 **多 AI 模型支持 · 灵活切换**
  一键接入 OpenAI、Anthropic、DeepSeek、通义千问（DashScope）、智谱 GLM、Ollama 六大 AI 提供商，支持流式输出，自由选择最适合你的模型。

- 🈷️ **CJK 优化文本分块 · 中文友好**
  专为中日韩语言设计的智能分块算法，精准识别句子边界与语义单元，避免传统按字符截断导致的语义破碎，大幅提升检索质量。

- 🔍 **RAG 检索增强生成 · 有据可依**
  基于向量相似度语义检索，从你的知识库中精准匹配相关内容，AI 回答附带引用来源，支持溯源验证，杜绝「幻觉」。

- 🕸️ **知识图谱可视化 · 一目了然**
  基于 D3.js 的力导向图，直观展示文档、笔记、文本块之间的关联关系，帮助你发现知识网络中隐藏的连接与结构。

- 📱 **PWA 离线支持 · 随时可用**
  完整的 Progressive Web App 支持，安装到桌面后可完全离线使用，无论是在飞机上还是网络不稳定的环境中，知识管理从不中断。

- 🌙 **暗色 / 亮色主题 · 舒适体验**
  内置亮色与暗色双主题，支持跟随系统自动切换，在任何光线环境下都能获得舒适的阅读与操作体验。

- 📄 **多格式文档解析 · 即传即用**
  支持 PDF、TXT、Markdown 三种主流格式的文档上传与解析，自动提取文本内容并进行智能分块，快速构建你的知识库。

## 🏗️ 技术架构

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端框架** | Next.js 14 + React 18 | App Router，服务端渲染与静态导出 |
| **开发语言** | TypeScript 5.4 | 全量类型安全 |
| **样式方案** | Tailwind CSS 3.4 | 原子化 CSS，快速构建 UI |
| **状态管理** | Zustand 4.5 | 轻量、高性能的 React 状态管理 |
| **本地存储** | IndexedDB (idb) | 浏览器原生数据库，存储文档与向量 |
| **AI 接入** | OpenAI / Anthropic / DeepSeek / DashScope / 智谱 GLM / Ollama | 多提供商统一抽象层 |
| **数据可视化** | D3.js 7.9 | 力导向知识图谱 |
| **PDF 解析** | pdfjs-dist 4.0 | 浏览器端 PDF 文本提取 |
| **Markdown** | marked + react-markdown | 笔记编辑与渲染 |
| **离线能力** | Service Worker + Manifest | PWA 完整支持 |

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0（或 yarn / pnpm）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/gitstq/NoteMind-AI.git
cd NoteMind-AI

# 安装依赖
npm install
```

### 启动开发服务器

```bash
# 复制环境变量模板
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

### 配置 AI 模型

在项目根目录创建 `.env.local` 文件（或通过应用内「设置」页面配置），填入你使用的 AI 提供商 API Key：

```bash
# OpenAI（推荐入门）
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# DeepSeek
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# 通义千问（DashScope）
NEXT_PUBLIC_DASHSCOPE_API_KEY=sk-your-dashscope-api-key

# 智谱 GLM
NEXT_PUBLIC_ZHIPU_API_KEY=your-zhipu-api-key

# Ollama（本地模型，无需 API Key）
NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434

# 默认配置
NEXT_PUBLIC_DEFAULT_PROVIDER=openai
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4o-mini
NEXT_PUBLIC_DEFAULT_EMBEDDING_MODEL=text-embedding-3-small
```

> **提示**：你也可以在应用内的「设置」页面直接配置 API Key，无需修改环境变量文件。Ollama 用户只需确保本地服务运行在 `localhost:11434` 即可。

## 📖 详细使用指南

### 创建笔记本

1. 点击首页的「新建笔记本」按钮
2. 输入笔记本名称和描述
3. 创建后即可开始上传文档和进行 AI 对话

### 上传文档

1. 进入笔记本详情页
2. 点击「上传文档」或直接拖拽文件到上传区域
3. 支持 **PDF**、**TXT**、**Markdown** 三种格式
4. 上传后系统会自动进行文本提取、智能分块和向量化处理

### AI 对话

1. 在笔记本中打开「AI 对话」面板
2. 输入你的问题，AI 将基于笔记本中的文档内容进行回答
3. 回答中会标注引用来源，点击可查看原文片段
4. 支持流式输出，实时查看 AI 生成过程

### 知识图谱

1. 进入笔记本的「知识图谱」视图
2. 图谱以力导向图形式展示文档、笔记和文本块之间的关系
3. 可拖拽节点、缩放画布，交互式探索知识网络
4. 节点颜色和大小反映不同类型和重要程度

### 设置

- **AI 提供商**：选择并配置 AI 服务提供商和模型
- **主题切换**：亮色 / 暗色 / 跟随系统
- **分块参数**：调整文本分块大小和重叠长度
- **语言设置**：简体中文 / English

## 💡 设计思路与迭代规划

### 设计理念

NoteMind AI 的核心设计理念是 **「轻量、隐私、开放」**：

- **轻量**：零后端架构，一个浏览器标签页就是完整的应用，无需部署服务器，打开即用。
- **隐私**：所有数据存储在用户本地浏览器中，不上传任何用户文档到第三方服务器（AI API 调用除外）。
- **开放**：完全开源，MIT 协议，支持多种 AI 提供商，不锁定任何特定服务商。

### v1.0 功能

- [x] 多 AI 提供商支持（OpenAI / Anthropic / DeepSeek / DashScope / 智谱 GLM / Ollama）
- [x] PDF / TXT / Markdown 文档上传与解析
- [x] CJK 优化智能文本分块
- [x] 向量化存储与相似度检索
- [x] RAG 检索增强生成对话
- [x] 引用溯源与来源标注
- [x] D3.js 知识图谱可视化
- [x] Markdown 笔记编辑器
- [x] 亮色 / 暗色主题
- [x] PWA 离线支持
- [x] 中英文双语界面

### 未来规划

- [ ] **多模态支持**：图片、音频、视频文档的解析与检索
- [ ] **协作共享**：基于 WebRTC 的端到端加密知识库共享
- [ ] **插件系统**：支持自定义数据源和 AI 处理管道
- [ ] **移动端适配**：响应式布局优化与手势操作
- [ ] **知识库导出**：支持导出为 Obsidian / Notion 兼容格式
- [ ] **智能摘要**：自动生成文档摘要与思维导图
- [ ] **更多 AI 提供商**：持续接入更多国内外 AI 服务

## 📦 打包与部署指南

### 开发模式

```bash
npm run dev
# 访问 http://localhost:3000
```

### 生产构建

```bash
npm run build
npm run start
# 默认监听 3000 端口
```

### 静态导出

NoteMind AI 支持完全静态导出，可部署到任意静态托管服务：

```bash
npm run build
# 构建产物在 out/ 目录（需在 next.config.js 中配置 output: 'export'）
```

可部署到：
- **Vercel**：`vercel deploy`
- **GitHub Pages**：推送 `out/` 目录
- **Netlify**：拖拽 `out/` 目录到 Netlify Drop
- **Cloudflare Pages**：连接仓库自动构建

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t notemind-ai .

# 运行容器
docker run -p 3000:3000 notemind-ai
```

## 🤝 贡献指南

我们欢迎任何形式的贡献！无论是提交 Bug、改进文档，还是贡献代码。

1. **Fork** 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature-name`
3. 提交更改：`git commit -m 'feat: add your feature'`
4. 推送分支：`git push origin feature/your-feature-name`
5. 提交 **Pull Request**

### 开发规范

- 遵循 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 新功能请附带相应的类型定义

## 📄 开源协议

本项目基于 [MIT License](https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE) 开源。

```
MIT License

Copyright (c) 2024 NoteMind AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/NoteMind-AI">NoteMind AI Team</a>
</p>

---
---

<a id="english-version"></a>

<p align="center">
  <img src="public/logo.jpg" alt="NoteMind AI" width="120" height="120" />
</p>

<h1 align="center">NoteMind AI 🧠</h1>

<p align="center">
  <strong>Lightweight AI-Powered Knowledge Notebook Engine — An Open-Source Alternative to Google NotebookLM</strong>
</p>

<p align="center">
  <a href="https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6.svg" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black.svg" alt="Next.js" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-Ready-6C63FF.svg" alt="PWA" /></a>
  <a href="https://github.com/gitstq/NoteMind-AI"><img src="https://img.shields.io/badge/AI-Multi%20Provider-orange.svg" alt="AI" /></a>
</p>

<p align="center">
  <a href="#日本語版">日本語</a> · <a href="#">简体中文</a>
</p>

---

## 🎉 Introduction

**NoteMind AI** is a lightweight, AI-powered knowledge notebook engine designed as a fully open-source alternative to Google NotebookLM. It empowers you to upload documents, build a knowledge base, and converse with an AI — all within your browser, with zero backend infrastructure required.

In the age of AI, organizing and retrieving knowledge has never been more critical. Yet most existing tools either rely on cloud services that raise privacy concerns, or are bloated with steep learning curves. NoteMind AI is built on the core philosophy of "zero backend, privacy first." All data — documents, notes, conversation history, and vector indices — is stored locally in the browser's IndexedDB. Your knowledge truly belongs to you.

NoteMind AI features deep optimization for CJK (Chinese, Japanese, Korean) text. Rather than naive character-based splitting, it employs an intelligent chunking algorithm that recognizes sentence boundaries and semantic integrity, ensuring high-precision knowledge retrieval. Combined with vector similarity-based RAG (Retrieval-Augmented Generation), AI responses are always grounded in your documents with verifiable citations. On top of that, a D3.js-powered knowledge graph visualization reveals hidden connections across your documents, offering a fresh perspective on knowledge management.

## ✨ Core Features

- 🔒 **Zero-Backend Architecture · Privacy by Design**
  All data — documents, notes, chat history, and vector indices — is stored entirely in the browser's IndexedDB. No account registration, no server setup. Your knowledge assets remain entirely under your control.

- 🤖 **Multi-Provider AI Support · Flexible Switching**
  Seamless integration with six major AI providers: OpenAI, Anthropic, DeepSeek, DashScope (Tongyi Qianwen), Zhipu GLM, and Ollama. Supports streaming output for a real-time experience.

- 🈷️ **CJK-Optimized Text Chunking · CJK-Friendly**
  An intelligent chunking algorithm purpose-built for Chinese, Japanese, and Korean text. It identifies sentence boundaries and semantic units to prevent the fragmentation caused by naive character-based splitting, significantly improving retrieval quality.

- 🔍 **RAG-Powered Generation · Evidence-Based Answers**
  Semantic retrieval powered by vector similarity matches relevant content from your knowledge base. AI responses include inline citations with source references, enabling traceability and reducing hallucinations.

- 🕸️ **Knowledge Graph Visualization · See the Big Picture**
  A D3.js force-directed graph reveals relationships between documents, notes, and text chunks. Interactively explore your knowledge network to discover hidden connections and structural patterns.

- 📱 **PWA Offline Support · Always Available**
  Full Progressive Web App support. Once installed to your desktop, NoteMind AI works completely offline — on a flight, in a tunnel, or anywhere with limited connectivity.

- 🌙 **Dark / Light Theme · Comfortable Experience**
  Built-in light and dark themes with system-aware auto-switching. Enjoy a comfortable reading and working experience in any lighting condition.

- 📄 **Multi-Format Document Parsing · Ready to Use**
  Upload and parse PDF, TXT, and Markdown files with automatic text extraction and intelligent chunking. Build your knowledge base in minutes.

## 🏗️ Technical Architecture

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Framework** | Next.js 14 + React 18 | App Router with SSR and static export |
| **Language** | TypeScript 5.4 | Full type safety |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS for rapid UI development |
| **State Management** | Zustand 4.5 | Lightweight, high-performance React state management |
| **Storage** | IndexedDB (idb) | Browser-native database for documents and vectors |
| **AI Integration** | OpenAI / Anthropic / DeepSeek / DashScope / Zhipu GLM / Ollama | Unified abstraction layer for multiple providers |
| **Visualization** | D3.js 7.9 | Force-directed knowledge graph |
| **PDF Parsing** | pdfjs-dist 4.0 | Client-side PDF text extraction |
| **Markdown** | marked + react-markdown | Note editing and rendering |
| **Offline** | Service Worker + Manifest | Full PWA support |

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/gitstq/NoteMind-AI.git
cd NoteMind-AI

# Install dependencies
npm install
```

### Start Development Server

```bash
# Copy environment variable template
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to get started.

### Configure AI Models

Create a `.env.local` file in the project root (or configure directly in the app's Settings page) with your AI provider API keys:

```bash
# OpenAI (recommended for getting started)
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# DeepSeek
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# DashScope (Tongyi Qianwen)
NEXT_PUBLIC_DASHSCOPE_API_KEY=sk-your-dashscope-api-key

# Zhipu GLM
NEXT_PUBLIC_ZHIPU_API_KEY=your-zhipu-api-key

# Ollama (local models, no API key needed)
NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434

# Default configuration
NEXT_PUBLIC_DEFAULT_PROVIDER=openai
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4o-mini
NEXT_PUBLIC_DEFAULT_EMBEDDING_MODEL=text-embedding-3-small
```

> **Tip**: You can also configure API keys directly in the app's Settings page without modifying environment files. For Ollama users, simply ensure the local service is running at `localhost:11434`.

## 📖 User Guide

### Creating a Notebook

1. Click the "New Notebook" button on the home page
2. Enter a name and description for your notebook
3. Start uploading documents and chatting with AI

### Uploading Documents

1. Navigate to the notebook detail page
2. Click "Upload Document" or drag and drop files into the upload area
3. Supported formats: **PDF**, **TXT**, **Markdown**
4. The system automatically extracts text, performs intelligent chunking, and generates vector embeddings

### AI Chat

1. Open the "AI Chat" panel within a notebook
2. Type your question — the AI answers based on your uploaded documents
3. Responses include inline citations — click to view the original source text
4. Streaming output for real-time response generation

### Knowledge Graph

1. Switch to the "Knowledge Graph" view in your notebook
2. The force-directed graph displays relationships between documents, notes, and text chunks
3. Drag nodes, zoom the canvas, and interactively explore your knowledge network
4. Node colors and sizes reflect different types and importance levels

### Settings

- **AI Provider**: Select and configure AI service providers and models
- **Theme**: Light / Dark / System
- **Chunking Parameters**: Adjust chunk size and overlap length
- **Language**: Simplified Chinese / English

## 💡 Design Philosophy & Roadmap

### Design Principles

NoteMind AI is guided by three core principles: **Lightweight, Privacy, and Openness**:

- **Lightweight**: Zero-backend architecture. A single browser tab is the complete application — no server deployment needed, instant access.
- **Privacy**: All data is stored locally in the user's browser. No user documents are uploaded to third-party servers (except for AI API calls).
- **Open**: Fully open-source under the MIT license. Supports multiple AI providers with no vendor lock-in.

### v1.0 Features

- [x] Multi-provider AI support (OpenAI / Anthropic / DeepSeek / DashScope / Zhipu GLM / Ollama)
- [x] PDF / TXT / Markdown document upload and parsing
- [x] CJK-optimized intelligent text chunking
- [x] Vector storage and similarity search
- [x] RAG-powered conversational AI
- [x] Citation tracing and source attribution
- [x] D3.js knowledge graph visualization
- [x] Markdown note editor
- [x] Light / Dark theme
- [x] PWA offline support
- [x] Bilingual interface (Chinese / English)

### Future Roadmap

- [ ] **Multimodal Support**: Parsing and retrieval for image, audio, and video documents
- [ ] **Collaborative Sharing**: End-to-end encrypted knowledge base sharing via WebRTC
- [ ] **Plugin System**: Custom data sources and AI processing pipelines
- [ ] **Mobile Optimization**: Responsive layout improvements and gesture support
- [ ] **Knowledge Export**: Export to Obsidian / Notion-compatible formats
- [ ] **Smart Summaries**: Automatic document summarization and mind map generation
- [ ] **More AI Providers**: Continuous integration of additional AI services

## 📦 Build & Deployment Guide

### Development Mode

```bash
npm run dev
# Visit http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
# Listens on port 3000 by default
```

### Static Export

NoteMind AI supports full static export for deployment to any static hosting service:

```bash
npm run build
# Output in out/ directory (requires output: 'export' in next.config.js)
```

Deploy to:
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push the `out/` directory
- **Netlify**: Drag the `out/` directory to Netlify Drop
- **Cloudflare Pages**: Connect your repo for automatic builds

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build the image
docker build -t notemind-ai .

# Run the container
docker run -p 3000:3000 notemind-ai
```

## 🤝 Contributing

We welcome contributions of all kinds — bug reports, documentation improvements, or code contributions.

1. **Fork** this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push the branch: `git push origin feature/your-feature-name`
5. Submit a **Pull Request**

### Development Guidelines

- Follow TypeScript strict mode conventions
- Use ESLint for code linting
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Include type definitions for new features

## 📄 License

This project is licensed under the [MIT License](https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE).

```
MIT License

Copyright (c) 2024 NoteMind AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/NoteMind-AI">NoteMind AI Team</a>
</p>

---
---

<a id="日本語版"></a>

<p align="center">
  <img src="public/logo.jpg" alt="NoteMind AI" width="120" height="120" />
</p>

<h1 align="center">NoteMind AI 🧠</h1>

<p align="center">
  <strong>軽量 AI ナレッジノートエンジン — Google NotebookLM のオープンソース代替</strong>
</p>

<p align="center">
  <a href="https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-3178C6.svg" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black.svg" alt="Next.js" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps"><img src="https://img.shields.io/badge/PWA-Ready-6C63FF.svg" alt="PWA" /></a>
  <a href="https://github.com/gitstq/NoteMind-AI"><img src="https://img.shields.io/badge/AI-Multi%20Provider-orange.svg" alt="AI" /></a>
</p>

<p align="center">
  <a href="#">简体中文</a> · <a href="#english-version">English</a>
</p>

---

## 🎉 プロジェクトについて

**NoteMind AI** は、Google NotebookLM の完全なオープンソース代替として設計された、軽量な AI 搭載ナレッジノートエンジンです。ドキュメントをアップロードしてナレッジベースを構築し、AI と対話できます。すべてブラウザ上で完結し、バックエンドサーバーは一切不要です。

AI 時代において、知識の整理と検索はかつてないほど重要になっています。しかし、既存のツールの多くはクラウドサービスに依存してプライバシー上の懸念を生じさせたり、機能が肥大化して学習コストが高かったりします。NoteMind AI は「ゼロバックエンド・プライバシーファースト」をコア理念としています。ドキュメント、ノート、対話履歴、ベクトルインデックスのすべてがブラウザの IndexedDB にローカル保存されます。あなたの知識は、本当にあなたのものです。

NoteMind AI は CJK（中国語・日本語・韓国語）テキストに最適化されています。単純な文字数分割ではなく、文境界と意味的完全性を認識するインテリジェントチャンキングアルゴリズムを採用し、知識検索の精度を大幅に向上させています。ベクトル類似度に基づく RAG（検索拡張生成）と組み合わせることで、AI の回答は常にドキュメントに基づき、引用元を検証可能です。さらに、D3.js によるナレッジグラフ可視化で、ドキュメント間の隠れた関連性を直感的に発見できます。

## ✨ 主な機能

- 🔒 **ゼロバックエンドアーキテクチャ · プライバシー第一**
  ドキュメント、ノート、チャット履歴、ベクトルインデックスのすべてがブラウザの IndexedDB に保存されます。アカウント登録もサーバー構築も不要。あなたのナレッジアセットは完全にあなたがコントロールできます。

- 🤖 **マルチ AI プロバイダー対応 · 柔軟な切り替え**
  OpenAI、Anthropic、DeepSeek、DashScope（通義千問）、Zhipu GLM、Ollama の 6 つの主要 AI プロバイダーにシームレスに接続。ストリーミング出力に対応し、最適なモデルを自由に選択できます。

- 🈷️ **CJK 最適化テキストチャンキング · CJK フレンドリー**
  中国語・日本語・韓国語のために特化したインテリジェントチャンキングアルゴリズム。文境界と意味的単位を正確に認識し、文字ベースの単純分割による意味の断片化を防ぎ、検索品質を大幅に向上させます。

- 🔍 **RAG 検索拡張生成 · 根拠のある回答**
  ベクトル類似度によるセマンティック検索で、ナレッジベースから関連コンテンツを精密にマッチング。AI の回答にはインライン引用が付属し、ソースを検証可能。ハルシネーションを抑制します。

- 🕸️ **ナレッジグラフ可視化 · 全体像を把握**
  D3.js の力指向グラフで、ドキュメント・ノート・テキストチャンク間の関連性を可視化。ノードのドラッグ、キャンバスのズームによるインタラクティブな探索で、知識ネットワークの隠れたつながりを発見できます。

- 📱 **PWA オフライン対応 · いつでも利用可能**
  完全な Progressive Web App サポート。デスクトップにインストールすれば、完全オフラインで動作します。フライト中でも通信環境が不安定な場所でも、ナレッジ管理は中断しません。

- 🌙 **ダーク / ライトテーマ · 快適な体験**
  ライトモードとダークモードを内蔵し、システム設定に連動した自動切替に対応。あらゆる照明環境で快適な読書・作業体験を提供します。

- 📄 **マルチフォーマットドキュメント解析 · 即座に利用可能**
  PDF、TXT、Markdown の 3 つの主要フォーマットに対応。アップロード後、自動的にテキストを抽出し、インテリジェントチャンキングを実行。短時間でナレッジベースを構築できます。

## 🏗️ 技術スタック

| レイヤー | 技術 | 説明 |
|---------|------|------|
| **フレームワーク** | Next.js 14 + React 18 | App Router、SSR および静的エクスポート |
| **言語** | TypeScript 5.4 | フルタイプセーフティ |
| **スタイリング** | Tailwind CSS 3.4 | ユーティリティファースト CSS |
| **状態管理** | Zustand 4.5 | 軽量・高パフォーマンスな React 状態管理 |
| **ストレージ** | IndexedDB (idb) | ブラウザネイティブデータベース |
| **AI 統合** | OpenAI / Anthropic / DeepSeek / DashScope / Zhipu GLM / Ollama | マルチプロバイダー統一抽象化レイヤー |
| **可視化** | D3.js 7.9 | 力指向ナレッジグラフ |
| **PDF 解析** | pdfjs-dist 4.0 | クライアントサイド PDF テキスト抽出 |
| **Markdown** | marked + react-markdown | ノート編集とレンダリング |
| **オフライン** | Service Worker + Manifest | フル PWA サポート |

## 🚀 クイックスタート

### 動作環境

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0（または yarn / pnpm）

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/gitstq/NoteMind-AI.git
cd NoteMind-AI

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
# 環境変数テンプレートをコピー
cp .env.example .env.local

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### AI モデルの設定

プロジェクトルートに `.env.local` ファイルを作成するか、アプリ内の「設定」ページで直接 API キーを設定してください：

```bash
# OpenAI（初心者におすすめ）
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic
NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# DeepSeek
NEXT_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-api-key

# DashScope（通義千問）
NEXT_PUBLIC_DASHSCOPE_API_KEY=sk-your-dashscope-api-key

# Zhipu GLM
NEXT_PUBLIC_ZHIPU_API_KEY=your-zhipu-api-key

# Ollama（ローカルモデル、API キー不要）
NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434

# デフォルト設定
NEXT_PUBLIC_DEFAULT_PROVIDER=openai
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4o-mini
NEXT_PUBLIC_DEFAULT_EMBEDDING_MODEL=text-embedding-3-small
```

> **ヒント**: 環境変数ファイルを編集せず、アプリ内の「設定」ページで API キーを直接設定することも可能です。Ollama ユーザーは、ローカルサービスが `localhost:11434` で動作していることを確認してください。

## 📖 使い方ガイド

### ノートブックの作成

1. ホームページの「新規ノートブック」ボタンをクリック
2. ノートブック名と説明を入力
3. 作成後、ドキュメントのアップロードや AI 対話を開始できます

### ドキュメントのアップロード

1. ノートブックの詳細ページを開く
2. 「ドキュメントをアップロード」をクリックするか、ファイルをドラッグ＆ドロップ
3. 対応形式：**PDF**、**TXT**、**Markdown**
4. アップロード後、自動的にテキスト抽出・インテリジェントチャンキング・ベクトル化が実行されます

### AI 対話

1. ノートブック内の「AI チャット」パネルを開く
2. 質問を入力すると、AI がアップロード済みのドキュメントに基づいて回答します
3. 回答には引用元が表示され、クリックで原文を確認できます
4. ストリーミング出力で、AI の生成プロセスをリアルタイムに確認できます

### ナレッジグラフ

1. ノートブックの「ナレッジグラフ」ビューに切り替え
2. 力指向グラフでドキュメント・ノート・テキストチャンク間の関係を表示
3. ノードのドラッグ、キャンバスのズームでインタラクティブに探索
4. ノードの色とサイズはタイプと重要度を反映しています

### 設定

- **AI プロバイダー**: AI サービスプロバイダーとモデルの選択・設定
- **テーマ**: ライト / ダーク / システム連動
- **チャンキングパラメータ**: チャンクサイズとオーバーラップ長の調整
- **言語**: 簡体字中国語 / English

## 💡 設計思想とロードマップ

### 設計理念

NoteMind AI は **「軽量・プライバシー・オープン」** の 3 つの理念で設計されています：

- **軽量**: ゼロバックエンドアーキテクチャ。ブラウザタブひとつが完全なアプリケーション。サーバーデプロイ不要、開くだけで使えます。
- **プライバシー**: すべてのデータはユーザーのブラウザにローカル保存。AI API 呼び出しを除き、ユーザードキュメントはサードパーティサーバーにアップロードされません。
- **オープン**: MIT ライセンスの完全オープンソース。複数 AI プロバイダーに対応し、特定のベンダーにロックインされません。

### v1.0 機能

- [x] マルチプロバイダー AI 対応（OpenAI / Anthropic / DeepSeek / DashScope / Zhipu GLM / Ollama）
- [x] PDF / TXT / Markdown ドキュメントのアップロードと解析
- [x] CJK 最適化インテリジェントテキストチャンキング
- [x] ベクトルストレージと類似度検索
- [x] RAG 検索拡張生成チャット
- [x] 引用トレースとソースアトリビューション
- [x] D3.js ナレッジグラフ可視化
- [x] Markdown ノートエディタ
- [x] ライト / ダークテーマ
- [x] PWA オフライン対応
- [x] 二言語インターフェース（中国語 / 英語）

### 今後の計画

- [ ] **マルチモーダル対応**: 画像・音声・動画ドキュメントの解析と検索
- [ ] **コラボレーション共有**: WebRTC によるエンドツーエンド暗号化ナレッジベース共有
- [ ] **プラグインシステム**: カスタムデータソースと AI 処理パイプライン
- [ ] **モバイル最適化**: レスポンシブレイアウト改善とジェスチャーサポート
- [ ] **ナレッジエクスポート**: Obsidian / Notion 互換形式へのエクスポート
- [ ] **スマートサマリー**: 自動ドキュメント要約とマインドマップ生成
- [ ] **さらなる AI プロバイダー**: 追加 AI サービスの継続的な統合

## 📦 ビルド＆デプロイガイド

### 開発モード

```bash
npm run dev
# http://localhost:3000 にアクセス
```

### 本番ビルド

```bash
npm run build
npm run start
# デフォルトでポート 3000 でリッスン
```

### 静的エクスポート

NoteMind AI は完全な静的エクスポートに対応しています。任意の静的ホスティングサービスにデプロイ可能です：

```bash
npm run build
# 出力先: out/ ディレクトリ（next.config.js で output: 'export' を設定が必要）
```

デプロイ先：
- **Vercel**: `vercel deploy`
- **GitHub Pages**: `out/` ディレクトリをプッシュ
- **Netlify**: `out/` ディレクトリを Netlify Drop にドラッグ
- **Cloudflare Pages**: リポジトリを接続して自動ビルド

### Docker デプロイ

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# イメージをビルド
docker build -t notemind-ai .

# コンテナを実行
docker run -p 3000:3000 notemind-ai
```

## 🤝 コントリビューション

バグ報告、ドキュメント改善、コード貢献など、あらゆる形式のコントリビューションを歓迎します。

1. このリポジトリを **Fork** する
2. フィーチャーブランチを作成：`git checkout -b feature/your-feature-name`
3. 変更をコミット：`git commit -m 'feat: add your feature'`
4. ブランチをプッシュ：`git push origin feature/your-feature-name`
5. **Pull Request** を提出する

### 開発ガイドライン

- TypeScript の厳格モードに準拠
- ESLint によるコードリントを実行
- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) に従う
- 新機能には型定義を含めること

## 📄 ライセンス

このプロジェクトは [MIT License](https://github.com/gitstq/NoteMind-AI/blob/main/LICENSE) の下で公開されています。

```
MIT License

Copyright (c) 2024 NoteMind AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
...
```

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/gitstq/NoteMind-AI">NoteMind AI Team</a>
</p>
