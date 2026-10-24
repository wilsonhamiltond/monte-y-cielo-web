import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { isLocale, localeLabels, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PROPERTIES } from "@/content/properties";
import { SITE, whatsappUrl } from "@/content/site";
import { getPhotoIndex, photoUrl } from "@/lib/photos";
import { PropertyGallery, type PropertyView } from "@/components/PropertyGallery";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const photoIndex = await getPhotoIndex();
  const generalWhatsApp = whatsappUrl(t.whatsapp.general);

  const properties: PropertyView[] = PROPERTIES.map((property) => {
    const text = property.text[lang];
    return {
      id: property.id,
      ...text,
      guests: property.guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      photos: (photoIndex[property.id] ?? []).map((photo) => ({
        full: photoUrl(property.id, photo, "full"),
        thumb: photoUrl(property.id, photo, "thumb"),
      })),
      bookUrl: whatsappUrl(t.whatsapp.property.replace("{name}", text.name)),
    };
  });

  // The hero uses the house's cover photo, or the first photo available.
  const heroPhoto = [...properties].reverse().find((property) => property.photos.length)?.photos[0];

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#" className="logo">🏠 {SITE.brandName}</a>
          <nav className="nav-links">
            <a href="#alojamientos">{t.nav.properties}</a>
            <a href="#como-reservar">{t.nav.howToBook}</a>
            <a href="#contacto">{t.nav.contact}</a>
          </nav>
          <div className="lang-switch" role="group" aria-label={t.nav.language}>
            {locales.map((locale) => (
              <Link key={locale} href={`/${locale}`} hrefLang={locale} aria-current={locale === lang ? "true" : undefined}>
                {localeLabels[locale]}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section
        className="hero"
        style={heroPhoto ? { backgroundImage: `linear-gradient(rgba(9,50,56,.55), rgba(9,50,56,.65)), url(${heroPhoto.full})` } : undefined}
      >
        <div className="container hero-inner">
          <h1>{t.hero.title}</h1>
          <p>{t.hero.tagline}</p>
          <p className="loc">📍 {SITE.location}</p>
          <div className="hero-actions">
            <a href="#alojamientos" className="btn btn-light">{t.hero.cta}</a>
            <a href={generalWhatsApp} className="btn btn-wa" target="_blank" rel="noopener">{t.hero.whatsapp}</a>
          </div>
        </div>
      </section>

      <main>
        <section id="alojamientos" className="section">
          <div className="container">
            <h2>{t.properties.title}</h2>
            <p className="section-sub">{t.properties.subtitle}</p>
            <PropertyGallery properties={properties} labels={t.properties} />
          </div>
        </section>

        <section id="como-reservar" className="section alt">
          <div className="container">
            <h2>{t.steps.title}</h2>
            <ol className="steps">
              {t.steps.items.map((step, i) => (
                <li key={step.title}>
                  <span>{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contacto" className="section">
          <div className="container contact">
            <h2>{t.contact.title}</h2>
            <p>{t.contact.text}</p>
            <a href={generalWhatsApp} className="btn btn-wa btn-lg" target="_blank" rel="noopener">
              💬 WhatsApp +{SITE.whatsappNumber}
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">© <CurrentYear /> {SITE.brandName}. {t.footer.rights}</div>
      </footer>

      <a href={generalWhatsApp} className="wa-float" target="_blank" rel="noopener" aria-label={t.hero.whatsapp}>
        <WhatsAppIcon />
      </a>
    </>
  );
}
