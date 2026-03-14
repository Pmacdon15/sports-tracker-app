"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { checkoutEquipment, returnEquipment } from "@/dal/transactions";
import type { DbResult, Transaction } from "@/db/types";

export async function checkoutEquipmentAction(
  unit_number: string,
  guest_name: string,
  type?: string,
): Promise<DbResult<Transaction>> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Unauthorized");

  const res = await checkoutEquipment(unit_number, guest_name, type);
  if (!res.error) {
    revalidateTag(`active-rentals-${orgId}`, "page" as any);
    revalidateTag(`equipment-${orgId}`, "page" as any); // Equipment status changes
  }
  return res;
}

export async function returnEquipmentAction(
  unit_number: string,
): Promise<DbResult<Transaction>> {
  const { orgId } = await auth.protect();
  if (!orgId) throw new Error("Unauthorized");

  const res = await returnEquipment(unit_number);
  if (!res.error) {
    revalidateTag(`active-rentals-${orgId}`, "page" as any);
    revalidateTag(`completed-rentals-${orgId}`, "page" as any);
    revalidateTag(`equipment-${orgId}`, "page" as any); // Equipment status changes
  }
  return res;
}
