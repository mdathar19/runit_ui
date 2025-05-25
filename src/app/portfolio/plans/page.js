import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LoadingComponent from '@/components/global/Loading';

// Define metadata for SEO
export const metadata = {
  title: 'Choose Your Portfolio Plan | RunIt',
  description: 'Choose the perfect plan for your portfolio. Get started with a free trial or upgrade to a paid plan for more features.',
  keywords: 'portfolio plans, website plans, professional portfolio, plan selection',
};

// Import the client component with dynamic import for better performance
const PlansClient = dynamic(
  () => import('../../../Clients/Plans'),
  { 
    ssr: true,
    loading: () => <LoadingComponent />
  }
);

export default function PlansPage() {
  return <PlansClient />;
} 