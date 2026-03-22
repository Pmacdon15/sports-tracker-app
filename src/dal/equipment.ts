import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import {
  addEquipmentDb,
  getAllEquipmentDb,
  getEquipmentByUnitDb,
  updateEquipmentStatusDb,
} from "@/db/equipment";
import type { DbResult, Equipment } from "@/db/types";
import { addUnitTypeDb } from "@/db/unit_types";
import { connection } from "next/server";

export async function getAllEquipment(): Promise<DbResult<Equipment[]>> {
  await connection();
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getAllEquipmentDb(orgId);
    // const data = await getMockEquipment(orgId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching all equipment:", e);
    return { data: null, error: "Failed to fetch equipment" };
  }
}

export async function getEquipmentByUnit(
  unit_number: string,
): Promise<DbResult<Equipment | null>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getEquipmentByUnitDb(orgId, unit_number);
    return { data, error: null };
  } catch (e: unknown) {
    console.error(`Error fetching equipment ${unit_number}:`, e);
    return {
      data: null,
      error: "Failed to fetch equipment details",
    };
  }
}

export async function addEquipment(type: string, unit_number: string) {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) return errAsync({ reason: "Unauthorized" } as const);

    const data = await addEquipmentDb(orgId, type, unit_number);
    await addUnitTypeDb(orgId, type);
    return okAsync(data);
  } catch (e: unknown) {
    console.error("Error adding equipment:", e);

    if (e instanceof Error && e.message.includes("limit reached")) {
      return errAsync({
        reason: "Over organization membership limit.",
        message: e.message,
      } as const);
    }

    return errAsync({ reason: "Failed to add equipment" } as const);
  }
}

export async function deleteEquipment(unit_number: string) {
  try {
    const { orgId, has } = await auth.protect();
    const isAdmin = has({ role: "org:admin" });
    if (!orgId || !isAdmin) return errAsync({ reason: "Unauthorized" } as const);

    const data = await updateEquipmentStatusDb(orgId, unit_number, "DELETED");
    return okAsync(data);
  } catch (e: unknown) {
    console.error("Error deleting equipment:", e);
    return errAsync({ reason: "Failed to delete equipment" } as const);
  }
}

export async function retireEquipment(unit_number: string) {
  try {
    const { orgId, has } = await auth.protect();
    const isAdmin = has({ role: "org:admin" });
    if (!orgId || !isAdmin) return errAsync({ reason: "Unauthorized" } as const);

    const data = await updateEquipmentStatusDb(orgId, unit_number, "RETIRED");
    return okAsync(data);
  } catch (e: unknown) {
    console.error("Error retiring equipment:", e);
    return errAsync({ reason: "Failed to retire equipment" } as const);
  }
}
