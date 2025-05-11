import JsCompiler from "@/Clients/JsCompiler";

// SEO metadata
export const metadata = {
  title: 'RunIt JavaScript Online Editor',
  description: 'Run JavaScript code online with RunIt',
};

export default function Home() {
  return (
      <JsCompiler defaultLanguage="javascript" />
  );
}