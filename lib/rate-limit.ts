// Rate limit en memoria, por clave (normalmente la IP del cliente).
//
// LIMITACIÓN CONOCIDA: este proyecto no tiene Redis/KV configurado (no hay
// deps de Upstash/@vercel/kv ni variables de entorno). En Vercel cada
// instancia serverless tiene su propia memoria y se descarta tras un rato de
// inactividad, así que el contador:
//   - no se comparte entre instancias concurrentes,
//   - se pierde en cada arranque en frío.
// Sirve para frenar ráfagas contra una misma instancia caliente, pero no es
// un límite global. Para un límite real hay que reemplazar el Map por un
// store compartido (p. ej. Upstash Redis con INCR + EXPIRE) manteniendo la
// misma firma de `rateLimit`.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_TRACKED_KEYS = 1000;

export type RateLimitOptions = { limit: number; windowMs: number };
export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  // Limpieza perezosa para que el Map no crezca sin límite.
  if (buckets.size >= MAX_TRACKED_KEYS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }

  if (bucket.count >= opts.limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

// En Vercel `x-forwarded-for` lo setea la plataforma (el primer valor es el
// cliente). Fuera de Vercel puede venir falsificado; es el mejor dato
// disponible sin infraestructura adicional.
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
