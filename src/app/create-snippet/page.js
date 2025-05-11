import { Suspense } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSnippetThemes } from '@/common/service';

// Define metadata for SEO
export const metadata = {
  title: 'Create Code Snippet | Runit',
  description: 'Create beautiful, customizable and shareable code snippets with various themes, colors, and customization options',
  keywords: 'code snippet, syntax highlighting, code sharing, programming, developer tools',
  openGraph: {
    title: 'Create Code Snippet | Runit',
    description: 'Create beautiful, shareable code snippets with various themes and customization options',
    images: [
      {
        url: '/runIt_v7_snippetShot.png',
        width: 1200,
        height: 630,
        alt: 'Code Snippet Creator',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Code Snippet | Runit',
    description: 'Create beautiful, shareable code snippets with various themes and customization options',
    images: ['/runIt_v7_snippetShot.png.png'],
  },
  alternates: {
    canonical: '/create-snippet',
  }
};

// Import the client component with dynamic import for better performance
const CreateSnippetClient = dynamic(
  () => import('../../Clients/CreateSnippetClient'),
  { 
    ssr: true,
    loading: () => (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-800 rounded-md mb-4 w-1/3"></div>
        <div className="h-6 bg-gray-800 rounded-md mb-8 w-2/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-gray-800 rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }
);

// Define available themes on the server


export default async function CreateSnippetPage() {
  // Get themes for snippets (could be fetched from an API in a real application)
  const snippetThemes = getSnippetThemes();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-2 sm:p-4">
      <div className="container mx-auto py-4 sm:py-8">
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-10 bg-gray-800 rounded-md mb-4 w-1/3"></div>
            <div className="h-6 bg-gray-800 rounded-md mb-8 w-2/3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-md"></div>
              ))}
            </div>
          </div>
        }>
          {/* Client component that handles interactivity */}
          <CreateSnippetClient themes={snippetThemes} />
        </Suspense>
      </div>
    </div>
  );
}