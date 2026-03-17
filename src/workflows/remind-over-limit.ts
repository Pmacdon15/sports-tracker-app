import { sleep } from "workflow";
import { retireExcessEquipmentDb } from "../db/equipment-retirement";
import { getAdminEmailsStep } from "./functions/get-admin-emails";
import { SendEmail } from "./functions/send-email";

// Define the step here for better discovery by the workflow engine
export async function retireExcessStep(orgId: string) {
  "use step";
  console.log("Executing retirement step for org:", orgId);
  await retireExcessEquipmentDb(orgId);
}

export async function remindOverLimit(orgId: string) {
  "use workflow";
  // const writable = getWritable();
  const emails = await getAdminEmailsStep(orgId);

  await SendEmail(
    // writable,
    emails,
    "Urgent: Organization is over limit. Oldest items will be retired automatically in 1 week.",
  );

  await sleep("60s");

  await SendEmail(
    // writable,
    emails,
    "System Notice: Excess equipment will be retired to match your plan limits in one day.",
  );
  await sleep("60s");

  // Call the locally defined step
  await retireExcessStep(orgId);

  await SendEmail(
    // writable,
    emails,
    "System Notice: Excess equipment has been retired to match your plan limits.",
  );
}
