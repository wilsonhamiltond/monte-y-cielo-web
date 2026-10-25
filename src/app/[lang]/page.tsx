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

  // The banner uses SITE.heroImage, or else the last property's cover photo.
  const heroPhoto =
    SITE.heroImage ?? [...properties].reverse().find((property) => property.photos.length)?.photos[0].full;
  const heroSrcSet = SITE.heroImage ? SITE.heroSrcSet : undefined;
  const heroMobileSrcSet = SITE.heroImage ? SITE.heroMobileSrcSet : undefined;

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
        <div className="hero-banner">
          {heroPhoto ? (
            <picture>
              {heroMobileSrcSet && <source media="(max-width: 760px)" srcSet={heroMobileSrcSet} sizes="100vw" />}
              <img src={heroPhoto} srcSet={heroSrcSet} sizes="100vw" alt="" fetchPriority="high" />
            </picture>
          ) : (
            <span className="shutters" />
          )}
          <p className="hero-brand">
            <MountainCloudMark />
            <span className="hero-brand-name">
              Monte <em>y</em> Cielo
            </span>
          </p>
        </div>
        <div className="container hero-info">
          <h1>{t.hero.title}</h1>
          <div>
            <p className="hero-tagline">{t.hero.tagline}</p>
            <p className="hero-loc">
              <PinIcon />
              {SITE.location}
            </p>
            <div className="hero-actions">
              <a href="#alojamientos" className="btn btn-ocre">{t.hero.cta}</a>
              <a href={generalWhatsApp} className="btn btn-wa" target="_blank" rel="noopener">
                <WhatsAppIcon size={20} />
                {t.hero.whatsapp}
              </a>
            </div>
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

/** Line drawing of a mountain range and a cloud, above the wordmark on the banner. */
function MountainCloudMark() {
  return (
    <svg className="hero-mark" viewBox="0 0 132 40" width="132" height="40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 37 30 9l10 11 9-9 25 26" />
        <path d="M24 17l6 4 5-3" />
        <path d="M86 35h33a8 8 0 0 0 0-16 11 11 0 0 0-21-3 8 8 0 0 0-12 7 6 6 0 0 0 0 12z" />
      </g>
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
