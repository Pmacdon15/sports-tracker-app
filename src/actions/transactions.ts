"use server";

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

export async function returnEquipmentAction(formData: FormData) {
  const unit_number = formData.get("unit_number") as string;
  const timezone = formData.get("timezone") as string;
  const photo = formData.get("photo") as File | null;
  let photoUrl: string | undefined;

  if (photo && photo.size > 0) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`returns/${Date.now()}-${photo.name}`, photo, {
      access: "private",
    });
    photoUrl = blob.url;
  }

  const res = await returnEquipment(unit_number, photoUrl);

  return res.match((transaction) => {
    updateTag(`active-rentals-${transaction.org_id}`);
    let date = transaction.checked_in_at?.toISOString().split("T")[0];
    if (transaction.checked_in_at && timezone) {
      date = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(transaction.checked_in_at);
    }
    updateTag(`completed-rentals-${transaction.org_id}-${date}-${timezone}`);
    updateTag(`equipment-${transaction.org_id}`);
    updateTag(`guest-global-stats-${transaction.org_id}`);
    updateTag(
      `guest-transactions-${transaction.org_id}-${transaction.guest_id}`,
    );
    return { value: transaction };
  }, handleMutationError);
}
