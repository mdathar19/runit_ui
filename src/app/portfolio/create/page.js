import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/components/global/Loading';

// Define metadata for SEO
export const metadata = {
  title: 'Create Your Professional Portfolio in Minutes | RunIt',
  description: 'Build a stunning professional portfolio website in just 5 minutes. Choose a beautiful design, fill in your details, and publish your portfolio instantly.',
  keywords: 'portfolio creator, web portfolio, professional website, developer portfolio, quick portfolio',
  openGraph: {
    title: 'Create Your Professional Portfolio in Minutes | RunIt',
    description: 'Build a stunning professional portfolio website in just 5 minutes. Choose a design, fill your details, and publish.',
    images: [
      {
        url: '/portfolio-image.png', // Make sure this image exists or replace with an actual preview image
        width: 1200,
        height: 630,
        alt: 'Portfolio Creator Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Professional Portfolio in Minutes | RunIt',
    description: 'Build a stunning professional portfolio website in just 5 minutes.',
    images: ['/portfolio-image.png'], // Make sure this image exists or replace with an actual preview image
  },
  alternates: {
    canonical: '/user',
  }
};

// Import the client component with dynamic import for better performance
const PortfolioLanding = dynamic(
  () => import('../../../Clients/portfolioLanding'),
  { 
    ssr: true,
    loading: () => <LoadingComponent /> // Show loading component while loading
  }
);

export default function PortfolioPage() {
  return <PortfolioLanding />;
}
