'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/components/global/Loading';
import useReduxStore from '@/hooks/useReduxStore';

// Client component wrapper for the Editor
function EditorClientWrapper() {
  const params = useParams();
  const [EditorComponent, setEditorComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dynamically import the Editor component with ssr: false
    const loadEditor = async () => {
      const EditorModule = await import('../Clients/Editor');
      setEditorComponent(() => EditorModule.default);
      setIsLoading(false);
    };

    loadEditor();
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }

  // Render the Editor component once loaded
  return EditorComponent ? <EditorComponent templateId={params.templateId} /> : null;
} 

export default useReduxStore(EditorClientWrapper);
