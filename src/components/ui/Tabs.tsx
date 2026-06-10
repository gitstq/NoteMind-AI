'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// Tabs Component
// ============================================================

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ items, defaultTab, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? items[0]?.id ?? '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab headers */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
              activeTab === item.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 py-4">
        {activeContent}
      </div>
    </div>
  );
}
