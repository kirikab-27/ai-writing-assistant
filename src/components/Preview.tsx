import { useEffect, useRef } from 'react';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

interface PreviewProps {
  content: string;
  isDarkMode: boolean;
}

export function Preview({ content, isDarkMode }: PreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current) {
      const html = md.render(content);
      const currentScrollPosition = previewRef.current.scrollTop;
      previewRef.current.innerHTML = html;
      previewRef.current.scrollTop = currentScrollPosition;
    }
  }, [content]);

  const previewStyles = isDarkMode ? 'prose-invert' : '';

  return (
    <div
      ref={previewRef}
      className={`prose prose-lg max-w-none p-8 overflow-auto h-full ${previewStyles}`}
      style={{
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        color: isDarkMode ? '#e0e0e0' : '#333333',
      }}
    />
  );
}