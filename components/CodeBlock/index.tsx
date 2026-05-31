import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const highlightCode = (rawCode: string, language?: string) => {
  let html = rawCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const placeholders: string[] = [];

  // 1. Extract Comments (block/line comments for Java/JS/C++, hashes for Python, double dashes for SQL/Lua, HTML comments)
  html = html.replace(/(\/\*[\s\S]*?\*\/|\/\/.*|#.*|--.*|&lt;!--[\s\S]*?--&gt;)/g, (match) => {
    placeholders.push(`<span class="text-slate-500 italic font-mono">${match}</span>`);
    return `___PH_${placeholders.length - 1}___`;
  });

  // 2. Extract Strings (single, double, or template quotes)
  html = html.replace(/(["'`])((?:\\.|[^\\])*?)\1/g, (match) => {
    placeholders.push(`<span class="text-emerald-400 dark:text-emerald-300 font-mono">${match}</span>`);
    return `___PH_${placeholders.length - 1}___`;
  });

  const lang = (language || '').toLowerCase();

  if (lang === 'html' || lang === 'xml' || lang === 'web_dev' || lang === 'web') {
    // HTML Highlights
    // Highlight HTML attributes: attribute_name="value"
    html = html.replace(/\b([\w-]+)(?=\s*=\s*___PH_)/g, (match) => {
      placeholders.push(`<span class="text-amber-400 font-semibold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight HTML tag names
    html = html.replace(/(&lt;\/?)([\w:-]+)/g, (_, p1, p2) => {
      placeholders.push(`<span class="text-rose-400 font-bold">${p2}</span>`);
      return `${p1}___PH_${placeholders.length - 1}___`;
    });
    
    // Highlight tag brackets
    html = html.replace(/(&lt;\/?|\/?&gt;)/g, (match) => {
      placeholders.push(`<span class="text-slate-500 font-bold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });
  } else if (lang === 'css') {
    // CSS Highlights
    // Highlight selectors before curly bracket {
    html = html.replace(/([^{}]+)(?=\s*\{)/g, (match) => {
      placeholders.push(`<span class="text-indigo-400 font-bold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });
    
    // Highlight properties before colon
    html = html.replace(/\b([\w-]+)(?=\s*:)/g, (match) => {
      placeholders.push(`<span class="text-cyan-400 font-medium">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });
    
    // Highlight numbers/units
    html = html.replace(/\b(\d+(\.\d+)?)(px|rem|em|%|s|ms)?\b/g, (match) => {
      placeholders.push(`<span class="text-amber-400">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });
  } else {
    // Programming Languages (JS, Python, Java, C++, Lua, Rust, Swift, SQL, R, Dart, etc.)
    // Highlight annotations (@Annotation)
    html = html.replace(/(@\w+)/g, (match) => {
      placeholders.push(`<span class="text-indigo-400 font-bold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight keywords
    const keywords = /\b(class|public|private|protected|static|final|void|int|double|float|long|short|byte|boolean|char|if|else|for|while|do|switch|case|default|break|continue|return|new|this|super|extends|implements|try|catch|finally|throw|throws|import|package|const|let|var|function|def|elif|from|as|val|fun|local|nil|fn|impl|struct|enum|match|use|pub|select|insert|update|delete|from|where|join|on|into|values|and|or|not)\b/g;
    html = html.replace(keywords, (match) => {
      placeholders.push(`<span class="text-sky-400 dark:text-sky-300 font-bold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight common types & classes
    const types = /\b(System|String|Math|Object|Scanner|List|ArrayList|Map|HashMap|Integer|Double|Float|Boolean|Character|Byte|Short|Long|Void|Exception|Thread|console|document|window|print|println|printf|cout|cin|vector|std|Console|List|Dictionary|Table)\b/g;
    html = html.replace(types, (match) => {
      placeholders.push(`<span class="text-rose-400 dark:text-rose-300 font-bold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight method/function calls
    html = html.replace(/\b(\w+)(?=\s*\()/g, (match) => {
      placeholders.push(`<span class="text-cyan-400 font-semibold">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight numbers
    html = html.replace(/\b(\d+(\.\d+)?)\b/g, (match) => {
      placeholders.push(`<span class="text-amber-400 font-medium">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });

    // Highlight operators
    html = html.replace(/([+\-*/%=!&|<>:?^~]+)/g, (match) => {
      placeholders.push(`<span class="text-slate-400">${match}</span>`);
      return `___PH_${placeholders.length - 1}___`;
    });
  }

  // 3. Re-insert strings, comments, and highlighted elements recursively
  let lastHtml = '';
  while (html !== lastHtml) {
    lastHtml = html;
    html = html.replace(/___PH_(\d+)___/g, (_, index) => placeholders[parseInt(index)]);
  }

  return html;
};

const cleanRawCode = (corruptedString: string): string => {
  // Removes any HTML tags completely to recover the underlying raw text
  return corruptedString.replace(/<\/?[^>]+(>|$)/g, "");
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const cleanCode = cleanRawCode(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const highlighted = highlightCode(cleanCode, language);

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 overflow-hidden shadow-md flex flex-col font-mono text-sm">
      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-slate-950 text-slate-400 text-xs border-b border-slate-800 select-none">
        <span className="font-bold uppercase tracking-wider text-slate-500">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer focus:outline-none"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto bg-[#0b0f19]">
        <pre className="leading-relaxed text-slate-300 text-left whitespace-pre block">
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
