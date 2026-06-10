'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatRelativeTime } from '@/lib/utils';
import type { Notebook } from '@/types';

// ============================================================
// NotebookCard Component
// ============================================================

interface NotebookCardProps {
  notebook: Notebook;
  onClick: () => void;
  onDelete: () => void;
}

export function NotebookCard({ notebook, onClick, onDelete }: NotebookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除笔记本「${notebook.name}」吗？此操作不可恢复。`)) {
      onDelete();
    }
  };

  return (
    <Card hover padding="md" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{notebook.name}</CardTitle>
          <Tooltip content="删除笔记本">
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </Tooltip>
        </div>
        {notebook.description && (
          <CardDescription>{notebook.description}</CardDescription>
        )}
      </CardHeader>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="primary">{notebook.sourceIds.length} 个来源</Badge>
        <Badge variant="default">{notebook.noteIds.length} 条笔记</Badge>
      </div>

      <CardFooter className="text-xs text-surface-400">
        更新于 {formatRelativeTime(notebook.updatedAt)}
      </CardFooter>
    </Card>
  );
}
