import RunItLanding from "@/Clients/RunItLanding";
import Navigation from "@/components/landing/Naviation";
// SEO metadata
export const metadata = {
  title: 'RunIt - AI Portfolio Generator, Code Agent & Online Compiler',
  description:
    'RunIt is your all-in-one AI platform to instantly generate professional portfolios, build with intelligent AI code agents, and compile code in 7 languages – all in the browser.',
  keywords:
    'portfolio generator, AI code agent, online compiler, AI code assistant, code snippet maker, multi-language compiler, online code editor, code sharing, developer portfolio, runit',

  openGraph: {
    title: 'RunIt - AI Portfolio Generator, Code Agent & Online Compiler',
    description:
      'Create stunning developer portfolios in 1 minute, build with AI code agents, and compile in 7 languages – all from your browser. No setup needed.',
    images: [
      {
        url: '/runIt-SEO.png',
        width: 600,
        height: 400,
        alt: 'RunIt AI Portfolio Generator Preview',
      }
    ],
    type: 'website',
    url: 'https://runit.in',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RunIt - AI Portfolio Generator, Code Agent & Online Compiler',
    description:
      'Instant portfolio generation, smart AI code agents, real-time compilation, and beautiful snippets – everything a developer needs. Try RunIt now.',
    images: ['/runIt-SEO.png'],
  },

  alternates: {
    canonical: 'https://runit.in',
  },
};




export default function Home() {
  return (
    <>
    {/* <MadeByAthar /> */}
    <Navigation />
    <RunItLanding/>
    </>
  );
}