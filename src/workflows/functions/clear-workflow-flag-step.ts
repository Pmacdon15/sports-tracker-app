import { getSql } from "@/db/db";

export async function clearWorkflowFlagStep(orgId: string) {
  "use step";
  const sql = getSql();
  await sql`
    UPDATE organizations
    SET remind_workflow_active = false
    WHERE org_id = ${orgId}
  `;
  console.log("Cleared workflow active flag for org:", orgId);
}
