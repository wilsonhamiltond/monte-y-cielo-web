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
  /** Hero banner photo in public/; without one, the banner uses the last property's cover photo. */
  heroImage: "/hero-wide-1448.webp" as string | undefined,
  /** Wide 2:1 crops of the hero photo for tablets and desktops. */
  heroSrcSet: "/hero-wide-960.webp 960w, /hero-wide-1448.webp 1448w" as string | undefined,
  /** Upright 3:4 crops of the same photo for phones, where the banner is taller than wide. */
  heroMobileSrcSet: "/hero-400.webp 400w, /hero-560.webp 560w, /hero-720.webp 720w, /hero.webp 815w" as string | undefined,
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
