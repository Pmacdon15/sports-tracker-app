import { auth } from "@clerk/nextjs/server";
import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId, orgId } = await auth.protect();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    const blob = await get(url, { access: 'private' });

    if (!blob) {
      return new NextResponse("Blob not found", { status: 404 });
    }

    // Set Cache-Control to ensure the proxy route is hit and authenticated each time
    const responseHeaders = new Headers();
    responseHeaders.set("Cache-Control", "private, no-cache, no-store, must-revalidate");

    return new NextResponse(blob.stream, { headers: responseHeaders });
  } catch (error) {
    console.error("Error serving photo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
