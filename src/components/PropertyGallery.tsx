"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface PhotoView {
  full: string;
  thumb: string;
}

export interface PropertyView {
  id: string;
  type: string;
  name: string;
  summary: string;
  description: string;
  price: string;
  amenities: string[];
  rules: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  mapUrl?: string;
  photos: PhotoView[];
  bookUrl: string;
}

interface Props {
  properties: PropertyView[];
  labels: Dictionary["properties"];
}

export function PropertyGallery({ properties, labels }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const current = properties.find((property) => property.id === openId) ?? null;
  const photoCount = current?.photos.length ?? 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
    document.body.classList.toggle("no-scroll", !!current);
  }, [current]);

  function step(delta: number) {
    if (photoCount) setIndex((i) => (i + delta + photoCount) % photoCount);
  }

  useEffect(() => {
    if (!current) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function open(id: string) {
    setIndex(0);
    setOpenId(id);
  }

  return (
    <>
      <div className="doors">
        {properties.map((property) => (
          <article className="door" key={property.id}>
            <button className="door-arch" onClick={() => open(property.id)} aria-label={`${labels.details}: ${property.name}`}>
              {property.photos.length ? (
                // eslint-disable-next-line @next/next/no-img-element -- photos are resized to WebP on upload
                <img src={property.photos[0].thumb} alt={property.name} loading="lazy" />
              ) : (
                <span className="shutters">
                  <span className="shutters-note">{labels.noPhotos}</span>
                </span>
              )}
              {property.photos.length > 0 && (
                <span className="photo-count">{property.photos.length} {labels.photos}</span>
              )}
            </button>
            <div className="door-body">
              <p className="plaque">{property.type}</p>
              <h3>{property.name}</h3>
              <p className="summary">{property.summary}</p>
              <Specs property={property} labels={labels} bedrooms={labels.bedroomsShort} />
              <p className="price">{property.price}</p>
              <div className="door-actions">
                <button className="btn btn-quiet" onClick={() => open(property.id)}>{labels.details}</button>
                <a className="btn btn-wa" href={property.bookUrl} target="_blank" rel="noopener">
                  <WhatsAppIcon size={18} />
                  {labels.book}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="modal"
        aria-label={current?.name}
        onClose={() => setOpenId(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {current && (
          <div className="modal-box">
            <button className="m-close" onClick={() => dialogRef.current?.close()} aria-label={labels.close}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
            <div className="gallery">
              <div
                className="g-stage"
                onTouchStart={(event) => (touchStart.current = event.touches[0].clientX)}
                onTouchEnd={(event) => {
                  if (touchStart.current === null) return;
                  const dx = event.changedTouches[0].clientX - touchStart.current;
                  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
                  touchStart.current = null;
                }}
              >
                {photoCount ? (
                  // eslint-disable-next-line @next/next/no-img-element -- photos are resized to WebP on upload
                  <img src={current.photos[index].full} alt={`${current.name} — ${index + 1}`} />
                ) : (
                  <span className="shutters">
                    <span className="shutters-note">{labels.noPhotos}</span>
                  </span>
                )}
                {photoCount > 1 && (
                  <>
                    <button className="g-nav prev" onClick={() => step(-1)} aria-label={labels.prev}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    <button className="g-nav next" onClick={() => step(1)} aria-label={labels.next}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    <span className="g-counter">{index + 1} / {photoCount}</span>
                  </>
                )}
              </div>
              {photoCount > 1 && (
                <div className="g-thumbs">
                  {current.photos.map((photo, i) => (
                    <button key={photo.thumb} className={i === index ? "active" : undefined} onClick={() => setIndex(i)} aria-label={`${i + 1}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- photos are resized to WebP on upload */}
                      <img src={photo.thumb} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="m-body">
              <p className="plaque">{current.type}</p>
              <h2>{current.name}</h2>
              <Specs property={current} labels={labels} bedrooms={labels.bedrooms} />
              {current.mapUrl && (
                <a className="map-link" href={current.mapUrl} target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  {labels.map}
                </a>
              )}
              <p>{current.description}</p>
              <h3>{labels.amenities}</h3>
              <ul className="amenities">
                {current.amenities.map((amenity, i) => <li key={i}>{amenity}</li>)}
              </ul>
              {current.rules.length > 0 && (
                <>
                  <h3>{labels.rules}</h3>
                  <ul className="rules">
                    {current.rules.map((rule, i) => <li key={i}>{rule}</li>)}
                  </ul>
                </>
              )}
              <div className="m-footer">
                <p className="price">{current.price}</p>
                <a className="btn btn-wa btn-lg" href={current.bookUrl} target="_blank" rel="noopener">
                  <WhatsAppIcon size={22} />
                  {labels.book}
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Specs({ property, labels, bedrooms }: { property: PropertyView; labels: Props["labels"]; bedrooms: string }) {
  return (
    <ul className="specs">
      <li><b>{property.guests}</b> {labels.guests}</li>
      <li><b>{property.bedrooms}</b> {bedrooms}</li>
      <li><b>{property.bathrooms}</b> {labels.bathrooms}</li>
    </ul>
  );
}
