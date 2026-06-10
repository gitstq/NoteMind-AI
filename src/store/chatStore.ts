import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, Citation } from '@/types';
import * as db from '@/lib/db/indexeddb';

// ============================================================
// Chat Store
// ============================================================

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;

  // Actions
  loadMessages: (notebookId: string) => Promise<void>;
  addMessage: (message: ChatMessage) => Promise<void>;
  clearMessages: (notebookId: string) => Promise<void>;
  startStreaming: () => void;
  appendStreamContent: (content: string) => void;
  finishStreaming: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingContent: '',
  error: null,

  loadMessages: async (notebookId) => {
    set({ isLoading: true, error: null });
    try {
      const messages = await db.getChatMessagesByNotebook(notebookId);
      set({ messages, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  addMessage: async (message) => {
    await db.createChatMessage(message);
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearMessages: async (notebookId) => {
    await db.deleteChatMessagesByNotebook(notebookId);
    set({ messages: [] });
  },

  startStreaming: () => {
    set({ isStreaming: true, streamingContent: '', error: null });
  },

  appendStreamContent: (content) => {
    set((state) => ({
      streamingContent: state.streamingContent + content,
    }));
  },

  finishStreaming: () => {
    set({ isStreaming: false });
  },

  setError: (error) => {
    set({ error });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
