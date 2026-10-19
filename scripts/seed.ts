// Seeds the Tillwright Supply demo store. See "Demo data" in README.md.
//
//   npm run seed            create or update the demo data
//   npm run seed -- --reset remove seeded rows, users and images only
//
// Runs in Node with the service role key, which bypasses RLS. It writes rows
// directly and never calls the app's routes, so no emails or WhatsApp
// messages are sent.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createClient, type User } from "@supabase/supabase-js";
import { Client } from "pg";
import {
  accounts,
  guests,
  orders,
  products,
  type SeedOrder,
} from "./seed-data";
import {
  APP_METADATA,
  PRODUCT_IMAGE_FOLDER,
  STORAGE_BUCKET as BUCKET,
  TILLWRIGHT_SCHEMA,
} from "../src/utils/supabase/config";

const IMAGE_PREFIX = "seed-";
const ORDER_PREFIX = "seed_";
const ASSETS = join(process.cwd(), "scripts", "seed-assets");
const SCHEMA = join(process.cwd(), "supabase", "schema.sql");

function fail(message: string): never {
  console.error(`seed: ${message}`);
  process.exit(1);
}

if (process.env.SEED_ALLOW !== "true") {
  fail(
    "refusing to run. Set SEED_ALLOW=true in .env.local, and only for a development or demo project.",
  );
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url) fail("NEXT_PUBLIC_SUPABASE_URL is not set.");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is not set.");

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: TILLWRIGHT_SCHEMA },
});

const reset = process.argv.includes("--reset");
type ProductRow = Record<string, unknown> & { price: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

// --- Checks ----------------------------------------------------------------

function checkData() {
  for (const p of products) {
    // pretax plus the GST amount must come back to the price, to the paisa.
    const gst = round2((p.pretax * p.tax) / 100);
    if (Math.abs(round2(p.pretax + gst) - p.price) > 0.01) {
      fail(`${p.name}: pretax ${p.pretax} + ${p.tax}% GST != price ${p.price}`);
    }
    const margin = (p.pretax - p.purchase) / p.pretax;
    if (margin < 0.3 || margin > 0.55) {
      fail(`${p.name}: margin ${(margin * 100).toFixed(1)}% is outside 30–55%`);
    }
    if (p.mrp < p.price) fail(`${p.name}: MRP is below price`);
  }
  const slugs = new Set(products.map((p) => p.slug));
  for (const o of orders) {
    if (!o.ref.startsWith(ORDER_PREFIX)) fail(`${o.ref}: must start with ${ORDER_PREFIX}`);
    for (const item of o.items) {
      if (!slugs.has(item.slug)) fail(`${o.ref}: unknown product ${item.slug}`);
    }
  }
}

// --- Helpers ---------------------------------------------------------------

async function findUser(email: string): Promise<User | undefined> {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) fail(`listing users: ${error.message}`);
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match || data.users.length < 1000) return match;
  }
}

// IST wall-clock time `daysAgo` days back at `hour`, never in the future.
function orderTime(daysAgo: number, hour: number): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  const day = new Date(
    Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate() - daysAgo, hour),
  );
  const utc = new Date(day.getTime() - IST_OFFSET_MS);
  const latest = new Date(Date.now() - 30 * 60 * 1000);
  return (utc > latest ? latest : utc).toISOString();
}

// Storage path of a seeded product image inside the bucket.
function imagePath(slug: string): string {
  return `${PRODUCT_IMAGE_FOLDER}/${IMAGE_PREFIX}${slug}.webp`;
}

// Placeholder Razorpay payment link id, stable per order.
function paymentLinkId(ref: string): string {
  return `plink_Seed${ref.replace(ORDER_PREFIX, "").replace(/[^A-Za-z0-9]/g, "")}Demo`;
}

// --- Schema ----------------------------------------------------------------

const SCHEMA_NOT_EXPOSED = `the Supabase API doesn't expose the ${TILLWRIGHT_SCHEMA} schema. Add it under Project Settings > Data API > Exposed schemas, then run the seed again.`;

