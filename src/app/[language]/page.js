import { languagePathMap } from "@/utils/Utils";
import dynamic from "next/dynamic";
import LoadingComponent from '@/components/global/Loading';
import MadeByAthar from "@/components/global/MadeByAthar";

// This function runs on the server during build time
export async function generateStaticParams() {
  // Generate routes for all supported languages
  return [
    { language: 'typescript' },
    { language: 'python' },
    { language: 'c' },
    { language: 'cpp' },
    { language: 'go' },
    { language: 'java' }
  ];
}

// Import the client component with dynamic import for better performance
const JsCompiler = dynamic(
  () => import('../../Clients/JsCompiler'),
  { 
    ssr: true, // Disable server-side rendering for this component
    loading: LoadingComponent // Show a loading component while loading
  }
);

// Dynamic metadata based on the language
export async function generateMetadata({ params }) {
  const { language } = await params; // No need for await here
  const languageDisplay = language.charAt(0).toUpperCase() + language.slice(1);

  return {
    title: `RunIt - ${languageDisplay} Online Editor & Snippet Creator`,
    description: `RunIt is a fast, lightweight, and beautiful online ${languageDisplay} editor with AI-powered code suggestions, compiler, and stunning snippet creation.`,
    keywords: `online ${language} editor, ${language} snippet generator, AI ${language} assistant, ${language} compiler, code formatter, beautiful ${language} snippets, runit editor`,

    openGraph: {
      title: `RunIt - ${languageDisplay} Snippet Creator & Code Runner`,
      description: `Create beautiful ${languageDisplay} snippets and run your ${languageDisplay} code online with themes, AI help, and instant results.`,
      images: [
        {
          url: '/runIt_v7_snippetShot.png',
          width: 1200,
          height: 630,
          alt: `RunIt ${languageDisplay} Snippet Preview`,
        },
      ],
      type: 'website',
      url: `https://runit.in/${language}`,
    },

    twitter: {
      card: 'summary_large_image',
      title: `RunIt - ${languageDisplay} Code Editor & Snippet Tool`,
      description: `Write, compile, and beautify your ${languageDisplay} code with RunIt. Share stunning code snippets with ease.`,
      images: ['/runIt_v7_snippetShot.png'],
    },

    alternates: {
      canonical: `https://runit.in/${language}`,
    },
  };
}

export default async function LanguagePage({ params }) {
  // Get the language from URL params (no need for await)
  const { language } = await params;
  const languageId = languagePathMap[language] || 'javascript';
  
  return (
    <>
      <MadeByAthar />
      <JsCompiler defaultLanguage={languageId} />
    </>
  );
}