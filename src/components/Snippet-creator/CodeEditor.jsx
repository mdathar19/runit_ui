'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

const languageMap = {
  javascript: 'javascript',
  typescript: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  html: 'html',
  css: 'css',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'cpp',
  csharp: 'csharp',
  php: 'php',
  rust: 'rust',
  sql: 'sql',
  json: 'json',
  markdown: 'markdown',
  ruby: 'ruby',
  bash: 'shell',
  shell: 'shell',
  go: 'go',
  swift: 'swift',
  kotlin: 'kotlin',
  yaml: 'yaml',
};

const CodeEditor = ({
  language = 'javascript',
  value = '',
  onChange,
  theme = 'vs-dark', // or 'light'
  height = '400px',
}) => {
  const resolvedLang = languageMap[language] || 'javascript';

  return (
    <Editor
      height={height}
      language={resolvedLang}
      theme={theme === 'light' ? 'light' : 'vs-dark'}
      value={value}
      onChange={(val) => onChange(val ?? '')}
      options={{
        fontSize: 14,
        fontFamily: "'Fira Code', Consolas, Monaco, 'Andale Mono', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
      }}
    />
  );
};

export default CodeEditor;
