'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '@/types';

// ============================================================
// NoteEditor Component
// ============================================================

interface NoteEditorProps {
  notes: Note[];
  notebookId: string;
  onCreateNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

export function NoteEditor({ notes, notebookId, onCreateNote, onUpdateNote, onDeleteNote }: NoteEditorProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const note: Note = {
      id: uuidv4(),
      notebookId,
      title: newTitle.trim(),
      content: '',
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onCreateNote(note);
    setSelectedNoteId(note.id);
    setNewTitle('');
    setIsCreating(false);
  };

  const handleContentChange = (content: string) => {
    if (!selectedNote) return;
    onUpdateNote({
      ...selectedNote,
      content,
      updatedAt: Date.now(),
    });
  };

  const handleTitleChange = (title: string) => {
    if (!selectedNote) return;
    onUpdateNote({
      ...selectedNote,
      title,
      updatedAt: Date.now(),
    });
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    if (window.confirm(`确定要删除笔记「${selectedNote.title}」吗？`)) {
      onDeleteNote(selectedNote.id);
      setSelectedNoteId(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Note list sidebar */}
      <div className="w-56 border-r border-surface-200 dark:border-surface-700 flex flex-col">
        <div className="p-3 border-b border-surface-200 dark:border-surface-700">
          {isCreating ? (
            <div className="space-y-2">
              <Input
                placeholder="笔记标题..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                autoFocus
              />
              <div className="flex gap-1">
                <Button size="sm" onClick={handleCreate}>创建</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>取消</Button>
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsCreating(true)}>
              + 新建笔记
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <p className="px-3 py-8 text-xs text-surface-400 text-center">
              暂无笔记
            </p>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`w-full text-left px-3 py-2.5 text-sm border-b border-surface-100 dark:border-surface-800 transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}
              >
                <div className="font-medium truncate">{note.title || '无标题'}</div>
                <div className="text-xs text-surface-400 mt-0.5 truncate">
                  {note.content ? note.content.slice(0, 50) + '...' : '空白笔记'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-surface-200 dark:border-surface-700">
              <input
                value={selectedNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-sm font-semibold bg-transparent border-none outline-none text-surface-900 dark:text-surface-100 flex-1"
                placeholder="笔记标题"
              />
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>

            {/* Markdown editor */}
            <textarea
              value={selectedNote.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="使用 Markdown 编写笔记..."
              className="flex-1 w-full resize-none p-4 bg-transparent text-sm text-surface-800 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none font-mono leading-relaxed"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-surface-400">
              {notes.length > 0 ? '选择一条笔记开始编辑' : '创建一条新笔记'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
