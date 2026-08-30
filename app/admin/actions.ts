"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_PATH,
  ADMIN_SESSION_MAX_AGE,
  isValidAdminToken,
  sessionValue,
} from "@/lib/admin-auth";

// 5 intentos / 15 min por IP. Misma respuesta genérica que un token incorrecto,
// para no revelar si el bloqueo fue por límite o por credencial. Ver la
// limitación del contador en memoria en lib/rate-limit.ts.
const LOGIN_RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function loginAction(formData: FormData) {
  const rl = rateLimit(
    `admin-login:${getClientIp(await headers())}`,
    LOGIN_RATE_LIMIT,
  );
  if (!rl.ok) {
    redirect("/admin/login?error=1");
  }

  const token = formData.get("token");
  const value = sessionValue();

  if (typeof token !== "string" || !isValidAdminToken(token) || !value) {
    redirect("/admin/login?error=1");
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: ADMIN_COOKIE_PATH,
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  redirect("/admin/messages");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: ADMIN_COOKIE_PATH });
  redirect("/admin/login");
}
