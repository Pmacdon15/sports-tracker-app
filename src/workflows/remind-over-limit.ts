import { sleep } from "workflow";
import { clearWorkflowFlagStep } from "./functions/clear-workflow-flag-step";
import { disableExcessStep } from "./functions/disable-excess-equipment";
import { getAdminEmailsStep } from "./functions/get-admin-emails";
import { SendEmail } from "./functions/send-email";

export async function remindOverLimit(orgId: string) {
  "use workflow";
  const emails = await getAdminEmailsStep(orgId);

  await SendEmail(
    emails,
    "Urgent: Organization is over limit. Oldest items will be disabled automatically in 1 week.",
  );

  // await sleep("7d");
  // await sleep("1m");

  await SendEmail(
    emails,
    "System Notice: Excess equipment will be disabled to match your plan limits in one day.",
  );
  // await sleep("1d");
  // await sleep("1m");

  // Disable excess equipment
  await disableExcessStep(orgId);

  await SendEmail(
    emails,
    "System Notice: Excess equipment has been disabled to match your plan limits.",
  );

  // Clear the flag so a new workflow can be triggered if they go over limit again
  await clearWorkflowFlagStep(orgId);
}
