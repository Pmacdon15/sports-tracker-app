import { revalidateTag } from "next/cache";
import { getSql } from "./db";

export async function disableExcessEquipmentDb(orgId: string, limit = 10) {
  const sql = getSql();

  // Count active items (neither DELETED, RETIRED, nor DISABLED)
  const [countData] = await sql`
    SELECT COUNT(*) as current_count FROM equipment 
    WHERE org_id = ${orgId} AND status NOT IN ('DELETED', 'RETIRED', 'DISABLED')
  `;
  const currentCount = Number(countData.current_count);

  if (currentCount > limit) {
    const overBy = currentCount - limit;
    // Disable oldest active items
    await sql`
      UPDATE equipment 
      SET status = 'DISABLED'
      WHERE id IN (
        SELECT id FROM equipment 
        WHERE org_id = ${orgId} AND status NOT IN ('DELETED', 'RETIRED', 'DISABLED')
        ORDER BY created_at ASC
        LIMIT ${overBy}
      )
    `;
    console.log(
      `[DISABLEMENT] Successfully disabled ${overBy} items for org ${orgId}`,
    );

    revalidateTag(`equipment-${orgId}`, "max");
  }
}
