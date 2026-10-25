import type { Locale } from "@/i18n/config";

/**
 * Default property descriptions in every language. The admin can edit them;
 * saved changes live on disk (see src/lib/properties.ts) and override these.
 * Photos are not listed here: they are uploaded from /admin (see src/lib/photos.ts).
 */
export const PROPERTY_IDS = ["apto-1", "apto-2", "casa", "casa-2"] as const;
export type PropertyId = (typeof PROPERTY_IDS)[number];

export interface PropertyText {
  type: string;
  name: string;
  summary: string;
  description: string;
  price: string;
  amenities: string[];
  /** House rules and booking conditions, one per line (check-in, pets, deposit…). */
  rules: string[];
}

export interface Property {
  id: PropertyId;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  /** Google Maps link shown as "Ver ubicación" in the detail view; omit to hide it. */
  mapUrl?: string;
  text: Record<Locale, PropertyText>;
}

const mapsUrl = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
const MONTE_Y_CIELO_MAP = mapsUrl(19.253683, -69.192589);

export const PROPERTIES: Property[] = [
  {
    id: "apto-2",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    mapUrl: MONTE_Y_CIELO_MAP,
    text: {
      es: {
        type: "Apartamento",
        name: "Monte y Cielo 1",
        summary: "Apartamento para dos en Samaná, con balcón y acceso a la piscina.",
        description:
          "Apartamento de 1 habitación y 1 baño con cocina, sala de estar y balcón, con vista a las montañas y al mar. Incluye acceso a la piscina, patio y parqueo privado. Ideal para parejas.",
        price: "Consultar precio",
        amenities: ["Cocina", "Sala de estar", "Balcón", "Acceso a la piscina", "Patio", "Parqueo privado"],
        rules: ["Máximo 2 personas"],
      },
      en: {
        type: "Apartment",
        name: "Monte y Cielo 1",
        summary: "Apartment for two in Samaná, with a balcony and pool access.",
        description:
          "1-bedroom, 1-bathroom apartment with a kitchen, living room and balcony, with views of the mountains and the sea. Includes pool access, a patio and private parking. Ideal for couples.",
        price: "Price on request",
        amenities: ["Kitchen", "Living room", "Balcony", "Pool access", "Patio", "Private parking"],
        rules: ["Maximum 2 guests"],
      },
      fr: {
        type: "Appartement",
        name: "Monte y Cielo 1",
        summary: "Appartement pour deux à Samaná, avec balcon et accès à la piscine.",
        description:
          "Appartement d'une chambre et une salle de bain avec cuisine, salon et balcon, avec vue sur les montagnes et la mer. Accès à la piscine, patio et parking privé. Idéal pour les couples.",
        price: "Prix sur demande",
        amenities: ["Cuisine", "Salon", "Balcon", "Accès à la piscine", "Patio", "Parking privé"],
        rules: ["2 personnes maximum"],
      },
    },
  },
  {
    id: "apto-1",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    mapUrl: MONTE_Y_CIELO_MAP,
    text: {
      es: {
        type: "Apartamento",
        name: "Monte y Cielo 2",
        summary: "Apartamento para dos en Samaná, con balcón y acceso a la piscina.",
        description:
          "Apartamento de 1 habitación y 1 baño con cocina, sala de estar y balcón, rodeado de naturaleza. Incluye acceso a la piscina, patio y parqueo privado. Ideal para parejas.",
        price: "Consultar precio",
        amenities: ["Cocina", "Sala de estar", "Balcón", "Acceso a la piscina", "Patio", "Parqueo privado"],
        rules: ["Máximo 2 personas"],
      },
      en: {
        type: "Apartment",
        name: "Monte y Cielo 2",
        summary: "Apartment for two in Samaná, with a balcony and pool access.",
        description:
          "1-bedroom, 1-bathroom apartment with a kitchen, living room and balcony, surrounded by nature. Includes pool access, a patio and private parking. Ideal for couples.",
        price: "Price on request",
        amenities: ["Kitchen", "Living room", "Balcony", "Pool access", "Patio", "Private parking"],
        rules: ["Maximum 2 guests"],
      },
      fr: {
        type: "Appartement",
        name: "Monte y Cielo 2",
        summary: "Appartement pour deux à Samaná, avec balcon et accès à la piscine.",
        description:
          "Appartement d'une chambre et une salle de bain avec cuisine, salon et balcon, en pleine nature. Accès à la piscine, patio et parking privé. Idéal pour les couples.",
        price: "Prix sur demande",
        amenities: ["Cuisine", "Salon", "Balcon", "Accès à la piscine", "Patio", "Parking privé"],
        rules: ["2 personnes maximum"],
      },
    },
  },
  {
    id: "casa",
    guests: 8,
    bedrooms: 3,
    bathrooms: 2,
    mapUrl: mapsUrl(19.282742, -69.203003),
    text: {
      es: {
        type: "Casa",
        name: "Casa Monte Verde",
        summary: "Casa completa en Samaná para hasta 8 personas, ideal para familias y grupos.",
        description:
          "Casa de 3 habitaciones y 2 baños con terraza, balcón, cocina completa con área de estar, patio y área de lavado y secado. Cuenta con parqueo privado.",
        price: "Consultar precio",
        amenities: ["Terraza", "Balcón", "Cocina completa con área de estar", "Patio", "Área de lavado y secado", "Parqueo privado"],
        rules: ["Máximo 8 personas", "La casa no tiene piscina"],
      },
      en: {
        type: "House",
        name: "Casa Monte Verde",
        summary: "Entire house in Samaná for up to 8 guests, ideal for families and groups.",
        description:
          "3-bedroom, 2-bathroom house with a terrace, balcony, full kitchen with a sitting area, patio and laundry area with washer and dryer. Private parking included.",
        price: "Price on request",
        amenities: ["Terrace", "Balcony", "Full kitchen with sitting area", "Patio", "Laundry area (washer and dryer)", "Private parking"],
        rules: ["Maximum 8 guests", "The house has no pool"],
      },
      fr: {
        type: "Maison",
        name: "Casa Monte Verde",
        summary: "Maison entière à Samaná jusqu'à 8 personnes, idéale pour les familles et les groupes.",
        description:
          "Maison de 3 chambres et 2 salles de bain avec terrasse, balcon, cuisine complète avec coin salon, patio et buanderie avec lave-linge et sèche-linge. Parking privé.",
        price: "Prix sur demande",
        amenities: ["Terrasse", "Balcon", "Cuisine complète avec coin salon", "Patio", "Buanderie (lave-linge et sèche-linge)", "Parking privé"],
        rules: ["8 personnes maximum", "La maison n'a pas de piscine"],
      },
    },
  },
  {
    id: "casa-2",
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    text: {
      es: {
        type: "Apartamento penthouse",
        name: "Vista Palmaretto",
        summary: "Apartamento penthouse de 2 pisos en Palmaretto, La Vega, ideal para estudiantes y catedráticos cerca de la PUCMM.",
        description:
          "Apartamento penthouse de 2 pisos en un edificio con portero, ubicado en Palmaretto, La Vega. Tiene 3 habitaciones, 2 baños completos y 2 medios baños, cocina, sala de estar, oficina privada, balcón y área de estar al aire libre. Cuenta con parqueo privado. El edificio no tiene ascensor. Ideal para estudiantes y catedráticos que necesiten estar cerca de la PUCMM.",
        price: "Consultar precio",
        amenities: ["Penthouse de 2 pisos", "Edificio con portero", "2 baños completos y 2 medios baños", "Oficina privada", "Cocina", "Sala de estar", "Balcón", "Área de estar al aire libre", "Parqueo privado"],
        rules: ["Máximo 6 personas", "El edificio no tiene ascensor (acceso por escaleras)"],
      },
      en: {
        type: "Penthouse apartment",
        name: "Vista Palmaretto",
        summary: "Two-story penthouse apartment in Palmaretto, La Vega, ideal for students and professors near PUCMM.",
        description:
          "Two-story penthouse apartment in a building with a doorman, located in Palmaretto, La Vega. It has 3 bedrooms, 2 full bathrooms and 2 half bathrooms, a kitchen, living room, private office, balcony and outdoor sitting area. Private parking included. The building has no elevator. Ideal for students and professors who need to be close to PUCMM.",
        price: "Price on request",
        amenities: ["Two-story penthouse", "Building with doorman", "2 full and 2 half bathrooms", "Private office", "Kitchen", "Living room", "Balcony", "Outdoor sitting area", "Private parking"],
        rules: ["Maximum 6 guests", "The building has no elevator (stairs only)"],
      },
      fr: {
        type: "Appartement penthouse",
        name: "Vista Palmaretto",
        summary: "Appartement penthouse de deux étages à Palmaretto, La Vega, idéal pour les étudiants et professeurs près de la PUCMM.",
        description:
          "Appartement penthouse de deux étages dans un immeuble avec concierge, situé à Palmaretto, La Vega. Il compte 3 chambres, 2 salles de bain complètes et 2 salles d'eau, cuisine, salon, bureau privé, balcon et coin salon extérieur. Parking privé. L'immeuble n'a pas d'ascenseur. Idéal pour les étudiants et professeurs qui doivent être près de la PUCMM.",
        price: "Prix sur demande",
        amenities: ["Penthouse de deux étages", "Immeuble avec concierge", "2 salles de bain et 2 salles d'eau", "Bureau privé", "Cuisine", "Salon", "Balcon", "Coin salon extérieur", "Parking privé"],
        rules: ["6 personnes maximum", "L'immeuble n'a pas d'ascenseur (accès par escaliers)"],
      },
    },
  },
];

export function isPropertyId(value: unknown): value is PropertyId {
  return typeof value === "string" && (PROPERTY_IDS as readonly string[]).includes(value);
}
