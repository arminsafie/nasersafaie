import { NextResponse } from "next/server";
import { readContent } from "@/lib/content-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}
