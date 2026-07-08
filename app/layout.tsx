import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers/Providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://villarrealrodrigo.com";

export const metadata: Metadata = {
  title: "Rodrigo Villarreal | Fullstack Developer",
  description:
    "Fullstack developer specializing in ERPs, admin panels, and custom business systems. Building production-grade software for real businesses.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Rodrigo Villarreal | Fullstack Developer",
    description:
      "Fullstack developer specializing in ERPs, admin panels, and custom business systems. Building production-grade software for real businesses.",
    url: BASE_URL,
    siteName: "Rodrigo Villarreal",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo Villarreal | Fullstack Developer",
    description:
      "Fullstack developer specializing in ERPs, admin panels, and custom business systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=localStorage.getItem('portfolio-theme');var d=k==='dark'||((k===null||k==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');else r.classList.remove('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rodrigo Villarreal",
              url: BASE_URL,
              jobTitle: "Fullstack Developer",
              description:
                "Fullstack developer specializing in ERPs, admin panels, and custom business systems.",
              sameAs: [
                "https://www.linkedin.com/in/rodrigonicolasvillarreal/",
                "https://github.com/rodrigoVilla11",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-50 antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
