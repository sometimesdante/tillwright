// Where this app keeps its data in a Supabase project it may share with other
// apps. Everything lives in the tillwright schema and the tillwright bucket;
// nothing here touches the public schema or another app's buckets. The same
// names are hard-coded in supabase/schema.sql.

export const TILLWRIGHT_SCHEMA = "tillwright";
export const STORAGE_BUCKET = "tillwright";
// Product images are stored under this folder inside STORAGE_BUCKET.
export const PRODUCT_IMAGE_FOLDER = "products";
// Stored in auth user_metadata on sign-up. The profile trigger only creates a
// tillwright.profiles row for users that carry it.
export const APP_METADATA = { app: "tillwright" } as const;
