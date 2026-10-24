import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE } from "@/content/site";
import "./site.css";

// Variable font with the width and optical-size axes: headings use the condensed, heavy cut.
const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], axes: ["opsz", "wdth"], display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: `${SITE.brandName} — ${t.meta.title}`,
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
    },
    openGraph: { title: `${SITE.brandName} — ${t.meta.title}`, description: t.meta.description, locale: lang },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={bricolage.className}>
      <body>{children}</body>
    </html>
  );
}
