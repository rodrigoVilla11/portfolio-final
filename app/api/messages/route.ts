import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const ADMIN_TOKEN = process.env.CONTACT_ADMIN_TOKEN;

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("Authorization");
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token || token !== ADMIN_TOKEN) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    const messages = await db
      .collection("contacts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      messages,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
