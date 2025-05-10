import JsCompiler from "@/Clients/JsCompiler";
import { languagePathMap } from "@/Utils";

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

// Dynamic metadata based on the language
export async function generateMetadata({ params }) {
  const { language } = await params;
  const languageDisplay = language.charAt(0).toUpperCase() + language.slice(1);
  
  return {
    title: `RunIt ${languageDisplay} Online Editor`,
    description: `Run ${languageDisplay} code online with RunIt`,
  };
}

export default async function LanguagePage({ params }) {
  // Get the language from URL params
  const { language } = await params;
  const languageId = languagePathMap[language] || 'javascript';
  
  return (
      <JsCompiler defaultLanguage={languageId} />
  );
}