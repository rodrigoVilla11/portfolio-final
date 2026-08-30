import type { Metadata } from "next";

// Todo /admin/* queda fuera de los buscadores (además del Disallow en robots.txt).
export const metadata: Metadata = {
  title: "Admin | Rodrigo Villarreal",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
