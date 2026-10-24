/*
 * ==========================================================
 *  CONFIGURACIÓN DEL SITIO — edita solo este archivo
 * ==========================================================
 *  - WHATSAPP_NUMBER: número con código de país, solo dígitos
 *    (ej. Colombia 57 + 3001234567 => "573001234567").
 *  - Las fotos van en la carpeta /images (o usa URLs).
 */
const SITE = {
  brandName: "Home Alquiler",
  tagline: "Apartamentos y casa para tus próximas vacaciones",
  whatsappNumber: "573000000000", // TODO: reemplazar por el número real
  location: "Ciudad, País",
};

const PROPERTIES = [
  {
    id: "apto-1",
    type: "Apartamento",
    name: "Apartamento 1",
    summary: "Moderno y luminoso, ideal para parejas o viajeros de negocios.",
    description:
      "Apartamento completamente amoblado con cocina equipada, sala de estar, balcón con vista y excelente ubicación cerca de restaurantes, supermercados y transporte.",
    price: "Desde $000.000 / noche",
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ["Wi-Fi", "Aire acondicionado", "Cocina equipada", "TV", "Parqueadero", "Lavadora"],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    ],
  },
  {
    id: "apto-2",
    type: "Apartamento",
    name: "Apartamento 2",
    summary: "Espacioso y cómodo, perfecto para familias pequeñas.",
    description:
      "Amplio apartamento con zonas sociales, cocina integral, habitaciones cómodas y acceso a las zonas comunes del edificio. Tranquilo y seguro.",
    price: "Desde $000.000 / noche",
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Wi-Fi", "Piscina", "Cocina equipada", "TV", "Portería 24h", "Balcón"],
    photos: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80",
    ],
  },
  {
    id: "casa",
    type: "Casa",
    name: "Casa",
    summary: "Casa completa con patio, ideal para grupos y familias grandes.",
    description:
      "Casa independiente con amplias habitaciones, patio/zona BBQ, cocina completa y espacio para compartir en familia o con amigos.",
    price: "Desde $000.000 / noche",
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ["Wi-Fi", "Patio", "Zona BBQ", "Parqueadero", "Cocina equipada", "Lavadora"],
    photos: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    ],
  },
];
