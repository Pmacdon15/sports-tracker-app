import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import {
  handleOrganizationCreated,
  handleSubscriptionUpdate,
} from "@/dal/webhooks";

export async function POST(req: NextRequest) {
  console.log("Webhook POST received");
  
  let evt: WebhookEvent;
  try {
    evt = (await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET as string,
    })) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  console.log("Webhook verified, type:", evt.type);

  try {
    switch (evt.type) {
      case "subscriptionItem.active": {
        const data = evt.data as any;
        console.log("Subscription data:", JSON.stringify(data, null, 2));

      
        // const userId = data.payer?.user_id || data.user_id || data.customer_id;
        const orgId = data.payer?.organization_id || data.organization_id;
        const email = data.payer?.email || data.email;

        console.log("Extracted identifiers:", { email, orgId});

        if ( orgId || email) {
          await handleSubscriptionUpdate(email, orgId);
        } else {
          console.error("No userId, orgId, or email found in subscriptionItem.active event data");
        }
        break;
      }
      case "organization.created": {
        const orgId = evt.data.id;
        const orgName = evt.data.name;
        await handleOrganizationCreated(orgId, orgName);
        break;
      }
      default:
        console.log("Unhandled event type:", evt.type);
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Error processing webhook", { status: 500 });
  }
}
