import { createClient } from "../supabase/client";

export async function fetchInvoiceNumber() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("invoice_id")
    .order("invoice_id", { ascending: false })
    .not("invoice_id", "is", null)
    .limit(1);

  if (error) {
    throw new Error(error.message);
  }
  const maxInvoice = data[0]?.invoice_id || 0;

  return maxInvoice + 1;
}
