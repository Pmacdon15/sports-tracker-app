import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import {
  handleOrganizationCreated,
  handleSubscriptionUpdate,
} from "@/dal/webhooks";
export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET as string,
    })) as WebhookEvent;

    switch (evt.type) {
      case "subscriptionItem.active": {
        const data = evt.data;

        const plan = data.plan?.slug;
        const orgId = data.payer?.organization_id;
        const userId = data.payer?.user_id;

        if (plan && orgId) {
          await handleSubscriptionUpdate(userId, orgId);
        }
        break;
      }
      case "organization.created": {
        const orgId = evt.data.id;
        const orgName = evt.data.name;
        await handleOrganizationCreated(orgId, orgName);
        break;
      }
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook Error:", err);
    return new Response("Server Error", { status: 500 });
  }
}
