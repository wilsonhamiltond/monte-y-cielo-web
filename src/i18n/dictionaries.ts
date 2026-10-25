import type { Locale } from "./config";

const es = {
  meta: {
    title: "Alquiler de apartamentos y casas",
    description: "Apartamentos y casas para tus vacaciones. Reserva fácil por WhatsApp.",
  },
  nav: { properties: "Alojamientos", howToBook: "Cómo reservar", contact: "Contacto", language: "Idioma" },
  hero: {
    title: "Tu hogar lejos de casa",
    tagline: "Bienvenido a Monte y Cielo, donde la comodidad se siente como en casa y cada estadía se convierte en una pequeña escapada.",
    cta: "Ver alojamientos",
    whatsapp: "Escríbenos por WhatsApp",
  },
  properties: {
    title: "Nuestros alojamientos",
    subtitle: "3 apartamentos y 1 casa. Toca una tarjeta para ver fotos y detalles.",
    guests: "huéspedes",
    bedrooms: "habitaciones",
    bedroomsShort: "hab.",
    bathrooms: "baños",
    photos: "fotos",
    details: "Ver detalles",
    book: "Reservar aquí",
    amenities: "Comodidades",
    rules: "Condiciones",
    map: "Ver ubicación",
    noPhotos: "Fotos próximamente",
    close: "Cerrar",
    prev: "Anterior",
    next: "Siguiente",
  },
  steps: {
    title: "Cómo reservar",
    items: [
      { title: "Elige", text: "Mira las fotos y la descripción del alojamiento que más te guste." },
      { title: "Toca “Reservar aquí”", text: "Se abrirá WhatsApp con un mensaje listo para enviar." },
      { title: "Confirma", text: "Te respondemos con disponibilidad, precio y forma de pago." },
    ],
  },
  contact: { title: "¿Tienes preguntas?", text: "Escríbenos o llámanos, con gusto te atendemos." },
  footer: { rights: "Todos los derechos reservados." },
  whatsapp: {
    general: "Hola, quiero información sobre los alojamientos disponibles.",
    property: "Hola, quiero reservar *{name}*. ¿Tienen disponibilidad para las fechas: ___?",
  },
};

export type Dictionary = typeof es;

const en: Dictionary = {
  meta: {
    title: "Apartments and houses for rent",
    description: "Apartments and houses for your vacation. Book easily on WhatsApp.",
  },
  nav: { properties: "Stays", howToBook: "How to book", contact: "Contact", language: "Language" },
  hero: {
    title: "Your home away from home",
    tagline: "Welcome to Monte y Cielo, where comfort feels like home and every stay becomes a little escape.",
    cta: "See our stays",
    whatsapp: "Message us on WhatsApp",
  },
  properties: {
    title: "Our stays",
    subtitle: "3 apartments and 1 house. Tap a card to see photos and details.",
    guests: "guests",
    bedrooms: "bedrooms",
    bedroomsShort: "bd.",
    bathrooms: "bathrooms",
    photos: "photos",
    details: "See details",
    book: "Book here",
    amenities: "Amenities",
    rules: "House rules",
    map: "View location",
    noPhotos: "Photos coming soon",
    close: "Close",
    prev: "Previous",
    next: "Next",
  },
  steps: {
    title: "How to book",
    items: [
      { title: "Choose", text: "Browse the photos and description of the place you like best." },
      { title: "Tap “Book here”", text: "WhatsApp opens with a message ready to send." },
      { title: "Confirm", text: "We reply with availability, price and payment options." },
    ],
  },
  contact: { title: "Any questions?", text: "Message or call us, we're happy to help." },
  footer: { rights: "All rights reserved." },
  whatsapp: {
    general: "Hi, I'd like information about your available stays.",
    property: "Hi, I'd like to book *{name}*. Is it available for these dates: ___?",
  },
};

const fr: Dictionary = {
  meta: {
    title: "Location d'appartements et de maisons",
    description: "Appartements et maisons pour vos vacances. Réservation facile sur WhatsApp.",
  },
  nav: { properties: "Logements", howToBook: "Réserver", contact: "Contact", language: "Langue" },
  hero: {
    title: "Votre maison loin de chez vous",
    tagline: "Bienvenue à Monte y Cielo, où le confort a un air de chez-soi et chaque séjour devient une petite escapade.",
    cta: "Voir les logements",
    whatsapp: "Écrivez-nous sur WhatsApp",
  },
  properties: {
    title: "Nos logements",
    subtitle: "3 appartements et 1 maison. Touchez une carte pour voir les photos et les détails.",
    guests: "voyageurs",
    bedrooms: "chambres",
    bedroomsShort: "ch.",
    bathrooms: "salles de bain",
    photos: "photos",
    details: "Voir les détails",
    book: "Réserver ici",
    amenities: "Équipements",
    rules: "Conditions",
    map: "Voir l'emplacement",
    noPhotos: "Photos bientôt disponibles",
    close: "Fermer",
    prev: "Précédente",
    next: "Suivante",
  },
  steps: {
    title: "Comment réserver",
    items: [
      { title: "Choisissez", text: "Regardez les photos et la description du logement qui vous plaît." },
      { title: "Touchez « Réserver ici »", text: "WhatsApp s'ouvre avec un message prêt à envoyer." },
      { title: "Confirmez", text: "Nous répondons avec la disponibilité, le prix et le mode de paiement." },
    ],
  },
  contact: { title: "Des questions ?", text: "Écrivez-nous ou appelez-nous, nous serons ravis de vous aider." },
  footer: { rights: "Tous droits réservés." },
  whatsapp: {
    general: "Bonjour, je souhaite des informations sur les logements disponibles.",
    property: "Bonjour, je souhaite réserver *{name}*. Est-il disponible pour ces dates : ___ ?",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
