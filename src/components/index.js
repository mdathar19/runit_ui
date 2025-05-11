import dynamic from 'next/dynamic';

export const CodeSnippetBox = dynamic(() => import('./Snippet-creator/CodeSnippetBox'), { 
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 rounded-lg w-full h-64"></div>
  )
});

export const CodeEditor = dynamic(() => import('./Snippet-creator/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 rounded-lg w-full h-64"></div>
  )
});

export const SnippetControlPanel = dynamic(() => import('./Snippet-creator/SnippetControlPanel'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 rounded-lg w-full h-100"></div>
  )
});

export const LanguageSelector = dynamic(() => import('./Snippet-creator/LanguageSelector'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-800 rounded-lg w-full h-16"></div>
  )
});

