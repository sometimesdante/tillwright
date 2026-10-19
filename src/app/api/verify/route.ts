import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { createAdminClient } from "@/utils/supabase/admin";
import { notifyOrderPlaced } from "@/utils/orders/notifications";
import { SITE_URL } from "@/utils/siteUrl";

// Razorpay redirects the customer here after a payment-link payment. The
// query string is attacker-controlled, so an order is marked paid only when
// the signature checks out AND Razorpay's API confirms the link is paid for
// the order's server-side amount.
export async function GET(req: Request) {
  const success = NextResponse.redirect(new URL("/notifications/success", SITE_URL));
  const failure = () =>
    NextResponse.redirect(new URL("/notifications/failure", SITE_URL));

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("Razorpay keys are not configured.");
    return failure();
  }

  const params = new URL(req.url).searchParams;
  const paymentId = params.get("razorpay_payment_id");
  const linkId = params.get("razorpay_payment_link_id");
  const referenceId = params.get("razorpay_payment_link_reference_id");
  const linkStatus = params.get("razorpay_payment_link_status");
  const signature = params.get("razorpay_signature");
  if (!paymentId || !linkId || !referenceId || !linkStatus || !signature) {
    return failure();
  }

  const signatureValid = validatePaymentVerification(
    {
      payment_link_id: linkId,
      payment_id: paymentId,
      payment_link_reference_id: referenceId,
      payment_link_status: linkStatus,
    },
    signature,
    keySecret,
  );
  if (!signatureValid) {
    console.error("Razorpay signature check failed for", referenceId);
    return failure();
  }

  try {
    // Don't trust the status in the URL: ask Razorpay.
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const link = await razorpay.paymentLink.fetch(linkId);
    if (link.status !== "paid" || link.reference_id !== referenceId) {
      return failure();
    }

    const admin = createAdminClient();
    const { data: order } = await admin
      .from("transactions")
      .select()
      .eq("transaction_id", referenceId)
      .maybeSingle();
    if (!order) return failure();

    const expectedPaise = Math.round(Number(order.amount) * 100);
    if (Number(link.amount) !== expectedPaise || Number(link.amount_paid) < expectedPaise) {
      console.error("Paid amount doesn't match order", referenceId);
      return failure();
    }

    // Claim the order so a repeated callback can't take stock, assign an
    // invoice or send notifications twice.
    const { data: claimed } = await admin
      .from("transactions")
      .update({ payment_status: "paid", razorpay_id: linkId, stock_reserved: true })
      .eq("id", order.id)
      .neq("payment_status", "paid")
      .select()
      .maybeSingle();
    if (!claimed) return success;

    const items = (order.products as { id: number; count: number }[]).map(
      ({ id, count }) => ({ id, count }),
    );
    await admin.rpc("adjust_stock", { items, direction: -1 });
    const { data: invoiceId } = await admin.rpc("assign_invoice_number", {
      order_id: order.id,
    });
    await notifyOrderPlaced({ ...claimed, invoice_id: invoiceId ?? null });
    return success;
  } catch (err) {
    console.error("Verifying Razorpay payment:", err);
    return failure();
  }
}
