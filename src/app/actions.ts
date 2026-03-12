"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addEquipment, deleteEquipment } from "@/data/equipment";
import { updateSetting } from "@/data/settings";
import {
  checkoutEquipmentTransaction,
  getCompletedRentals,
  returnEquipmentTransaction,
} from "@/data/transactions";

export async function fetchCompletedRentals({
  pageParam = 0,
  timezone = "UTC",
  date,
}: {
  pageParam?: number;
  timezone?: string;
  date?: string;
}) {
  const limit = 50;
  const rentals = await getCompletedRentals(limit, pageParam, timezone, date);
  return {
    rentals,
    nextPage: rentals.length === limit ? pageParam + limit : undefined,
  };
}

const CheckoutSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required").trim(),
  guest_name: z.string().min(1, "Guest name is required").trim(),
});

export async function processCheckout(data: {
  unit_number: string;
  guest_name: string;
}) {
  try {
    const validated = CheckoutSchema.parse(data);

    await checkoutEquipmentTransaction(
      validated.unit_number,
      validated.guest_name,
    );

    revalidatePath("/tracker");
    revalidatePath("/inventory");
    return {
      success: true,
      message: `Successfully checked out unit ${validated.unit_number}`,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      return { success: false, message: (error as any).errors[0].message };
    }
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to check out equipment",
    };
  }
}

const ReturnSchema = z.object({
  unit_number: z.string().min(1, "Unit number is required").trim(),
});

export async function processReturn(data: { unit_number: string }) {
  try {
    const validated = ReturnSchema.parse(data);

    await returnEquipmentTransaction(validated.unit_number);

    revalidatePath("/tracker");
    revalidatePath("/inventory");
    return {
      success: true,
      message: `Successfully returned unit ${validated.unit_number}`,
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray((error as any).errors)
    ) {
      return { success: false, message: (error as any).errors[0].message };
    }
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to return equipment",
    };
  }
}

export async function processEquipmentCreate(data: {
  type: string;
  unit_number: string;
}) {
  try {
    const { type, unit_number } = data;

    if (!type || !unit_number) throw new Error("Missing fields");

    await addEquipment(type, unit_number);
    revalidatePath("/inventory");
    return { success: true, message: `Added equipment ${unit_number}` };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to add equipment",
    };
  }
}

export async function processEquipmentDelete(unit_number: string) {
  try {
    await deleteEquipment(unit_number);
    revalidatePath("/inventory");
    return { success: true, message: `Deleted equipment ${unit_number}` };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to delete equipment",
    };
  }
}

export async function processSettingsUpdate(data: {
  yellow_trigger_hours?: string;
  red_trigger_hours?: string;
}) {
  try {
    const { yellow_trigger_hours: yellow, red_trigger_hours: red } = data;

    if (yellow) await updateSetting("yellow_trigger_hours", yellow);
    if (red) await updateSetting("red_trigger_hours", red);

    revalidatePath("/settings");
    revalidatePath("/tracker");
    return { success: true, message: "Settings updated" };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || "Failed to update settings",
    };
  }
}
