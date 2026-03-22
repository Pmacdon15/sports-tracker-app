import { NextResponse } from "next/server";
import { getCompletedRentalsPaginated } from "@/dal/transactions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("query") || undefined;
  const date = searchParams.get("date") || undefined;

  const { data, error } = await getCompletedRentalsPaginated(page, limit, search, date);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
