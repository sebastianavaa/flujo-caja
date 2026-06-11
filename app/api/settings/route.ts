import { NextResponse } from "next/server";
import { auth } from "@/auth";
import redis from "@/lib/redis";

function key(email: string) {
  return `flujo-caja:settings:${email}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

  const data = await redis.get(key(session.user.email));
  if (!data) return NextResponse.json(null);
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 });

  const body = await req.json();
  await redis.set(key(session.user.email), JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
