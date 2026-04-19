import { clerkClient } from "@clerk/nextjs/server";
import {
  insertOrganizationDb,
  updateOrganizationEquipmentLimitDb,
} from "@/db/organizations";

export async function handleSubscriptionUpdate(
  userId: string | undefined,
  orgId: string | undefined,
) {
  console.log("handleSubscriptionUpdate called with:", { userId, orgId });
  if (!userId && !orgId) {
    console.log("No userId or orgId provided, returning early");
    return;
  }

  const clerk = await clerkClient();

  try {
    let subscription: any;
    if (orgId) {
      console.log("Fetching subscription for org:", orgId);
      subscription =
        await clerk.billing.getOrganizationBillingSubscription(orgId);
    } else if (userId) {
      console.log("No orgId, fetching subscription for user:", userId);
      subscription = await clerk.billing.getUserBillingSubscription(userId);
    }

    console.log("Subscription fetched:", JSON.stringify(subscription, null, 2));

    if (!subscription) {
      console.log("No subscription found");
      if (userId) {
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: { maxOrgs: 1 },
        });
      }
      return;
    }

    const features =
      subscription.subscriptionItems.flatMap((item: any) => {
        const itemFeatures = item.features || [];
        const planFeatures = item.plan?.features || [];
        return [...itemFeatures, ...planFeatures];
      }) || [];

    console.log("Extracted features:", features);

    // Update Organization Equipment Limit if orgId is present
    if (orgId) {
      let equipmentLimit = 10;
      if (features.includes("200_inventory_items")) equipmentLimit = 200;
      else if (features.includes("50_inventory_items")) equipmentLimit = 50;

      console.log(
        `Updating org ${orgId} equipment limit in DB to ${equipmentLimit}`,
      );
      await updateOrganizationEquipmentLimitDb(orgId, equipmentLimit);
    }

    // Update User Metadata if userId is present
    if (userId) {
      let maxOrgs = 1;
      if (features.includes("2_organizations")) maxOrgs = 2;
      // if (features.includes("4_organization")) maxOrgs = 4;

      console.log(
        "Updating user metadata for",
        userId,
        "with maxOrgs:",
        maxOrgs,
      );
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          maxOrgs,
        },
      });
      console.log("User metadata updated successfully");
    }
  } catch (error) {
    console.error("Error updating subscription details: ", error);
    if (userId) {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { maxOrgs: 1 },
      });
    }
  }
}

export async function handleOrganizationCreated(
  orgId: string,
  orgName: string,
) {
  await insertOrganizationDb(orgId, orgName);
}
