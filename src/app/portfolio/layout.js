// This is a Server Component (no "use client" directive here)
import "../globals.css";
import PortfolioLayout from "@/components/portfolio-layout";

export default function RootLayout({ children }) {
  return (
        <PortfolioLayout>{children}</PortfolioLayout>
  );
}