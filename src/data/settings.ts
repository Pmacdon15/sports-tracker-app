import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export interface Setting {
  id: number;
  key: string;
  value: string;
  org_id: string;
  updated_at: Date;
}

export async function getSettings(): Promise<Record<string, string>> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`SELECT key, value FROM settings WHERE org_id = ${orgId}`;
  const settings: Record<string, string> = {
    yellow_trigger_hours: "2",
    red_trigger_hours: "3",
  };
  for (const row of res.rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function updateSetting(key: string, value: string): Promise<void> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  await sql`
    INSERT INTO settings (key, value, org_id) 
    VALUES (${key}, ${value}, ${orgId}) 
    ON CONFLICT (key, org_id) 
    DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
  `;
}
