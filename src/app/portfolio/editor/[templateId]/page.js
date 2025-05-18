'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import the custom Editor dynamically to avoid SSR issues
const EditorClientWrapper = dynamic(() => import('@/components/EditorClientWrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-400 border-t-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
        <p className="text-white">Loading editor...</p>
      </div>
    </div>
  )
});

export default function EditorPage({ params }) {
  return <EditorClientWrapper templateId={params.templateId} />;
}
