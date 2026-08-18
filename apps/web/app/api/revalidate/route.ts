import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
  const secret = req.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => {
    return null;
  });
  const resource =
    body && typeof body === "object"
      ? (body as { resource?: unknown }).resource
      : undefined;

  if (typeof resource !== "string" || !resource) {
    return NextResponse.json({ error: "resource required" }, { status: 400 });
  }

  revalidateTag(resource, { expire: 0 });

  return NextResponse.json({ ok: true });
};
