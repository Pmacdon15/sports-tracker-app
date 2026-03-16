"use server";

import { updateTag } from "next/cache";
import {
  addEquipment,
  deleteEquipment,
  retireEquipment,
} from "@/dal/equipment";
import type { DbResult, Equipment } from "@/db/types";

export async function addEquipmentAction(
  type: string,
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const res = await addEquipment(type, unit_number);
  if (!res.error) {
    updateTag(`equipment-${res.data?.org_id}`);
  }
  return res;
}

export async function deleteEquipmentAction(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const res = await deleteEquipment(unit_number);
  if (!res.error) {
    updateTag(`equipment-${res.data?.org_id}`);
  }
  return res;
}

export async function retireEquipmentAction(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const res = await retireEquipment(unit_number);
  if (!res.error) {
    updateTag(`equipment-${res.data?.org_id}`);
  }
  return res;
}
