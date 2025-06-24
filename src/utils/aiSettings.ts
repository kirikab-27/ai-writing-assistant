import CryptoJS from 'crypto-js';
import type { AISettings } from '../types/AI';
import { DEFAULT_AI_SETTINGS } from '../types/AI';

const STORAGE_KEY = 'ai-writing-assistant-settings';
const ENCRYPTION_KEY = 'ai-assistant-secure-key-2024'; // In production, this should be more secure

export function encryptApiKey(apiKey: string): string {
  return CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
}

export function decryptApiKey(encryptedKey: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function saveAISettings(settings: AISettings): void {
  try {
    const settingsToSave = {
      ...settings,
      apiKey: settings.apiKey ? encryptApiKey(settings.apiKey) : '',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Failed to save AI settings:', error);
    throw new Error('Failed to save AI settings');
  }
}

export function loadAISettings(): AISettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return DEFAULT_AI_SETTINGS;
    }

    const parsedSettings = JSON.parse(saved);
    return {
      ...DEFAULT_AI_SETTINGS,
      ...parsedSettings,
      apiKey: parsedSettings.apiKey ? decryptApiKey(parsedSettings.apiKey) : '',
    };
  } catch (error) {
    console.error('Failed to load AI settings:', error);
    return DEFAULT_AI_SETTINGS;
  }
}

export function clearAISettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear AI settings:', error);
  }
}

export function validateApiKey(provider: string, apiKey: string): boolean {
  if (!apiKey || apiKey.trim().length === 0) {
    return false;
  }

  switch (provider) {
    case 'gemini':
      return apiKey.startsWith('AIza') || apiKey.includes('google');
    case 'cohere':
      return apiKey.length > 20; // Cohere keys are typically longer
    case 'huggingface':
      return apiKey.startsWith('hf_');
    default:
      return apiKey.length > 10; // Basic validation
  }
}