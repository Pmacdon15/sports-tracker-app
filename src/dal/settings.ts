import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { getSettingsDb, updateSettingDb } from "@/db/settings";
import type { DbResult, Setting } from "@/db/types";
import { settingsSchema } from "@/zod/schemas/settings-schema";

export async function getSettings(): Promise<DbResult<Record<string, string>>> {
  await connection();
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    const rows = await getSettingsDb(orgId);
    const settings: Record<string, string> = {
      yellow_trigger_hours: "2",
      red_trigger_hours: "3",
    };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return { data: settings, error: null };
  } catch (e: unknown) {
    console.error("Error fetching settings:", e);
    return { data: null, error: "Failed to fetch settings" };
  }
}

export async function updateSetting(
  key: string,
  value: string,
): Promise<DbResult<Setting>> {
  try {
    const { orgId, has } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");
    if (!has({ role: "org:admin" })) throw new Error("Not an Admin");

    const schemaKey = key as keyof typeof settingsSchema.shape;
    const validator = settingsSchema.pick({ [schemaKey]: true } as any);

    const validatedFields = validator.safeParse({ [key]: value });

    if (!validatedFields.success) {
      const errorMessage =
        validatedFields.error.issues[0]?.message || "Invalid input";
      return { data: null, error: `${key}: ${errorMessage}` };
    }

    const data = await updateSettingDb(orgId, key, value);
    return { data, error: null };
  } catch (e: unknown) {
    console.error(`Error updating setting ${key}:`, e);
    return {
      data: null,
      error: e instanceof Error ? e.message : "Failed to update",
    };
  }
}
