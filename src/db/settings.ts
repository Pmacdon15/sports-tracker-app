import { cacheTag } from "next/cache";
import { getSql } from "./db";
import type { Setting } from "./types";

export async function getSettingsDb(orgId: string): Promise<Setting[]> {
  "use cache: remote";
  cacheTag(`settings-${orgId}`);
  const sql = getSql();
  const res = await sql`
    SELECT * FROM settings 
    WHERE org_id = ${orgId}
  `;
  return res as unknown as Setting[];
}

export async function updateSettingDb(
  orgId: string,
  key: string,
  value: string,
): Promise<Setting> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO settings (key, value, org_id) 
    VALUES (${key}, ${value}, ${orgId}) 
    ON CONFLICT (key, org_id) 
    DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  return res[0] as unknown as Setting;
}
