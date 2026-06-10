import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Notebook, Source, Chunk, Note, ChatMessage, Settings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

// ============================================================
// Schema
// ============================================================

interface NoteMindDB extends DBSchema {
  notebooks: {
    key: string;
    value: Notebook;
    indexes: { 'by-createdAt': number };
  };
  sources: {
    key: string;
    value: Source;
    indexes: { 'by-notebookId': string; 'by-createdAt': number };
  };
  chunks: {
    key: string;
    value: Chunk;
    indexes: { 'by-sourceId': string; 'by-notebookId': string };
  };
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-notebookId': string; 'by-createdAt': number };
  };
  chats: {
    key: string;
    value: ChatMessage;
    indexes: { 'by-notebookId': string; 'by-createdAt': number };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

const DB_NAME = 'notemind_db';
const DB_VERSION = 1;

// ============================================================
// Database singleton
// ============================================================

let dbPromise: Promise<IDBPDatabase<NoteMindDB>> | null = null;

function getDB(): Promise<IDBPDatabase<NoteMindDB>> {
  if (!dbPromise) {
    dbPromise = openDB<NoteMindDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Notebooks
        const notebookStore = db.createObjectStore('notebooks', { keyPath: 'id' });
        notebookStore.createIndex('by-createdAt', 'createdAt');

        // Sources
        const sourceStore = db.createObjectStore('sources', { keyPath: 'id' });
        sourceStore.createIndex('by-notebookId', 'notebookId');
        sourceStore.createIndex('by-createdAt', 'createdAt');

        // Chunks
        const chunkStore = db.createObjectStore('chunks', { keyPath: 'id' });
        chunkStore.createIndex('by-sourceId', 'sourceId');
        chunkStore.createIndex('by-notebookId', 'notebookId');

        // Notes
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        noteStore.createIndex('by-notebookId', 'notebookId');
        noteStore.createIndex('by-createdAt', 'createdAt');

        // Chats
        const chatStore = db.createObjectStore('chats', { keyPath: 'id' });
        chatStore.createIndex('by-notebookId', 'notebookId');
        chatStore.createIndex('by-createdAt', 'createdAt');

        // Settings
        db.createObjectStore('settings');
      },
    });
  }
  return dbPromise;
}

// ============================================================
// Notebook CRUD
// ============================================================

export async function createNotebook(notebook: Notebook): Promise<void> {
  const db = await getDB();
  await db.put('notebooks', notebook);
}

export async function getNotebook(id: string): Promise<Notebook | undefined> {
  const db = await getDB();
  return db.get('notebooks', id);
}

export async function getAllNotebooks(): Promise<Notebook[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('notebooks', 'by-createdAt');
  return all.reverse(); // newest first
}

export async function updateNotebook(notebook: Notebook): Promise<void> {
  const db = await getDB();
  await db.put('notebooks', notebook);
}

export async function deleteNotebook(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['notebooks', 'sources', 'chunks', 'notes', 'chats'], 'readwrite');

  // Delete notebook
  await tx.objectStore('notebooks').delete(id);

  // Delete associated sources
  const sourceIndex = tx.objectStore('sources').index('by-notebookId');
  let sourceCursor = await sourceIndex.openCursor(id);
  while (sourceCursor) {
    const source = sourceCursor.value;
    // Delete chunks for this source
    const chunkIndex = tx.objectStore('chunks').index('by-sourceId');
    let chunkCursor = await chunkIndex.openCursor(source.id);
    while (chunkCursor) {
      await chunkCursor.delete();
      chunkCursor = await chunkCursor.continue();
    }
    await sourceCursor.delete();
    sourceCursor = await sourceCursor.continue();
  }

  // Delete associated notes
  const noteIndex = tx.objectStore('notes').index('by-notebookId');
  let noteCursor = await noteIndex.openCursor(id);
  while (noteCursor) {
    await noteCursor.delete();
    noteCursor = await noteCursor.continue();
  }

  // Delete associated chats
  const chatIndex = tx.objectStore('chats').index('by-notebookId');
  let chatCursor = await chatIndex.openCursor(id);
  while (chatCursor) {
    await chatCursor.delete();
    chatCursor = await chatCursor.continue();
  }

  await tx.done;
}

