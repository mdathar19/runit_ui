import JsCompiler from "@/activePages/JsCompiler";
import ClientComponent from '../components/ClientComponent';

// SEO metadata
export const metadata = {
  title: 'RunIt JavaScript Online Editor',
  description: 'Run JavaScript code online with RunIt',
};

export default function Home() {
  return (
    <ClientComponent>
      <JsCompiler defaultLanguage="javascript" />
    </ClientComponent>
  );
}