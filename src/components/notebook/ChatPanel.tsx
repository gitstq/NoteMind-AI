'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { ChatMessage, Citation } from '@/types';

// ============================================================
// ChatPanel Component
// ============================================================

interface ChatPanelProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  error: string | null;
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  onClearChat: () => void;
}

export function ChatPanel({
  messages,
  isStreaming,
  streamingContent,
  error,
  onSendMessage,
  onStopStreaming,
  onClearChat,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    onSendMessage(trimmed);
    setInput('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              基于笔记本内容向 AI 提问
            </p>
            <p className="text-xs text-surface-400 mt-1">
              上传文档后，AI 将基于你的知识库回答问题
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && streamingContent && (
          <ChatBubble
            message={{
              id: 'streaming',
              notebookId: '',
              role: 'assistant',
              content: streamingContent,
              citations: [],
              createdAt: Date.now(),
            }}
            isStreaming
          />
        )}

        {error && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-surface-200 dark:border-surface-700 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题..."
              rows={1}
              className="w-full resize-none rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2.5 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {isStreaming ? (
            <Button variant="danger" size="md" onClick={onStopStreaming}>
              停止
            </Button>
          ) : (
            <Button size="md" onClick={handleSend} disabled={!input.trim()}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          )}
        </div>
        {messages.length > 0 && (
          <div className="flex justify-center mt-2">
            <Button variant="ghost" size="sm" onClick={onClearChat}>
              清空对话
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ChatBubble Sub-component
// ============================================================

function ChatBubble({ message, isStreaming }: { message: ChatMessage; isStreaming?: boolean }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5',
          isUser
            ? 'bg-primary-600 text-white rounded-br-md'
            : 'bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-bl-md'
        )}
      >
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-current animate-pulse rounded-sm" />
          )}
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 pt-2 border-t border-surface-200/50 dark:border-surface-600/50">
            <div className="flex flex-wrap gap-1">
              {message.citations.map((citation, i) => (
                <CitationBadge key={citation.chunkId} citation={citation} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CitationBadge({ citation, index }: { citation: Citation; index: number }) {
  return (
    <Badge variant="primary" size="sm" className="cursor-default">
      [{index + 1}] {citation.sourceTitle}
    </Badge>
  );
}
