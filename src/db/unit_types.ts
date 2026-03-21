import { cacheTag } from "next/cache";
import { getSql } from "./db";
import type { UnitType } from "./types";

export async function getAllUnitTypesDb(orgId: string): Promise<UnitType[]> {
  "use cache: remote";
  cacheTag(`unit-types-${orgId}`);
  const sql = getSql();
  const res = await sql`
    SELECT * FROM unit_types 
    WHERE org_id = ${orgId} 
    ORDER BY name ASC
  `;
  return res as unknown as UnitType[];
}

export async function addUnitTypeDb(
  orgId: string,
  name: string,
): Promise<UnitType> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO unit_types (name, org_id) 
    VALUES (${name}, ${orgId}) 
    ON CONFLICT (name, org_id) DO UPDATE SET name = EXCLUDED.name
    RETURNING *
  `;
  return res[0] as unknown as UnitType;
}
