import { clerkClient } from "@clerk/nextjs/server";
import { insertOrganizationDb } from "@/db/organizations";

export async function handleSubscriptionUpdate(
  userId: string | undefined,
  orgId: string,
) {
  if (!userId) return;

  const clerk = await clerkClient();

  try {
    const subscription =
      await clerk.billing.getOrganizationBillingSubscription(orgId);
    const features =
      subscription.subscriptionItems.flatMap((plan: any) => plan.features) ||
      [];

    console.log("features: " + JSON.stringify(features, null, 2));
    let maxOrgs = 1;
    if (features.includes("2_organizations")) maxOrgs = 2;
    // if (features.includes("4_organization")) maxOrgs = 4;

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        maxOrgs,
      },
    });
  } catch (error) {
    console.error("Error updating org amount limit: ", error);
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { maxOrgs: 1 },
    });
  }
}

export async function handleOrganizationCreated(
  orgId: string,
  orgName: string,
) {
  await insertOrganizationDb(orgId, orgName);
}
