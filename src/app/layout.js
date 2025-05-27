// This is a Server Component (no "use client" directive here)
import "./globals.css";
import ClientLayout from '../components/client-layout';

// Server component can export metadata
export const metadata = {
  title: "RunIt - AI-Powered Online Code Editor & Snippet Creator",
  description: "RunIt is a fast, lightweight, and beautiful online code editor that supports multiple programming languages, instant AI code suggestions, and stunning snippet creation with themes.",
  icons:{
    icon: [
    { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/favicon_io/favicon_io/android-chrome-192x192.png' },
    { url: '/favicon_io/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    { url: '/favicon_io/apple-touch-icon.png', sizes: '16x16', type: 'image/png' },
  ],
  apple:'/apple-touch-icon.png'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}