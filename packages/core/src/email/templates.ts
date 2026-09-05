export const welcomeTemplate = ({ name }: { name: string }) => {
  return `
    <div>
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining our platform.</p>
    </div>
  `;
};

export const emailVerificationTemplate = ({ name, url }: { name: string; url: string }) => {
  return `
    <div>
      <h1>Verify your email, ${name}</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${url}">Verify Email</a>
    </div>
  `;
};

export const forgotPasswordTemplate = ({ name, url }: { name: string; url: string }) => {
  return `
    <div>
      <h1>Reset your password, ${name}</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${url}">Reset Password</a>
    </div>
  `;
};

export const passwordChangedTemplate = ({ name }: { name: string }) => {
  return `
    <div>
      <h1>Password Changed, ${name}</h1>
      <p>Your password has been successfully changed.</p>
    </div>
  `;
};

export const emailVerificationOTPTemplate = ({ name, otp }: { name: string; otp: string }) => {
  return `
    <div>
      <h1>Verify your email, ${name}</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
    </div>
  `;
};

export const forgotPasswordOTPTemplate = ({ name, otp }: { name: string; otp: string }) => {
  return `
    <div>
      <h1>Reset your password, ${name}</h1>
      <p>Your password reset code is: <strong>${otp}</strong></p>
    </div>
  `;
};

export const signInOTPTemplate = ({ name, otp }: { name: string; otp: string }) => {
  return `
    <div>
      <h1>Sign in, ${name}</h1>
      <p>Your sign-in code is: <strong>${otp}</strong></p>
    </div>
  `;
};

// ─────────────────────────────────────────────────────────────────────────────
// Fifo Städfirma — Quote request emails
// ─────────────────────────────────────────────────────────────────────────────

export interface QuoteRequestEmailData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;   // human-readable label, e.g. "House Cleaning"
  propertySizeSqft: number;
  message?: string | null;
  submittedAt: string;   // ISO timestamp formatted for display
}

const SERVICE_LABELS: Record<string, string> = {
  house_cleaning:  "House Cleaning",
  office_cleaning: "Office Cleaning",
  moving_cleaning: "Moving Cleaning",
  deep_cleaning:   "Deep Cleaning",
};

function humanService(key: string) {
  return SERVICE_LABELS[key] ?? key;
}

/**
 * Internal notification sent to support@fifostadfirma.se when a quote
 * request is submitted. Contains all client-provided details.
 */
