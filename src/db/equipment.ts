import { getSql } from "./db";
import type { Equipment } from "./types";

export async function getAllEquipmentDb(orgId: string): Promise<Equipment[]> {
  const sql = getSql();
  const res = await sql`
    SELECT * FROM equipment 
    WHERE org_id = ${orgId} 
    ORDER BY unit_number ASC
  `;
  return res as unknown as Equipment[];
}

export async function getEquipmentByUnitDb(
  orgId: string,
  unit_number: string,
): Promise<Equipment | null> {
  console.log("Data: ", unit_number);
  const sql = getSql();
  const res = await sql`
    SELECT * FROM equipment 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId}
  `;
  return (res[0] as unknown as Equipment) || null;
}

export async function addEquipmentDb(
  orgId: string,
  type: string,
  unit_number: string,
): Promise<Equipment> {
  const sql = getSql();
  const res = await sql`
    INSERT INTO equipment (type, unit_number, org_id) 
    VALUES (${type}, ${unit_number}, ${orgId}) 
    RETURNING *
  `;
  return res[0] as unknown as Equipment;
}

export async function updateEquipmentStatusDb(
  orgId: string,
  unit_number: string,
  status: string,
): Promise<Equipment | null> {
  const sql = getSql();
  const res = await sql`
    UPDATE equipment 
    SET status = ${status} 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId} 
    RETURNING *
  `;
  return (res[0] as unknown as Equipment) || null;
}

export async function deleteEquipmentDb(
  orgId: string,
  unit_number: string,
): Promise<boolean> {
  const sql = getSql();
  const res = await sql`
    DELETE FROM equipment 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId}
    RETURNING id
  `;
  return res.length > 0;
}
