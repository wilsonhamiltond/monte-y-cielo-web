/**
 * Site-wide settings. The WhatsApp number comes from the WHATSAPP_NUMBER
 * environment variable: country code + number, digits only (e.g. 573001234567).
 */
export const SITE = {
  brandName: "Home Alquiler",
  location: "Ciudad, País",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "573000000000",
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
