"use server";

import { updateTag } from "next/cache";
import { checkoutEquipment, returnEquipment } from "@/dal/transactions";
import type { DbResult, Transaction } from "@/db/types";

export async function checkoutEquipmentAction(
  unit_number: string,
  guest_name: string,
  type?: string,
): Promise<DbResult<Transaction>> {
  const res = await checkoutEquipment(unit_number, guest_name, type);
  if (!res.error) {
    updateTag(`active-rentals-${res.data?.org_id}`);
    updateTag(`equipment-${res.data?.org_id}`);
    updateTag(`unit-types-${res.data?.org_id}`);
    updateTag(`guest-global-stats-${res.data?.org_id}`);
  }
  return res;
}

export async function returnEquipmentAction(
  unit_number: string,
): Promise<DbResult<Transaction>> {
  const res = await returnEquipment(unit_number);
  if (!res.error) {
    updateTag(`active-rentals-${res.data?.org_id}`);
    updateTag(`completed-rentals-${res.data?.org_id}`);
    updateTag(`equipment-${res.data?.org_id}`);
    updateTag(`guest-global-stats-${res.data?.org_id}`);
    updateTag(`guest-transactions-${res.data?.org_id}-${res.data?.guest_id}`);
  }
  return res;
}
