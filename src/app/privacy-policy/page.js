import PrivacyPolicy from "@/Clients/PrivacyPolicy";

// SEO metadata
export const metadata = {
  title: 'RunIt - AI-Powered Online Portfolio Builder, Code Editor & Snippet Creator',
  description:
    'RunIt is a fast, lightweight, and beautiful online code editor that supports multiple programming languages, instant AI code suggestions, and stunning snippet creation with themes.',
  keywords:
    'online Portfolio Builder, code editor, code snippet generator, AI code assistant, multi-language compiler, JavaScript compiler, Python compiler, code formatter, beautiful code snippets, runit editor',

  openGraph: {
    title: 'RunIt - AI-Powered Online Portfolio Builder, Code Editor & Snippet Creator',
    description:
      'RunIt is a fast, lightweight, and beautiful online code editor that supports multiple programming languages, instant AI code suggestions, and stunning snippet creation with themes.',
    images: [
      {
        url: '/runit-home1.png',
        width: 1200,
        height: 630,
        alt: 'RunIt Code AI-assist Preview',
      },
      {
        url: '/runit-home2.png',
        width: 1200,
        height: 630,
        alt: 'RunIt Code snippet Preview',
      },
    ],
    type: 'website',
    url: 'https://runit.in',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RunIt - AI-Powered Online Code Editor & Snippet Creator',
    description:
      'Write and compile code in multiple languages. Generate beautiful, shareable snippets effortlessly with RunIt.',
    images: ['/runit-home1.png'],
  },

  alternates: {
    canonical: 'https://runit.in',
  },
};


export default function Home() {
  return (
    <>
    {/* <MadeByAthar /> */}
    <PrivacyPolicy   />
    </>
  );
}