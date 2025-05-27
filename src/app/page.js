import RunItLanding from "@/Clients/RunItLanding";
import Navigation from "@/components/landing/Naviation";
// SEO metadata
export const metadata = {
  title: 'RunIt - Online Compiler | AI Code Assistant, Snippet & Portfolio Creator',
  description:
    'RunIt is your all-in-one online Compiler that lets you write and compile code in 7 languages, generate AI-assisted code, create beautiful code snippets, and Create professional portfolios in minutes.',
  keywords:
    'online Compiler, AI code assistant, code snippet generator, portfolio creator, multi-language compiler, online code editor, JavaScript compiler, Python compiler, code sharing, developer portfolio, runit',

  openGraph: {
    title: 'RunIt – Online Compiler | AI Code Assistant, Snippet & Portfolio Creator',
    description:
      'Write and compile code in 7 languages, use AI to generate code, create and share beautiful snippets, and Create professional portfolios in minutes.',
    images: [
      {
        url: '/runIt-SEO.png',
        width: 600,
        height: 400,
        alt: 'RunIt Code AI-assist Preview',
      }
    ],
    type: 'website',
    url: 'https://runit.in',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RunIt – Online Compiler | AI Code Assistant, Snippet & Portfolio Creator',
    description:
      'Experience coding like never before with RunIt: an online Compiler for 7 languages, AI-assisted coding, snippet creation, and Create professional portfolios in minutes.',
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