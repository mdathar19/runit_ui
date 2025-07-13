"use client";

import { Suspense, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import MessagePopup from './JsCompiler/MessagePopup';
import PaymentAlert from './global/PaymentAlert';
import Navigation from './landing/Naviation';

// List of paths where navigation should be hidden
const HIDE_NAV_PATHS = [
  /^\/AI-agent\/[^\/]+$/,
  /^\/compiler\/[^\/]+$/,
  /^\/portfolio\/editor\/[^\/]+$/ // Regex to match dynamic paths like /portfolio/editor/[templateId]
];

// Helper to check if navigation should be hidden
const shouldHideNavigation = (pathname) => {
  return HIDE_NAV_PATHS.some((pattern) => pattern.test(pathname));
};

const LoadingFallback = () => (
  <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
);

function ClientLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const prefetchLinks = [
      '/',
      '/compiler/python',
      '/create-snippet',
      '/portfolio/create',
      '/portfolio/templates-list'
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
        {!shouldHideNavigation(pathname) && <Navigation />}
        <MessagePopup />
        <PaymentAlert />
        {children}
      </Suspense>
    </>
  );
}

export default ClientLayout;
