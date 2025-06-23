import { Document } from '../types/Document';

interface DocumentListProps {
  documents: Document[];
  currentDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onNewDocument: () => void;
  onDeleteDocument: (id: string) => void;
  isDarkMode: boolean;
}

export function DocumentList({
  documents,
  currentDocumentId,
  onSelectDocument,
  onNewDocument,
  onDeleteDocument,
  isDarkMode,
}: DocumentListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`w-64 h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewDocument}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          + New Document
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No documents yet
          </div>
        ) : (
          <div className="p-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`
                  p-3 mb-2 rounded cursor-pointer transition-colors
                  ${currentDocumentId === doc.id
                    ? isDarkMode 
                      ? 'bg-gray-700' 
                      : 'bg-blue-50 border-blue-200'
                    : isDarkMode
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                  }
                `}
                onClick={() => onSelectDocument(doc.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-gray-900 dark:text-gray-100">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDate(doc.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete document"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}