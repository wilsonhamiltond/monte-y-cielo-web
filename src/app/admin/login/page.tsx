import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}

async function Login() {
  if (await isAuthenticated()) redirect("/admin");
  return (
    <main className="login">
      <LoginForm />
    </main>
  );
}
