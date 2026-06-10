'use client';

import React, { useState, useEffect, use } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { SourceUploader } from '@/components/notebook/SourceUploader';
import { SourceList } from '@/components/notebook/SourceList';
import { ChatPanel } from '@/components/notebook/ChatPanel';
import { NoteEditor } from '@/components/notebook/NoteEditor';
import { KnowledgeGraph } from '@/components/notebook/KnowledgeGraph';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { useNotebook } from '@/hooks/useNotebook';
import { useChat } from '@/hooks/useChat';
import { useAI } from '@/hooks/useAI';
import { getNotebook } from '@/lib/db/indexeddb';

// ============================================================
// Notebook Detail Page
// ============================================================

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotebookDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sources');

  const {
    currentNotebook,
    sources,
    notes,
    isLoading,
    loadNotebooks,
    addSource,
    removeSource,
    addNote,
    updateNote,
    removeNote,
    setCurrentNotebook,
  } = useNotebook(id);

  const {
    messages,
    isStreaming,
    streamingContent,
    error: chatError,
    sendMessage,
    stopStreaming,
    clearChat,
  } = useChat(id);

  const { processSource } = useAI();

  // Load notebook data
  useEffect(() => {
    const load = async () => {
      await loadNotebooks();
      const notebook = await getNotebook(id);
      if (notebook) {
        setCurrentNotebook(notebook);
      }
    };
    load();
  }, [id, loadNotebooks, setCurrentNotebook]);

  const handleSourceAdded = async (source: any) => {
    await addSource(source);
  };

  const handleProcessSource = async (sourceId: string, content: string) => {
    try {
      await processSource(sourceId, id, content);
    } catch (err) {
      console.error('Failed to process source:', err);
    }
  };

  const tabs = [
    {
      id: 'sources',
      label: '来源',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <SourceUploader
            notebookId={id}
            onSourceAdded={handleSourceAdded}
            onProcessSource={handleProcessSource}
          />
          <SourceList sources={sources} onRemove={removeSource} />
        </div>
      ),
    },
    {
      id: 'chat',
      label: 'AI 对话',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      content: (
        <ChatPanel
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
          error={chatError}
          onSendMessage={sendMessage}
          onStopStreaming={stopStreaming}
          onClearChat={clearChat}
        />
      ),
    },
    {
      id: 'notes',
      label: '笔记',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      content: (
        <NoteEditor
          notes={notes}
          notebookId={id}
          onCreateNote={addNote}
          onUpdateNote={updateNote}
          onDeleteNote={removeNote}
        />
      ),
    },
    {
      id: 'graph',
      label: '知识图谱',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      content: <KnowledgeGraph notebookId={id} />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!currentNotebook) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
            笔记本未找到
          </h2>
          <p className="text-sm text-surface-400">该笔记本可能已被删除</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateNotebook={async () => {}}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          title={currentNotebook.name}
        />

        <main className="flex-1 overflow-hidden">
          <Tabs items={tabs} defaultTab={activeTab} onChange={setActiveTab} className="h-full" />
        </main>
      </div>

      {/* Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
