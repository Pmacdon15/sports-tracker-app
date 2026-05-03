import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/render";
import { EmailTemplate } from "@/components/email-templates/contact-email";

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function SendEmail(
  emails: string[],
  message: string,
) {
  "use step";
  if (!emails || emails.length === 0) {
    console.log("No emails to send to.");
    return;
  }

  const html = await render(<EmailTemplate message={message} />);
  
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `[Sports Tracker] ${message.split(".")[0]}`,
      },
    },
    Source: process.env.AWS_SES_FROM_EMAIL || "Sports Tracker <sports-tracker@notifications.patmac.ca>",
  });

  try {
    await ses.send(command);
  } catch (error) {
    console.error("SES error:", error);
    // throw new Error("Error sending reminder email via SES");
  }
}
