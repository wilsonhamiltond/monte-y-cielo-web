import type { Locale } from "@/i18n/config";

/**
 * Property descriptions in every language. Photos are not listed here:
 * they are uploaded from /admin and stored on disk (see src/lib/photos.ts).
 */
export const PROPERTY_IDS = ["apto-1", "apto-2", "casa"] as const;
export type PropertyId = (typeof PROPERTY_IDS)[number];

export interface PropertyText {
  type: string;
  name: string;
  summary: string;
  description: string;
  price: string;
  amenities: string[];
}

export interface Property {
  id: PropertyId;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  text: Record<Locale, PropertyText>;
}

export const PROPERTIES: Property[] = [
  {
    id: "apto-1",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    text: {
      es: {
        type: "Apartamento",
        name: "Apartamento 1",
        summary: "Moderno y luminoso, ideal para parejas o viajeros de negocios.",
        description:
          "Apartamento completamente amoblado con cocina equipada, sala de estar, balcón con vista y excelente ubicación cerca de restaurantes, supermercados y transporte.",
        price: "Desde $000.000 / noche",
        amenities: ["Wi-Fi", "Aire acondicionado", "Cocina equipada", "TV", "Parqueadero", "Lavadora"],
      },
      en: {
        type: "Apartment",
        name: "Apartment 1",
        summary: "Modern and bright, ideal for couples or business travelers.",
        description:
          "Fully furnished apartment with an equipped kitchen, living room, balcony with a view and a great location near restaurants, supermarkets and transport.",
        price: "From $000,000 / night",
        amenities: ["Wi-Fi", "Air conditioning", "Equipped kitchen", "TV", "Parking", "Washing machine"],
      },
      fr: {
        type: "Appartement",
        name: "Appartement 1",
        summary: "Moderne et lumineux, idéal pour les couples ou les voyages d'affaires.",
        description:
          "Appartement entièrement meublé avec cuisine équipée, salon, balcon avec vue et excellent emplacement près des restaurants, supermarchés et transports.",
        price: "À partir de 000 000 $ / nuit",
        amenities: ["Wi-Fi", "Climatisation", "Cuisine équipée", "TV", "Parking", "Lave-linge"],
      },
    },
  },
  {
    id: "apto-2",
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    text: {
      es: {
        type: "Apartamento",
        name: "Apartamento 2",
        summary: "Espacioso y cómodo, perfecto para familias pequeñas.",
        description:
          "Amplio apartamento con zonas sociales, cocina integral, habitaciones cómodas y acceso a las zonas comunes del edificio. Tranquilo y seguro.",
        price: "Desde $000.000 / noche",
        amenities: ["Wi-Fi", "Piscina", "Cocina equipada", "TV", "Portería 24h", "Balcón"],
      },
      en: {
        type: "Apartment",
        name: "Apartment 2",
        summary: "Spacious and comfortable, perfect for small families.",
        description:
          "Large apartment with living areas, a full kitchen, comfortable bedrooms and access to the building's shared spaces. Quiet and safe.",
        price: "From $000,000 / night",
        amenities: ["Wi-Fi", "Pool", "Equipped kitchen", "TV", "24h front desk", "Balcony"],
      },
      fr: {
        type: "Appartement",
        name: "Appartement 2",
        summary: "Spacieux et confortable, parfait pour les petites familles.",
        description:
          "Grand appartement avec espaces de vie, cuisine complète, chambres confortables et accès aux espaces communs de l'immeuble. Calme et sûr.",
        price: "À partir de 000 000 $ / nuit",
        amenities: ["Wi-Fi", "Piscine", "Cuisine équipée", "TV", "Gardien 24h/24", "Balcon"],
      },
    },
  },
  {
    id: "casa",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    text: {
      es: {
        type: "Casa",
        name: "Casa",
        summary: "Casa completa con patio, ideal para grupos y familias grandes.",
        description:
          "Casa independiente con amplias habitaciones, patio/zona BBQ, cocina completa y espacio para compartir en familia o con amigos.",
        price: "Desde $000.000 / noche",
        amenities: ["Wi-Fi", "Patio", "Zona BBQ", "Parqueadero", "Cocina equipada", "Lavadora"],
      },
      en: {
        type: "House",
        name: "House",
        summary: "Entire house with a yard, ideal for groups and large families.",
        description:
          "Detached house with large bedrooms, a yard/BBQ area, a full kitchen and plenty of space to share with family or friends.",
        price: "From $000,000 / night",
        amenities: ["Wi-Fi", "Yard", "BBQ area", "Parking", "Equipped kitchen", "Washing machine"],
      },
      fr: {
        type: "Maison",
        name: "Maison",
        summary: "Maison entière avec jardin, idéale pour les groupes et les grandes familles.",
        description:
          "Maison indépendante avec grandes chambres, jardin/espace barbecue, cuisine complète et beaucoup d'espace à partager en famille ou entre amis.",
        price: "À partir de 000 000 $ / nuit",
        amenities: ["Wi-Fi", "Jardin", "Espace barbecue", "Parking", "Cuisine équipée", "Lave-linge"],
      },
    },
  },
];

export function isPropertyId(value: unknown): value is PropertyId {
  return typeof value === "string" && (PROPERTY_IDS as readonly string[]).includes(value);
}
