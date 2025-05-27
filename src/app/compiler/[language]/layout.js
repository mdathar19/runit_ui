// This is a Server Component (no "use client" directive here)
import "../../globals.css";
import CompilerLayout from "@/components/compiler-layout";


export default function RootLayout({ children }) {
  return (
        <CompilerLayout>{children}</CompilerLayout>
  );
}