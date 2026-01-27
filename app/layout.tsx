import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers/Providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Rodrigo Villarreal | Desarrollador Fullstack",
  description:
    "Portfolio de Rodrigo Villarreal, desarrollador fullstack especializado en Next.js, NestJS y aplicaciones web modernas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-50 antialiased">
        <Providers>
          <Navbar />
          {children}\
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
