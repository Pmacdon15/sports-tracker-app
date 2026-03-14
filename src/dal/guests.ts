import { auth } from "@clerk/nextjs/server";
import { getAllGuestsDb } from "@/db/guests";
import type { DbResult, Guest } from "@/db/types";

export async function getAllGuests(): Promise<DbResult<Guest[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getAllGuestsDb(orgId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching all guests:", e);
    return { data: null, error: "Failed to fetch guests" };
  }
}
