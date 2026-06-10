# NoteMind AI

**Lightweight AI-Powered Knowledge Notebook Engine**

Privacy-first, zero-backend, offline-ready. A lightweight open-source alternative to Google NotebookLM.

## Features

- **Multi-Provider AI Support**: OpenAI, Anthropic, DeepSeek, DashScope, ZhipuGLM, Ollama
- **RAG-Powered Chat**: Retrieve-augmented generation with vector similarity search
- **Document Processing**: Upload PDF, TXT, Markdown files with CJK-optimized chunking
- **Knowledge Graph**: D3-powered force-directed graph visualization
- **Markdown Notes**: Built-in note editor with markdown support
- **Offline-Ready**: PWA with Service Worker for offline access
- **Privacy-First**: All data stored locally in IndexedDB, zero backend

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Configuration

Configure your AI provider in Settings or via environment variables. See `.env.example` for details.

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **State Management**: Zustand
- **Database**: IndexedDB (via idb)
- **Styling**: Tailwind CSS
- **Visualization**: D3.js
- **PDF Parsing**: pdfjs-dist

## License

MIT
