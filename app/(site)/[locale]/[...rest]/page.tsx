import { notFound } from "next/navigation";

// Toda ruta no definida bajo un idioma cae acá y renderiza el not-found de ese
// idioma (los not-found anidados no atrapan URLs sin página; un catch-all sí).
export default function CatchAllPage() {
  notFound();
}
