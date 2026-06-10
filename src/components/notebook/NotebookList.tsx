'use client';

import React from 'react';
import { NotebookCard } from './NotebookCard';
import type { Notebook } from '@/types';

// ============================================================
// NotebookList Component
// ============================================================

interface NotebookListProps {
  notebooks: Notebook[];
  onDelete: (id: string) => void;
  onClick: (notebook: Notebook) => void;
}

export function NotebookList({ notebooks, onDelete, onClick }: NotebookListProps) {
  if (notebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
          暂无笔记本
        </h3>
        <p className="text-sm text-surface-400 max-w-sm">
          创建你的第一个笔记本，上传文档开始使用 AI 驱动的知识管理
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notebooks.map((notebook) => (
        <NotebookCard
          key={notebook.id}
          notebook={notebook}
          onClick={() => onClick(notebook)}
          onDelete={() => onDelete(notebook.id)}
        />
      ))}
    </div>
  );
}
