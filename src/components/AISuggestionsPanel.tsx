import { useState } from 'react';

interface AISuggestionsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface Suggestion {
  id: string;
  type: 'improve' | 'continue' | 'summarize';
  originalText: string;
  suggestion: string;
  timestamp: Date;
}

export function AISuggestionsPanel({ isVisible, onClose, isDarkMode }: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedSuggestion(null);
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'improve': return '✨';
      case 'continue': return '➡️';
      case 'summarize': return '📝';
      default: return '💡';
    }
  };

  const getSuggestionLabel = (type: Suggestion['type']) => {
    switch (type) {
      case 'improve': return 'Improved';
      case 'continue': return 'Continued';
      case 'summarize': return 'Summarized';
      default: return 'Suggestion';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  if (!isVisible) return null;

  return (
    <div className={`w-80 h-full flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Suggestions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Close panel"
          >
            ×
          </button>
        </div>
        {suggestions.length > 0 && (
          <button
            onClick={clearSuggestions}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {suggestions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <div className="text-4xl mb-4">🤖</div>
            <p>No AI suggestions yet.</p>
            <p className="text-sm mt-2">
              Select text and use the AI tools to see suggestions here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSuggestion === suggestion.id
                    ? isDarkMode
                      ? 'bg-gray-700 border-blue-500'
                      : 'bg-blue-50 border-blue-300'
                    : isDarkMode
                      ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedSuggestion(
                  selectedSuggestion === suggestion.id ? null : suggestion.id
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getSuggestionLabel(suggestion.type)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {suggestion.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                {selectedSuggestion === suggestion.id && (
                  <div className="space-y-3">
                    {/* Original Text */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Original
                      </label>
                      <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300">
                        {suggestion.originalText.length > 100 
                          ? `${suggestion.originalText.slice(0, 100)}...`
                          : suggestion.originalText
                        }
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        AI Suggestion
                      </label>
                      <div className="mt-1 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm text-gray-700 dark:text-gray-300">
                        {suggestion.suggestion}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(suggestion.suggestion);
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // This would integrate with the editor to replace text
                          console.log('Apply suggestion:', suggestion.suggestion);
                        }}
                        className="flex-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {selectedSuggestion !== suggestion.id && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {suggestion.suggestion.length > 80 
                      ? `${suggestion.suggestion.slice(0, 80)}...`
                      : suggestion.suggestion
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Quick Actions
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
            ✨ Improve
          </button>
          <button className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
            ➡️ Continue
          </button>
          <button className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
            📝 Summarize
          </button>
        </div>
      </div>
    </div>
  );
}