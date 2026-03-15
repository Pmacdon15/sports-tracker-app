import { auth } from "@clerk/nextjs/server";
import { addEquipmentDb, getEquipmentByUnitDb } from "@/db/equipment";
import { createGuestDb, getGuestByNameDb } from "@/db/guests";
import {
  checkoutEquipmentDb,
  getActiveRentalsDb,
  getCompletedRentalsDb,
  returnEquipmentDb,
} from "@/db/transactions";
import type { DbResult, Transaction } from "@/db/types";

export async function getActiveRentals(): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getActiveRentalsDb(orgId);
    return { data, error: null };
  } catch (e: any) {
    console.error("Error fetching active rentals:", e);
    return { data: null, error: "Failed to fetch active rentals" };
  }
}

export async function getCompletedRentals(
  date?: string,
  timezone?: string,
): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getCompletedRentalsDb(orgId, date, timezone);
    return { data, error: null };
  } catch (e: any) {
    console.error("Error fetching completed rentals:", e);
    return {
      data: null,
      error: "Failed to fetch completed rentals",
    };
  }
}

export async function checkoutEquipment(
  unit_number: string,
  guest_name: string,
  type?: string,
): Promise<DbResult<Transaction>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

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
    }

    if (equipment.status !== "AVAILABLE") {
      throw new Error(`Equipment ${unit_number} is ${equipment.status}.`);
    }

    const data = await checkoutEquipmentDb(orgId, equipment.id, guest.id);
    return { data, error: null };
  } catch (e: any) {
    console.error("Error checking out equipment:", e);
    return { data: null, error: "Failed to checkout equipment" };
  }
}

export async function returnEquipment(
  unit_number: string,
  userId:string
): Promise<DbResult<Transaction>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const equipment = await getEquipmentByUnitDb(orgId, unit_number);

    if (!equipment) throw new Error(`Equipment ${unit_number} not found.`);
    if (equipment.status !== "CHECKED_OUT" && equipment.status !== "DELETED") {
      throw new Error(`Equipment ${unit_number} is not checked out.`);
    }

    const data = await returnEquipmentDb(orgId, equipment.id, userId);
    return { data, error: null };
  } catch (e: any) {
    console.error("Error returning equipment:", e);
    return { data: null, error: "Failed to return equipment" };
  }
}
