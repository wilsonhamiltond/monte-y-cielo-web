"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="login-card">
      <h1>🏠 Administración</h1>
      <p>Ingresa la contraseña para gestionar las fotos.</p>
      <label htmlFor="password">Contraseña</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      {state.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>
    </form>
  );
}
