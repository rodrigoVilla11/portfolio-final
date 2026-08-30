import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// 5 envíos cada 15 minutos por IP. Ver lib/rate-limit.ts: el contador vive en
// memoria de la instancia, no es un límite global en Vercel.
const RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

// Campo trampa: oculto por CSS en el formulario. Un humano nunca lo completa.
const HONEYPOT_FIELD = "website";

// Los mensajes de error son códigos estables; el cliente los traduce
// (contactPage.formErrors.<código> en app/translate/*.json).
const ContactSchema = z.object({
  name: z
    .string({ error: "name_invalid" })
    .trim()
    .min(2, "name_min")
    .max(80, "name_max"),
  email: z
    .string({ error: "email_invalid" })
    .trim()
    .max(254, "email_max")
    .pipe(z.email("email_invalid")),
  message: z
    .string({ error: "message_invalid" })
    .trim()
    .min(20, "message_min")
    .max(5000, "message_max"),
});

type Field = keyof z.infer<typeof ContactSchema>;
const FIELDS: Field[] = ["name", "email", "message"];
const KNOWN_CODES = new Set([
  "name_min",
  "name_max",
  "name_invalid",
  "email_invalid",
  "email_max",
  "message_min",
  "message_max",
  "message_invalid",
]);

function toFieldErrors(error: z.ZodError): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string" || !FIELDS.includes(field as Field)) continue;
    const f = field as Field;
    if (errors[f]) continue; // primer error por campo
    errors[f] = KNOWN_CODES.has(issue.message) ? issue.message : `${f}_invalid`;
  }
  return errors;
}

export async function POST(req: Request) {
  const rl = rateLimit(`contact:${getClientIp(req)}`, RATE_LIMIT);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", retryAfter: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: si viene relleno es un bot. Respondemos como si todo hubiera
  // salido bien y descartamos el mensaje; un error explícito invita a reintentar.
  const honeypot = (body as Record<string, unknown>)[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", errors: toFieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection("contacts").insertOne({
      ...parsed.data,
      createdAt: new Date(),
      read: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error al guardar contacto:", err);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
