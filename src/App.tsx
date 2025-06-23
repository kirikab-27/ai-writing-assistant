import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { DocumentList } from './components/DocumentList';
import {
  getAllDocuments,
  getDocument,
  saveDocument,
  deleteDocument,
  createNewDocument,
} from './utils/database';
import type { Document } from './types/Document';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
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
        {/* Sidebar */}
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

        {/* Main content area */}
        {currentDocument ? (
          <div className="flex-1 flex flex-col">
            <Toolbar
              onBold={handleBold}
              onItalic={handleItalic}
              onHeading={handleHeading}
              onLink={handleLink}
              onList={handleList}
              onCode={handleCode}
              onQuote={handleQuote}
            />
            
            <div className="flex-1 flex">
              {/* Editor */}
              <div className="flex-1 flex flex-col">
                <Editor
                  content={currentDocument.content}
                  onChange={handleContentChange}
                  isDarkMode={isDarkMode}
                />
              </div>
              
              {/* Preview */}
              <div className="flex-1 border-l border-gray-200 dark:border-gray-700">
                <Preview
                  content={currentDocument.content}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-xl mb-4">No document selected</p>
              <button
                onClick={handleNewDocument}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;