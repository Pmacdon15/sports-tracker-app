import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import { connection } from "next/server";
import z from "zod";
import { isOverMemberShipLimit } from "@/db/auth";
import { addEquipmentDb, getEquipmentByUnitDb } from "@/db/equipment";
import { createGuestDb, getGuestByNameDb } from "@/db/guests";
import {
  checkoutEquipmentDb,
  getActiveRentalsDb,
  getCompletedRentalsDb,
  getGuestTransactionsDb,
  returnEquipmentDb,
} from "@/db/transactions";
import type { DbResult, Transaction } from "@/db/types";
import { addUnitTypeDb } from "@/db/unit_types";
import { checkoutSchema, returnSchema } from "@/zod/schemas/transaction-schema";
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
  timeZone?: string,
): Promise<DbResult<Transaction[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getCompletedRentalsDb(orgId, date, timeZone);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching completed rentals:", e);
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
) {
  const validatedFields = checkoutSchema.safeParse({
    unit_number,
    guest_name,
    type,
  });

  if (!validatedFields.success) {
    // If your version of Zod supports it:
    const errorTree = z.treeifyError(validatedFields.error);

    return errAsync({
      reason: "Validation failed",
      errors: errorTree,
    } as const);
  }

  const { orgId, userId } = await auth.protect();
  if (!orgId) return errAsync({ reason: "Unauthorized" } as const);
  try {
    const isOverMemberShipLimitValue = await isOverMemberShipLimit(orgId);
    if (isOverMemberShipLimitValue)
      return errAsync({
        reason: "Over organization membership limit.",
      } as const);

    let guest = await getGuestByNameDb(orgId, guest_name);

    if (!guest) {
      guest = await createGuestDb(orgId, guest_name);
    }

    if (!guest)
      return errAsync({
        reason: "Failed to create or retrieve guest.",
      } as const);

    let equipment = await getEquipmentByUnitDb(orgId, unit_number);

    if (!equipment) {
      if (!type) {
        return errAsync({
          reason: `Equipment not found and no type provided for creation.`,
        } as const);
      }
      equipment = await addEquipmentDb(orgId, type, unit_number);
      // Ensure the unit type is in the registry
      addUnitTypeDb(orgId, type);
    }

    if (equipment.status !== "AVAILABLE") {
      return errAsync({
        reason: `Equipment is not available`,
      } as const);
    }

    return okAsync(
      await checkoutEquipmentDb(userId, orgId, equipment.id, guest.id),
    );
    // return { data, error: null };
  } catch (e: unknown) {
    console.error("Error checking out equipment:", e);

    return errAsync({ reason: "Unknown error." } as const);
  }
}

export async function returnEquipment(unit_number: string) {
  try {
    const { orgId, userId } = await auth.protect();
    if (!orgId) return errAsync({ reason: "Unauthorized" } as const);

    const validatedFields = returnSchema.safeParse({
      unit_number,
    });

    if (!validatedFields.success) {
      // If your version of Zod supports it:
      const errorTree = z.treeifyError(validatedFields.error);

      return errAsync({
        reason: "Validation failed",
        errors: errorTree,
      } as const);
    }
    const equipment = await getEquipmentByUnitDb(orgId, unit_number);

    if (!equipment)
      return errAsync({ reason: "Equipment not found." } as const);
    if (
      equipment.status !== "CHECKED_OUT" &&
      equipment.status !== "DELETED" &&
      equipment.status !== "RETIRED"
    ) {
      return errAsync({ reason: "Equipment is not checked out." } as const);
    }

    return okAsync(await returnEquipmentDb(orgId, equipment.id, userId));
  } catch (e: unknown) {
    console.error("Error returning equipment:", e);
    return errAsync({ reason: "Unknown error." } as const);
  }
}
