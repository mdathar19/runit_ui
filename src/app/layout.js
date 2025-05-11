import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeartIcon } from "@heroicons/react/solid";
import { FiExternalLink } from "react-icons/fi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-gradient-to-r from-gray-900 to-purple-900 p-1 text-white shadow-lg">
          <div className="container mx-auto">
            <div className="font-light text-sm tracking-wide text-center">
              Made with <HeartIcon className="h-4 w-4 text-red-400 inline-block mx-1 animate-pulse" /> by <strong><a href="https://www.linkedin.com/in/md-athar-alam-a5067b18b/" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline transition-all">Athar</a>
              <FiExternalLink className="h-3 w-3 ml-1 inline-block" /></strong>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
