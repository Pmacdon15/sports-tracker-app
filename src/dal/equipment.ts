import { auth } from "@clerk/nextjs/server";
import {
  addEquipmentDb,
  getAllEquipmentDb,
  getEquipmentByUnitDb,
  updateEquipmentStatusDb,
} from "@/db/equipment";
import type { DbResult, Equipment } from "@/db/types";
import { addUnitTypeDb } from "@/db/unit_types";

export async function getAllEquipment(): Promise<DbResult<Equipment[]>> {
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

export async function addEquipment(
  type: string,
  unit_number: string,
): Promise<DbResult<Equipment>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await addEquipmentDb(orgId, type, unit_number);
    await addUnitTypeDb(orgId, type);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error adding equipment:", e);
    return { data: null, error: "Failed to add equipment" };
  }
}

export async function deleteEquipment(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  try {
    const { orgId, has } = await auth.protect();
    const isAdmin = has({ role: "org:admin" });
    if (!orgId || !isAdmin) throw new Error("Unauthorized");

    const data = await updateEquipmentStatusDb(orgId, unit_number, "DELETED");
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error deleting equipment:", e);
    return { data: null, error: "Failed to delete equipment" };
  }
}

export async function retireEquipment(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  try {
    const { orgId, has } = await auth.protect();
    const isAdmin = has({ role: "org:admin" });
    if (!orgId || !isAdmin) throw new Error("Unauthorized");

    const data = await updateEquipmentStatusDb(orgId, unit_number, "RETIRED");
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error retiring equipment:", e);
    return { data: null, error: "Failed to retire equipment" };
  }
}
