import { useState, useEffect, useCallback } from 'react';
import type { AISettings, AIProvider } from '../types/AI';
import { DEFAULT_AI_SETTINGS, AI_MODELS } from '../types/AI';
import { loadAISettings, saveAISettings, validateApiKey } from '../utils/aiSettings';
import { AIServiceFactory } from '../services/ai/AIServiceFactory';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AISettings) => void;
}

export function AISettingsModal({ isOpen, onClose, onSettingsChange }: AISettingsModalProps) {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setSettings(loadAISettings());
      setConnectionStatus('idle');
      setErrors({});
    }
  }, [isOpen]);

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [handleEscapeKey]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleProviderChange = (provider: AIProvider) => {
    setSettings(prev => ({
      ...prev,
      provider,
      model: AI_MODELS[provider][0],
    }));
    setConnectionStatus('idle');
    setErrors({});
  };

  const handleApiKeyChange = (apiKey: string) => {
    setSettings(prev => ({ ...prev, apiKey }));
    setConnectionStatus('idle');
    if (errors.apiKey) {
      setErrors(prev => ({ ...prev, apiKey: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!settings.apiKey.trim()) {
      newErrors.apiKey = 'API key is required';
    } else if (!validateApiKey(settings.provider, settings.apiKey)) {
      newErrors.apiKey = `Invalid API key format for ${settings.provider}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validateForm()) return;

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const service = AIServiceFactory.createService({
        provider: settings.provider,
        apiKey: settings.apiKey,
        model: settings.model,
      });

      const isConnected = await service.testConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      saveAISettings(settings);
      onSettingsChange(settings);
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to save settings' });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-600"
          style={{ 
            backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : 'white',
            opacity: 1
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🤖 AI Settings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure your AI assistant preferences
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Provider Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Provider Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Provider
                  </label>
                  <select
                    value={settings.provider}
                    onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="cohere">Cohere</option>
                    <option value="huggingface">HuggingFace</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {AI_MODELS[settings.provider].map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* API Key Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Authentication
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder={`Enter your ${settings.provider} API key`}
                  className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.apiKey ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.apiKey && (
                  <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Creativity: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Connection Test */}
            <div>
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection || !settings.apiKey}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? 'Testing...' : 'Test Connection'}
              </button>

              {connectionStatus === 'success' && (
                <p className="text-green-600 text-sm mt-2">✓ Connection successful!</p>
              )}
              {connectionStatus === 'error' && (
                <p className="text-red-600 text-sm mt-2">✗ Connection failed</p>
              )}
            </div>

            {errors.general && (
              <p className="text-red-600 text-sm">{errors.general}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}