import { del, list } from "@vercel/blob";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { clearTransactionPhotosDb } from "@/db/transactions";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ----------------------------------------------------------------------
    // TOGGLE: Change this to `true` to only delete images older than 1 year.
    // Right now it is set to `false`, which deletes ALL return images.
    // ----------------------------------------------------------------------
    const DELETE_ONLY_OLD_IMAGES = true;

    let hasMore = true;
    let cursor: string | undefined;
    let deletedCount = 0;

    // Calculate the threshold date for exactly 1 year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    while (hasMore) {
      // List all blobs starting with our returns/ prefix
      const { blobs, cursor: nextCursor } = await list({
        prefix: "returns/",
        limit: 1000,
        cursor,
      });

      const urlsToDelete: string[] = [];

      for (const blob of blobs) {
        if (!DELETE_ONLY_OLD_IMAGES || new Date(blob.uploadedAt) < oneYearAgo) {
          urlsToDelete.push(blob.url);
        }
      }

      // Batch delete the URLs to save API calls
      if (urlsToDelete.length > 0) {
        await del(urlsToDelete);
        await clearTransactionPhotosDb(urlsToDelete);
        deletedCount += urlsToDelete.length;
      }

      hasMore = nextCursor !== undefined;
      cursor = nextCursor;
    }

    revalidateTag("completed-rentals", "max");
    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} images.`,
      mode: DELETE_ONLY_OLD_IMAGES ? "OLDER_THAN_1_YEAR" : "ALL_IMAGES",
    });
  } catch (error) {
    console.error("Error clearing old images:", error);
    return NextResponse.json(
      { error: "Failed to clear images" },
      { status: 500 },
    );
  }
}
