import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/components/global/Loading';
import { getSnippetThemes } from '@/utils/Utils';
import MadeByAthar from '@/components/global/MadeByAthar';

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
    images: ['/runIt_v7_snippetShot.png'],
  },
  alternates: {
    canonical: '/create-snippet',
  }
};

// Import the client component with dynamic import with optimized settings
const CreateSnippetClient = dynamic(
  () => import('../../Clients/CreateSnippetClient'),
  { 
    ssr: true, // Disable server-side rendering for better performance
    loading: () => <LoadingComponent /> // Show loading component while loading
  }
);

// Preload the themes on the server
export async function generateStaticParams() {
  // This will be executed at build time and cached
  return [{}]; // Return an empty object to generate the static page
}

export default async function CreateSnippetPage() {
  // Get themes for snippets
  const snippetThemes = getSnippetThemes();

  return (
    <>
    <MadeByAthar />
      <div className="min-h-screen bg-gray-950 text-white p-2 sm:p-4">
        <div className="container mx-auto">
          <CreateSnippetClient themes={snippetThemes} />
        </div>
      </div>
    </>
  );
}