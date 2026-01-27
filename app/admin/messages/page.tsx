"use client";

import { useState } from "react";

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read?: boolean;
};

export default function MessagesPage() {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/messages?token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error("Token inválido");
      }

      setMessages(data.messages);
    } catch (err) {
      setError("Token incorrecto o error en el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Mensajes recibidos
      </h1>

      {/* LOGIN */}
      {!messages && (
        <form onSubmit={handleLogin} className="space-y-4 max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Ingresá el token de administrador
          </p>

          <input
            type="password"
            className="
              w-full px-3 py-2 rounded-xl
              border border-slate-300 dark:border-slate-700
              bg-white dark:bg-slate-900
              text-sm
            "
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              px-4 py-2 rounded-full text-sm
              bg-slate-900 text-white
              dark:bg-slate-100 dark:text-slate-900
              hover:scale-[1.02]
              transition-all
            "
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </form>
      )}

      {/* LISTA DE MENSAJES */}
      {messages && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">
              No hay mensajes todavía.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m._id}
              className="
                rounded-2xl p-4
                border border-slate-200 dark:border-slate-800
                bg-white dark:bg-slate-900/80
                shadow-sm
              "
            >
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-slate-500">{m.email}</p>

              <p className="text-sm mt-2">
                {m.message}
              </p>

              <p className="text-[11px] text-slate-500 mt-3">
                {new Date(m.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
