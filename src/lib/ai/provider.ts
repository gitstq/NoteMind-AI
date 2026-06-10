import type {
  AIProviderId,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  EmbeddingRequest,
  EmbeddingResponse,
} from '@/types';

// ============================================================
// Provider registry — maps provider id → API adapter
// ============================================================

interface ProviderAdapter {
  chatCompletion(
    request: ChatCompletionRequest,
    apiKey: string,
    baseUrl: string
  ): Promise<ChatCompletionResponse>;

  chatCompletionStream(
    request: ChatCompletionRequest,
    apiKey: string,
    baseUrl: string,
    onChunk: (chunk: ChatCompletionChunk) => void
  ): Promise<void>;

  createEmbedding(
    request: EmbeddingRequest,
    apiKey: string,
    baseUrl: string
  ): Promise<EmbeddingResponse>;
}

// ============================================================
// OpenAI-compatible adapter (covers OpenAI, DeepSeek, DashScope, ZhipuGLM)
// ============================================================

const openAICompatible: ProviderAdapter = {
  async chatCompletion(request, apiKey, baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Chat completion failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      role: 'assistant',
      content: data.choices[0]?.message?.content ?? '',
      citations: [],
    };
  },

  async chatCompletionStream(request, apiKey, baseUrl, onChunk) {
    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Stream chat completion failed (${res.status}): ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') {
          onChunk({ id: 'stream', role: 'assistant', content: '', done: true });
          return;
        }
        try {
          const parsed = JSON.parse(payload);
          const delta = parsed.choices[0]?.delta?.content ?? '';
          if (delta) {
            onChunk({ id: parsed.id, role: 'assistant', content: delta, done: false });
          }
        } catch {
          // skip malformed JSON
        }
      }
    }

    onChunk({ id: 'stream', role: 'assistant', content: '', done: true });
  },

  async createEmbedding(request, apiKey, baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, '')}/embeddings`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        input: request.input,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Embedding failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return {
      embeddings: data.data.map((d: { embedding: number[] }) => d.embedding),
      model: data.model,
      usage: data.usage,
    };
  },
};

// ============================================================
// Anthropic adapter
// ============================================================

const anthropicAdapter: ProviderAdapter = {
  async chatCompletion(request, apiKey, baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, '')}/messages`;
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const messages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens ?? 2048,
        system: systemMessage?.content ?? '',
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic chat failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      role: 'assistant',
      content: data.content[0]?.text ?? '',
      citations: [],
    };
  },

  async chatCompletionStream(request, apiKey, baseUrl, onChunk) {
    const url = `${baseUrl.replace(/\/+$/, '')}/messages`;
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const messages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens ?? 2048,
        system: systemMessage?.content ?? '',
        messages,
        stream: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic stream failed (${res.status}): ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        try {
          const parsed = JSON.parse(payload);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            onChunk({ id: parsed.id, role: 'assistant', content: parsed.delta.text, done: false });
          }
          if (parsed.type === 'message_stop') {
            onChunk({ id: 'stream', role: 'assistant', content: '', done: true });
            return;
          }
        } catch {
          // skip
        }
      }
    }

    onChunk({ id: 'stream', role: 'assistant', content: '', done: true });
  },

  async createEmbedding(_request, _apiKey, _baseUrl) {
    throw new Error('Anthropic does not provide an embedding API. Please use OpenAI or another provider for embeddings.');
  },
};

// ============================================================
// Ollama adapter
// ============================================================

const ollamaAdapter: ProviderAdapter = {
  async chatCompletion(request, _apiKey, baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, '')}/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: false,
        options: {
          temperature: request.temperature ?? 0.7,
          num_predict: request.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama chat failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return {
      id: 'ollama-' + Date.now(),
      role: 'assistant',
      content: data.message?.content ?? '',
      citations: [],
    };
  },

  async chatCompletionStream(request, _apiKey, baseUrl, onChunk) {
    const url = `${baseUrl.replace(/\/+$/, '')}/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
        options: {
          temperature: request.temperature ?? 0.7,
          num_predict: request.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama stream failed (${res.status}): ${err}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);
          if (parsed.message?.content) {
            onChunk({ id: 'ollama', role: 'assistant', content: parsed.message.content, done: false });
          }
          if (parsed.done) {
            onChunk({ id: 'ollama', role: 'assistant', content: '', done: true });
            return;
          }
        } catch {
          // skip
        }
      }
    }

    onChunk({ id: 'ollama', role: 'assistant', content: '', done: true });
  },

  async createEmbedding(request, _apiKey, baseUrl) {
    const url = `${baseUrl.replace(/\/+$/, '')}/embeddings`;
    const results: number[][] = [];

    for (const text of request.input) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: request.model, prompt: text }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Ollama embedding failed (${res.status}): ${err}`);
      }

      const data = await res.json();
      results.push(data.embedding);
    }

    return {
      embeddings: results,
      model: request.model,
      usage: { promptTokens: 0, totalTokens: 0 },
    };
  },
};

// ============================================================
// Provider lookup
// ============================================================

const adapters: Record<AIProviderId, ProviderAdapter> = {
  openai: openAICompatible,
  anthropic: anthropicAdapter,
  deepseek: openAICompatible,
  dashscope: openAICompatible,
  zhipu: openAICompatible,
  ollama: ollamaAdapter,
};

export function getAdapter(providerId: AIProviderId): ProviderAdapter {
  return adapters[providerId];
}

export async function chatCompletion(
  providerId: AIProviderId,
  request: ChatCompletionRequest,
  apiKey: string,
  baseUrl: string
): Promise<ChatCompletionResponse> {
  const adapter = getAdapter(providerId);
  return adapter.chatCompletion(request, apiKey, baseUrl);
}

export async function chatCompletionStream(
  providerId: AIProviderId,
  request: ChatCompletionRequest,
  apiKey: string,
  baseUrl: string,
  onChunk: (chunk: ChatCompletionChunk) => void
): Promise<void> {
  const adapter = getAdapter(providerId);
  return adapter.chatCompletionStream(request, apiKey, baseUrl, onChunk);
}

export async function createEmbedding(
  providerId: AIProviderId,
  request: EmbeddingRequest,
  apiKey: string,
  baseUrl: string
): Promise<EmbeddingResponse> {
  const adapter = getAdapter(providerId);
  return adapter.createEmbedding(request, apiKey, baseUrl);
}
