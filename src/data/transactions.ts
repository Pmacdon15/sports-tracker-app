import { auth } from "@clerk/nextjs/server";
import { sql } from "@vercel/postgres";

export interface Transaction {
  id: number;
  equipment_id: number;
  guest_id: number;
  org_id: string;
  checked_out_at: Date;
  checked_in_at: Date | null;
  status: "OUT" | "RETURNED";
  equipment_unit?: string;
  equipment_type?: string;
  guest_name?: string;
}

export async function getActiveRentals(): Promise<Transaction[]> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const res = await sql`
    SELECT t.*, e.unit_number as equipment_unit, e.type as equipment_type, g.name as guest_name
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN guests g ON t.guest_id = g.id
    WHERE t.status = 'OUT' AND t.org_id = ${orgId}
    ORDER BY t.checked_out_at ASC
  `;
  return res.rows as Transaction[];
}

export async function getCompletedRentals(
  limit: number = 50,
  offset: number = 0,
  timezone: string = "UTC",
  date?: string, // YYYY-MM-DD
): Promise<Transaction[]> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

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
      LIMIT ${limit} OFFSET ${offset}
    `;
    return res.rows as Transaction[];
  }

  const res = await sql`
    SELECT t.*, e.unit_number as equipment_unit, e.type as equipment_type, g.name as guest_name
    FROM transactions t
    JOIN equipment e ON t.equipment_id = e.id
    JOIN guests g ON t.guest_id = g.id
    WHERE t.status = 'RETURNED' AND t.org_id = ${orgId}
    ORDER BY t.checked_in_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return res.rows as Transaction[];
}

export async function checkoutEquipmentTransaction(
  unit_number: string,
  guest_name: string,
): Promise<Transaction> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  const guestRes = await sql`
    INSERT INTO guests (name, org_id) 
    VALUES (${guest_name}, ${orgId}) 
    ON CONFLICT (name, org_id) DO NOTHING 
    RETURNING *
  `;

  let guestId: any;
  if (guestRes.rows.length > 0) {
    guestId = guestRes.rows[0].id;
  } else {
    const g =
      await sql`SELECT id FROM guests WHERE name = ${guest_name} AND org_id = ${orgId}`;
    if (g.rows.length === 0) throw new Error("Failed to resolve guest");
    guestId = g.rows[0].id;
  }

  // 2. Validate Equipment
  const eqRes = await sql`
    SELECT id, status FROM equipment 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId}
  `;
  if (eqRes.rows.length === 0) {
    throw new Error(
      `Equipment with unit number ${unit_number} not found in this organization.`,
    );
  }
  const eq = eqRes.rows[0];
  if (eq.status !== "AVAILABLE") {
    throw new Error(
      `Equipment ${unit_number} is currently ${eq.status} and cannot be checked out.`,
    );
  }

  // 3. Perform Checkout Sequence
  const activeTrans = await sql`
    WITH update_eq AS (
      UPDATE equipment SET status = 'CHECKED_OUT' WHERE id = ${eq.id} RETURNING id
    )
    INSERT INTO transactions (equipment_id, guest_id, status, org_id) 
    VALUES ((SELECT id FROM update_eq), ${guestId}, 'OUT', ${orgId}) 
    RETURNING *
  `;

  return activeTrans.rows[0] as Transaction;
}

export async function returnEquipmentTransaction(
  unit_number: string,
): Promise<Transaction> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("Organization selection is required.");

  // 1. Validate Equipment
  const eqRes = await sql`
    SELECT id, status FROM equipment 
    WHERE unit_number = ${unit_number} AND org_id = ${orgId}
  `;
  if (eqRes.rows.length === 0) {
    throw new Error(`Equipment ${unit_number} not found in this organization.`);
  }
  const eq = eqRes.rows[0];
  if (eq.status !== "CHECKED_OUT") {
    throw new Error(`Equipment ${unit_number} is not checked out.`);
  }

  // 2. Perform Return Sequence
  const returnTrans = await sql`
    WITH update_eq AS (
      UPDATE equipment SET status = 'AVAILABLE' WHERE id = ${eq.id} RETURNING id
    )
    UPDATE transactions 
    SET status = 'RETURNED', checked_in_at = CURRENT_TIMESTAMP 
    WHERE equipment_id = (SELECT id FROM update_eq) AND status = 'OUT' AND org_id = ${orgId}
    RETURNING *
  `;

  if (returnTrans.rows.length === 0) {
    throw new Error(`Could not find active OUT transaction for ${unit_number}`);
  }

  return returnTrans.rows[0] as Transaction;
}
