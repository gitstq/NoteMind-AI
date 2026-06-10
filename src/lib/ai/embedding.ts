import type { AIProviderId, EmbeddingRequest, EmbeddingResponse } from '@/types';
import { createEmbedding as providerEmbedding } from './provider';

// ============================================================
// Cosine similarity
// ============================================================

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ============================================================
// Batch embedding with rate limiting
// ============================================================

const BATCH_SIZE = 20; // max texts per request
const BATCH_DELAY_MS = 200; // delay between batches

export async function generateEmbeddings(
  providerId: AIProviderId,
  apiKey: string,
  baseUrl: string,
  model: string,
  texts: string[]
): Promise<number[][]> {
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const request: EmbeddingRequest = {
      input: batch,
      model,
    };

    const response: EmbeddingResponse = await providerEmbedding(
      providerId,
      request,
      apiKey,
      baseUrl
    );

    allEmbeddings.push(...response.embeddings);

    // Rate limiting
    if (i + BATCH_SIZE < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return allEmbeddings;
}

// ============================================================
// Find most similar chunks
// ============================================================

export interface SimilarityResult {
  index: number;
  score: number;
}

export function findMostSimilar(
  queryEmbedding: number[],
  chunkEmbeddings: number[][],
  topK: number = 5,
  threshold: number = 0.3
): SimilarityResult[] {
  const results: SimilarityResult[] = [];

  for (let i = 0; i < chunkEmbeddings.length; i++) {
    const score = cosineSimilarity(queryEmbedding, chunkEmbeddings[i]);
    if (score >= threshold) {
      results.push({ index: i, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}
