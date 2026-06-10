// ============================================================
// NoteMind AI — Type Definitions
// ============================================================

/** Supported AI provider identifiers */
export type AIProviderId =
  | 'openai'
  | 'anthropic'
  | 'deepseek'
  | 'dashscope'
  | 'zhipu'
  | 'ollama';

/** A single source document uploaded to a notebook */
export interface Source {
  id: string;
  notebookId: string;
  title: string;
  content: string;
  type: SourceType;
  chunks: string[]; // chunk IDs
  createdAt: number;
  updatedAt: number;
}

export type SourceType = 'pdf' | 'txt' | 'md' | 'url' | 'text';

/** A text chunk produced from a source */
export interface Chunk {
  id: string;
  sourceId: string;
  notebookId: string;
  content: string;
  embedding: number[];
  metadata: {
    startIndex: number;
    endIndex: number;
    pageNumber?: number;
  };
  createdAt: number;
}

/** A user-authored note inside a notebook */
export interface Note {
  id: string;
  notebookId: string;
  title: string;
  content: string; // markdown
  sources: string[]; // source IDs referenced
  createdAt: number;
  updatedAt: number;
}

/** A single chat message */
export interface ChatMessage {
  id: string;
  notebookId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations: Citation[];
  createdAt: number;
}

/** A citation linking assistant output to source chunks */
export interface Citation {
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  text: string;
  score: number;
}

/** A notebook — the top-level organisational unit */
export interface Notebook {
  id: string;
  name: string;
  description: string;
  sourceIds: string[];
  noteIds: string[];
  chatIds: string[];
  createdAt: number;
  updatedAt: number;
}

/** AI model definition */
export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsEmbedding: boolean;
}

/** AI provider configuration */
export interface AIProvider {
  id: AIProviderId;
  name: string;
  apiKey: string;
  baseUrl: string;
  models: AIModel[];
  isConfigured: boolean;
}

/** Global application settings */
export interface Settings {
  aiProvider: AIProviderId;
  aiModel: string;
  embeddingModel: string;
  theme: 'light' | 'dark' | 'system';
  language: 'zh' | 'en';
  chunkSize: number;
  chunkOverlap: number;
  maxContextChunks: number;
}

/** Chat completion request (provider-agnostic) */
export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/** Chat completion response chunk (streaming) */
export interface ChatCompletionChunk {
  id: string;
  role: 'assistant';
  content: string;
  done: boolean;
}

/** Chat completion response (non-streaming) */
export interface ChatCompletionResponse {
  id: string;
  role: 'assistant';
  content: string;
  citations: Citation[];
}

/** Embedding request */
export interface EmbeddingRequest {
  input: string[];
  model: string;
}

/** Embedding response */
export interface EmbeddingResponse {
  embeddings: number[][];
  model: string;
  usage: { promptTokens: number; totalTokens: number };
}

/** RAG search result */
export interface RAGSearchResult {
  chunks: Chunk[];
  citations: Citation[];
}

/** Knowledge graph node */
export interface GraphNode {
  id: string;
  label: string;
  type: 'source' | 'note' | 'chunk';
  notebookId: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

/** Knowledge graph edge */
export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}

/** Default settings factory */
export const DEFAULT_SETTINGS: Settings = {
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  embeddingModel: 'text-embedding-3-small',
  theme: 'system',
  language: 'zh',
  chunkSize: 512,
  chunkOverlap: 64,
  maxContextChunks: 8,
};

/** Pre-defined provider templates */
export const PROVIDER_TEMPLATES: Record<AIProviderId, Omit<AIProvider, 'apiKey' | 'isConfigured'>> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'text-embedding-3-small', name: 'Text Embedding 3 Small', maxTokens: 8191, supportsStreaming: false, supportsEmbedding: true },
      { id: 'text-embedding-3-large', name: 'Text Embedding 3 Large', maxTokens: 8191, supportsStreaming: false, supportsEmbedding: true },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', maxTokens: 200000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', maxTokens: 200000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 200000, supportsStreaming: true, supportsEmbedding: false },
    ],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', maxTokens: 64000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', maxTokens: 64000, supportsStreaming: true, supportsEmbedding: false },
    ],
  },
  dashscope: {
    id: 'dashscope',
    name: '通义千问 (DashScope)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { id: 'qwen-turbo', name: 'Qwen Turbo', maxTokens: 131072, supportsStreaming: true, supportsEmbedding: false },
      { id: 'qwen-plus', name: 'Qwen Plus', maxTokens: 131072, supportsStreaming: true, supportsEmbedding: false },
      { id: 'qwen-max', name: 'Qwen Max', maxTokens: 32768, supportsStreaming: true, supportsEmbedding: false },
      { id: 'text-embedding-v3', name: 'Text Embedding V3', maxTokens: 8192, supportsStreaming: false, supportsEmbedding: true },
    ],
  },
  zhipu: {
    id: 'zhipu',
    name: '智谱 GLM',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { id: 'glm-4', name: 'GLM-4', maxTokens: 128000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', maxTokens: 128000, supportsStreaming: true, supportsEmbedding: false },
      { id: 'embedding-3', name: 'Embedding-3', maxTokens: 8192, supportsStreaming: false, supportsEmbedding: true },
    ],
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434/api',
    models: [
      { id: 'llama3', name: 'Llama 3', maxTokens: 8192, supportsStreaming: true, supportsEmbedding: false },
      { id: 'qwen2', name: 'Qwen 2', maxTokens: 32768, supportsStreaming: true, supportsEmbedding: false },
      { id: 'nomic-embed-text', name: 'Nomic Embed Text', maxTokens: 8192, supportsStreaming: false, supportsEmbedding: true },
    ],
  },
};
