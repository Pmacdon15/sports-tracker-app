"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import { checkoutEquipment, returnEquipment } from "@/dal/transactions";
import type { DbResult, Transaction } from "@/db/types";

export async function checkoutEquipmentAction(
  unit_number: string,
  guest_name: string,
  type?: string,
): Promise<DbResult<Transaction>> {
  const { orgId } = await auth.protect();
  if (!orgId) throw new Error("Unauthorized");

  const res = await checkoutEquipment(unit_number, guest_name, type);
  if (!res.error) {
    updateTag(`active-rentals-${orgId}`);
    updateTag(`equipment-${orgId}`);
    updateTag(`unit-types-${orgId}`);
    updateTag(`guest-global-stats-${orgId}`);
  }
  return res;
}

export async function returnEquipmentAction(
  unit_number: string,
): Promise<DbResult<Transaction>> {
  const { orgId, userId } = await auth.protect();
  if (!orgId) throw new Error("Unauthorized");

  const res = await returnEquipment(unit_number, userId);
  if (!res.error) {
    updateTag(`active-rentals-${orgId}`);
    updateTag(`completed-rentals-${orgId}`);
    updateTag(`equipment-${orgId}`);
    updateTag(`guest-stats-${orgId}`);
    // updateTag(`guest-stats-${orgId}`);
    updateTag(`guest-global-stats-${orgId}`);
  }
  return res;
}
