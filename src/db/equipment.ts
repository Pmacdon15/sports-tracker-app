import { cacheTag } from "next/cache";
import { getSql } from "./db";
import type { Equipment } from "./types";

export async function getAllEquipmentDb(orgId: string): Promise<Equipment[]> {
  "use cache";
  cacheTag(`equipment-${orgId}`);
  const sql = getSql();
  const res = await sql`
    SELECT * FROM equipment 
    WHERE org_id = ${orgId} AND status != 'DELETED'
    ORDER BY unit_number ASC
  `;
  return res as unknown as Equipment[];
}

export function getMockEquipment(orgId: string): Equipment[] {
  const types = ["Raft", "Bike", "Helmet", "Paddle", "Life Jacket"];
  const statuses: Equipment["status"][] = ["AVAILABLE", "CHECKED_OUT", "RETIRED"];

  return Array.from({ length: 100 }, (_, i) => {
    const id = i + 1;
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id,
      org_id: orgId,
      type,
      // Generates padded numbers like "001", "002"...
      unit_number: `${type.substring(0, 1).toUpperCase()}-${String(id).padStart(3, "0")}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
    };
  });
}

export async function getEquipmentByUnitDb(
  orgId: string,
  unit_number: string,
): Promise<Equipment | null> { 
  const sql = getSql();
  const res = await sql`
    SELECT * FROM equipment 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId}   `;
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
): Promise<Equipment> {
  const sql = getSql();
  const res = await sql`
    UPDATE equipment 
    SET status = ${status} 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId} 
    RETURNING *
  `;
  return (res[0] as unknown as Equipment);
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
