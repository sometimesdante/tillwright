"use server";

import { createClient } from "@/utils/supabase/server";
import { fetchTransaction } from "@/utils/functions/fetchTransaction";
import { handleWhatsapp } from "@/utils/functions/handleWhatsapp";
import { handleDispatchWhatsapp } from "@/utils/functions/handleDispatchWhatsapp";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";

// Server actions so the WhatsApp token never reaches the browser.
// Order details are looked up here rather than trusted from the client.

export async function notifyOrderPlaced(transaction_id: string) {
  const order = await fetchTransaction(transaction_id);
  if (!order) return;

  await handleWhatsapp(
    order.phone,
    order.name,
    formatInvoiceNo(order.invoice_id, order.created_at) ?? "",
    "tomorrow",
  );
}

export async function notifyOrderDispatched(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return;

  const role = await supabase
    .from("profiles")
    .select()
    .eq("email", data.user.email)
    .single();
  if (role.data?.role !== "admin") return;

  const { data: order } = await supabase
    .from("transactions")
    .select()
    .eq("id", id)
    .single();
  if (!order) return;

  await handleDispatchWhatsapp(
    order.phone,
    order.name,
    formatInvoiceNo(order.invoice_id, order.created_at) ?? "",
  );
}
