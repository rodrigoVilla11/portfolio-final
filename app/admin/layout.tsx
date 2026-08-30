import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

// Root layout propio de /admin/*: el sitio público vive en app/(site)/[locale]
// con su propio root layout, y con varios root layouts no puede existir
// app/layout.tsx. Sin navbar ni footer; es una herramienta interna.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Todo /admin/* queda fuera de los buscadores (además del Disallow en robots.txt).
export const metadata: Metadata = {
  title: "Admin | Rodrigo Villarreal",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
