import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || "re_dummy");
  }
  return resendInstance;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using Resend.
 * 
 * Errors are logged but not thrown, so a failed email never crashes the auth flow.
 * 
 * @param options - Email options
 * @returns Promise<boolean> - true if sent successfully, false if failed
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM_NOREPLY || "noreply@ghostcod.com",
  replyTo = process.env.EMAIL_REPLY_TO || "support@ghostcod.com",
}: SendEmailOptions): Promise<boolean> {
  try {
    const result = await getResend().emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    if (result.error) {
      console.error("[sendEmail] Resend error:", result.error);
      return false;
    }

    console.log(`[sendEmail] Email sent successfully to ${to} (ID: ${result.data?.id})`);
    return true;
  } catch (error) {
    console.error("[sendEmail] Failed to send email:", error);
    return false;
  }
}
