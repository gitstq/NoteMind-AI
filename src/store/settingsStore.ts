import { create } from 'zustand';
import type { Settings, AIProviderId, AIProvider } from '@/types';
import { DEFAULT_SETTINGS, PROVIDER_TEMPLATES } from '@/types';
import * as db from '@/lib/db/indexeddb';

// ============================================================
// Settings Store
// ============================================================

interface SettingsState {
  settings: Settings;
  providers: Record<AIProviderId, AIProvider>;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  setProviderApiKey: (providerId: AIProviderId, apiKey: string) => void;
  setProviderBaseUrl: (providerId: AIProviderId, baseUrl: string) => void;
  getProviderConfig: (providerId: AIProviderId) => { apiKey: string; baseUrl: string };
  isProviderConfigured: (providerId: AIProviderId) => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  providers: buildInitialProviders(),
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await db.getSettings();
      set({ settings, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    const newSettings = { ...get().settings, ...updates };
    await db.saveSettings(newSettings);
    set({ settings: newSettings });
  },

  setProviderApiKey: (providerId, apiKey) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [providerId]: {
          ...state.providers[providerId],
          apiKey,
          isConfigured: apiKey.length > 0,
        },
      },
    }));
  },

  setProviderBaseUrl: (providerId, baseUrl) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [providerId]: {
          ...state.providers[providerId],
          baseUrl,
        },
      },
    }));
  },

  getProviderConfig: (providerId) => {
    const provider = get().providers[providerId];
    return {
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
    };
  },

  isProviderConfigured: (providerId) => {
    // Ollama doesn't need an API key
    if (providerId === 'ollama') return true;
    const provider = get().providers[providerId];
    return provider.apiKey.length > 0;
  },
}));

// ============================================================
// Helpers
// ============================================================

function buildInitialProviders(): Record<AIProviderId, AIProvider> {
  const providers = {} as Record<AIProviderId, AIProvider>;
  for (const [id, template] of Object.entries(PROVIDER_TEMPLATES)) {
    providers[id as AIProviderId] = {
      ...template,
      apiKey: '',
      isConfigured: false,
    };
  }
  return providers;
}
