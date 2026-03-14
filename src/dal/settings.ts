import { auth } from "@clerk/nextjs/server";
import { getSettingsDb, updateSettingDb } from "@/db/settings";
import type { DbResult } from "@/db/types";

export async function getSettings(): Promise<DbResult<Record<string, string>>> {
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
): Promise<DbResult<void>> {
  try {
    const { orgId } = await auth.protect();
    if (!orgId) throw new Error("Organization selection is required.");

    await updateSettingDb(orgId, key, value);
    return { data: undefined, error: null };
  } catch (e: unknown) {
    console.error(`Error updating setting ${key}:`, e);
    return { data: null, error: "Failed to update setting" };
  }
}
