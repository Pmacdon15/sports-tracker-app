import { sleep } from "workflow";
import { getSql } from "../db/db";
import { retireExcessEquipmentDb } from "../db/equipment-retirement";
import { getAdminEmailsStep } from "./functions/get-admin-emails";
import { SendEmail } from "./functions/send-email";

// Define the step here for better discovery by the workflow engine
export async function retireExcessStep(orgId: string) {
  "use step";
  console.log("Executing retirement step for org:", orgId);
  await retireExcessEquipmentDb(orgId);
}

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

export async function remindOverLimit(orgId: string) {
  "use workflow";
  const emails = await getAdminEmailsStep(orgId);

  await SendEmail(
    emails,
    "Urgent: Organization is over limit. Oldest items will be retired automatically in 1 week.",
  );

  await sleep("7d");

  await SendEmail(
    emails,
    "System Notice: Excess equipment will be retired to match your plan limits in one day.",
  );
  await sleep("1d");

  // Retire excess equipment
  await retireExcessStep(orgId);

  await SendEmail(
    emails,
    "System Notice: Excess equipment has been retired to match your plan limits.",
  );

  // Clear the flag so a new workflow can be triggered if they go over limit again
  await clearWorkflowFlagStep(orgId);
}
