import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export interface Equipment {
  id: number;
  type: string;
  unit_number: string;
  org_id: string;
  status: "AVAILABLE" | "CHECKED_OUT" | "RETIRED";
  created_at: Date;
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`SELECT * FROM equipment WHERE org_id = ${orgId} ORDER BY unit_number ASC`;
  return res.rows as Equipment[];
}

export async function getEquipmentByUnit(
  unit_number: string,
): Promise<Equipment | null> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`SELECT * FROM equipment WHERE unit_number = ${unit_number} AND org_id = ${orgId}`;
  return res.rows[0] ? (res.rows[0] as Equipment) : null;
}

export async function addEquipment(
  type: string,
  unit_number: string,
): Promise<Equipment> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res = await sql`
    INSERT INTO equipment (type, unit_number, org_id) 
    VALUES (${type}, ${unit_number}, ${orgId}) 
    RETURNING *
  `;
  return res.rows[0] as Equipment;
}

export async function updateEquipmentStatus(
  unit_number: string,
  status: "AVAILABLE" | "CHECKED_OUT" | "RETIRED",
): Promise<Equipment | null> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res = await sql`
    UPDATE equipment 
    SET status = ${status} 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId} 
    RETURNING *
  `;
  return res.rows[0] ? (res.rows[0] as Equipment) : null;
}

export async function deleteEquipment(unit_number: string): Promise<boolean> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res =
    await sql`DELETE FROM equipment WHERE unit_number = ${unit_number} AND org_id = ${orgId}`;
  return (res.rowCount ?? 0) > 0;
}
