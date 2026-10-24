"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import { deletePhoto, PHOTOS_TAG, reorderPhotos } from "@/lib/photos";
import { isPropertyId, type PropertyId, type PropertyText } from "@/content/properties";
import { locales, type Locale } from "@/i18n/config";
import { PROPERTIES_TAG, saveProperty } from "@/lib/properties";

export interface LoginState {
  error: string | null;
}

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Contraseña incorrecta." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

async function assertAdmin(propertyId: string): Promise<void> {
  if (!(await isAuthenticated())) throw new Error("Tu sesión expiró. Vuelve a iniciar sesión.");
  if (!isPropertyId(propertyId)) throw new Error("Alojamiento desconocido.");
}

export async function deletePhotoAction(propertyId: string, photoId: string): Promise<void> {
  await assertAdmin(propertyId);
  await deletePhoto(propertyId as Parameters<typeof deletePhoto>[0], photoId);
  updateTag(PHOTOS_TAG);
  refresh();
}

export async function reorderPhotosAction(propertyId: string, orderedIds: string[]): Promise<void> {
  await assertAdmin(propertyId);
  await reorderPhotos(propertyId as Parameters<typeof reorderPhotos>[0], orderedIds);
  updateTag(PHOTOS_TAG);
  refresh();
}

export interface DetailsState {
  status: "idle" | "saved" | "error";
  message: string | null;
}

const LANGUAGE_NAMES: Record<Locale, string> = { es: "español", en: "inglés", fr: "francés" };

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 40);
}

function text(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function count(formData: FormData, field: string, label: string, min: number, max: number): number {
  const value = Number(formData.get(field));
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label}: escribe un número entre ${min} y ${max}.`);
  }
  return value;
}

export async function saveDetailsAction(propertyId: string, _previous: DetailsState, formData: FormData): Promise<DetailsState> {
  try {
    await assertAdmin(propertyId);
    const textByLocale = {} as Record<Locale, PropertyText>;
    for (const locale of locales) {
      const field = (name: string) => formData.get(`${locale}.${name}`);
      const entry: PropertyText = {
        type: text(field("type"), 60),
        name: text(field("name"), 80),
        summary: text(field("summary"), 300),
        description: text(field("description"), 3000),
        price: text(field("price"), 80),
        amenities: lines(field("amenities")),
        rules: lines(field("rules")),
      };
      if (!entry.name) throw new Error(`Falta el nombre en ${LANGUAGE_NAMES[locale]}.`);
      textByLocale[locale] = entry;
    }
    await saveProperty(propertyId as PropertyId, {
      guests: count(formData, "guests", "Huéspedes", 1, 50),
      bedrooms: count(formData, "bedrooms", "Habitaciones", 0, 30),
      bathrooms: count(formData, "bathrooms", "Baños", 0, 30),
      text: textByLocale,
    });
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "No se pudo guardar." };
  }
  updateTag(PROPERTIES_TAG);
  refresh();
  return { status: "saved", message: "Cambios guardados. Ya se ven en el sitio." };
}
