import { getSql } from "./db";
import type { Transaction } from "./types";

export async function getActiveRentalsDb(
  orgId: string,
): Promise<Transaction[]> {
  const sql = getSql();
  const res = await sql`
    SELECT t.*, e.unit_number as equipment_unit, e.type as equipment_type, g.name as guest_name
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN guests g ON t.guest_id = g.id
    WHERE t.status = 'OUT' AND t.org_id = ${orgId}
    ORDER BY t.checked_out_at ASC
  `;
  return res as unknown as Transaction[];
}

export async function getCompletedRentalsDb(
  orgId: string,
  limit: number,
  offset: number,
  timezone: string,
  date?: string,
): Promise<Transaction[]> {
  const sql = getSql();
  if (date) {
    const res = await sql`
      SELECT t.*, e.unit_number as equipment_unit, e.type as equipment_type, g.name as guest_name
      FROM transactions t
      JOIN equipment e ON t.equipment_id = e.id
      JOIN guests g ON t.guest_id = g.id
      WHERE t.status = 'RETURNED' 
        AND t.org_id = ${orgId}
        AND (t.checked_in_at AT TIME ZONE 'UTC' AT TIME ZONE ${timezone})::date = ${date}::date
      ORDER BY t.checked_in_at DESC
    `;
    return res as unknown as Transaction[];
  }

  const res = await sql`
    SELECT t.*, e.unit_number as equipment_unit, e.type as equipment_type, g.name as guest_name
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN guests g ON t.guest_id = g.id
    WHERE t.status = 'RETURNED' AND t.org_id = ${orgId}
    ORDER BY t.checked_in_at DESC
    
  `;
  return res as unknown as Transaction[];
}
// LIMIT ${limit} OFFSET ${offset} add this if you hook up pagination
export async function checkoutEquipmentDb(
  orgId: string,
  equipmentId: number,
  guestId: number,
): Promise<Transaction> {
  const sql = getSql();
  const res = await sql`
    WITH update_eq AS (
      UPDATE equipment SET status = 'CHECKED_OUT' WHERE id = ${equipmentId} RETURNING id
    )
    INSERT INTO transactions (equipment_id, guest_id, status, org_id) 
    VALUES ((SELECT id FROM update_eq), ${guestId}, 'OUT', ${orgId}) 
    RETURNING *
  `;
  return res[0] as unknown as Transaction;
}

export async function returnEquipmentDb(
  orgId: string,
  equipmentId: number,
): Promise<Transaction> {
  const sql = getSql();
  const res = await sql`
    WITH update_eq AS (
      UPDATE equipment SET status = 'AVAILABLE' WHERE id = ${equipmentId} RETURNING id
    )
    UPDATE transactions 
    SET status = 'RETURNED', checked_in_at = CURRENT_TIMESTAMP 
    WHERE equipment_id = (SELECT id FROM update_eq) AND status = 'OUT' AND org_id = ${orgId}
    RETURNING *
  `;
  return res[0] as unknown as Transaction;
}
