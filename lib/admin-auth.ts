import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Sesión de administración basada en cookie httpOnly.
//
// El valor de la cookie NO es el token: es un HMAC derivado de
// CONTACT_ADMIN_TOKEN, así una cookie filtrada no revela el secreto y rotar
// el token invalida todas las sesiones. Todas las comparaciones son en
// tiempo constante.

export const ADMIN_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas
export const ADMIN_COOKIE_PATH = "/admin";

function secret(): string | null {
  const s = process.env.CONTACT_ADMIN_TOKEN;
  return s && s.length > 0 ? s : null;
}

function safeEqual(a: string, b: string): boolean {
  // Hashear ambos lados iguala longitudes (requisito de timingSafeEqual) sin
  // filtrar la longitud del secreto.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function isValidAdminToken(token: string | null | undefined): boolean {
  const s = secret();
  if (!s || !token) return false;
  return safeEqual(token, s);
}

export function sessionValue(): string | null {
  const s = secret();
  if (!s) return null;
  return createHmac("sha256", s).update("admin-session-v1").digest("hex");
}

export function isValidSession(value: string | null | undefined): boolean {
  const expected = sessionValue();
  if (!expected || !value) return false;
  return safeEqual(value, expected);
}
