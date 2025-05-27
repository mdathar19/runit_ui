import CtaSection from '@/components/landing/CtaSection';
import Pricing from '@/components/landing/Pricing';
import Testimonial from '@/components/landing/Testimonial';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import HeroSection from '@/components/landing/HeroSection';
import Footer from '@/components/landing/Footer';
import Features from '@/components/landing/Features';
import Navigation from '@/components/landing/Naviation';

const RunItLanding = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden">
      <Navigation />
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
     <Testimonial />

      {/* Pricing */}
      <Pricing />

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RunItLanding;