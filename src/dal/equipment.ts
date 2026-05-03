import { auth } from "@clerk/nextjs/server";
import { errAsync, okAsync } from "neverthrow";
import { connection } from "next/server";
import z from "zod";
import {
  addEquipmentDb,
  getAllEquipmentDb,
  getEquipmentByUnitDb,
  updateEquipmentStatusDb,
} from "@/db/equipment";
import type { DbResult, Equipment } from "@/db/types";
import { addUnitTypeDb } from "@/db/unit_types";
import {
  createInventorySchema,
  deleteEquipmentSchema,
} from "@/zod/schemas/equipment-schema";

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
    const { orgId, has } = await auth.protect();
    if (!orgId) return errAsync({ reason: "Unauthorized" } as const);
    const validatedFields = createInventorySchema.safeParse({
      unit_number,
      type,
    });

    let equipmentLimit= 10
    const limitIs50 = has({ feature: "50_inventory_items" });
     const limitIs200 = has({ feature: "200_inventory_items" });
    if (limitIs50) equipmentLimit = 50;
    else if(limitIs200) equipmentLimit = 200    

    if (!validatedFields.success) {
      // If your version of Zod supports it:
      const errorTree = z.treeifyError(validatedFields.error);

      return errAsync({
        reason: "Validation failed",
        errors: errorTree,
      } as const);
    }

    const results = await Promise.allSettled([
      addEquipmentDb(orgId, type, unit_number, equipmentLimit),
      addUnitTypeDb(orgId, type),
    ]);

    const equipmentResult = results[0];

    if (equipmentResult.status === "rejected") {
      throw equipmentResult.reason;
    }

    return okAsync(equipmentResult.value);
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
    if (!orgId || !isAdmin)
      return errAsync({ reason: "Unauthorized" } as const);

    const validatedFields = deleteEquipmentSchema.safeParse({
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
    if (!orgId || !isAdmin)
      return errAsync({ reason: "Unauthorized" } as const);

    const validatedFields = deleteEquipmentSchema.safeParse({
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
    const data = await updateEquipmentStatusDb(orgId, unit_number, "RETIRED");
    return okAsync(data);
  } catch (e: unknown) {
    console.error("Error retiring equipment:", e);
    return errAsync({ reason: "Failed to retire equipment" } as const);
  }
}
