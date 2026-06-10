'use client';

import { useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '@/store/chatStore';
import { useSettingsStore } from '@/store/settingsStore';
import { chatCompletionStream } from '@/lib/ai/provider';
import { searchChunks } from '@/lib/ai/rag';
import type { ChatMessage, Citation } from '@/types';

// ============================================================
// useChat — manages chat with streaming support
// ============================================================

export function useChat(notebookId?: string) {
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();
  const abortRef = useRef<AbortController | null>(null);

  // Load messages when notebook changes
  useEffect(() => {
    if (notebookId) {
      chatStore.loadMessages(notebookId);
    }
  }, [notebookId, chatStore]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!notebookId) return;

      const { settings } = settingsStore;
      const { providers } = settingsStore;
      const provider = providers[settings.aiProvider];
      const apiKey = provider.apiKey;
      const baseUrl = provider.baseUrl;

      if (!apiKey && settings.aiProvider !== 'ollama') {
        chatStore.setError('请先配置 AI Provider 的 API Key');
        return;
      }

      // 1. Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        notebookId,
        role: 'user',
        content,
        citations: [],
        createdAt: Date.now(),
      };
      await chatStore.addMessage(userMessage);

      // 2. Search for relevant context
      let citations: Citation[] = [];
      try {
        const result = await searchChunks(
          settings.aiProvider,
          apiKey,
          baseUrl,
          settings.embeddingModel,
          notebookId,
          content,
          settings.maxContextChunks
        );
        citations = result.citations;
      } catch {
        // Non-fatal: proceed without RAG context
      }

      // 3. Build context-augmented messages
      const contextText = citations.length > 0
        ? citations.map((c, i) => `[${i + 1}] ${c.text}`).join('\n\n')
        : '';

      const systemContent = contextText
        ? `You are a helpful AI assistant. Use the following context from the user's notebook to answer questions.\n\n## Context:\n${contextText}\n\nCite sources using [1], [2] format. Respond in the same language as the user.`
        : 'You are a helpful AI assistant. Respond in the same language as the user.';

      const history = chatStore.messages.map((m) => ({
        id: m.id,
        notebookId: m.notebookId,
        role: m.role,
        content: m.content,
        citations: m.citations,
        createdAt: m.createdAt,
      }));

      // 4. Start streaming
      chatStore.startStreaming();

      try {
        await chatCompletionStream(
          settings.aiProvider,
          {
            messages: [
              {
                id: 'system',
                notebookId,
                role: 'system',
                content: systemContent,
                citations: [],
                createdAt: Date.now(),
              },
              ...history,
              userMessage,
            ],
            model: settings.aiModel,
            temperature: 0.7,
            maxTokens: 2048,
          },
          apiKey,
          baseUrl,
          (chunk) => {
            if (chunk.done) {
              chatStore.finishStreaming();
            } else {
              chatStore.appendStreamContent(chunk.content);
            }
          }
        );

        // 5. Save assistant message
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          notebookId,
          role: 'assistant',
          content: chatStore.streamingContent,
          citations,
          createdAt: Date.now(),
        };
        await chatStore.addMessage(assistantMessage);
      } catch (err) {
        chatStore.setError((err as Error).message);
        chatStore.finishStreaming();
      }
    },
    [notebookId, chatStore, settingsStore]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    chatStore.finishStreaming();
  }, [chatStore]);

  const clearChat = useCallback(async () => {
    if (notebookId) {
      await chatStore.clearMessages(notebookId);
    }
  }, [notebookId, chatStore]);

  return {
    messages: chatStore.messages,
    isLoading: chatStore.isLoading,
    isStreaming: chatStore.isStreaming,
    streamingContent: chatStore.streamingContent,
    error: chatStore.error,
    sendMessage,
    stopStreaming,
    clearChat,
  };
}
