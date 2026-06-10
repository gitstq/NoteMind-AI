'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { parseFile } from '@/lib/pdf/parser';
import { v4 as uuidv4 } from 'uuid';
import type { Source } from '@/types';

// ============================================================
// SourceUploader Component
// ============================================================

interface SourceUploaderProps {
  notebookId: string;
  onSourceAdded: (source: Source) => void;
  onProcessSource: (sourceId: string, content: string) => Promise<void>;
}

const ACCEPTED_TYPES = '.pdf,.txt,.md,.markdown';

export function SourceUploader({ notebookId, onSourceAdded, onProcessSource }: SourceUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setIsProcessing(true);
      const fileArray = Array.from(files);

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        try {
          setProgress(`正在解析: ${file.name} (${i + 1}/${fileArray.length})`);
          const parsed = await parseFile(file);

          const source: Source = {
            id: uuidv4(),
            notebookId,
            title: parsed.title,
            content: parsed.content,
            type: parsed.type,
            chunks: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          onSourceAdded(source);

          // Process embeddings in background
          setProgress(`正在生成向量: ${file.name}`);
          await onProcessSource(source.id, parsed.content);
        } catch (err) {
          console.error(`Failed to process ${file.name}:`, err);
        }
      }

      setIsProcessing(false);
      setProgress('');
    },
    [notebookId, onSourceAdded, onProcessSource]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <svg className="w-10 h-10 mx-auto text-surface-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
          拖放文件到此处，或点击上传
        </p>
        <p className="text-xs text-surface-400 mt-1">
          支持 PDF、TXT、Markdown 文件
        </p>
      </div>

      {/* Processing status */}
      {isProcessing && (
        <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-lg">
          <svg className="animate-spin h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm text-primary-700 dark:text-primary-300">{progress}</span>
        </div>
      )}
    </div>
  );
}
