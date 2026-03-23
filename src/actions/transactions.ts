"use server";

import { okAsync } from "neverthrow";
import { updateTag } from "next/cache";
import { checkoutEquipment, returnEquipment } from "@/dal/transactions";
import { handleMutationError } from "./utils";

export async function checkoutEquipmentAction(
  unit_number: string,
  guest_name: string,
  type?: string,
) {
  const res = await checkoutEquipment(unit_number, guest_name, type);

  return res.match((checkedOut) => {
    updateTag(`active-rentals-${checkedOut.org_id}`);
    updateTag(`equipment-${checkedOut.org_id}`);
    updateTag(`unit-types-${checkedOut.org_id}`);
    updateTag(`guest-global-stats-${checkedOut.org_id}`);
    updateTag(`guest-transactions-${checkedOut.org_id}-${checkedOut.guest_id}`);
    return { value: checkedOut };
  }, handleMutationError);
}

export async function returnEquipmentAction(
  unit_number: string,
  timezone: string,
) {
  const res = await returnEquipment(unit_number);

  return res.match((transaction) => {
    updateTag(`active-rentals-${transaction.org_id}`);
    const date = transaction.checked_in_at?.toISOString().split("T")[0];
    updateTag(`completed-rentals-${transaction.org_id}-${date}-${timezone}`);
    updateTag(`equipment-${transaction.org_id}`);
    updateTag(`guest-global-stats-${transaction.org_id}`);
    updateTag(
      `guest-transactions-${transaction.org_id}-${transaction.guest_id}`,
    );
    return { value: transaction };
  }, handleMutationError);
}
