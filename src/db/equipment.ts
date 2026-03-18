import { cacheTag } from "next/cache";
import { start } from "workflow/api";
import { remindOverLimit } from "../workflows/remind-over-limit";
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
  const statuses: Equipment["status"][] = [
    "AVAILABLE",
    "CHECKED_OUT",
    "RETIRED",
  ];

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

  await isOverEquipmentLimitDb(orgId);
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
  return res[0] as unknown as Equipment;
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

export async function triggerOverLimitWorkflowIfNecessaryDb(orgId: string) {
  const sql = getSql();
  const [orgData] = await sql`
    SELECT 
      o.equipment_limit,
      o.remind_workflow_active,
      (SELECT COUNT(*) FROM equipment WHERE org_id = ${orgId} AND status <> 'DELETED' AND status <> 'RETIRED') as current_count
    FROM organizations o
    WHERE o.org_id = ${orgId}
  `;

  if (!orgData) {
    return { current_count: 0, equipment_limit: 0, is_over: false };
  }

  const current_count = Number(orgData.current_count);
  const equipment_limit = orgData.equipment_limit;
  console.log("Data: ", current_count, equipment_limit);
  console.log("Org Data: ", orgData);
  if (current_count > equipment_limit) {
    // Only start the workflow if one isn't already running for this org.
    // Use an atomic update to claim the lock — if no row is returned, another
    // workflow is already active and we skip starting a new one.
    if (!orgData.remind_workflow_active) {
      const claimed = await sql`
        UPDATE organizations
        SET remind_workflow_active = true
        WHERE org_id = ${orgId} AND (remind_workflow_active = false OR remind_workflow_active IS NULL)
        RETURNING org_id
      `;
      console.log("claimed: ", claimed.length);
      if (claimed.length > 0) {
        await start(remindOverLimit, [orgId]);
      }
    }
  }

  return {
    current_count,
    equipment_limit,
    is_over: current_count > equipment_limit,
  };
}

export async function isOverEquipmentLimitDb(orgId: string) {
  const { current_count, equipment_limit } =
    await triggerOverLimitWorkflowIfNecessaryDb(orgId);

  if (current_count >= equipment_limit) {
    throw new Error(
      `Equipment limit reached (${equipment_limit}). Please upgrade your plan.`,
    );
  }
}
