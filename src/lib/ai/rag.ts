import type { Chunk, Citation, RAGSearchResult, AIProviderId } from '@/types';
import { generateEmbeddings, findMostSimilar } from './embedding';
import { chatCompletion } from './provider';
import { getChunksByNotebook, getSourcesByNotebook } from '../db/indexeddb';

// ============================================================
// RAG — Retrieval-Augmented Generation
// ============================================================

/**
 * Search notebook chunks by semantic similarity to a query.
 */
export async function searchChunks(
  providerId: AIProviderId,
  apiKey: string,
  baseUrl: string,
  embeddingModel: string,
  notebookId: string,
  query: string,
  topK: number = 5
): Promise<RAGSearchResult> {
  // 1. Get all chunks for the notebook
  const chunks = await getChunksByNotebook(notebookId);
  if (chunks.length === 0) {
    return { chunks: [], citations: [] };
  }

  // 2. Generate embedding for the query
  const queryEmbeddings = await generateEmbeddings(
    providerId,
    apiKey,
    baseUrl,
    embeddingModel,
    [query]
  );

  const queryEmbedding = queryEmbeddings[0];
  if (!queryEmbedding) {
    return { chunks: [], citations: [] };
  }

  // 3. Filter chunks that have embeddings
  const embeddedChunks = chunks.filter((c) => c.embedding && c.embedding.length > 0);
  if (embeddedChunks.length === 0) {
    return { chunks: [], citations: [] };
  }

  // 4. Find most similar chunks
  const chunkEmbeddings = embeddedChunks.map((c) => c.embedding);
  const similar = findMostSimilar(queryEmbedding, chunkEmbeddings, topK);

  // 5. Build results
  const matchedChunks = similar.map((s) => embeddedChunks[s.index]);

  // 6. Get source titles for citations
  const sources = await getSourcesByNotebook(notebookId);
  const sourceMap = new Map(sources.map((s) => [s.id, s.title]));

  const citations: Citation[] = matchedChunks.map((chunk, i) => ({
    chunkId: chunk.id,
    sourceId: chunk.sourceId,
    sourceTitle: sourceMap.get(chunk.sourceId) ?? 'Unknown Source',
    text: chunk.content.slice(0, 200) + (chunk.content.length > 200 ? '...' : ''),
    score: similar[i].score,
  }));

  return { chunks: matchedChunks, citations };
}

/**
 * Build a RAG-augmented prompt and call the AI model.
 */
export async function ragChat(
  providerId: AIProviderId,
  apiKey: string,
  baseUrl: string,
  model: string,
  embeddingModel: string,
  notebookId: string,
  userMessage: string,
  chatHistory: { role: string; content: string }[],
  maxContextChunks: number = 8
): Promise<{ content: string; citations: Citation[] }> {
  // 1. Retrieve relevant chunks
  const { chunks, citations } = await searchChunks(
    providerId,
    apiKey,
    baseUrl,
    embeddingModel,
    notebookId,
    userMessage,
    maxContextChunks
  );

  // 2. Build context string
  const contextParts = chunks.map(
    (chunk, i) => `[${i + 1}] ${chunk.content}`
  );
  const contextString = contextParts.length > 0
    ? contextParts.join('\n\n')
    : 'No relevant context found.';

  // 3. Build system prompt
  const systemPrompt = `You are a helpful AI assistant for a knowledge notebook. Answer the user's question based on the provided context from their uploaded sources. If the context doesn't contain relevant information, say so honestly.

## Context from sources:
${contextString}

## Instructions:
- Answer based primarily on the provided context.
- Cite sources using [1], [2], etc. format when referencing specific parts.
- If the context is insufficient, clearly state that.
- Respond in the same language as the user's question.`;

  // 4. Call chat completion
  const response = await chatCompletion(
    providerId,
    {
      messages: [
        { id: 'system', notebookId, role: 'system', content: systemPrompt, citations: [], createdAt: Date.now() },
        ...chatHistory.map((m, i) => ({
          id: `history-${i}`,
          notebookId,
          role: m.role as 'user' | 'assistant',
          content: m.content,
          citations: [],
          createdAt: Date.now(),
        })),
        { id: `user-${Date.now()}`, notebookId, role: 'user', content: userMessage, citations: [], createdAt: Date.now() },
      ],
      model,
      temperature: 0.7,
      maxTokens: 2048,
    },
    apiKey,
    baseUrl
  );

  return {
    content: response.content,
    citations: citations.length > 0 ? citations : [],
  };
}
