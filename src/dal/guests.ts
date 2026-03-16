import { auth } from "@clerk/nextjs/server";

import {
  getAllGuestsDb,
  getGlobalGuestStatsDb,
  getGuestByIdDb,
  getGuestStatsDb,
} from "@/db/guests";

import type { DbResult, GlobalGuestStats, Guest, GuestStats } from "@/db/types";

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

export async function getGuestById(guestId: string): Promise<DbResult<Guest>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const id = parseInt(guestId);
    if (Number.isNaN(id)) throw new Error("Invalid guest ID");

    const data = await getGuestByIdDb(orgId, id);
    if (!data) return { data: null, error: "Guest not found" };

    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching guest by ID:", e);
    return { data: null, error: "Failed to fetch guest details" };
  }
}

export async function getGuestStats(
  page = 1,
  limit = 20,
  search?: string,
): Promise<DbResult<GuestStats[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Unauthorized");

    const offset = (page - 1) * limit;
    const data = await getGuestStatsDb(orgId, limit, offset, search);

    // MOCK FUNCTION for UI demonstration
    // const data = getMockGuestStats(page, limit, search);

    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching guest stats:", e);
    return { data: null, error: "Failed to fetch guest stats" };
  }
}

export async function getGlobalGuestStats(): Promise<
  DbResult<GlobalGuestStats>
> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Unauthorized");

    // REAL FUNCTION (Commented out for mock demonstration)
    const data = await getGlobalGuestStatsDb(orgId);

    // MOCK FUNCTION for UI demonstration
    // const data: GlobalGuestStats = {
    //   total_guests: 5,
    //   total_trips: 43,
    //   avg_trips_per_guest: 8.6,
    // };

    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching global guest stats:", e);
    return { data: null, error: "Failed to fetch global stats" };
  }
}