// With SUPABASE_DB_URL set, apply supabase/schema.sql (safe to re-run). The
// Supabase API can't run DDL, so this needs a direct Postgres connection.
// Without it, only check that the tables exist.
async function ensureSchema(): Promise<string> {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (dbUrl && /your-project-ref|your-db-password/.test(dbUrl)) {
    fail(
      "SUPABASE_DB_URL is still the .env.example placeholder. Copy the Session pooler URI from the dashboard (Connect > Session pooler) and put your database password in it.",
    );
  }
  if (dbUrl) {
    const client = new Client({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
    });
    try {
      await client.connect();
      await client.query(readFileSync(SCHEMA, "utf8"));
    } catch (err) {
      fail(`applying supabase/schema.sql: ${err instanceof Error ? err.message : err}`);
    } finally {
      await client.end().catch(() => {});
    }
    // PostgREST reloads its schema cache asynchronously after the notify.
    for (let attempt = 0; attempt < 10; attempt++) {
      const { error } = await supabase.from("products").select("id").limit(1);
      if (!error) return "applied";
      if (error.code === "PGRST106") fail(SCHEMA_NOT_EXPOSED);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    fail("schema applied, but the Supabase API still can't see the tables. Run the seed again in a minute.");
  }

  const { error } = await supabase.from("products").select("id").limit(1);
  if (error?.code === "PGRST106") fail(SCHEMA_NOT_EXPOSED);
  if (error?.code === "PGRST205") {
    fail(
      "the tables don't exist yet. Either set SUPABASE_DB_URL in .env.local so the seed can create them, or run supabase/schema.sql in the Supabase SQL Editor.",
    );
  }
  if (error) fail(`checking tables: ${error.message}`);
  return "already in place";
}

// --- Seed ------------------------------------------------------------------

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (data) return "exists";
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) fail(`creating bucket ${BUCKET}: ${error.message}`);
  return "created";
}

async function uploadImages(): Promise<Map<string, string>> {
  const urls = new Map<string, string>();
  for (const p of products) {
    const path = imagePath(p.slug);
    const body = readFileSync(join(ASSETS, `${IMAGE_PREFIX}${p.slug}.webp`));
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, body, { contentType: "image/webp", upsert: true });
    if (error) fail(`uploading ${path}: ${error.message}`);
    urls.set(p.slug, supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }
  return urls;
}

async function upsertProducts(imageUrls: Map<string, string>) {
  const rows = new Map<string, ProductRow>();
  for (const p of products) {
    const values = {
      name: p.name,
      category: p.category,
      description: p.description,
      image_url: imageUrls.get(p.slug),
      purchase: p.purchase,
      mrp: p.mrp,
      pretax: p.pretax,
      tax: p.tax,
      price: p.price,
      inventory: p.inventory,
    };
    const { data: existing, error: findError } = await supabase
      .from("products")
      .select("id")
      .eq("name", p.name)
      .limit(1);
    if (findError) fail(`reading products: ${findError.message}`);

    const query = existing?.length
      ? supabase.from("products").update(values).eq("id", existing[0].id)
      : supabase.from("products").insert(values);
    const { data, error } = await query.select().single();
    if (error) fail(`saving product ${p.name}: ${error.message}`);
    rows.set(p.slug, data);
  }
  return rows;
}

async function upsertAccounts() {
  for (const account of accounts) {
    const password = process.env[account.passwordEnv];
    if (!password) fail(`${account.passwordEnv} is not set.`);

    const existing = await findUser(account.email);
    const { data, error } = existing
      ? await supabase.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
          user_metadata: { ...account.metadata, ...APP_METADATA },
        })
      : await supabase.auth.admin.createUser({
          email: account.email,
          password,
          email_confirm: true,
          user_metadata: { ...account.metadata, ...APP_METADATA },
        });
    if (error || !data.user) fail(`saving user ${account.email}: ${error?.message}`);

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: data.user.id, email: account.email, role: account.role },
        { onConflict: "email" },
      );
    if (profileError) fail(`saving profile ${account.email}: ${profileError.message}`);
  }
}

async function upsertGuests() {
  for (const guest of guests) {
    const { data: existing, error: findError } = await supabase
      .from("guest_profiles")
      .select("id")
      .eq("email", guest.email)
      .limit(1);
    if (findError) fail(`reading guest_profiles: ${findError.message}`);
    const values = { ...guest, role: "guest" };
    const { error } = existing?.length
      ? await supabase.from("guest_profiles").update(values).eq("id", existing[0].id)
      : await supabase.from("guest_profiles").insert(values);
    if (error) fail(`saving guest ${guest.email}: ${error.message}`);
  }
}

async function upsertOrders(productRows: Map<string, ProductRow>) {
  const { data: existingRows, error } = await supabase
    .from("transactions")
    .select("id, transaction_id, invoice_id, created_at")
    .like("transaction_id", `${ORDER_PREFIX}%`);
  if (error) fail(`reading transactions: ${error.message}`);
  const existing = new Map((existingRows ?? []).map((r) => [r.transaction_id, r]));

  // Invoice numbers come from the database sequence, like real orders
  // (assign_invoice_number in supabase/schema.sql). Seeded orders keep the
  // number they were given.
  // Number new orders oldest first, so invoice order follows date order.
  const byDate = [...orders].sort(
    (a, b) => orderTime(a.daysAgo, a.hour).localeCompare(orderTime(b.daysAgo, b.hour)),
  );

  let created = 0;
  for (const order of byDate) {
    const lines = order.items.map((item) => ({
      ...productRows.get(item.slug)!,
      count: item.count,
    }));
    const amount = round2(
      lines.reduce((sum, line) => sum + Number(line.price) * line.count, 0),
    );
    const row = rowFor(order, lines, amount);
    const current = existing.get(order.ref);

    if (current) {
      // Keep the original date and invoice number so re-runs change nothing.
      const { error: updateError } = await supabase
        .from("transactions")
        .update(row)
        .eq("id", current.id);
      if (updateError) fail(`updating ${order.ref}: ${updateError.message}`);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("transactions")
        .insert({ ...row, created_at: orderTime(order.daysAgo, order.hour) })
        .select("id")
        .single();
      if (insertError || !inserted) fail(`inserting ${order.ref}: ${insertError?.message}`);
      const { error: invoiceError } = await supabase.rpc("assign_invoice_number", {
        order_id: inserted.id,
      });
      if (invoiceError) fail(`numbering ${order.ref}: ${invoiceError.message}`);
      created++;
    }
  }
  return created;
}

