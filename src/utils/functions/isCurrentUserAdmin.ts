"use server";

import { createClient } from "@/utils/supabase/server";

export async function isCurrentUserAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", user.email)
    .single();

  return data?.role === "admin";
}