export function quoteRequestInternalTemplate(data: QuoteRequestEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Quote Request — Fifo Städfirma</title>
  <style>
    body  { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 14px; color: #111; background: #fff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px; }
    h1    { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; }
    th, td{ text-align: left; padding: 10px 0; border-bottom: 1px solid #e5e5e5;
            font-size: 14px; vertical-align: top; }
    th    { width: 40%; color: #555; font-weight: 500; }
    .msg  { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 4px;
            padding: 12px; margin-top: 4px; white-space: pre-wrap; }
    .foot { margin-top: 32px; font-size: 12px; color: #999; border-top: 1px solid #e5e5e5;
            padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <p style="font-size:12px;color:#999;margin:0 0 24px;">FIFO STÄDFIRMA — INTERNAL</p>
    <h1>New Quote Request</h1>
    <p class="meta">Submitted ${data.submittedAt}</p>

    <table>
      <tr><th>Name</th><td>${data.clientName}</td></tr>
      <tr><th>Email</th><td><a href="mailto:${data.clientEmail}">${data.clientEmail}</a></td></tr>
      <tr><th>Phone</th><td><a href="tel:${data.clientPhone}">${data.clientPhone}</a></td></tr>
      <tr><th>Service</th><td>${humanService(data.serviceType)}</td></tr>
      <tr><th>Property size</th><td>${data.propertySizeSqft} sq ft</td></tr>
      ${data.message ? `<tr><th>Message</th><td><div class="msg">${data.message}</div></td></tr>` : ""}
    </table>

    <div class="foot">This is an automated notification from the Fifo Städfirma website.</div>
  </div>
</body>
</html>`;
}

/**
 * Confirmation email sent to the client after a successful quote submission.
 */
export function quoteRequestConfirmationTemplate(data: QuoteRequestEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>We've received your quote request — Fifo Städfirma</title>
  <style>
    body  { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 14px; color: #111; background: #fff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 32px; letter-spacing: -0.5px; }
    h1   { font-size: 22px; font-weight: 700; margin: 0 0 12px; }
    p    { line-height: 1.6; margin: 0 0 16px; color: #333; }
    table{ width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td{ text-align: left; padding: 10px 0; border-bottom: 1px solid #e5e5e5;
            font-size: 14px; vertical-align: top; }
    th   { width: 45%; color: #555; font-weight: 500; }
    .foot{ margin-top: 40px; font-size: 12px; color: #999; border-top: 1px solid #e5e5e5;
           padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Fifo Städfirma</div>

    <h1>We've received your request</h1>
    <p>Thank you, ${data.clientName}. We've received your quote request and will be in touch within <strong>1–2 business days</strong>.</p>

    <p>Here's a summary of what you submitted:</p>

    <table>
      <tr><th>Service</th><td>${humanService(data.serviceType)}</td></tr>
      <tr><th>Property size</th><td>${data.propertySizeSqft} sq ft</td></tr>
      <tr><th>Contact email</th><td>${data.clientEmail}</td></tr>
      <tr><th>Contact phone</th><td>${data.clientPhone}</td></tr>
      ${data.message ? `<tr><th>Your note</th><td>${data.message}</td></tr>` : ""}
    </table>

    <p>If you have any urgent questions, you can reach us at <a href="mailto:support@fifostadfirma.se">support@fifostadfirma.se</a> or call us directly.</p>

    <div class="foot">
      Fifo Städfirma &nbsp;·&nbsp; Stockholm, Sweden<br />
      This email was sent to ${data.clientEmail} because you submitted a quote request on our website.
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact form notification (no auth required)
// ─────────────────────────────────────────────────────────────────────────────

export interface ContactFormEmailData {
  senderName: string;
  senderEmail: string;
  message: string;
  submittedAt: string;
}

/**
 * Internal notification sent to support@ when someone submits
 * the public /contact form.
 */
export function contactFormTemplate(data: ContactFormEmailData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Contact Message — Fifo Städfirma</title>
  <style>
    body  { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 14px; color: #111; background: #fff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px; }
    h1   { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #666; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 0; border-bottom: 1px solid #e5e5e5;
             font-size: 14px; vertical-align: top; }
    th    { width: 35%; color: #555; font-weight: 500; }
    .msg  { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 4px;
            padding: 12px; margin-top: 4px; white-space: pre-wrap; line-height: 1.6; }
    .foot { margin-top: 32px; font-size: 12px; color: #999;
            border-top: 1px solid #e5e5e5; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <p style="font-size:12px;color:#999;margin:0 0 24px;">FIFO STÄDFIRMA — CONTACT FORM</p>
    <h1>New Message</h1>
    <p class="meta">Received ${data.submittedAt}</p>

    <table>
      <tr><th>From</th><td>${data.senderName}</td></tr>
      <tr><th>Email</th><td><a href="mailto:${data.senderEmail}">${data.senderEmail}</a></td></tr>
      <tr>
        <th>Message</th>
        <td><div class="msg">${data.message}</div></td>
      </tr>
    </table>

    <div class="foot">
      Reply directly to <a href="mailto:${data.senderEmail}">${data.senderEmail}</a>.
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quote ready / closed notifications (sent to the customer by the API handler)
// ─────────────────────────────────────────────────────────────────────────────

/** Format öre (integer) to a human-readable SEK string: 150000 → "1 500 SEK" */
function formatSEK(ore: number): string {
  const sek = ore / 100;
  return (
    new Intl.NumberFormat("sv-SE", {
      minimumFractionDigits: sek % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(sek) + " SEK"
  );
}

export interface QuoteReadyEmailData {
  name: string;
  serviceType: string;   // raw key, e.g. "house_cleaning"
  quotedAmount: number;  // in öre (1/100 SEK)
  quotedMessage?: string | null;
}

/**
 * Sent to the customer when an admin attaches a price quote to their request.
 * Amount displayed in SEK. Optional admin message shown below the amount.
 * Styling: neutral palette with teal (#2A9D8F) accent — no gradients, no glow.
 */
export function quoteReadyTemplate(data: QuoteReadyEmailData): string {
  const service  = humanService(data.serviceType);
  const amount   = formatSEK(data.quotedAmount);
  const msgBlock = data.quotedMessage
    ? `<tr>
        <th>Note from us</th>
        <td><div class="msg">${data.quotedMessage}</div></td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Quote is Ready — Fifo Städfirma</title>
  <style>
    body  { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 14px; color: #1a2633; background: #fff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px; }
    .logo { font-size: 18px; font-weight: 700; color: #1a2633; margin-bottom: 32px;
            letter-spacing: -0.4px; }
    .dot  { display: inline-block; width: 8px; height: 8px; border-radius: 50%;
            background: #2A9D8F; margin-right: 6px; vertical-align: middle; }
    h1    { font-size: 22px; font-weight: 700; margin: 0 0 12px; color: #1a2633; }
    p     { line-height: 1.65; margin: 0 0 16px; color: #3d4f5c; }
    .amount-box { border: 1px solid #c8ede9; background: #f0faf9;
                  border-radius: 6px; padding: 18px 20px; margin: 24px 0; }
    .amount-label { font-size: 12px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.08em; color: #2A9D8F; display: block; margin-bottom: 4px; }
    .amount-value { font-size: 28px; font-weight: 700; color: #1a2633; }
    table { width: 100%; border-collapse: collapse; margin: 4px 0 20px; }
    th, td{ text-align: left; padding: 10px 0; border-bottom: 1px solid #e8edf0;
            font-size: 14px; vertical-align: top; }
    th    { width: 42%; color: #5a6978; font-weight: 500; }
    .msg  { background: #f7f8f9; border: 1px solid #e8edf0; border-radius: 4px;
            padding: 12px; white-space: pre-wrap; line-height: 1.6; color: #3d4f5c; }
    .cta  { display: inline-block; margin: 8px 0 24px;
            background: #2A9D8F; color: #fff; text-decoration: none;
            padding: 12px 24px; border-radius: 6px;
            font-size: 14px; font-weight: 600; }
    .foot { margin-top: 40px; font-size: 12px; color: #8a9aaa;
            border-top: 1px solid #e8edf0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo"><span class="dot"></span>Fifo Städfirma</div>
    <h1>Your quote is ready</h1>
    <p>Hi ${data.name}, we've reviewed your request and prepared a quote for you.</p>
    <div class="amount-box">
      <span class="amount-label">Quoted price</span>
      <span class="amount-value">${amount}</span>
    </div>
    <table>
      <tr><th>Service</th><td>${service}</td></tr>
      ${msgBlock}
    </table>
    <p>To proceed or ask any questions, sign in to your account or reply to this email.</p>
    <a class="cta" href="https://fifostadfirma.se/dashboard">View my requests</a>
    <p>If you'd prefer to speak with us directly, call <strong>+46 70 000 00 00</strong> (Mon–Fri 08:00–18:00).</p>
    <div class="foot">
      Fifo Städfirma &nbsp;·&nbsp; Stockholm, Sweden<br />
      This quote was sent because you submitted a request on fifostadfirma.se.
    </div>
  </div>
</body>
</html>`;
}

export interface QuoteClosedEmailData {
  name: string;
  serviceType: string;
}

/**
 * Short, polite notification sent when an admin closes/expires a quote request.
 */
export function quoteClosedTemplate(data: QuoteClosedEmailData): string {
  const service = humanService(data.serviceType);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Quote Request Has Been Closed — Fifo Städfirma</title>
  <style>
    body  { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            font-size: 14px; color: #1a2633; background: #fff; margin: 0; padding: 0; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px; }
    .logo { font-size: 18px; font-weight: 700; color: #1a2633; margin-bottom: 32px;
            letter-spacing: -0.4px; }
    .dot  { display: inline-block; width: 8px; height: 8px; border-radius: 50%;
            background: #2A9D8F; margin-right: 6px; vertical-align: middle; }
    h1    { font-size: 22px; font-weight: 700; margin: 0 0 12px; color: #1a2633; }
    p     { line-height: 1.65; margin: 0 0 16px; color: #3d4f5c; }
    .service-tag { display: inline-block; background: #f0faf9; border: 1px solid #c8ede9;
                   border-radius: 4px; padding: 3px 10px; font-size: 13px;
                   color: #2A9D8F; font-weight: 500; margin-bottom: 20px; }
    .cta  { display: inline-block; margin: 4px 0 24px;
            background: #2A9D8F; color: #fff; text-decoration: none;
            padding: 12px 24px; border-radius: 6px;
            font-size: 14px; font-weight: 600; }
    .foot { margin-top: 40px; font-size: 12px; color: #8a9aaa;
            border-top: 1px solid #e8edf0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo"><span class="dot"></span>Fifo Städfirma</div>
    <h1>Your request has been closed</h1>
    <p>Hi ${data.name},</p>
    <div class="service-tag">${service}</div>
    <p>Your quote request for <strong>${service}</strong> has been closed. This can happen if the request expired or was resolved outside the platform.</p>
    <p>If you're still interested, we'd love to help — simply submit a new request and we'll be in touch within 1–2 business days.</p>
    <a class="cta" href="https://fifostadfirma.se/#quote">Request a new quote</a>
    <p style="font-size:13px;color:#5a6978;">
      Questions? Email <a href="mailto:support@fifostadfirma.se">support@fifostadfirma.se</a>
      or call <strong>+46 70 000 00 00</strong>.
    </p>
    <div class="foot">
      Fifo Städfirma &nbsp;·&nbsp; Stockholm, Sweden<br />
      This email was sent because you submitted a quote request on fifostadfirma.se.
    </div>
  </div>
</body>
</html>`;
}
