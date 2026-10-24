/**
 * Site-wide settings. The WhatsApp number comes from the WHATSAPP_NUMBER
 * environment variable: country code + number, digits only (e.g. 573001234567).
 */
export const SITE = {
  brandName: "Monte y Cielo",
  location: "Samaná y La Vega, República Dominicana",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "573000000000",
  /** Hero photo in public/; without one, the hero uses the last property's cover photo. */
  heroImage: "/hero.webp" as string | undefined,
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
