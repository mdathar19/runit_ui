'use client';

import React, { useEffect, useState } from 'react';
import ThreeDot from '../global/ThreeDot';
import { prismLanguageMap } from '@/utils/Utils';

/**
 * Reusable component that displays syntax-highlighted code based on the language
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The code content to display
 * @param {string} props.language - Programming language of the code
 * @param {Object} props.theme - Theme settings for styling (optional)
 * @param {string} props.className - Additional CSS classes (optional)
 */
const CodeViewerByLAnguage = ({ 
  content, 
  language = 'javascript', 
  theme = null, 
  className = '' 
}) => {
  const [highlightedCode, setHighlightedCode] = useState('');
  
  // Default theme if none provided
  const defaultTheme = {
    background: '#000000',
    textShadow: '0 0 5px #00ff95, 0 0 10pxrgb(23, 26, 25)',
    color: '#00ff95',
    fontFamily: '"Source Code Pro", monospace',
    accentColor: '#ff00ff',
    secondaryColor: '#00ffff',
    tertiaryColor: '#ffff00',
    dotColors: ['#ff5f56', '#ffbd2e', '#27c93f'],
    commentColor: '#6a9955',
    punctuationColor: '#d4d4d4',
    numberColor: '#b5cea8',
    stringColor: '#ce9178',
    operatorColor: '#d4d4d4',
    keywordColor: '#569cd6',
    functionColor: '#dcdcaa',
    variableColor: '#9cdcfe',
  };

  // Merge provided theme with default theme
  const selectedTheme = theme ? { ...defaultTheme, ...theme } : defaultTheme;
  
  // Map language to Prism language
  const prismLanguage = prismLanguageMap[language] || 'javascript';

  useEffect(() => {
    // Client-side only to avoid SSR issues
    if (typeof window !== 'undefined' && content) {
      // Dynamically import Prism
      import('prismjs').then((Prism) => {
        // Import language components - only import the ones needed
        const languageImports = [
          import('prismjs/components/prism-javascript'),
          import('prismjs/components/prism-typescript'),
          import('prismjs/components/prism-jsx'),
          import('prismjs/components/prism-tsx'),
          import('prismjs/components/prism-css'),
          import('prismjs/components/prism-python'),
          import('prismjs/components/prism-java'),
          import('prismjs/components/prism-c'),
          import('prismjs/components/prism-cpp'),
          import('prismjs/components/prism-csharp'),
          import('prismjs/components/prism-go'),
          import('prismjs/components/prism-rust'),
          import('prismjs/components/prism-markup-templating.js'),
          import('prismjs/components/prism-php'),
          import('prismjs/components/prism-ruby'),
          import('prismjs/components/prism-swift'),
          import('prismjs/components/prism-kotlin'),
          import('prismjs/components/prism-sql'),
          import('prismjs/components/prism-bash'),
          import('prismjs/components/prism-powershell'),
          import('prismjs/components/prism-json'),
          import('prismjs/components/prism-yaml'),
          import('prismjs/components/prism-markdown'),
          import('prismjs/components/prism-graphql'),
        ];

        Promise.all(languageImports).then(() => {
          try {
            if (Prism.default) {
              // Pre-highlight the code and capture the HTML
              const grammar = Prism.default.languages[prismLanguage] || Prism.default.languages.javascript;
              const highlightedHtml = Prism.default.highlight(content, grammar, prismLanguage);
              setHighlightedCode(highlightedHtml);
            }
          } catch (error) {
            console.error("Error highlighting code:", error);
            setHighlightedCode(content); // Fallback to plain code
          }
        }).catch(error => {
          console.error("Failed to load Prism language components:", error);
          setHighlightedCode(content); // Fallback to plain code
        });
      }).catch(error => {
        console.error("Failed to load Prism:", error);
        setHighlightedCode(content); // Fallback to plain code
      });
    }
  }, [content, prismLanguage]);

  // Add custom CSS to override Prism default styling
  const customStyles = `
    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: ${selectedTheme.commentColor};
    }
    .token.punctuation {
      color: ${selectedTheme.punctuationColor};
    }
    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
      color: ${selectedTheme.numberColor};
    }
    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
      color: ${selectedTheme.stringColor};
    }
    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
      color: ${selectedTheme.operatorColor};
    }
    .token.atrule,
    .token.attr-value,
    .token.keyword {
      color: ${selectedTheme.keywordColor};
    }
    .token.function,
    .token.class-name {
      color: ${selectedTheme.functionColor};
    }
    .token.regex,
    .token.important,
    .token.variable {
      color: ${selectedTheme.variableColor};
    }
  `;

  return (
    <div 
      className={`rounded-lg shadow-xl overflow-hidden ${className}`}
      style={{
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        wordWrap: 'break-word',
        fontFamily: selectedTheme.fontFamily,
        background: selectedTheme.background,
        color: selectedTheme.color,
        textShadow: selectedTheme.textShadow || 'none',
      }}
    >
      {/* Custom styles for syntax highlighting */}
      <style>{customStyles}</style>
      
      {/* Add custom style for pre and code elements */}
      <style>{`
        .code-viewer-content pre,
        .code-viewer-content code {
          white-space: pre-wrap !important;
          word-break: break-word !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      `}</style>
      
      <div className="p-4">
        {/* Code display with syntax highlighting */}
        <div className="overflow-auto code-viewer-content">
          <pre 
            style={{ 
              margin: 0, 
              padding: 0, 
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              msWordBreak: 'break-all',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              overflowX: 'hidden',
            }}
          >
            <code 
              className={`language-${prismLanguage}`}
              style={{ 
                background: 'transparent',
                fontFamily: 'inherit',
                color: selectedTheme.color,
                display: 'block',
                padding: '0.5rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
              dangerouslySetInnerHTML={{ __html: highlightedCode || content }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeViewerByLAnguage;
