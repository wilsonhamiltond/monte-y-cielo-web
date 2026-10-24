import { revalidateTag } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { addPhoto, MAX_UPLOAD_BYTES, PHOTOS_TAG } from "@/lib/photos";
import { isPropertyId } from "@/content/properties";

const error = (message: string, status: number) => Response.json({ error: message }, { status });

/** Uploads one photo: multipart form with `propertyId` and `file`. */
export async function POST(request: Request) {
  if (!(await isAuthenticated())) return error("Tu sesión expiró.", 401);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES + 1024 * 1024) return error("La foto pesa más de 15 MB.", 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return error("Solicitud inválida.", 400);
  }

  const propertyId = form.get("propertyId");
  const file = form.get("file");
  if (!isPropertyId(propertyId)) return error("Alojamiento desconocido.", 400);
  if (!(file instanceof File)) return error("No se recibió ninguna foto.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return error("La foto pesa más de 15 MB.", 413);
  if (!file.type.startsWith("image/")) return error("El archivo no es una imagen.", 415);

  try {
    const photo = await addPhoto(propertyId, Buffer.from(await file.arrayBuffer()));
    revalidateTag(PHOTOS_TAG, { expire: 0 });
    return Response.json({ photo }, { status: 201 });
  } catch (cause) {
    console.error(`Photo upload failed (${propertyId}, ${file.name}):`, cause);
    return error("No se pudo procesar la imagen. Usa JPG, PNG o WebP.", 422);
  }
}
