import type { WithId } from "mongodb";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, isValidSession } from "@/lib/admin-auth";
import { connectToDatabase } from "@/lib/mongodb";
import { logoutAction } from "../actions";

// Página de servidor: sin cookie de sesión válida responde 404, como si no
// existiera. El login está en /admin/login.
export const dynamic = "force-dynamic";

type ContactDoc = {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  read?: boolean;
};

const MAX_MESSAGES = 200;

export default async function MessagesPage() {
  const store = await cookies();
  if (!isValidSession(store.get(ADMIN_COOKIE)?.value)) {
    notFound();
  }

  let messages: WithId<ContactDoc>[] = [];
  let dbError = false;
  try {
    const { db } = await connectToDatabase();
    messages = await db
      .collection<ContactDoc>("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .limit(MAX_MESSAGES)
      .toArray();
  } catch (err) {
    console.error("Error al leer mensajes:", err);
    dbError = true;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Mensajes recibidos</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="
              px-4 py-2 rounded-full text-sm
              border border-slate-300 dark:border-slate-700
              hover:bg-slate-100/70 dark:hover:bg-slate-800/70
              transition-colors
            "
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      {dbError ? (
        <p role="alert" className="text-sm text-red-500">
          No se pudieron leer los mensajes (error de base de datos).
        </p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-slate-500">No hay mensajes todavía.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article
              key={m._id.toString()}
              className="
                rounded-2xl p-4
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-sm
              "
            >
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-slate-500">{m.email}</p>
              <p className="text-sm mt-2 whitespace-pre-wrap break-words">{m.message}</p>
              <p className="text-[11px] text-slate-500 mt-3">
                {new Date(m.createdAt).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
