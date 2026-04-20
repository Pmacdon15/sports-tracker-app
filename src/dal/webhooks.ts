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

    const features =
      orgSubscription?.subscriptionItems?.flatMap((item: any) => {
        const itemFeatures = item.features || [];
        const planFeatures = item.plan?.features || [];
        return [...itemFeatures, ...planFeatures];
      }) || [];

    const slugs = features.map((f: any) => f.slug);
    console.log("Features: ", slugs);

    let maxOrgs = 1;
    if (slugs.includes("2_organizations")) maxOrgs = 2;

    await clerk.users.
    (userId, {
      createOrganizationsLimit: maxOrgs,
    });
  } catch (error) {
    console.error("Error updating subscription features");
  }
}

export async function handleOrganizationCreated(
  orgId: string,
  orgName: string,
) {
  await insertOrganizationDb(orgId, orgName);
}
