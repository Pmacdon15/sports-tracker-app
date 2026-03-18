import { clerkClient } from "@clerk/nextjs/server";

export async function getAdminEmailsStep(
  organizationId: string,
): Promise<string[]> {
  "use step";
    try {
    const client = await clerkClient();

    const { data: memberships } =
      await client.organizations.getOrganizationMembershipList({
        organizationId,
      });

    const adminEmails = memberships
      .filter((mem) => mem.role === "org:admin")
      .map((mem) => mem.publicUserData?.identifier)
      .filter((email): email is string => Boolean(email));

    return adminEmails;
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    return [];
  }
}
