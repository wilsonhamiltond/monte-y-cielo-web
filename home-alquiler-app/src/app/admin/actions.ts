"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import { deletePhoto, PHOTOS_TAG, reorderPhotos } from "@/lib/photos";
import { isPropertyId } from "@/content/properties";

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
