import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">
        Project not found / Proyecto no encontrado
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        <Link
          href="/projects"
          className="underline underline-offset-4 text-indigo-600 dark:text-indigo-400 hover:opacity-80"
        >
          ← Back to projects
        </Link>
      </p>
    </main>
  );
}
