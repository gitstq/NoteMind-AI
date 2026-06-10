'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { ModelConfig } from './ModelConfig';
import { useSettingsStore } from '@/store/settingsStore';
import { resetDatabase } from '@/lib/db/indexeddb';

// ============================================================
// SettingsModal Component
// ============================================================

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettingsStore();

  const handleResetDatabase = async () => {
    if (window.confirm('确定要重置所有数据吗？此操作不可恢复，将清除所有笔记本、来源和笔记。')) {
      await resetDatabase();
      window.location.reload();
    }
  };

  const tabs = [
    {
      id: 'model',
      label: 'AI 模型',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      content: <ModelConfig />,
    },
    {
      id: 'appearance',
      label: '外观',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              主题
            </label>
            <div className="flex gap-2">
              {[
                { value: 'light', label: '浅色' },
                { value: 'dark', label: '深色' },
                { value: 'system', label: '跟随系统' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ theme: option.value as 'light' | 'dark' | 'system' })}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    settings.theme === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              语言
            </label>
            <div className="flex gap-2">
              {[
                { value: 'zh', label: '中文' },
                { value: 'en', label: 'English' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ language: option.value as 'zh' | 'en' })}
                  className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                    settings.language === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'data',
      label: '数据管理',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <h3 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              数据存储
            </h3>
            <p className="text-xs text-surface-400">
              所有数据均存储在浏览器本地 IndexedDB 中，不会上传到任何服务器。
            </p>
          </div>

          <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
              危险操作
            </h3>
            <p className="text-xs text-red-500 dark:text-red-400 mb-3">
              重置数据库将清除所有笔记本、来源、笔记和对话记录。此操作不可恢复。
            </p>
            <Button variant="danger" size="sm" onClick={handleResetDatabase}>
              重置数据库
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置" size="lg">
      <Tabs items={tabs} defaultTab="model" />
    </Modal>
  );
}
