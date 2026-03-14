import { getSql } from "./db";
import type { Guest } from "./types";

export async function getAllGuestsDb(orgId: string): Promise<Guest[]> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM guests 
    WHERE org_id = ${orgId} 
    ORDER BY name ASC
  `;
  return res as unknown as Guest[];
}

export async function getGuestByNameDb(
  orgId: string,
  name: string,
): Promise<Guest | null> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM guests 
    WHERE name = ${name} AND org_id = ${orgId}
  `;
  return (res[0] as unknown as Guest) || null;
}

export async function createGuestDb(
  orgId: string,
  name: string,
): Promise<Guest> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO guests (name, org_id) 
    VALUES (${name}, ${orgId}) 
    ON CONFLICT (name, org_id) DO NOTHING 
    RETURNING *
  `;
  return res[0] as unknown as Guest;
}
