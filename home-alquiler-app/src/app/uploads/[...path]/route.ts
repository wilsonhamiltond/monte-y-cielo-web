import { promises as fs } from "node:fs";
import { resolveUploadPath } from "@/lib/photos";

/** Serves uploaded photos. File names are unique ids, so they can be cached forever. */
export async function GET(_request: Request, { params }: RouteContext<"/uploads/[...path]">) {
  const { path } = await params;
  const file = resolveUploadPath(path);
  if (!file) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
