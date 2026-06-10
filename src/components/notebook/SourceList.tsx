'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatRelativeTime, truncate, countWords } from '@/lib/utils';
import type { Source } from '@/types';

// ============================================================
// SourceList Component
// ============================================================

interface SourceListProps {
  sources: Source[];
  onRemove: (id: string) => void;
}

const typeLabels: Record<Source['type'], string> = {
  pdf: 'PDF',
  txt: '文本',
  md: 'Markdown',
  url: '链接',
  text: '文本',
};

const typeColors: Record<Source['type'], 'primary' | 'default' | 'success' | 'warning' | 'danger'> = {
  pdf: 'danger',
  txt: 'default',
  md: 'success',
  url: 'primary',
  text: 'default',
};

export function SourceList({ sources, onRemove }: SourceListProps) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-10 h-10 mx-auto text-surface-300 dark:text-surface-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm text-surface-400">暂无来源文档</p>
        <p className="text-xs text-surface-400 mt-1">上传 PDF、TXT 或 Markdown 文件</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <div
          key={source.id}
          className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700"
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                {source.title}
              </span>
              <Badge variant={typeColors[source.type]} size="sm">
                {typeLabels[source.type]}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
              <span>{countWords(source.content)} 字</span>
              <span>{source.chunks.length} 个分块</span>
              <span>{formatRelativeTime(source.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <Tooltip content="删除来源">
            <button
              onClick={() => onRemove(source.id)}
              className="flex-shrink-0 p-1.5 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
