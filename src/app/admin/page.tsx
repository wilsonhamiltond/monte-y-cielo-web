import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getPhotoIndexFresh, photoUrl } from "@/lib/photos";
import { getPropertiesFresh } from "@/lib/properties";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { PropertyEditor } from "@/components/admin/PropertyEditor";
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
  const [index, properties] = await Promise.all([getPhotoIndexFresh(), getPropertiesFresh()]);

  return (
    <>
      <header className="admin-bar">
        <strong>🏠 Administración</strong>
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
          Las fotos se optimizan automáticamente. Abre “Información y condiciones” para cambiar los textos,
          precios, comodidades y condiciones de cada alojamiento.
        </p>
        {properties.map((property) => (
          <div key={property.id} className="property-group">
            <PhotoManager
              propertyId={property.id}
              name={property.text.es.name}
              photos={(index[property.id] ?? []).map((photo) => ({
                id: photo.id,
                thumb: photoUrl(property.id, photo, "thumb"),
                full: photoUrl(property.id, photo, "full"),
              }))}
            />
            <PropertyEditor property={property} />
          </div>
        ))}
      </main>
    </>
  );
}
