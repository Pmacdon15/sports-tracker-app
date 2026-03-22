import { auth } from "@clerk/nextjs/server";
import { isOverMemberShipLimit } from "@/db/auth";
import { addEquipmentDb, getEquipmentByUnitDb } from "@/db/equipment";
import { createGuestDb, getGuestByNameDb } from "@/db/guests";
import {
  checkoutEquipmentDb,
  getActiveRentalsDb,
  getCompletedRentalsDb,
  getCompletedRentalsPaginatedDb,
  getGuestTransactionsDb,
  returnEquipmentDb,
} from "@/db/transactions";
import type { DbResult, Transaction } from "@/db/types";
import { addUnitTypeDb } from "@/db/unit_types";
import { connection } from "next/server";

export async function getActiveRentals(): Promise<DbResult<Transaction[]>> {
  await connection();
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getActiveRentalsDb(orgId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching active rentals:", e);
    return { data: null, error: "Failed to fetch active rentals" };
  }
}

export async function getCompletedRentals(
  date?: string,  
): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getCompletedRentalsDb(orgId, date);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching completed rentals:", e);
    return {
      data: null,
      error: "Failed to fetch completed rentals",
    };
  }
}

export async function getCompletedRentalsPaginated(
  page = 1,
  limit = 20,
  search?: string,
  date?: string,
): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const targetDate = date ?? new Date().toISOString().split("T")[0];
    const offset = (page - 1) * limit;

    const data = await getCompletedRentalsPaginatedDb(
      orgId,
      targetDate,
      limit,
      offset,
      search,
    );
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching paginated completed rentals:", e);
    return {
      data: null,
      error: "Failed to fetch completed rentals",
    };
  }
}

export async function getGuestTransactions(
  guestId: string,
): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const id = parseInt(guestId);
    if (Number.isNaN(id)) throw new Error("Invalid guest ID");

    const data = await getGuestTransactionsDb(orgId, id);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching guest transactions:", e);
    return { data: null, error: "Failed to fetch guest trips" };
  }
}

export async function checkoutEquipment(
  unit_number: string,
  guest_name: string,
  type?: string,
): Promise<DbResult<Transaction>> {
  try {
    const { orgId, userId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const isOverMemberShipLimitValue = await isOverMemberShipLimit(orgId);
    if (isOverMemberShipLimitValue)
      throw new Error("Over organization membership limit.");

    let guest = await getGuestByNameDb(orgId, guest_name);

    if (!guest) {
      guest = await createGuestDb(orgId, guest_name);
    }

    if (!guest) throw new Error("Failed to create or retrieve guest.");

    let equipment = await getEquipmentByUnitDb(orgId, unit_number);

    if (!equipment) {
      if (!type) {
        throw new Error(
          `Equipment ${unit_number} not found and no type provided for creation.`,
        );
      }
      equipment = await addEquipmentDb(orgId, type, unit_number);
      // Ensure the unit type is in the registry
      await addUnitTypeDb(orgId, type);
    }

    if (equipment.status !== "AVAILABLE") {
      throw new Error(`Equipment ${unit_number} is ${equipment.status}.`);
    }

    const data = await checkoutEquipmentDb(
      userId,
      orgId,
      equipment.id,
      guest.id,
    );
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error checking out equipment:", e);

    if (e instanceof Error) {
      if (e.message === "Over organization membership limit.") {
        return { data: null, error: "Over organization membership limit." };
      }

      return { data: null, error: e.message };
    }

    return { data: null, error: "Failed to checkout equipment" };
  }
}

export async function returnEquipment(
  unit_number: string,
): Promise<DbResult<Transaction>> {
  try {
    const { orgId, userId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const equipment = await getEquipmentByUnitDb(orgId, unit_number);

    if (!equipment) throw new Error(`Equipment ${unit_number} not found.`);
    if (
      equipment.status !== "CHECKED_OUT" &&
      equipment.status !== "DELETED" &&
      equipment.status !== "RETIRED"
    ) {
      throw new Error(`Equipment ${unit_number} is not checked out.`);
    }

    const data = await returnEquipmentDb(orgId, equipment.id, userId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error returning equipment:", e);
    return { data: null, error: "Failed to return equipment" };
  }
}
