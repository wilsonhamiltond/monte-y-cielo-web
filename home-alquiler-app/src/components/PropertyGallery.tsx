"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

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
  guests: number;
  bedrooms: number;
  bathrooms: number;
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
      <div className="grid">
        {properties.map((property) => (
          <article className="card" key={property.id}>
            <button className="card-media" onClick={() => open(property.id)} aria-label={`${labels.details}: ${property.name}`}>
              {property.photos.length ? (
                // eslint-disable-next-line @next/next/no-img-element -- photos are resized to WebP on upload
                <img src={property.photos[0].thumb} alt={property.name} loading="lazy" />
              ) : (
                <span className="no-photo">{labels.noPhotos}</span>
              )}
              <span className="badge">{property.type}</span>
              {property.photos.length > 0 && (
                <span className="photo-count">📷 {property.photos.length} {labels.photos}</span>
              )}
            </button>
            <div className="card-body">
              <h3>{property.name}</h3>
              <p className="summary">{property.summary}</p>
              <ul className="specs">
                <li>👥 {property.guests} {labels.guests}</li>
                <li>🛏️ {property.bedrooms} {labels.bedroomsShort}</li>
                <li>🛁 {property.bathrooms} {labels.bathrooms}</li>
              </ul>
              <p className="price">{property.price}</p>
              <div className="card-actions">
                <button className="btn btn-ghost" onClick={() => open(property.id)}>{labels.details}</button>
                <a className="btn btn-wa" href={property.bookUrl} target="_blank" rel="noopener">{labels.book}</a>
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
            <button className="m-close" onClick={() => dialogRef.current?.close()} aria-label={labels.close}>✕</button>
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
                  <span className="no-photo">{labels.noPhotos}</span>
                )}
                {photoCount > 1 && (
                  <>
                    <button className="g-nav prev" onClick={() => step(-1)} aria-label={labels.prev}>‹</button>
                    <button className="g-nav next" onClick={() => step(1)} aria-label={labels.next}>›</button>
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
              <span className="badge static">{current.type}</span>
              <h2>{current.name}</h2>
              <ul className="specs">
                <li>👥 {current.guests} {labels.guests}</li>
                <li>🛏️ {current.bedrooms} {labels.bedrooms}</li>
                <li>🛁 {current.bathrooms} {labels.bathrooms}</li>
              </ul>
              <p>{current.description}</p>
              <h3>{labels.amenities}</h3>
              <ul className="amenities">
                {current.amenities.map((amenity) => <li key={amenity}>✓ {amenity}</li>)}
              </ul>
              <div className="m-footer">
                <p className="price">{current.price}</p>
                <a className="btn btn-wa btn-lg" href={current.bookUrl} target="_blank" rel="noopener">{labels.book}</a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