// ============================================================
// Source CRUD
// ============================================================

export async function createSource(source: Source): Promise<void> {
  const db = await getDB();
  await db.put('sources', source);
}

export async function getSource(id: string): Promise<Source | undefined> {
  const db = await getDB();
  return db.get('sources', id);
}

export async function getSourcesByNotebook(notebookId: string): Promise<Source[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('sources', 'by-notebookId', notebookId);
  return all;
}

export async function updateSource(source: Source): Promise<void> {
  const db = await getDB();
  await db.put('sources', source);
}

export async function deleteSource(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['sources', 'chunks'], 'readwrite');
  await tx.objectStore('sources').delete(id);
  // Delete associated chunks
  const chunkIndex = tx.objectStore('chunks').index('by-sourceId');
  let chunkCursor = await chunkIndex.openCursor(id);
  while (chunkCursor) {
    await chunkCursor.delete();
    chunkCursor = await chunkCursor.continue();
  }
  await tx.done;
}

// ============================================================
// Chunk CRUD
// ============================================================

export async function createChunk(chunk: Chunk): Promise<void> {
  const db = await getDB();
  await db.put('chunks', chunk);
}

export async function createChunks(chunks: Chunk[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('chunks', 'readwrite');
  for (const chunk of chunks) {
    await tx.store.put(chunk);
  }
  await tx.done;
}

export async function getChunksBySource(sourceId: string): Promise<Chunk[]> {
  const db = await getDB();
  return db.getAllFromIndex('chunks', 'by-sourceId', sourceId);
}

export async function getChunksByNotebook(notebookId: string): Promise<Chunk[]> {
  const db = await getDB();
  return db.getAllFromIndex('chunks', 'by-notebookId', notebookId);
}

export async function deleteChunksBySource(sourceId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('chunks', 'readwrite');
  const index = tx.store.index('by-sourceId');
  let cursor = await index.openCursor(sourceId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

// ============================================================
// Note CRUD
// ============================================================

export async function createNote(note: Note): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function getNote(id: string): Promise<Note | undefined> {
  const db = await getDB();
  return db.get('notes', id);
}

export async function getNotesByNotebook(notebookId: string): Promise<Note[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('notes', 'by-notebookId', notebookId);
  return all;
}

export async function updateNote(note: Note): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}

// ============================================================
// Chat CRUD
// ============================================================

export async function createChatMessage(message: ChatMessage): Promise<void> {
  const db = await getDB();
  await db.put('chats', message);
}

export async function getChatMessagesByNotebook(notebookId: string): Promise<ChatMessage[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('chats', 'by-notebookId', notebookId);
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function deleteChatMessagesByNotebook(notebookId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('chats', 'readwrite');
  const index = tx.store.index('by-notebookId');
  let cursor = await index.openCursor(notebookId);
  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }
  await tx.done;
}

// ============================================================
// Settings
// ============================================================

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const settings = await db.get('settings', 'global');
  return settings ?? { ...DEFAULT_SETTINGS };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings, 'global');
}

// ============================================================
// Database reset (for debugging)
// ============================================================

export async function resetDatabase(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(
    ['notebooks', 'sources', 'chunks', 'notes', 'chats', 'settings'],
    'readwrite'
  );
  await Promise.all([
    tx.objectStore('notebooks').clear(),
    tx.objectStore('sources').clear(),
    tx.objectStore('chunks').clear(),
    tx.objectStore('notes').clear(),
    tx.objectStore('chats').clear(),
    tx.objectStore('settings').clear(),
  ]);
  await tx.done;
}
