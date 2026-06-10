'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNotebookStore } from '@/store/notebookStore';
import { formatRelativeTime, truncate } from '@/lib/utils';

// ============================================================
// Sidebar Component
// ============================================================

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNotebook: (name: string, description?: string) => void;
}

export function Sidebar({ isOpen, onClose, onCreateNotebook }: SidebarProps) {
  const pathname = usePathname();
  const notebooks = useNotebookStore((s) => s.notebooks);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateNotebook(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-200 dark:border-surface-700">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">
              NoteMind AI
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-800 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New notebook button */}
        <div className="px-3 py-3">
          {isCreating ? (
            <div className="space-y-2">
              <Input
                placeholder="笔记本名称..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreate}>
                  创建
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsCreating(true)}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              新建笔记本
            </Button>
          )}
        </div>

        {/* Notebook list */}
        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">
            笔记本
          </p>
          <div className="space-y-1">
            {notebooks.length === 0 ? (
              <p className="px-2 py-4 text-sm text-surface-400 text-center">
                暂无笔记本，点击上方按钮创建
              </p>
            ) : (
              notebooks.map((nb) => (
                <Link
                  key={nb.id}
                  href={`/notebooks/${nb.id}`}
                  onClick={onClose}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm transition-colors',
                    pathname === `/notebooks/${nb.id}`
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800'
                  )}
                >
                  <div className="font-medium">{truncate(nb.name, 30)}</div>
                  {nb.description && (
                    <div className="text-xs text-surface-400 mt-0.5">
                      {truncate(nb.description, 40)}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                    <span>{nb.sourceIds.length} 个来源</span>
                    <span>{nb.noteIds.length} 条笔记</span>
                    <span>{formatRelativeTime(nb.updatedAt)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-surface-200 dark:border-surface-700">
          <p className="text-xs text-surface-400 text-center">
            Privacy-first, Zero-backend
          </p>
        </div>
      </aside>
    </>
  );
}
