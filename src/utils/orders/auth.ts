import "server-only";

import { createClient } from "@/utils/supabase/server";

// The signed-in user and whether they are an admin (profiles.role = 'admin').
// Uses the visitor's own session, so row-level security still applies.
export async function getViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { supabase, user: null, isAdmin: false };

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();
  return { supabase, user, isAdmin: data?.role === "admin" };
}
