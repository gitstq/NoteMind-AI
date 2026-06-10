'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { NotebookList } from '@/components/notebook/NotebookList';
import { Input } from '@/components/ui/Input';
import { useNotebook } from '@/hooks/useNotebook';
import { useSettingsStore } from '@/store/settingsStore';

// ============================================================
// Home Page
// ============================================================

export default function HomePage() {
  const {
    notebooks,
    isLoading,
    loadNotebooks,
    createNotebook,
    deleteNotebook,
    navigateToNotebook,
  } = useNotebook();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadNotebooks();
  }, [loadNotebooks]);

  const filteredNotebooks = searchQuery
    ? notebooks.filter(
        (nb) =>
          nb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nb.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notebooks;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateNotebook={createNotebook}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          title="NoteMind AI"
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Hero section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                AI 知识笔记引擎
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                上传文档，与 AI 对话，构建你的知识图谱。所有数据本地存储，隐私安全。
              </p>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
              <Input
                placeholder="搜索笔记本..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Notebook list */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : (
              <NotebookList
                notebooks={filteredNotebooks}
                onDelete={deleteNotebook}
                onClick={navigateToNotebook}
              />
            )}
          </div>
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
