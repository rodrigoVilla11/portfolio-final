import type { Metadata, ResolvingMetadata } from "next";
import { getMessage, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/i18n-metadata";
import ContactClient from "./_client";

type Params = { locale: string };

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return pageMetadata({
    locale,
    path: "/contact",
    title: getMessage(locale, "meta.pages.contact.title"),
    description: getMessage(locale, "meta.pages.contact.description"),
    parent,
  });
}

export default function ContactPage() {
  return <ContactClient />;
}
