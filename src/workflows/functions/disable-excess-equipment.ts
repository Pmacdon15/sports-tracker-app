import { clerkClient } from "@clerk/nextjs/server";
import { disableExcessEquipmentDb } from "@/db/equipment-retirement";

export async function disableExcessStep(orgId: string) {
  "use step";
  console.log("Executing disablement step for org:", orgId);

  const clerk = await clerkClient();
  const orgSub = await clerk.billing.getOrganizationBillingSubscription(orgId);

  const features =
    orgSub?.subscriptionItems?.flatMap((item: any) => {
      const itemFeatures = item.features || [];
      const planFeatures = item.plan?.features || [];
      return [...itemFeatures, ...planFeatures];
    }) || [];

  const slugs = features.map((f: any) => f.slug);
  console.log("Features: ", slugs);

  let limit = 10;
  if (slugs.includes("10_inventory_items")) limit = 10;
  if (slugs.includes("50_inventory_items")) limit = 50;
  if (slugs.includes("200_inventory_items")) limit = 200;

  await disableExcessEquipmentDb(orgId, limit);
}
