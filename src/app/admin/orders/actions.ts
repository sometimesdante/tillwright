"use server";

import { nanoid } from "nanoid";
import { createAdminClient } from "@/utils/supabase/admin";
import { getViewer } from "@/utils/orders/auth";
import { notifyOrderDispatched } from "@/utils/orders/notifications";

const DELIVERY_STATUSES = ["pending", "out for delivery", "delivered", "cancelled"];

type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

// Changes an order's delivery status. Cancelling puts its stock back;
// un-cancelling takes it again. Only "out for delivery" sends the dispatch
// message, once.
export async function updateDeliveryStatus(
  orderId: number,
  status: string,
): Promise<ActionResult> {
  const { isAdmin } = await getViewer();
  if (!isAdmin) return { ok: false, error: "Only admins can change orders." };
  if (!DELIVERY_STATUSES.includes(status)) {
    return { ok: false, error: "Unknown delivery status." };
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("transactions")
    .select()
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false, error: "Order not found." };
  if (order.delivery_status === status) return { ok: true };

  const items = (Array.isArray(order.products) ? order.products : [])
    .filter((p: { id?: number }) => Number(p?.id) > 0)
    .map(({ id, count }: { id: number; count: number }) => ({ id, count }));

  let stockReserved = order.stock_reserved;
  if (status === "cancelled" && stockReserved) {
    await admin.rpc("adjust_stock", { items, direction: 1 });
    stockReserved = false;
  } else if (
    order.delivery_status === "cancelled" &&
    !stockReserved &&
    (order.payment_status === "cod" || order.payment_status === "paid")
  ) {
    await admin.rpc("adjust_stock", { items, direction: -1 });
    stockReserved = true;
  }

  const { error } = await admin
    .from("transactions")
    .update({ delivery_status: status, stock_reserved: stockReserved })
    .eq("id", orderId);
  if (error) {
    console.error("Updating delivery status:", error);
    return { ok: false, error: "Couldn't save the status. Try again." };
  }

  if (status === "out for delivery") {
    await notifyOrderDispatched(order);
  }
  return { ok: true };
}

// A one-line invoice for a sale made outside the store. The invoice number
// comes from the same database sequence as every other order, so the GST
// series has no gaps or duplicates.
export async function createCustomInvoice(input: {
  amount: number;
  description: string;
}): Promise<ActionResult<{ orderId: number }>> {
  const { isAdmin } = await getViewer();
  if (!isAdmin) return { ok: false, error: "Only admins can create invoices." };

  const amount = Math.round(Number(input?.amount) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 10_000_000) {
    return { ok: false, error: "Enter an amount greater than zero." };
  }
  const description = String(input?.description ?? "").trim().slice(0, 120) || "Miscellaneous";

  const admin = createAdminClient();
  const { data: saved, error } = await admin
    .from("transactions")
    .insert({
      transaction_id: `MANUAL-${nanoid(10)}`,
      payment_status: "manual",
      razorpay_id: "Not Applicable",
      delivery_status: "delivered",
      amount,
      products: [
        {
          id: 0,
          name: description,
          category: "Others",
          mrp: amount,
          pretax: amount,
          tax: 0,
          price: amount,
          count: 1,
        },
      ],
    })
    .select("id")
    .single();
  if (error || !saved) {
    console.error("Creating custom invoice:", error);
    return { ok: false, error: "Couldn't create the invoice. Try again." };
  }

  await admin.rpc("assign_invoice_number", { order_id: saved.id });
  return { ok: true, orderId: saved.id };
}
