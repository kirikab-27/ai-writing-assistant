interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onHeading: (level: number) => void;
  onLink: () => void;
  onList: (ordered: boolean) => void;
  onCode: () => void;
  onQuote: () => void;
}

export function Toolbar({
  onBold,
  onItalic,
  onHeading,
  onLink,
  onList,
  onCode,
  onQuote,
}: ToolbarProps) {
  const buttonClass = "px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors";

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        onClick={onBold}
        className={buttonClass}
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={onItalic}
        className={buttonClass}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      
      <button
        onClick={() => onHeading(1)}
        className={buttonClass}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => onHeading(2)}
        className={buttonClass}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => onHeading(3)}
        className={buttonClass}
        title="Heading 3"
      >
        H3
      </button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      
      <button
        onClick={onLink}
        className={buttonClass}
        title="Insert Link"
      >
        🔗
      </button>
      <button
        onClick={() => onList(false)}
        className={buttonClass}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => onList(true)}
        className={buttonClass}
        title="Numbered List"
      >
        1. List
      </button>
      <button
        onClick={onCode}
        className={buttonClass}
        title="Code Block"
      >
        {'</>'}
      </button>
      <button
        onClick={onQuote}
        className={buttonClass}
        title="Quote"
      >
        "
      </button>
    </div>
  );
}