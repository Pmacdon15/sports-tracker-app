import { NextResponse } from "next/server";
import { getGuestStats } from "@/dal/guests";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
  const search = searchParams.get("query") || undefined;

  const { data, error } = await getGuestStats(page, limit, search);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
