import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos" },
        { status: 400 },
      );
    }

    const { db } = await connectToDatabase();

    await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error al guardar contacto:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 },
    );
  }
}
