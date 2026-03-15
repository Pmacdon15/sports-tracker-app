"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import { addUnitType, getAllUnitTypes } from "@/dal/unit_types";
import type { DbResult, UnitType } from "@/db/types";

export async function getUnitTypesAction(): Promise<DbResult<UnitType[]>> {
  const { orgId } = await auth.protect();
  if (!orgId) throw new Error("Unauthorized");

  return await getAllUnitTypes();
}

export async function addUnitTypeAction(
  name: string,
): Promise<DbResult<UnitType>> {
  const { orgId } = await auth.protect();
  if (!orgId) throw new Error("Unauthorized");

  const res = await addUnitType(name);
  if (!res.error) {
    updateTag(`unit-types-${orgId}`);
  }
  return res;
}
