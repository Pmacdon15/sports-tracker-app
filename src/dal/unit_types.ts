import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import type { DbResult, UnitType } from "@/db/types";
import { addUnitTypeDb, getAllUnitTypesDb } from "@/db/unit_types";

export async function getAllUnitTypes(): Promise<DbResult<UnitType[]>> {
  await connection();
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await getAllUnitTypesDb(orgId);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error fetching all unit types:", e);
    return { data: null, error: "Failed to fetch unit types" };
  }
}

export async function addUnitType(name: string): Promise<DbResult<UnitType>> {
  await connection();
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const data = await addUnitTypeDb(orgId, name);
    return { data, error: null };
  } catch (e: unknown) {
    console.error("Error adding unit type:", e);
    return { data: null, error: "Failed to add unit type" };
  }
}
