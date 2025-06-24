import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { DocumentList } from './components/DocumentList';
import { AISettingsModal } from './components/AISettingsModal';
import { AISidebar } from './components/AISidebar';
import {
  getAllDocuments,
  getDocument,
  saveDocument,
  deleteDocument,
  createNewDocument,
} from './utils/database';
import { loadAISettings } from './utils/aiSettings';
import { AIServiceFactory } from './services/ai/AIServiceFactory';
import type { Document } from './types/Document';
import type { AISettings } from './types/AI';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isAISidebarCollapsed, setIsAISidebarCollapsed] = useState(false);
  const [aiSettings, setAISettings] = useState<AISettings | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const autoSaveTimerRef = useRef<number | null>(null);

  // Load documents and AI settings on mount
  useEffect(() => {
    loadDocuments();
    setAISettings(loadAISettings());
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const loadDocuments = async () => {
    const docs = await getAllDocuments();
    setDocuments(docs);
    
    // If no current document and there are documents, select the first one
    if (!currentDocument && docs.length > 0) {
      const doc = await getDocument(docs[0].id);
      if (doc) {
        setCurrentDocument(doc);
      }
    }
  };

  const handleContentChange = useCallback((content: string) => {
    if (!currentDocument) return;

    const updatedDoc = {
      ...currentDocument,
      content,
      updatedAt: new Date(),
    };
    setCurrentDocument(updatedDoc);

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer for auto-save
    autoSaveTimerRef.current = setTimeout(async () => {
      await saveDocument(updatedDoc);
      await loadDocuments();
    }, 30000); // 30 seconds
  }, [currentDocument]);

  const handleTitleChange = async (title: string) => {
    if (!currentDocument) return;

    const updatedDoc = {
      ...currentDocument,
      title,
      updatedAt: new Date(),
    };
    setCurrentDocument(updatedDoc);
    await saveDocument(updatedDoc);
    await loadDocuments();
  };

  const handleSelectDocument = async (id: string) => {
    const doc = await getDocument(id);
    if (doc) {
      setCurrentDocument(doc);
    }
  };

  const handleNewDocument = async () => {
    const doc = await createNewDocument();
    await loadDocuments();
    setCurrentDocument(doc);
  };

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
      if (currentDocument?.id === id) {
        setCurrentDocument(null);
      }
      await loadDocuments();
    }
  };

  const handleSave = async () => {
    if (!currentDocument) return;
    await saveDocument(currentDocument);
    await loadDocuments();
  };

  // Toolbar handlers
  const insertText = (before: string, after: string = '') => {
    // This is a simplified version - in a real app, you'd integrate with CodeMirror's API
    if (!currentDocument) return;
    const content = currentDocument.content;
    const newContent = content + before + after;
    handleContentChange(newContent);
  };

  const handleBold = () => insertText('**', '**');
  const handleItalic = () => insertText('*', '*');
  const handleHeading = (level: number) => {
    const hashes = '#'.repeat(level);
    insertText(`\n${hashes} `, '\n');
  };
  const handleLink = () => insertText('[', '](url)');
  const handleList = (ordered: boolean) => {
    const bullet = ordered ? '1. ' : '- ';
    insertText(`\n${bullet}`, '\n');
  };
  const handleCode = () => insertText('\n```\n', '\n```\n');
  const handleQuote = () => insertText('\n> ', '\n');

  // AI functionality handlers
  const handleAIImprove = async (selectedText?: string) => {
    if (!aiSettings?.enabled || !aiSettings.apiKey || !currentDocument) return;
    
    const textToImprove = selectedText || currentDocument.content;
    if (!textToImprove.trim()) return;

    setIsAILoading(true);
    try {
      const service = AIServiceFactory.createService(aiSettings);
      const response = await service.improveText(textToImprove);
      
      // For now, just log the response - in a real implementation,
      // this would be handled by the AISuggestionsPanel
      console.log('AI Improvement:', response.text);
    } catch (error) {
      console.error('AI improvement failed:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAIContinue = async (selectedText?: string) => {
    if (!aiSettings?.enabled || !aiSettings.apiKey || !currentDocument) return;
    
    const textToContinue = selectedText || currentDocument.content;
    if (!textToContinue.trim()) return;

    setIsAILoading(true);
    try {
      const service = AIServiceFactory.createService(aiSettings);
      const response = await service.continueText(textToContinue);
      
      console.log('AI Continuation:', response.text);
    } catch (error) {
      console.error('AI continuation failed:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAISummarize = async (selectedText?: string) => {
    if (!aiSettings?.enabled || !aiSettings.apiKey || !currentDocument) return;
    
    const textToSummarize = selectedText || currentDocument.content;
    if (!textToSummarize.trim()) return;

    setIsAILoading(true);
    try {
      const service = AIServiceFactory.createService(aiSettings);
      const response = await service.summarizeText(textToSummarize);
      
      console.log('AI Summary:', response.text);
    } catch (error) {
      console.error('AI summarization failed:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">AI Writing Assistant</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {currentDocument && (
            <input
              type="text"
              value={currentDocument.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* AI Sidebar - Left Panel */}
        <AISidebar
          isCollapsed={isAISidebarCollapsed}
          onToggle={() => setIsAISidebarCollapsed(!isAISidebarCollapsed)}
          aiSettings={aiSettings}
          onOpenSettings={() => setIsAISettingsOpen(true)}
          onAIImprove={() => handleAIImprove()}
          onAIContinue={() => handleAIContinue()}
          onAISummarize={() => handleAISummarize()}
          isAILoading={isAILoading}
          isDarkMode={isDarkMode}
        />

        {/* Document Management Panel */}
        {isSidebarOpen && (
          <DocumentList
            documents={documents}
            currentDocumentId={currentDocument?.id || null}
            onSelectDocument={handleSelectDocument}
            onNewDocument={handleNewDocument}
            onDeleteDocument={handleDeleteDocument}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Main Content Area - Editor and Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {currentDocument ? (
            <>
              {/* Toolbar */}
              <Toolbar
                onBold={handleBold}
                onItalic={handleItalic}
                onHeading={handleHeading}
                onLink={handleLink}
                onList={handleList}
                onCode={handleCode}
                onQuote={handleQuote}
              />
              
              {/* Editor and Preview Container */}
              <div className="flex-1 flex min-h-0">
                {/* Editor - Left Half */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <Editor
                    content={currentDocument.content}
                    onChange={handleContentChange}
                    isDarkMode={isDarkMode}
                  />
                </div>
                
                {/* Preview - Right Half */}
                <div className="flex-1 min-w-0 border-l border-gray-200 dark:border-gray-700">
                  <Preview
                    content={currentDocument.content}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl mb-2">AI Writing Assistant</p>
                <p className="text-gray-400 mb-6">Create or select a document to start writing</p>
                <button
                  onClick={handleNewDocument}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        onSettingsChange={setAISettings}
      />
    </div>
  );
}

export default App;