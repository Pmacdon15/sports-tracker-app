import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/contact-email";

export async function SendEmail(
  // writable: WritableStream,
  emails: string[],
  message: string,
) {
  "use step";
  if (!emails || emails.length === 0) {
    console.log("No emails to send to.");
    return;
  }
  // const writer = writable.getWriter();

  // await writer.write(new TextEncoder().encode(`message`));
  // writer.releaseLock();

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: "Sports Tracker <notificationsg@resend.dev>",
    to: emails,
    subject: `[Sports Tracker] ${message.split(".")[0]}`,
    react: EmailTemplate({
      message: message,
    }),
  });
  if (error) {
    console.error("Resend error:", error);
    throw new Error("Error sending reminder email");
  }
  if (data !== null) return;
}
