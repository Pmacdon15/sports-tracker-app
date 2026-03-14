import { auth } from "@clerk/nextjs/server";
import {
  addEquipmentDb,
  deleteEquipmentDb,
  getAllEquipmentDb,
  getEquipmentByUnitDb,
} from "@/db/equipment";
import type { DbResult, Equipment } from "@/db/types";

export async function getAllEquipment(): Promise<DbResult<Equipment[]>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getAllEquipmentDb(orgId);
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

export async function addEquipment(
  type: string,
  unit_number: string,
): Promise<DbResult<Equipment>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await addEquipmentDb(orgId, type, unit_number);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error adding equipment:", e);
    return { data: null, error: "Failed to add equipment" };
  }
}

export async function deleteEquipment(
  unit_number: string,
): Promise<DbResult<boolean>> {
  try {
   const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await deleteEquipmentDb(orgId, unit_number);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error deleting equipment:", e);
    return { data: null, error: "Failed to delete equipment" };
  }
}
