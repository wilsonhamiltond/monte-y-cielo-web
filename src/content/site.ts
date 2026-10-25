/**
 * Site-wide settings. The WhatsApp number comes from the WHATSAPP_NUMBER
 * environment variable: country code + number (e.g. 573001234567). Anything
 * but digits is dropped, since wa.me links break on spaces, "+" or dashes.
 */
export const SITE = {
  brandName: "Monte y Cielo",
  /** Public origin, used for absolute canonical and hreflang URLs. */
  url: "https://www.monteycieloaparments.com",
  location: "Samaná y La Vega, República Dominicana",
  whatsappNumber: (process.env.WHATSAPP_NUMBER ?? "573000000000").replace(/\D/g, ""),
  /** Hero photo in public/; without one, the hero uses the last property's cover photo. */
  heroImage: "/hero.webp" as string | undefined,
  /** Smaller copies of heroImage (already cropped to the 3:4 arch) for phones. */
  heroSrcSet: "/hero-400.webp 400w, /hero-560.webp 560w, /hero-720.webp 720w, /hero.webp 815w" as string | undefined,
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
