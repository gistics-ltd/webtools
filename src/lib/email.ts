import nodemailer, { type Transporter } from "nodemailer";
import { pricingConfig } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import type { EstimateResult } from "@/lib/pricing";
import type { QuoteRequestInput } from "@/lib/quote-schema";
import { formatUGX } from "@/lib/format";

export type QuoteEmailContext = {
  request: QuoteRequestInput;
  vehicleName: string;
  routeName: string;
  estimate: EstimateResult;
  requestId: string;
  submittedAt: Date;
};

let transporter: Transporter | null = null;

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? "");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";
  const to = process.env.QUOTE_TO_EMAIL?.trim();
  const from = process.env.QUOTE_FROM_EMAIL?.trim();

  return { host, port, user, pass, secure, to, from };
}

export function isSmtpConfigured(): boolean {
  const { host, port, to, from } = smtpConfig();
  return Boolean(host && Number.isFinite(port) && port > 0 && to && from);
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const { host, port, user, pass, secure } = smtpConfig();

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });

  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatKampalaTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: siteConfig.timeZone,
  }).format(date);
}

function estimateLines(context: QuoteEmailContext): string[] {
  const { estimate } = context;
  if (estimate.isCustomRoute) {
    return ["Estimate: Price on request (custom route)"];
  }

  const lines = [
    `Base (${context.vehicleName} x ${context.request.days} day(s)): ${formatUGX(estimate.baseUGX)}`,
  ];
  if (estimate.discountPct > 0) {
    lines.push(
      `Long-stay discount (${estimate.discountPct}%): -${formatUGX(estimate.discountUGX)}`,
    );
  }
  lines.push(`Route charge: ${formatUGX(estimate.routeChargeUGX)}`);
  lines.push(
    `Driver fee: ${estimate.driverFeeUGX > 0 ? formatUGX(estimate.driverFeeUGX) : "Not selected"}`,
  );
  lines.push(`Total excluding VAT: ${formatUGX(estimate.totalExVatUGX)}`);
  lines.push(
    `VAT at ${pricingConfig.vatPct}% (for information): ${formatUGX(estimate.vatUGX)}`,
  );
  lines.push(`Total including VAT (for information): ${formatUGX(estimate.totalIncVatUGX)}`);
  lines.push(`USD guide: approx US$${estimate.usdApprox} at ${formatUGX(estimate.usdRateUGX)}/US$`);
  return lines;
}

function buildTeamText(context: QuoteEmailContext): string {
  const request = context.request;
  return [
    `New car hire quote request [${context.requestId}]`,
    "",
    `Vehicle: ${context.vehicleName}`,
    `Route: ${context.routeName}`,
    `Days: ${request.days}`,
    `Passengers: ${request.passengers}`,
    `Driver: ${request.withDriver ? "With driver" : "Self-drive"}`,
    "",
    `Name: ${request.fullName}`,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    `Pickup date: ${request.pickupDate}`,
    `Pickup location: ${request.pickupLocation}`,
    `Notes: ${request.notes || "None"}`,
    "",
    "Pricing recomputed on the server:",
    ...estimateLines(context),
    "",
    `Submitted: ${formatKampalaTime(context.submittedAt)} (Africa/Kampala)`,
    `Reference: ${context.requestId}`,
  ].join("\n");
}

