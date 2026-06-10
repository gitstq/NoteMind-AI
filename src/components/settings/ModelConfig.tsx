'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useSettingsStore } from '@/store/settingsStore';
import type { AIProviderId } from '@/types';

// ============================================================
// ModelConfig Component
// ============================================================

export function ModelConfig() {
  const {
    settings,
    providers,
    updateSettings,
    setProviderApiKey,
    setProviderBaseUrl,
    isProviderConfigured,
  } = useSettingsStore();

  const handleProviderChange = (providerId: string) => {
    updateSettings({ aiProvider: providerId as AIProviderId });
  };

  const handleModelChange = (modelId: string) => {
    updateSettings({ aiModel: modelId });
  };

  const handleEmbeddingModelChange = (modelId: string) => {
    updateSettings({ embeddingModel: modelId });
  };

  const currentProvider = providers[settings.aiProvider];
  const chatModels = currentProvider.models.filter((m) => m.supportsStreaming);
  const embeddingModels = currentProvider.models.filter((m) => m.supportsEmbedding);

  return (
    <div className="space-y-6">
      {/* Provider selection */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          AI Provider
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderChange(provider.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-colors ${
                settings.aiProvider === provider.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              <span className="font-medium">{provider.name}</span>
              {isProviderConfigured(provider.id) ? (
                <Badge variant="success" size="sm">已配置</Badge>
              ) : (
                <Badge variant="warning" size="sm">未配置</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      {settings.aiProvider !== 'ollama' && (
        <Input
          label="API Key"
          type="password"
          value={currentProvider.apiKey}
          onChange={(e) => setProviderApiKey(settings.aiProvider, e.target.value)}
          placeholder="输入你的 API Key"
        />
      )}

      {/* Base URL */}
      <Input
        label="Base URL"
        value={currentProvider.baseUrl}
        onChange={(e) => setProviderBaseUrl(settings.aiProvider, e.target.value)}
        placeholder="API 基础地址"
      />

      {/* Chat Model */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          对话模型
        </label>
        <select
          value={settings.aiModel}
          onChange={(e) => handleModelChange(e.target.value)}
          className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {chatModels.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} (max {model.maxTokens.toLocaleString()} tokens)
            </option>
          ))}
        </select>
      </div>

      {/* Embedding Model */}
      <div>
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          嵌入模型
        </label>
        <select
          value={settings.embeddingModel}
          onChange={(e) => handleEmbeddingModelChange(e.target.value)}
          className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {embeddingModels.length > 0 ? (
            embeddingModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))
          ) : (
            <option value="">当前 Provider 不支持嵌入模型</option>
          )}
        </select>
        {embeddingModels.length === 0 && (
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
            提示：当前 Provider 不提供嵌入模型。请选择其他 Provider（如 OpenAI）用于向量嵌入。
          </p>
        )}
      </div>

      {/* Chunk settings */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="分块大小 (字符)"
          type="number"
          value={settings.chunkSize.toString()}
          onChange={(e) => updateSettings({ chunkSize: parseInt(e.target.value) || 512 })}
        />
        <Input
          label="分块重叠 (字符)"
          type="number"
          value={settings.chunkOverlap.toString()}
          onChange={(e) => updateSettings({ chunkOverlap: parseInt(e.target.value) || 64 })}
        />
      </div>

      <Input
        label="最大上下文分块数"
        type="number"
        value={settings.maxContextChunks.toString()}
        onChange={(e) => updateSettings({ maxContextChunks: parseInt(e.target.value) || 8 })}
      />
    </div>
  );
}
