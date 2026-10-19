"use server";

import { nanoid } from "nanoid";
import Razorpay from "razorpay";
import { createAdminClient } from "@/utils/supabase/admin";
import { getViewer } from "@/utils/orders/auth";
import { notifyOrderPlaced } from "@/utils/orders/notifications";
import { formatINR } from "@/utils/formatINR";
import { SITE_URL } from "@/utils/siteUrl";

export type CheckoutContact = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type PlaceOrderResult =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

type CartLine = { id: number; count: number };

const MAX_LINES = 50;
const MAX_COUNT = 99;
const round2 = (n: number) => Math.round(n * 100) / 100;

function cleanItems(items: unknown): CartLine[] | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return null;
  }
  const merged = new Map<number, number>();
  for (const item of items) {
    const id = Number((item as CartLine)?.id);
    const count = Number((item as CartLine)?.count);
    if (!Number.isInteger(id) || id <= 0) return null;
    if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) return null;
    merged.set(id, (merged.get(id) ?? 0) + count);
  }
  return [...merged].map(([id, count]) => ({ id, count }));
}

function cleanContact(contact: CheckoutContact): CheckoutContact | string {
  const name = String(contact?.name ?? "").trim();
  const email = String(contact?.email ?? "").trim().toLowerCase();
  const phone = String(contact?.phone ?? "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const address = String(contact?.address ?? "").trim();
  if (name.length < 2 || name.length > 100) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  if (!/^\d{10}$/.test(phone)) return "Enter a 10-digit mobile number.";
  if (address.length < 10 || address.length > 300) return "Enter your full delivery address.";
  return { name, email, phone, address };
}

// Places an order. The browser sends only product IDs, quantities and contact
// details; prices, the total and stock come from the database.
export async function placeOrder(input: {
  contact: CheckoutContact;
  items: CartLine[];
  mode: "cod" | "online";
}): Promise<PlaceOrderResult> {
  if (input?.mode !== "cod" && input?.mode !== "online") {
    return { ok: false, error: "Choose a payment method." };
  }
  const items = cleanItems(input.items);
  if (!items) return { ok: false, error: "Your cart is empty or invalid. Refresh the page and try again." };

  const contact = cleanContact(input.contact);
  if (typeof contact === "string") return { ok: false, error: contact };

  // A signed-in customer's orders are linked by their account email, so use
  // the session's email rather than whatever the form sent.
  const { user } = await getViewer();
  if (user?.email) contact.email = user.email.toLowerCase();

  const admin = createAdminClient();
  const { data: rows, error: productsError } = await admin
    .from("products")
    .select()
    .in("id", items.map((i) => i.id));
  if (productsError) {
    console.error("Loading products for checkout:", productsError);
    return { ok: false, error: "We couldn't check your cart. Try again in a moment." };
  }

  const lines = [];
  for (const item of items) {
    const product = rows?.find((row) => row.id === item.id);
    if (!product) {
      return { ok: false, error: "An item in your cart is no longer sold. Remove it and try again." };
    }
    if ((product.inventory ?? 0) < item.count) {
      return {
        ok: false,
        error:
          (product.inventory ?? 0) > 0
            ? `Only ${product.inventory} of ${product.name} left. Lower the quantity and try again.`
            : `${product.name} just sold out. Remove it and try again.`,
      };
    }
    lines.push({ ...product, count: item.count });
  }
  const amount = round2(
    lines.reduce((sum, line) => sum + Number(line.price) * line.count, 0),
  );

  if (!user) {
    const { error } = await admin.from("guest_profiles").insert({ ...contact, role: "guest" });
    if (error) console.error("Saving guest details:", error);
  }

  const order = {
    transaction_id: nanoid(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    delivery_status: "pending",
    amount,
    products: lines,
  };

  if (input.mode === "cod") {
    const { data: reserved, error: stockError } = await admin.rpc("reserve_stock", { items });
    if (stockError) {
      console.error("Reserving stock:", stockError);
      return { ok: false, error: "We couldn't place your order. Try again in a moment." };
    }
    if (!reserved) {
      return { ok: false, error: "Some items just sold out. Check your cart and try again." };
    }

    const { data: saved, error: insertError } = await admin
      .from("transactions")
      .insert({
        ...order,
        payment_status: "cod",
        razorpay_id: "Not Applicable",
        stock_reserved: true,
      })
      .select()
      .single();
    if (insertError || !saved) {
      console.error("Saving COD order:", insertError);
      await admin.rpc("adjust_stock", { items, direction: 1 });
      return { ok: false, error: "We couldn't place your order. Try again in a moment." };
    }

    const { data: invoiceId } = await admin.rpc("assign_invoice_number", { order_id: saved.id });
    await notifyOrderPlaced({ ...saved, invoice_id: invoiceId ?? null });
    return { ok: true, redirectTo: "/notifications/success" };
  }

  // Online: Razorpay charges the server-side total. Stock is taken and the
  // invoice number assigned once /api/verify confirms the payment.
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return { ok: false, error: "Online payment isn't set up yet. Choose cash on delivery." };
  }
  const paise = Math.round(amount * 100);
  if (paise < 100) {
    return { ok: false, error: `Online payments need ${formatINR(1)} or more.` };
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const link = await razorpay.paymentLink.create({
      amount: paise,
      currency: "INR",
      reference_id: order.transaction_id,
      description: "For products purchased",
      customer: { name: contact.name, email: contact.email, contact: contact.phone },
      notify: { sms: false, email: false },
      reminder_enable: true,
      callback_url: `${SITE_URL}/api/verify`,
      callback_method: "get",
    });

    const { error: insertError } = await admin
      .from("transactions")
      .insert({ ...order, payment_status: "pending" });
    if (insertError) {
      console.error("Saving online order:", insertError);
      return { ok: false, error: "We couldn't start the payment. Try again in a moment." };
    }
    return { ok: true, redirectTo: link.short_url };
  } catch (err) {
    console.error("Creating Razorpay payment link:", err);
    return { ok: false, error: "We couldn't start the payment. Try again, or choose cash on delivery." };
  }
}
