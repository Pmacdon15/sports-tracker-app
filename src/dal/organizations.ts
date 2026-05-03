import { clerkClient } from "@clerk/nextjs/server";
import { getAllOrganizationsDb } from "@/db/organizations";

export async function getAllOrganizationsWithLimits() {
  const orgs = await getAllOrganizationsDb();
  const clerk = await clerkClient();

  const results = await Promise.all(
    orgs.map(async (org) => {
      try {
        const orgId = org.org_id;
        const orgSubscription = await clerk.billing.getOrganizationBillingSubscription(orgId);

        const features =
          orgSubscription?.subscriptionItems?.flatMap((item: any) => {
            const itemFeatures = item.features || [];
            const planFeatures = item.plan?.features || [];
            return [...itemFeatures, ...planFeatures];
          }) || [];

        const slugs = features.map((f: any) => f.slug);
        console.log(`Features for org ${orgId}: `, slugs);

        let equipmentLimit = 10;
        if (slugs.includes("50_inventory_items")) equipmentLimit = 50;
        if (slugs.includes("200_inventory_items")) equipmentLimit = 200;

        let maxOrgs = 1;
        if (slugs.includes("2_organizations")) maxOrgs = 2;

        // Note: We are not updating user.createOrganizationsLimit here 
        // because we don't have the userId in this context easily,
        // and it's better handled in webhooks. 
        // We focus on the equipmentLimit for rebalancing.

        return {
          ...org,
          equipmentLimit,
          maxOrgs,
          slugs
        };
      } catch (error) {
        console.error(`Error fetching subscription for org ${org.org_id}:`, error);
        return {
          ...org,
          equipmentLimit: 10, // Default fallback
          maxOrgs: 1,
          slugs: []
        };
      }
    })
  );

  return results;
}
