import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getPhotoIndexFresh, photoUrl } from "@/lib/photos";
import { PROPERTIES } from "@/content/properties";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { logout } from "./actions";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="admin-loading">Cargando…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const index = await getPhotoIndexFresh();

  return (
    <>
      <header className="admin-bar">
        <strong>🏠 Administración de fotos</strong>
        <nav>
          <a href="/es" target="_blank" rel="noopener">Ver sitio ↗</a>
          <form action={logout}>
            <button className="link-button">Cerrar sesión</button>
          </form>
        </nav>
      </header>
      <main className="admin-main">
        <p className="hint">
          La primera foto de cada alojamiento es la portada. Formatos: JPG, PNG o WebP, hasta 15 MB por foto.
          Las fotos se optimizan automáticamente.
        </p>
        {PROPERTIES.map((property) => (
          <PhotoManager
            key={property.id}
            propertyId={property.id}
            name={property.text.es.name}
            photos={(index[property.id] ?? []).map((photo) => ({
              id: photo.id,
              thumb: photoUrl(property.id, photo, "thumb"),
              full: photoUrl(property.id, photo, "full"),
            }))}
          />
        ))}
      </main>
    </>
  );
}
