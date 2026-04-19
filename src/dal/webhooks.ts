import { clerkClient } from "@clerk/nextjs/server";
import { insertOrganizationDb } from "@/db/organizations";

export async function handleSubscriptionUpdate(
  email: string | undefined,
  orgId: string | undefined,
) {
  const clerk = await clerkClient();

  try {
    const userPromise = email
      ? clerk.users.getUserList({ emailAddress: [email], limit: 1 })
      : Promise.resolve(null);

    const orgSubPromise = orgId
      ? clerk.billing.getOrganizationBillingSubscription(orgId)
      : Promise.resolve(null);

    const [userResponse, orgSubscription] = await Promise.all([
      userPromise,
      orgSubPromise,
    ]);

    const user = userResponse?.data?.[0];
    const userId = user?.id;

    if (!userId) {
      return;
    }

    let subscription = orgSubscription;

    if (!orgId) {
      subscription = await clerk.billing.getUserBillingSubscription(userId);
    }

    if (!subscription) {
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { maxOrgs: 1 },
      });
      return;
    }

    const features =
      subscription.subscriptionItems?.flatMap((item: any) => {
        const itemFeatures = item.features || [];
        const planFeatures = item.plan?.features || [];
        return [...itemFeatures, ...planFeatures];
      }) || [];

    let maxOrgs = 1;
    if (features.includes("2_organizations")) maxOrgs = 2;

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        maxOrgs,
      },
    });
  } catch (error) {
    if (email) {
      const userSearch = await clerk.users.getUserList({
        emailAddress: [email],
        limit: 1,
      });
      const fallbackId = userSearch?.data?.[0]?.id;
      if (fallbackId) {
        await clerk.users.updateUserMetadata(fallbackId, {
          publicMetadata: { maxOrgs: 1 },
        });
      }
    }
  }
}

export async function handleOrganizationCreated(
  orgId: string,
  orgName: string,
) {
  await insertOrganizationDb(orgId, orgName);
}
