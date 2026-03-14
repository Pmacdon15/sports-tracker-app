import { clerkClient } from "@clerk/nextjs/server";
import {
  updateOrganizationEquipmentLimitDb,
  upsertOrganizationDb,
} from "@/db/organizations";

export async function handleSubscriptionUpdate({
  orgId,
  plan,
}: {
  orgId: string;
  plan: string;
}) {
  console.log(
    `Subscription update for organization ${orgId} with plan ${plan}`,
  );

  const clerk = await clerkClient();

  if (plan === "free") {
    await clerk.organizations.updateOrganization(orgId, {
      maxAllowedMemberships: 1,
    });
    await updateOrganizationEquipmentLimitDb(orgId, 10);
  } else if (plan === "basic") {
    await clerk.organizations.updateOrganization(orgId, {
      maxAllowedMemberships: 4,
    });
    await updateOrganizationEquipmentLimitDb(orgId, 50);
  }
}

export async function handleOrganizationCreated(
  orgId: string,
  orgName: string,
) {
  await upsertOrganizationDb(orgId, orgName);
}
