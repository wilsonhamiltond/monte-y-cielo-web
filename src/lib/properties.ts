import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { PROPERTIES, type Property, type PropertyId, type PropertyText } from "@/content/properties";
import { locales, type Locale } from "@/i18n/config";
import { STORAGE_DIR } from "./photos";

/**
 * Property details edited from /admin, saved to STORAGE_DIR/properties.json.
 * Each saved property replaces its defaults from src/content/properties.ts;
 * fields missing from the file (e.g. added in a later version) keep the default.
 */
export type PropertyDetails = Omit<Property, "id">;
type StoredDetails = Partial<Record<PropertyId, Partial<PropertyDetails>>>;

export const PROPERTIES_TAG = "properties";
const DETAILS_FILE = path.join(STORAGE_DIR, "properties.json");

async function readStored(): Promise<StoredDetails> {
  try {
    return JSON.parse(await fs.readFile(DETAILS_FILE, "utf8")) as StoredDetails;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }
}

function merge(stored: StoredDetails): Property[] {
  return PROPERTIES.map((property) => {
    const saved = stored[property.id] ?? {};
    const text = Object.fromEntries(
      locales.map((locale) => [locale, { ...property.text[locale], ...saved.text?.[locale] }]),
    ) as Record<Locale, PropertyText>;
    return {
      id: property.id,
      guests: saved.guests ?? property.guests,
      bedrooms: saved.bedrooms ?? property.bedrooms,
      bathrooms: saved.bathrooms ?? property.bathrooms,
      mapUrl: saved.mapUrl ?? property.mapUrl,
      text,
    };
  });
}

/** Cached read used by the public pages; invalidated with the PROPERTIES_TAG tag. */
export async function getProperties(): Promise<Property[]> {
  "use cache";
  cacheTag(PROPERTIES_TAG);
  cacheLife("max");
  return merge(await readStored());
}

/** Uncached read for the admin panel. */
export async function getPropertiesFresh(): Promise<Property[]> {
  return merge(await readStored());
}

// Writes run one at a time so two saves can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

export function saveProperty(id: PropertyId, details: PropertyDetails): Promise<void> {
  const run = queue.then(async () => {
    const stored = await readStored();
    stored[id] = details;
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    const tmp = `${DETAILS_FILE}.${randomUUID()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(stored, null, 2));
    await fs.rename(tmp, DETAILS_FILE);
  });
  queue = run.catch(() => undefined);
  return run;
}
