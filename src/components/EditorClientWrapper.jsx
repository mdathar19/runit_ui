'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import LoadingComponent from '@/components/global/Loading';
import useReduxStore from '@/hooks/useReduxStore';

const EditorComponent = dynamic(
  () => import('../Clients/Editor'),
  {
    ssr: false,
    loading: () => <LoadingComponent />,
  }
);

function EditorClientWrapper({ templateId: propTemplateId }) {
  const params = useParams();
  const [canRender, setCanRender] = useState(false);
  const templateId = propTemplateId || params?.templateId;

  useEffect(() => {
    // Ensure we're in browser and document is accessible
    if (typeof window !== 'undefined' && window.document) {
      setCanRender(true);
    }
  }, []);

  if (!canRender) {
    return <LoadingComponent />;
  }

  return <EditorComponent templateId={templateId} />;
}

export default useReduxStore(EditorClientWrapper);