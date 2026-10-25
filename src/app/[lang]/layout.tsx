import type { Metadata } from "next";
import { Bricolage_Grotesque, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE } from "@/content/site";
import "./site.css";

// Variable font with the width and optical-size axes: headings use the condensed, heavy cut.
const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], axes: ["opsz", "wdth"], display: "swap" });
// Wordmark on the hero banner: serif "Monte" / "Cielo" with a script "y".
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: "500", display: "swap", variable: "--font-brand" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-script" });

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
    // Resolves the relative URLs below: search engines want absolute canonical/hreflang links.
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])), "x-default": "/es" },
    },
    openGraph: { title: `${SITE.brandName} — ${t.meta.title}`, description: t.meta.description, locale: lang },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${bricolage.className} ${cormorant.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
