'use client';

import React, { useEffect, useRef, useState } from 'react';
import ThreeDot from '../global/ThreeDot';
import { prismLanguageMap } from '@/Utils';

// Create a component that manually applies syntax highlighting to code
const CodeSnippetBox = ({ previewRef, selectedTheme, language, code, width, height }) => {
  const codeContainerRef = useRef(null);
  const [highlightedCode, setHighlightedCode] = useState('');
 
  const prismLanguage = prismLanguageMap[language] || 'javascript';

  useEffect(() => {
    // Client-side only to avoid SSR issues
    if (typeof window !== 'undefined') {
      // Dynamically import Prism
      import('prismjs').then((Prism) => {
        // Import language components
        Promise.all([
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
          // Plugin for line numbers
          import('prismjs/plugins/line-numbers/prism-line-numbers'),
        ]).then(() => {
          try {
            if(Prism){
              // Pre-highlight the code and capture the HTML
              const grammar = Prism.default.languages[prismLanguage] || Prism.default.languages.javascript;
              const highlightedHtml = Prism.default.highlight(code, grammar, prismLanguage);
              setHighlightedCode(highlightedHtml);
            }
          } catch (error) {
            console.error("Error pre-highlighting code:", error);
            setHighlightedCode(code); // Fallback to plain code
          }
        });
      }).catch(error => {
        console.error("Failed to load Prism:", error);
        setHighlightedCode(code); // Fallback to plain code
      });
    }
  }, [code, prismLanguage]);

  // Add custom CSS to override Prism default styling
  const customStyles = `
    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: ${selectedTheme?.commentColor || '#6a9955'};
    }
    .token.punctuation {
      color: ${selectedTheme?.punctuationColor || '#d4d4d4'};
    }
    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
      color: ${selectedTheme?.numberColor || '#b5cea8'};
    }
    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
      color: ${selectedTheme?.stringColor || '#ce9178'};
    }
    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
      color: ${selectedTheme?.operatorColor || '#d4d4d4'};
    }
    .token.atrule,
    .token.attr-value,
    .token.keyword {
      color: ${selectedTheme?.keywordColor || '#569cd6'};
    }
    .token.function,
    .token.class-name {
      color: ${selectedTheme?.functionColor || '#dcdcaa'};
    }
    .token.regex,
    .token.important,
    .token.variable {
      color: ${selectedTheme?.variableColor || '#9cdcfe'};
    }
  `;

  return (
    <div 
      id="snippet-preview"
      ref={previewRef}
      className="rounded-lg shadow-xl overflow-hidden"
      style={{
        width: `${width}px`,
        maxWidth: '100%',
        height: 'auto',
        maxHeight: `${height}px`,
        fontFamily: selectedTheme?.fontFamily || 'monospace',
        background: selectedTheme?.background || '#1e1e1e',
        color: selectedTheme?.color || '#d4d4d4',
        textShadow: selectedTheme?.textShadow || 'none',
      }}
    >
      {/* Custom styles for syntax highlighting */}
      <style>{customStyles}</style>
      
      {/* Window controls */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ThreeDot theme={selectedTheme}/>
          {/* Language indicator */}
          <div className="ml-auto text-xs opacity-70">
            {language}
          </div>
        </div>
        
        {/* Code display with syntax highlighting */}
        <div className="overflow-auto" style={{ maxHeight: `${height - 40}px` }}>
          <pre 
            className="line-numbers" 
            style={{ 
              margin: 0, 
              padding: 0, 
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
            }}
          >
            <code 
              ref={codeContainerRef}
              className={`language-${prismLanguage}`}
              style={{ 
                background: 'transparent',
                fontFamily: 'inherit',
                color: selectedTheme?.color || '#d4d4d4',
              }}
              dangerouslySetInnerHTML={{ __html: highlightedCode || code }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetBox;