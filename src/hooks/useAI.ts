'use client';

import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { generateEmbeddings } from '@/lib/ai/embedding';
import { chunkText } from '@/lib/ai/chunking';
import { createChunks } from '@/lib/db/indexeddb';
import { v4 as uuidv4 } from 'uuid';
import type { Chunk, AIProviderId } from '@/types';

// ============================================================
// useAI — high-level AI operations hook
// ============================================================

export function useAI() {
  const settingsStore = useSettingsStore();

  /**
   * Process a source document: chunk it and generate embeddings.
   */
  const processSource = useCallback(
    async (sourceId: string, notebookId: string, content: string) => {
      const { settings, providers } = settingsStore;
      const provider = providers[settings.aiProvider];
      const apiKey = provider.apiKey;
      const baseUrl = provider.baseUrl;

      if (!apiKey && settings.aiProvider !== 'ollama') {
        throw new Error('请先配置 AI Provider 的 API Key');
      }

      // 1. Chunk the text
      const textChunks = chunkText(content, {
        chunkSize: settings.chunkSize,
        chunkOverlap: settings.chunkOverlap,
      });

      if (textChunks.length === 0) return;

      // 2. Generate embeddings
      const embeddings = await generateEmbeddings(
        settings.aiProvider,
        apiKey,
        baseUrl,
        settings.embeddingModel,
        textChunks.map((c) => c.content)
      );

      // 3. Create chunk records
      const chunks: Chunk[] = textChunks.map((tc, i) => ({
        id: uuidv4(),
        sourceId,
        notebookId,
        content: tc.content,
        embedding: embeddings[i] ?? [],
        metadata: {
          startIndex: tc.startIndex,
          endIndex: tc.endIndex,
        },
        createdAt: Date.now(),
      }));

      await createChunks(chunks);
      return chunks;
    },
    [settingsStore]
  );

  /**
   * Check if AI is configured and ready.
   */
  const isReady = useCallback(() => {
    const { settings, providers } = settingsStore;
    const provider = providers[settings.aiProvider];
    if (settings.aiProvider === 'ollama') return true;
    return provider.apiKey.length > 0;
  }, [settingsStore]);

  return {
    processSource,
    isReady,
    settings: settingsStore.settings,
    providers: settingsStore.providers,
    updateSettings: settingsStore.updateSettings,
    setProviderApiKey: settingsStore.setProviderApiKey,
    setProviderBaseUrl: settingsStore.setProviderBaseUrl,
    getProviderConfig: settingsStore.getProviderConfig,
    isProviderConfigured: settingsStore.isProviderConfigured,
  };
}
