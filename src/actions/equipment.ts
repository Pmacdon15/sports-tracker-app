"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import { addEquipment, deleteEquipment, retireEquipment } from "@/dal/equipment";
import type { DbResult, Equipment } from "@/db/types";

export async function addEquipmentAction(
  type: string,
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const { orgId  } = await auth.protect();
  // const isAdmin = has({ role: "org:admin" });
  if (!orgId) throw new Error("Unauthorized");

  const res = await addEquipment(type, unit_number);
  if (!res.error) {
    updateTag(`equipment-${orgId}`);
  }
  return res;
}

export async function deleteEquipmentAction(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const { orgId, has } = await auth.protect();
  const isAdmin = has({ role: "org:admin" });
  if (!orgId || !isAdmin) throw new Error("Unauthorized");

  const res = await deleteEquipment(unit_number);
  if (!res.error) {
    updateTag(`equipment-${orgId}`);
  }
  return res;
}

export async function retireEquipmentAction(
  unit_number: string,
): Promise<DbResult<Equipment>> {
  const { orgId, has } = await auth.protect();
  const isAdmin = has({ role: "org:admin" });
  if (!orgId || !isAdmin) throw new Error("Unauthorized");

  const res = await retireEquipment(unit_number);
  if (!res.error) {
    updateTag(`equipment-${orgId}`);
  }
  return res;
}
