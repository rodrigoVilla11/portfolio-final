"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_PATH,
  ADMIN_SESSION_MAX_AGE,
  isValidAdminToken,
  sessionValue,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
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
