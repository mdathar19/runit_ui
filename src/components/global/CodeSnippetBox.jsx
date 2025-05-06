import React from 'react';
import ThreeDot from './ThreeDot';

const CodeSnippetBox = ({
  previewRef,
  selectedTheme,
  language,
  code,
  width,
  height
}) => {
  const formatCode = (code) => {
    return code.split('\n').map((line, i) => (
      <div key={i} className="flex py-1">
        <span className="w-10 text-right pr-4 text-gray-500 select-none text-sm opacity-70">
          {i + 1}
        </span>
        <span className="flex-1 overflow-x-auto whitespace-pre">
          {line}
        </span>
      </div>
    ));
  };

  return (
    <div className="overflow-auto max-w-full">
      <div 
        id="snippet-preview"
        ref={previewRef}
        style={{ 
          background: selectedTheme?.background || '#1e1e1e',
          color: selectedTheme?.color || '#f8f8f8',
          fontFamily: selectedTheme?.fontFamily || 'monospace',
          width: `${width}px`,
          maxHeight: `${height}px`,
          textShadow: selectedTheme?.textShadow || 'none',
        }}
        className="rounded-xl p-6 shadow-xl overflow-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <ThreeDot theme={selectedTheme}/>
          <span
            style={{ 
              backgroundColor: selectedTheme?.accentColor || '#ff5f56',
              color: selectedTheme?.background || '#1e1e1e',
            }}
            className="px-2 py-1 text-xs font-semibold rounded"
          >
            Runit.in
          </span>
        </div>
        
        <div 
          style={{ 
            fontFamily: selectedTheme?.fontFamily || 'Consolas, Monaco, "Andale Mono", monospace',
          }}
          className="text-sm leading-relaxed"
        >
          {formatCode(code)}
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetBox;