"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePhotoAction, reorderPhotosAction } from "@/app/admin/actions";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

interface AdminPhoto {
  id: string;
  thumb: string;
  full: string;
}

interface Props {
  propertyId: string;
  name: string;
  photos: AdminPhoto[];
}

export function PhotoManager({ propertyId, name, photos }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const busy = pending || progress !== null;

  // Uploads one file per request so large batches never hit body size limits.
  async function upload(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    const failed: string[] = [];
    setErrors([]);
    setProgress({ done: 0, total: files.length });

    for (const [i, file] of files.entries()) {
      if (!file.type.startsWith("image/")) {
        failed.push(`${file.name}: no es una imagen.`);
      } else if (file.size > MAX_UPLOAD_BYTES) {
        failed.push(`${file.name}: pesa más de 15 MB.`);
      } else {
        const body = new FormData();
        body.append("propertyId", propertyId);
        body.append("file", file);
        try {
          const response = await fetch("/api/admin/photos", { method: "POST", body });
          if (response.status === 401) {
            router.push("/admin/login");
            return;
          }
          if (!response.ok) {
            const data = (await response.json().catch(() => null)) as { error?: string } | null;
            failed.push(`${file.name}: ${data?.error ?? "no se pudo subir."}`);
          }
        } catch {
          failed.push(`${file.name}: error de conexión.`);
        }
      }
      setProgress({ done: i + 1, total: files.length });
    }

    setProgress(null);
    setErrors(failed);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  function run(action: () => Promise<void>) {
    setErrors([]);
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        setErrors([error instanceof Error ? error.message : "Ocurrió un error."]);
      }
    });
  }

  function move(from: number, to: number) {
    const ids = photos.map((photo) => photo.id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    run(() => reorderPhotosAction(propertyId, ids));
  }

  function remove(photoId: string) {
    if (confirm("¿Eliminar esta foto? Esta acción no se puede deshacer.")) {
      run(() => deletePhotoAction(propertyId, photoId));
    }
  }

  return (
    <section className={`property${busy ? " busy" : ""}`}>
      <header>
        <h2>{name}</h2>
        <span className="count">{photos.length} {photos.length === 1 ? "foto" : "fotos"}</span>
      </header>

      <label
        className={`dropzone${dragging ? " dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!busy) upload(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={busy}
          onChange={(event) => upload(event.target.files)}
        />
        {progress ? (
          <span>Subiendo {progress.done} de {progress.total}…</span>
        ) : (
          <span>
            <strong>📤 Subir fotos</strong> — haz clic o arrastra las imágenes aquí
          </span>
        )}
      </label>

      {errors.length > 0 && (
        <ul className="errors" role="alert">
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      {photos.length === 0 ? (
        <p className="empty">Todavía no hay fotos. En el sitio se mostrará “Fotos próximamente”.</p>
      ) : (
        <ol className="photos">
          {photos.map((photo, i) => (
            <li key={photo.id}>
              <a href={photo.full} target="_blank" rel="noopener" title="Ver en tamaño completo">
                {/* eslint-disable-next-line @next/next/no-img-element -- thumbnails generated on upload */}
                <img src={photo.thumb} alt={`${name} — foto ${i + 1}`} loading="lazy" />
              </a>
              {i === 0 && <span className="cover">Portada</span>}
              <div className="tools">
                <button onClick={() => move(i, i - 1)} disabled={busy || i === 0} title="Mover a la izquierda" aria-label="Mover a la izquierda">←</button>
                <button onClick={() => move(i, i + 1)} disabled={busy || i === photos.length - 1} title="Mover a la derecha" aria-label="Mover a la derecha">→</button>
                <button onClick={() => move(i, 0)} disabled={busy || i === 0} title="Usar como portada" aria-label="Usar como portada">★</button>
                <button className="danger" onClick={() => remove(photo.id)} disabled={busy} title="Eliminar" aria-label="Eliminar">🗑</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
