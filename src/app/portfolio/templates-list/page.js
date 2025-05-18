import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/components/global/Loading';

// Define metadata for SEO
export const metadata = {
  title: 'Choose Your Portfolio Template | RunIt',
  description: 'Browse and select from our professionally designed portfolio templates. Create your stunning portfolio website in minutes.',
  keywords: 'portfolio templates, website templates, professional portfolio, template selection',
};

// Import the client component with dynamic import for better performance
const TemplatesClient = dynamic(
  () => import('../../../Clients/Templates'),
  { 
    ssr: true,
    loading: () => <LoadingComponent />
  }
);

export default function TemplatesPage() {
  return <TemplatesClient />;
} 