import type { AISettings } from '../types/AI';

interface AISidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  aiSettings: AISettings | null;
  onOpenSettings: () => void;
  onAIImprove: () => void;
  onAIContinue: () => void;
  onAISummarize: () => void;
  isAILoading: boolean;
  isDarkMode: boolean;
}

export function AISidebar({
  isCollapsed,
  onToggle,
  aiSettings,
  onOpenSettings,
  onAIImprove,
  onAIContinue,
  onAISummarize,
  isAILoading,
  isDarkMode,
}: AISidebarProps) {

  const isAIEnabled = aiSettings?.enabled && aiSettings?.apiKey;

  return (
    <div className={`${
      isCollapsed ? 'w-12' : 'w-80'
    } transition-all duration-300 ${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
    } border-r flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              🤖 AI Assistant
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title={isCollapsed ? 'Expand AI Panel' : 'Collapse AI Panel'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* AI Settings Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Settings
              </h3>
              <button
                onClick={onOpenSettings}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="AI Settings"
              >
                ⚙️
              </button>
            </div>
            
            {isAIEnabled ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ✅ {aiSettings.provider} connected
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  Model: {aiSettings.model}
                </div>
                <button
                  onClick={onOpenSettings}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ⚙️ Reconfigure
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ❌ Not configured
                  </span>
                </div>
                <button
                  onClick={onOpenSettings}
                  className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                >
                  🚀 Configure AI
                </button>
              </div>
            )}
          </div>

          {/* AI Actions */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                AI Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={onAIImprove}
                  disabled={!isAIEnabled || isAILoading}
                  className="w-full p-3 text-left rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Improve Text
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Enhance clarity and grammar
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onAIContinue}
                  disabled={!isAIEnabled || isAILoading}
                  className="w-full p-3 text-left rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">➡️</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Continue Writing
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Generate next paragraph
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={onAISummarize}
                  disabled={!isAIEnabled || isAILoading}
                  className="w-full p-3 text-left rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Summarize
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Create concise summary
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Usage Stats */}
            {isAIEnabled && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usage Today
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Improvements</span>
                    <span className="text-gray-700 dark:text-gray-300">3</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Continuations</span>
                    <span className="text-gray-700 dark:text-gray-300">1</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Summaries</span>
                    <span className="text-gray-700 dark:text-gray-300">2</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isAILoading && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AI Processing...
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}