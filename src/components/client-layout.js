"use client";

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import MessagePopup from './JsCompiler/MessagePopup';
// Loading fallback component
const LoadingFallback = () => (
  <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
);

// Client-side layout component with navigation optimizations
function ClientLayout({ children }) {
  const pathname = usePathname();
  // Add prefetching for common routes
  useEffect(() => {
    // Prefetch critical pages that users might navigate to
    const prefetchLinks = [
      '/typescript',
      '/python', 
      '/javascript',
      '/c',
      '/cpp',
      '/go',
      '/java',
      '/create-snippet',
      '/portfolio',
      '/portfolio/templates-list',
    ];
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    
    prefetchLinks.forEach(path => {
      if (pathname !== path) {
        const prefetchLink = link.cloneNode();
        prefetchLink.href = path;
        document.head.appendChild(prefetchLink);
      }
    });
    
    return () => {
      // Clean up prefetch links when component unmounts
      document.querySelectorAll('link[rel="prefetch"]').forEach(el => el.remove());
    };
  }, [pathname]);

  return (
    <>
      <NextTopLoader 
        color="#8B5CF6" 
        initialPosition={0.08} 
        crawlSpeed={200} 
        height={3} 
        crawl={true} 
        showSpinner={false} 
        easing="ease" 
        speed={200} 
      />
        <Suspense fallback={<LoadingFallback />}>
          <MessagePopup />
          {children}
        </Suspense>
    </>
  );
}

export default ClientLayout