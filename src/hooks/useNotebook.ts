'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useNotebookStore } from '@/store/notebookStore';
import type { Notebook } from '@/types';

// ============================================================
// useNotebook — convenience hook for notebook operations
// ============================================================

export function useNotebook(notebookId?: string) {
  const router = useRouter();
  const store = useNotebookStore();

  const loadNotebook = useCallback(async () => {
    if (!notebookId) return;
    await store.loadSources(notebookId);
    await store.loadNotes(notebookId);
  }, [notebookId, store]);

  useEffect(() => {
    loadNotebook();
  }, [loadNotebook]);

  const navigateToNotebook = useCallback(
    (notebook: Notebook) => {
      store.setCurrentNotebook(notebook);
      router.push(`/notebooks/${notebook.id}`);
    },
    [router, store]
  );

  const handleCreateNotebook = useCallback(
    async (name: string, description?: string) => {
      const notebook = await store.createNotebook(name, description);
      navigateToNotebook(notebook);
      return notebook;
    },
    [store, navigateToNotebook]
  );

  const handleDeleteNotebook = useCallback(
    async (id: string) => {
      await store.deleteNotebook(id);
      if (store.currentNotebook?.id === id) {
        router.push('/');
      }
    },
    [store, router]
  );

  return {
    // State
    notebooks: store.notebooks,
    currentNotebook: store.currentNotebook,
    sources: store.sources,
    notes: store.notes,
    isLoading: store.isLoading,
    error: store.error,

    // Actions
    loadNotebooks: store.loadNotebooks,
    createNotebook: handleCreateNotebook,
    updateNotebook: store.updateNotebook,
    deleteNotebook: handleDeleteNotebook,
    setCurrentNotebook: store.setCurrentNotebook,
    navigateToNotebook,

    // Source actions
    addSource: store.addSource,
    removeSource: store.removeSource,

    // Note actions
    addNote: store.addNote,
    updateNote: store.updateNote,
    removeNote: store.removeNote,
  };
}
