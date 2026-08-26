import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readContent, writeContent } from "@/lib/content-server";
import { validateSiteContent } from "@/lib/content-validate";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE_NAME)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const content = await readContent();
  return NextResponse.json(content, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    validateSiteContent(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid content shape.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await writeContent(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
