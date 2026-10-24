"use client";

import { useActionState, useState, useTransition } from "react";
import { saveDetailsAction, type DetailsState } from "@/app/admin/actions";
import type { Property } from "@/content/properties";
import { locales, localeLabels, type Locale } from "@/i18n/config";

const initialState: DetailsState = { status: "idle", message: null };

const LANGUAGE_NAMES: Record<Locale, string> = { es: "Español", en: "Inglés", fr: "Francés" };

export function PropertyEditor({ property }: { property: Property }) {
  const [state, formAction, pending] = useActionState(saveDetailsAction.bind(null, property.id), initialState);
  const [, startTransition] = useTransition();
  const [locale, setLocale] = useState<Locale>("es");

  return (
    <details className="property editor">
      <summary>✏️ Información y condiciones</summary>

      <form
        // Submitted by hand so a failed save keeps what the admin typed
        // (a form `action` resets the fields after every submit).
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          startTransition(() => formAction(formData));
        }}
      >
        <div className="numbers">
          <label>
            Huéspedes
            <input name="guests" type="number" min={1} max={50} defaultValue={property.guests} />
          </label>
          <label>
            Habitaciones
            <input name="bedrooms" type="number" min={0} max={30} defaultValue={property.bedrooms} />
          </label>
          <label>
            Baños
            <input name="bathrooms" type="number" min={0} max={30} defaultValue={property.bathrooms} />
          </label>
        </div>

        <div className="lang-tabs" role="tablist" aria-label="Idioma del texto">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={code === locale}
              className={code === locale ? "active" : undefined}
              onClick={() => setLocale(code)}
            >
              {localeLabels[code]} <span>{LANGUAGE_NAMES[code]}</span>
            </button>
          ))}
        </div>

        {locales.map((code) => {
          const text = property.text[code];
          return (
            <fieldset key={code} hidden={code !== locale}>
              <legend>Texto en {LANGUAGE_NAMES[code].toLowerCase()}</legend>
              <div className="pair">
                <label>
                  Nombre
                  <input name={`${code}.name`} defaultValue={text.name} maxLength={80} />
                </label>
                <label>
                  Tipo
                  <input name={`${code}.type`} defaultValue={text.type} maxLength={60} placeholder="Apartamento, Casa…" />
                </label>
              </div>
              <label>
                Resumen <small>(se ve en la tarjeta)</small>
                <input name={`${code}.summary`} defaultValue={text.summary} maxLength={300} />
              </label>
              <label>
                Descripción
                <textarea name={`${code}.description`} defaultValue={text.description} rows={4} maxLength={3000} />
              </label>
              <label>
                Precio
                <input name={`${code}.price`} defaultValue={text.price} maxLength={80} placeholder="Desde $000.000 / noche" />
              </label>
              <div className="pair">
                <label>
                  Comodidades <small>(una por línea)</small>
                  <textarea name={`${code}.amenities`} defaultValue={text.amenities.join("\n")} rows={7} />
                </label>
                <label>
                  Condiciones <small>(una por línea)</small>
                  <textarea
                    name={`${code}.rules`}
                    defaultValue={text.rules.join("\n")}
                    rows={7}
                    placeholder={"Check-in desde las 3:00 p. m.\nCheck-out hasta las 11:00 a. m.\nNo se permiten mascotas"}
                  />
                </label>
              </div>
            </fieldset>
          );
        })}

        <div className="editor-footer">
          {state.message && (
            <p className={state.status === "error" ? "form-error" : "form-ok"} role={state.status === "error" ? "alert" : "status"}>
              {state.message}
            </p>
          )}
          <button className="btn" disabled={pending}>{pending ? "Guardando…" : "Guardar cambios"}</button>
        </div>
      </form>
    </details>
  );
}