function rowFor(order: SeedOrder, lines: unknown[], amount: number) {
  return {
    transaction_id: order.ref,
    // Checkout writes "Not Applicable" for COD; online orders get the link id.
    razorpay_id: order.payment_status === "cod" ? "Not Applicable" : paymentLinkId(order.ref),
    name: order.name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    payment_status: order.payment_status,
    delivery_status: order.delivery_status,
    amount,
    products: lines,
    // The seed sets inventory directly, so seeded orders hold no stock.
    stock_reserved: false,
  };
}

// --- Reset -----------------------------------------------------------------

async function resetSeed() {
  const tally: Record<string, number> = {};

  const { data: txns, error: txnError } = await supabase
    .from("transactions")
    .delete()
    .like("transaction_id", `${ORDER_PREFIX}%`)
    .select("id");
  if (txnError) fail(`deleting orders: ${txnError.message}`);
  tally.orders = txns?.length ?? 0;

  const { data: prods, error: prodError } = await supabase
    .from("products")
    .delete()
    .in("name", products.map((p) => p.name))
    .select("id");
  if (prodError) fail(`deleting products: ${prodError.message}`);
  tally.products = prods?.length ?? 0;

  const { data: gs, error: guestError } = await supabase
    .from("guest_profiles")
    .delete()
    .in("email", guests.map((g) => g.email))
    .select("id");
  if (guestError) fail(`deleting guests: ${guestError.message}`);
  tally.guests = gs?.length ?? 0;

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .in("email", accounts.map((a) => a.email));
  if (profileError) fail(`deleting profiles: ${profileError.message}`);

  tally.users = 0;
  for (const account of accounts) {
    const user = await findUser(account.email);
    if (!user) continue;
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) fail(`deleting user ${account.email}: ${error.message}`);
    tally.users++;
  }

  const files = products.map((p) => imagePath(p.slug));
  const { data: removed, error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove(files);
  // A missing bucket just means there are no seeded images to remove.
  if (storageError && !/not found/i.test(storageError.message)) {
    fail(`deleting images: ${storageError.message}`);
  }
  tally.images = removed?.length ?? 0;

  console.log(`\nRemoved seeded data from ${new URL(url!).host}`);
  console.log(
    `  orders ${tally.orders} · products ${tally.products} · guests ${tally.guests} · users ${tally.users} · images ${tally.images}`,
  );
  console.log(`  Nothing else was touched. The ${BUCKET} bucket is kept.`);
}

// --- Main ------------------------------------------------------------------

async function main() {
  console.log(`seed: target ${new URL(url!).host}${reset ? " (reset)" : ""}`);
  if (reset) return resetSeed();

  checkData();
  const schema = await ensureSchema();
  const bucket = await ensureBucket();
  const imageUrls = await uploadImages();
  const productRows = await upsertProducts(imageUrls);
  await upsertAccounts();
  await upsertGuests();
  const createdOrders = await upsertOrders(productRows);

  const revenue = orders
    .filter((o) => o.payment_status !== "cancelled")
    .reduce(
      (sum, o) =>
        sum +
        o.items.reduce(
          (s, i) => s + i.count * products.find((p) => p.slug === i.slug)!.price,
          0,
        ),
      0,
    );

  console.log(`\nSeeded ${new URL(url!).host}`);
  console.log(`  schema   ${schema}`);
  console.log(`  bucket   ${BUCKET} (${bucket}), ${products.length} images`);
  console.log(`  products ${products.length}`);
  console.log(
    `  orders   ${orders.length} (${createdOrders} new), ₹${revenue.toFixed(2)} excluding cancelled`,
  );
  console.log(`  guests   ${guests.length}`);
  console.log("  logins   (passwords from SEED_ADMIN_PASSWORD / SEED_CUSTOMER_PASSWORD)");
  for (const a of accounts) console.log(`           ${a.email}  ${a.role}`);
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
