import { createBrowserClient } from "@supabase/ssr";
import { TILLWRIGHT_SCHEMA } from "./config";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { db: { schema: TILLWRIGHT_SCHEMA } }
  );
}