function buildTeamHtml(context: QuoteEmailContext): string {
  const request = context.request;
  const rows: Array<[string, string]> = [
    ["Vehicle", context.vehicleName],
    ["Route", context.routeName],
    ["Days", String(request.days)],
    ["Passengers", String(request.passengers)],
    ["Driver", request.withDriver ? "With driver" : "Self-drive"],
    ["Name", request.fullName],
    ["Phone", request.phone],
    ["Email", request.email],
    ["Pickup date", request.pickupDate],
    ["Pickup location", request.pickupLocation],
    ["Notes", request.notes || "None"],
    ["Submitted", `${formatKampalaTime(context.submittedAt)} (Africa/Kampala)`],
    ["Reference", context.requestId],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#52525b;vertical-align:top">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;color:#0d0d0d;font-weight:600">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const estimateHtml = estimateLines(context)
    .map((line) => `<li style="margin:2px 0">${escapeHtml(line)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#0d0d0d">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-top:6px solid #e83e1c;padding:24px">
      <h1 style="font-size:22px;margin:0 0 4px">New quote request</h1>
      <p style="margin:0 0 18px;color:#52525b">Reference ${escapeHtml(context.requestId)}</p>
      <table style="border-collapse:collapse;font-size:14px;width:100%">${tableRows}</table>
      <h2 style="font-size:16px;margin:22px 0 8px">Server-recomputed estimate</h2>
      <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.5">${estimateHtml}</ul>
      <p style="margin:18px 0 0;font-size:12px;color:#71717a">
        Estimate only, excluding VAT (${pricingConfig.vatPct}%), and not a confirmed price.
      </p>
    </div>
  </body>
</html>`;
}

function buildCustomerText(context: QuoteEmailContext): string {
  return [
    `Hello ${context.request.fullName},`,
    "",
    "We have received your car hire request and will respond shortly.",
    "",
    `Reference: ${context.requestId}`,
    `Vehicle: ${context.vehicleName}`,
    `Route: ${context.routeName}`,
    `Days: ${context.request.days}`,
    `Driver: ${context.request.withDriver ? "With driver" : "Self-drive"}`,
    `Pickup date: ${context.request.pickupDate}`,
    "",
    "Your request is not a confirmed booking. We will confirm availability and the final price before you pay anything.",
    "",
    `Phone: ${siteConfig.phone.display}`,
    `WhatsApp: https://wa.me/${siteConfig.whatsapp.number}`,
    `Email: ${siteConfig.email}`,
    "",
    `${siteConfig.name}`,
  ].join("\n");
}

function buildCustomerHtml(context: QuoteEmailContext): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#0d0d0d">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-top:6px solid #e83e1c;padding:24px">
      <h1 style="font-size:22px;margin:0 0 12px">We've received your request</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 12px">Hello ${escapeHtml(
        context.request.fullName,
      )},</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
        Thank you for contacting Gistics Limited. We have received your car hire request and will
        respond shortly with availability and a final price.
      </p>
      <p style="font-size:14px;margin:0 0 16px;padding:12px;background:#0d0d0d;color:#e8ae1c;font-weight:700">
        Reference: ${escapeHtml(context.requestId)}
      </p>
      <p style="font-size:14px;line-height:1.7;margin:0 0 16px">
        ${escapeHtml(context.vehicleName)}<br />
        ${escapeHtml(context.routeName)}<br />
        ${context.request.days} day(s) · ${
          context.request.withDriver ? "With driver" : "Self-drive"
        }<br />
        Pickup: ${escapeHtml(context.request.pickupDate)}
      </p>
      <p style="font-size:13px;line-height:1.6;color:#52525b;margin:0 0 16px">
        This is not a confirmed booking. We will confirm availability and the final price before
        you pay anything.
      </p>
      <p style="font-size:14px;line-height:1.8;margin:0">
        Phone: ${escapeHtml(siteConfig.phone.display)}<br />
        WhatsApp: <a href="https://wa.me/${siteConfig.whatsapp.number}">wa.me/${
          siteConfig.whatsapp.number
        }</a><br />
        Email: <a href="mailto:${escapeHtml(siteConfig.email)}">${escapeHtml(siteConfig.email)}</a>
      </p>
      <p style="font-size:13px;color:#71717a;margin:20px 0 0">${escapeHtml(siteConfig.name)}</p>
    </div>
  </body>
</html>`;
}

function sendCustomerConfirmation(): boolean {
  return process.env.SEND_CUSTOMER_CONFIRMATION !== "false";
}

export async function sendQuoteEmails(context: QuoteEmailContext): Promise<void> {
  const { from, to } = smtpConfig();
  const transport = getTransporter();
  const subject = `Quote request: ${context.vehicleName} – ${context.request.days} day(s) – ${context.routeName} [${context.requestId}]`;

  await transport.sendMail({
    from,
    to,
    replyTo: context.request.email,
    subject,
    text: buildTeamText(context),
    html: buildTeamHtml(context),
  });

  if (sendCustomerConfirmation()) {
    try {
      await transport.sendMail({
        from,
        to: context.request.email,
        replyTo: to,
        subject: `We've received your quote request [${context.requestId}] – ${siteConfig.name}`,
        text: buildCustomerText(context),
        html: buildCustomerHtml(context),
      });
    } catch (error) {
      // The lead has already reached the team; a failed acknowledgement should
      // not turn a successful submission into an error for the customer.
      console.error(
        "[quote] customer confirmation failed",
        context.requestId,
        error instanceof Error ? error.message : "unknown error",
      );
    }
  }
}
