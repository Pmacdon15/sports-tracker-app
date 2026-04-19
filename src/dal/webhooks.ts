import { clerkClient } from "@clerk/nextjs/server";
import { insertOrganizationDb } from "@/db/organizations";

export async function handleSubscriptionUpdate(
  userId: string | undefined,
  orgId: string | undefined,
) {
  console.log("handleSubscriptionUpdate called with:", { userId, orgId });
  if (!userId) {
    console.log("No userId provided, returning early");
    return;
  }

  const clerk = await clerkClient();

  try {
    let subscription:any;
    if (orgId) {
      console.log("Fetching subscription for org:", orgId);
      subscription =
        await clerk.billing.getOrganizationBillingSubscription(orgId);
    } else {
      console.log("No orgId, fetching subscription for user:", userId);
      subscription = await clerk.billing.getUserBillingSubscription(userId);
    }

    console.log("Subscription fetched:", JSON.stringify(subscription, null, 2));

    if (!subscription) {
      console.log("No subscription found");
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { maxOrgs: 1 },
      });
      return;
    }

    const features =
      subscription.subscriptionItems.flatMap((item: any) => {
        const itemFeatures = item.features || [];
        const planFeatures = item.plan?.features || [];
        return [...itemFeatures, ...planFeatures];
      }) || [];

    console.log("Extracted features:", features);
    let maxOrgs = 1;
    if (features.includes("2_organizations")) maxOrgs = 2;
    // if (features.includes("4_organization")) maxOrgs = 4;

    console.log("Updating user metadata for", userId, "with maxOrgs:", maxOrgs);
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        maxOrgs,
      },
    });
    console.log("User metadata updated successfully");
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
