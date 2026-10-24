import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { cacheLife, cacheTag } from "next/cache";
import { isPropertyId, type PropertyId } from "@/content/properties";

/**
 * Photo storage on the local disk:
 *   STORAGE_DIR/photos.json                       ordered photo list per property
 *   STORAGE_DIR/uploads/<property>/<id>.webp       full size (max 2000px)
 *   STORAGE_DIR/uploads/<property>/<id>_thumb.webp thumbnail (max 600px)
 */
export interface Photo {
  id: string;
  width: number;
  height: number;
  createdAt: string;
}

export type PhotoIndex = Partial<Record<PropertyId, Photo[]>>;

export const PHOTOS_TAG = "photos";
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

// Runtime data directory, not part of the build output.
const STORAGE_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.STORAGE_DIR ?? path.join(process.cwd(), "storage"));
const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");
const INDEX_FILE = path.join(STORAGE_DIR, "photos.json");
const FULL_SIZE = 2000;
const THUMB_SIZE = 600;
const FILE_NAME = /^[0-9a-f-]{36}(_thumb)?\.webp$/;

async function readIndex(): Promise<PhotoIndex> {
  try {
    return JSON.parse(await fs.readFile(INDEX_FILE, "utf8")) as PhotoIndex;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

async function writeIndex(index: PhotoIndex): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const tmp = `${INDEX_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(index, null, 2));
  await fs.rename(tmp, INDEX_FILE);
}

// Index writes run one at a time so parallel uploads can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function mutateIndex<T>(fn: (index: PhotoIndex) => T): Promise<T> {
  const run = queue.then(async () => {
    const index = await readIndex();
    const result = fn(index);
    await writeIndex(index);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

/** Cached read used by the public pages; invalidated with the PHOTOS_TAG tag. */
export async function getPhotoIndex(): Promise<PhotoIndex> {
  "use cache";
  cacheTag(PHOTOS_TAG);
  cacheLife("max");
  return readIndex();
}

/** Uncached read for the admin panel. */
export async function getPhotoIndexFresh(): Promise<PhotoIndex> {
  return readIndex();
}

export function photoUrl(propertyId: PropertyId, photo: Photo, variant: "full" | "thumb"): string {
  return `/uploads/${propertyId}/${photo.id}${variant === "thumb" ? "_thumb" : ""}.webp`;
}

function photoFiles(propertyId: PropertyId, id: string): string[] {
  const dir = path.join(UPLOADS_DIR, propertyId);
  return [path.join(dir, `${id}.webp`), path.join(dir, `${id}_thumb.webp`)];
}

/** Resizes, strips metadata, converts to WebP and appends the photo to the property. */
export async function addPhoto(propertyId: PropertyId, input: Buffer): Promise<Photo> {
  const id = randomUUID();
  const [fullPath, thumbPath] = photoFiles(propertyId, id);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  try {
    // Encode to memory and write with fs: sharp's own file writer can't handle
    // Windows paths longer than 260 characters.
    const image = sharp(input, { failOn: "error" }).rotate();
    const full = await image
      .clone()
      .resize(FULL_SIZE, FULL_SIZE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const thumb = await image
      .clone()
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();
    await fs.writeFile(fullPath, full.data);
    await fs.writeFile(thumbPath, thumb);

    const photo: Photo = { id, width: full.info.width, height: full.info.height, createdAt: new Date().toISOString() };
    await mutateIndex((index) => {
      index[propertyId] = [...(index[propertyId] ?? []), photo];
    });
    return photo;
  } catch (error) {
    await Promise.all([fullPath, thumbPath].map((file) => fs.rm(file, { force: true })));
    throw error;
  }
}

export async function deletePhoto(propertyId: PropertyId, photoId: string): Promise<void> {
  const removed = await mutateIndex((index) => {
    const photos = index[propertyId] ?? [];
    index[propertyId] = photos.filter((photo) => photo.id !== photoId);
    return photos.length !== index[propertyId].length;
  });
  if (removed) {
    await Promise.all(photoFiles(propertyId, photoId).map((file) => fs.rm(file, { force: true })));
  }
}

/** Applies a new order; the ids must be exactly the property's current photos. */
export async function reorderPhotos(propertyId: PropertyId, orderedIds: string[]): Promise<void> {
  await mutateIndex((index) => {
    const photos = index[propertyId] ?? [];
    const byId = new Map(photos.map((photo) => [photo.id, photo]));
    if (orderedIds.length !== photos.length || !orderedIds.every((id) => byId.has(id))) {
      throw new Error("La lista de fotos cambió; recarga la página e intenta de nuevo.");
    }
    index[propertyId] = orderedIds.map((id) => byId.get(id)!);
  });
}

/** Maps a /uploads/<property>/<file> request to a file on disk, or null if invalid. */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.length !== 2) return null;
  const [propertyId, fileName] = segments;
  if (!isPropertyId(propertyId) || !FILE_NAME.test(fileName)) return null;
  return path.join(UPLOADS_DIR, propertyId, fileName);
}
