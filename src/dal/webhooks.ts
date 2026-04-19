import { clerkClient } from "@clerk/nextjs/server";
import { insertOrganizationDb } from "@/db/organizations";

export async function handleSubscriptionUpdate(
  userId: string | undefined,
  orgId: string | undefined, 
) {
  console.log("handleSubscriptionUpdate called with:", {
    userId,
    orgId,   
  });

  const clerk = await clerkClient();

  if (!userId) {
    console.error("Could not determine target user ID for subscription update");
    return;
  }

  try {
    let subscription: any;
    if (orgId) {
      console.log("Fetching subscription for org:", orgId);
      subscription =
        await clerk.billing.getOrganizationBillingSubscription(orgId);
    } else {
      console.log("No orgId, fetching subscription for user:", userId);
      subscription =
        await clerk.billing.getUserBillingSubscription(userId);
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

    console.log(
      "Updating user metadata for",
      targetUserId,
      "with maxOrgs:",
      maxOrgs,
    );
    await clerk.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        maxOrgs,
      },
    });
    console.log("User metadata updated successfully");
  } catch (error) {
    console.error("Error updating user maxOrgs: ", error);
    await clerk.users.updateUserMetadata(targetUserId, {
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
