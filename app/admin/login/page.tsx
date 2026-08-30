import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const store = await cookies();
  if (isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/messages");
  }

  const { error } = await searchParams;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Acceso de administración</h1>

      <form action={loginAction} className="space-y-4 max-w-sm">
        <div className="space-y-1 text-sm">
          <label htmlFor="token" className="block text-slate-700 dark:text-slate-200">
            Token de administrador
          </label>
          <input
            id="token"
            name="token"
            type="password"
            required
            autoComplete="current-password"
            className="
              w-full px-3 py-2 rounded-xl
              border border-slate-300 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm
              outline-none
              focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500
            "
          />
        </div>

        <button
          type="submit"
          className="
            px-4 py-2 rounded-full text-sm
            bg-slate-900 text-white
            dark:bg-slate-100 dark:text-slate-900
            hover:scale-[1.02]
            transition-all
          "
        >
          Ingresar
        </button>

        {error ? (
          <p role="alert" className="text-sm text-red-500">
            Token incorrecto.
          </p>
        ) : null}
      </form>
    </main>
  );
}
