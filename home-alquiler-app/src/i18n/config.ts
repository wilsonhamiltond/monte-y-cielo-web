export const locales = ["es", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeLabels: Record<Locale, string> = {
  es: "ES",
  en: "EN",
  fr: "FR",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
