import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { isLocale, localeLabels, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE, whatsappUrl } from "@/content/site";
import { getPhotoIndex, photoSrcSet, photoUrl } from "@/lib/photos";
import { getProperties } from "@/lib/properties";
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
  const [photoIndex, details] = await Promise.all([getPhotoIndex(), getProperties()]);
  const generalWhatsApp = whatsappUrl(t.whatsapp.general);

  const properties: PropertyView[] = details.map((property) => {
    const text = property.text[lang];
    return {
      id: property.id,
      ...text,
      guests: property.guests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      mapUrl: property.mapUrl,
      photos: (photoIndex[property.id] ?? []).map((photo) => ({
        full: photoUrl(property.id, photo, "full"),
        thumb: photoUrl(property.id, photo, "thumb"),
        small: photoUrl(property.id, photo, "small"),
        srcSet: photoSrcSet(property.id, photo),
      })),
      bookUrl: whatsappUrl(t.whatsapp.property.replace("{name}", text.name)),
    };
  });

  // The hero uses SITE.heroImage, or else the last property's cover photo.
  const heroPhoto =
    SITE.heroImage ?? [...properties].reverse().find((property) => property.photos.length)?.photos[0].full;
  const heroSrcSet = SITE.heroImage ? SITE.heroSrcSet : undefined;

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a href="#" className="logo">
            <ArchMark />
            {SITE.brandName}
          </a>
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

      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1>{t.hero.title}</h1>
            <p className="hero-tagline">{t.hero.tagline}</p>
            <p className="hero-loc">
              <PinIcon />
              {SITE.location}
            </p>
            <div className="hero-actions">
              <a href="#alojamientos" className="btn btn-ocre">{t.hero.cta}</a>
              <a href={generalWhatsApp} className="btn btn-line" target="_blank" rel="noopener">
                <WhatsAppIcon size={20} />
                {t.hero.whatsapp}
              </a>
            </div>
          </div>
          <div className="hero-arch">
            {heroPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element -- photos are resized to WebP on upload
              <img
                src={heroPhoto}
                srcSet={heroSrcSet}
                sizes="(max-width: 760px) calc(min(78vw, 340px) - 20px), 440px"
                alt=""
                fetchPriority="high"
              />
            ) : (
              <span className="shutters" />
            )}
          </div>
        </div>
      </section>

      <main>
        <section id="alojamientos" className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t.properties.title}</h2>
              <p>{t.properties.subtitle}</p>
            </div>
            <PropertyGallery properties={properties} labels={t.properties} />
          </div>
        </section>

        <section id="como-reservar" className="section section-steps">
          <div className="container">
            <div className="section-head">
              <h2>{t.steps.title}</h2>
            </div>
            <ol className="steps">
              {t.steps.items.map((step, i) => (
                <li key={step.title}>
                  <span className="step-num" aria-hidden="true">{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contacto" className="contact">
          <div className="container contact-inner">
            <div>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.text}</p>
            </div>
            <a href={generalWhatsApp} className="btn btn-wa btn-lg" target="_blank" rel="noopener">
              <WhatsAppIcon size={22} />
              +{SITE.whatsappNumber}
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

function ArchMark() {
  return (
    <svg viewBox="0 0 20 24" width="18" height="22" aria-hidden="true">
      <path d="M2 23V10a8 8 0 0 1 16 0v13" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
