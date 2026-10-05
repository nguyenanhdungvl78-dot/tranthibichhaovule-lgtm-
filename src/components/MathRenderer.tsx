import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses mixed text containing LaTeX formulas:
 * - Block math: $$ ... $$
 * - Inline math: $ ... $
 * Safe and fast rendering with KaTeX
 */
export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Split text by $$...$$ and $...$
    // Regex matches $$...$$ or $...$
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
    const parts = content.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const formula = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="my-2 block overflow-x-auto text-center font-serif text-slate-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="text-red-500 font-mono text-sm">
              {part}
            </span>
          );
        }
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const formula = part.slice(1, -1).trim();
        try {
          const html = katex.renderToString(formula, {
            displayMode: false,
            throwOnError: false,
          });
          return (
            <span
              key={index}
              className="inline-block px-0.5 font-serif text-slate-900"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="text-red-500 font-mono text-xs">
              {part}
            </span>
          );
        }
      }

      // Preserve newlines in plain text
      return (
        <span key={index} className="whitespace-pre-line">
          {part}
        </span>
      );
    });
  }, [content]);

  return <div className={`inline-block leading-relaxed ${className}`}>{renderedElements}</div>;
};
