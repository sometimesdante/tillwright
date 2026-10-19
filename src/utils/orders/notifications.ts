import "server-only";

import { Resend } from "resend";
import { OrderPlacedTemplate } from "@/ui/Components/email-order-place";
import { OrderConfirmationTemplate } from "@/ui/Components/email-order-confirm";
import { handleWhatsapp } from "@/utils/functions/handleWhatsapp";
import { handleDispatchWhatsapp } from "@/utils/functions/handleDispatchWhatsapp";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";
import { siteConfig } from "@/utils/siteConfig";

// Order notifications, sent from server code only. They used to go through
// public /api routes that anyone could call with a transaction_id.

type NotifiableOrder = {
  invoice_id: number | null;
  created_at: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payment_status: string;
  products: unknown;
};

function resend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const whatsappConfigured = () =>
  Boolean(process.env.WHATSAPP_URL && process.env.WHATSAPP_TOKEN);

// A failed email or message must never fail the order, so each one is
// attempted independently and errors are logged.
export async function notifyOrderPlaced(order: NotifiableOrder) {
  const orderNumber = formatInvoiceNo(order.invoice_id, order.created_at) ?? "";
  const mail = resend();
  const tasks: Promise<unknown>[] = [];

  if (mail) {
    tasks.push(
      mail.emails.send({
        from: siteConfig.emailFrom,
        to: [siteConfig.adminEmail],
        subject: `New order ${orderNumber}`,
        react: OrderPlacedTemplate({
          transaction_id: orderNumber,
          email: order.email ?? "",
          payment_status: order.payment_status,
          products: order.products as any[],
        }),
      }),
    );
    if (order.email) {
      tasks.push(
        mail.emails.send({
          from: siteConfig.emailFrom,
          to: [order.email],
          subject: `Order ${orderNumber} is confirmed`,
          react: OrderConfirmationTemplate({ firstName: order.name ?? "there" }),
        }),
      );
    }
  } else {
    console.warn("RESEND_API_KEY is not set; skipping order emails.");
  }

  if (whatsappConfigured() && order.phone) {
    tasks.push(
      handleWhatsapp(order.phone, order.name ?? "", orderNumber, "tomorrow"),
    );
  }

  for (const result of await Promise.allSettled(tasks)) {
    if (result.status === "rejected") {
      console.error("Order notification failed:", result.reason);
    }
  }
}

export async function notifyOrderDispatched(order: NotifiableOrder) {
  if (!whatsappConfigured() || !order.phone) return;
  try {
    await handleDispatchWhatsapp(
      order.phone,
      order.name ?? "",
      formatInvoiceNo(order.invoice_id, order.created_at) ?? "",
    );
  } catch (err) {
    console.error("Dispatch notification failed:", err);
  }
}
