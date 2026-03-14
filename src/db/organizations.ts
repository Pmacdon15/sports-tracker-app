import { getSql } from "./db";
import type { Organization } from "./types";

export async function upsertOrganizationDb(
  orgId: string,
  name: string,
): Promise<Organization> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO organizations (org_id, name)
    VALUES (${orgId}, ${name})
    ON CONFLICT (org_id)
    DO UPDATE SET name = EXCLUDED.name
    RETURNING *
  `;
  return res[0] as unknown as Organization;
}

export async function updateOrganizationEquipmentLimitDb(
  orgId: string,
  limit: number,
): Promise<Organization | null> {
  const sql = getSql();
  const res = await sql`
    UPDATE organizations
    SET equipment_limit = ${limit}
    WHERE org_id = ${orgId}
    RETURNING *
  `;
  return (res[0] as unknown as Organization) || null;
}

export async function getOrganizationDb(
  orgId: string,
): Promise<Organization | null> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM organizations
    WHERE org_id = ${orgId}
  `;
  return (res[0] as unknown as Organization) || null;
}
