import { updateTag } from "next/cache";
import { getSql } from "./db";

export async function retireExcessEquipmentDb(orgId: string) {
  const sql = getSql();
  const [orgData] = await sql`
    SELECT equipment_limit FROM organizations WHERE org_id = ${orgId}
  `;
  if (!orgData) return;

  const limit = Number(orgData.equipment_limit);

  // Count active items (neither DELETED nor RETIRED)
  const [countData] = await sql`
    SELECT COUNT(*) as current_count FROM equipment 
    WHERE org_id = ${orgId} AND status NOT IN ('DELETED', 'RETIRED')
  `;
  const currentCount = Number(countData.current_count);

  if (currentCount > limit) {
    const overBy = currentCount - limit;
    // Retire oldest active items
    await sql`
      UPDATE equipment 
      SET status = 'RETIRED'
      WHERE id IN (
        SELECT id FROM equipment 
        WHERE org_id = ${orgId} AND status NOT IN ('DELETED', 'RETIRED')
        ORDER BY created_at ASC
        LIMIT ${overBy}
      )
    `;
    console.log(
      `[RETIREMENT] Successfully retired ${overBy} items for org ${orgId}`,
    );

    updateTag(`equipment-${orgId}`);
  }
}
