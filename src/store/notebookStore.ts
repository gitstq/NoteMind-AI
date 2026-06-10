import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Notebook, Source, Note } from '@/types';
import * as db from '@/lib/db/indexeddb';

// ============================================================
// Notebook Store
// ============================================================

interface NotebookState {
  notebooks: Notebook[];
  currentNotebook: Notebook | null;
  sources: Source[];
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // Notebook actions
  loadNotebooks: () => Promise<void>;
  createNotebook: (name: string, description?: string) => Promise<Notebook>;
  updateNotebook: (id: string, updates: Partial<Notebook>) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;
  setCurrentNotebook: (notebook: Notebook | null) => void;

  // Source actions
  loadSources: (notebookId: string) => Promise<void>;
  addSource: (source: Source) => Promise<void>;
  removeSource: (id: string) => Promise<void>;

  // Note actions
  loadNotes: (notebookId: string) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
}

export const useNotebookStore = create<NotebookState>((set, get) => ({
  notebooks: [],
  currentNotebook: null,
  sources: [],
  notes: [],
  isLoading: false,
  error: null,

  // ---- Notebook CRUD ----

  loadNotebooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const notebooks = await db.getAllNotebooks();
      set({ notebooks, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  createNotebook: async (name: string, description = '') => {
    const now = Date.now();
    const notebook: Notebook = {
      id: uuidv4(),
      name,
      description,
      sourceIds: [],
      noteIds: [],
      chatIds: [],
      createdAt: now,
      updatedAt: now,
    };
    await db.createNotebook(notebook);
    set((state) => ({
      notebooks: [notebook, ...state.notebooks],
    }));
    return notebook;
  },

  updateNotebook: async (id, updates) => {
    const current = get().notebooks.find((n) => n.id === id);
    if (!current) return;

    const updated = { ...current, ...updates, updatedAt: Date.now() };
    await db.updateNotebook(updated);
    set((state) => ({
      notebooks: state.notebooks.map((n) => (n.id === id ? updated : n)),
      currentNotebook: state.currentNotebook?.id === id ? updated : state.currentNotebook,
    }));
  },

  deleteNotebook: async (id) => {
    await db.deleteNotebook(id);
    set((state) => ({
      notebooks: state.notebooks.filter((n) => n.id !== id),
      currentNotebook: state.currentNotebook?.id === id ? null : state.currentNotebook,
    }));
  },

  setCurrentNotebook: (notebook) => {
    set({ currentNotebook: notebook });
  },

  // ---- Source management ----

  loadSources: async (notebookId) => {
    try {
      const sources = await db.getSourcesByNotebook(notebookId);
      set({ sources });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addSource: async (source) => {
    await db.createSource(source);
    const notebook = get().currentNotebook;
    if (notebook && notebook.id === source.notebookId) {
      const updatedNotebook = {
        ...notebook,
        sourceIds: [...notebook.sourceIds, source.id],
        updatedAt: Date.now(),
      };
      await db.updateNotebook(updatedNotebook);
      set((state) => ({
        sources: [...state.sources, source],
        currentNotebook:
          state.currentNotebook?.id === source.notebookId
            ? updatedNotebook
            : state.currentNotebook,
      }));
    }
  },

  removeSource: async (id) => {
    await db.deleteSource(id);
    const notebook = get().currentNotebook;
    if (notebook) {
      const updatedNotebook = {
        ...notebook,
        sourceIds: notebook.sourceIds.filter((sid) => sid !== id),
        updatedAt: Date.now(),
      };
      await db.updateNotebook(updatedNotebook);
      set((state) => ({
        sources: state.sources.filter((s) => s.id !== id),
        currentNotebook:
          state.currentNotebook?.id === notebook.id
            ? updatedNotebook
            : state.currentNotebook,
      }));
    }
  },

  // ---- Note management ----

  loadNotes: async (notebookId) => {
    try {
      const notes = await db.getNotesByNotebook(notebookId);
      set({ notes });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addNote: async (note) => {
    await db.createNote(note);
    const notebook = get().currentNotebook;
    if (notebook && notebook.id === note.notebookId) {
      const updatedNotebook = {
        ...notebook,
        noteIds: [...notebook.noteIds, note.id],
        updatedAt: Date.now(),
      };
      await db.updateNotebook(updatedNotebook);
      set((state) => ({
        notes: [...state.notes, note],
        currentNotebook:
          state.currentNotebook?.id === note.notebookId
            ? updatedNotebook
            : state.currentNotebook,
      }));
    }
  },

  updateNote: async (note) => {
    await db.updateNote(note);
    set((state) => ({
      notes: state.notes.map((n) => (n.id === note.id ? note : n)),
    }));
  },

  removeNote: async (id) => {
    await db.deleteNote(id);
    const notebook = get().currentNotebook;
    if (notebook) {
      const updatedNotebook = {
        ...notebook,
        noteIds: notebook.noteIds.filter((nid) => nid !== id),
        updatedAt: Date.now(),
      };
      await db.updateNotebook(updatedNotebook);
      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        currentNotebook:
          state.currentNotebook?.id === notebook.id
            ? updatedNotebook
            : state.currentNotebook,
      }));
    }
  },
}));
