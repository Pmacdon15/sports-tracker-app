"use server";

import { updateTag } from "next/cache";
import { addUnitType } from "@/dal/unit_types";
import type { DbResult, UnitType } from "@/db/types";

export async function addUnitTypeAction(
  name: string,
): Promise<DbResult<UnitType>> {
  const res = await addUnitType(name);
  if (!res.error) {
    updateTag(`unit-types-${res.data?.org_id}`);
  }
  return res;
}
