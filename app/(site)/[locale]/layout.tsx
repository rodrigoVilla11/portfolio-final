import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { Providers } from "@/app/providers/Providers";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { LOCALES, getMessage, isLocale } from "@/lib/i18n";
import { BASE_URL, SITE_NAME, siteMetadata } from "@/lib/i18n-metadata";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

type Params = { locale: string };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return siteMetadata(locale);
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  // Con los rewrites de next.config.ts nunca llega otro valor; guarda defensiva.
  if (!isLocale(locale)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: BASE_URL,
    jobTitle: getMessage(locale, "meta.site.jobTitle"),
    description: getMessage(locale, "meta.site.description"),
    sameAs: [
      "https://www.linkedin.com/in/rodrigonicolasvillarreal/",
      "https://github.com/rodrigoVilla11",
    ],
  };

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k=localStorage.getItem('portfolio-theme');var d=k==='dark'||((k===null||k==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');else r.classList.remove('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-50 antialiased">
        <Providers lang={locale}>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
