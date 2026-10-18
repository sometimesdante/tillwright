import { createClient } from "@/utils/supabase/server";

export async function fetchTransaction(transaction_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select()
    .eq("transaction_id", transaction_id);

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}
