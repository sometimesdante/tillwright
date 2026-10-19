import "server-only";

import { createClient } from "@supabase/supabase-js";
import { TILLWRIGHT_SCHEMA } from "./config";

// Service-role client for trusted server code: placing orders, verifying
// payments, invoice numbers, stock and notifications. It bypasses row-level
// security, so never pass its results to the browser without checking who is
// asking. The "server-only" import makes the build fail if a client component
// imports this file.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set on the server.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: TILLWRIGHT_SCHEMA },
  });
}
