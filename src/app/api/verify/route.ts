import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { handleConfirmEmail } from "@/utils/functions/handleConfirmEmail";
import { handlePlaceEmail } from "@/utils/functions/handlePlaceEmail";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { fetchInvoiceNumber } from "@/utils/functions/fetchInvoiceNumber";
import { handleWhatsapp } from "@/utils/functions/handleWhatsapp";
import { SITE_URL } from "@/utils/siteUrl";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";

export async function GET(req: Request): Promise<NextResponse> {
  const supabase = await createClient();
  // Fetch the secret from environment variables
  const secret: string = process.env.RAZORPAY_KEY_SECRET || "";

  if (!secret) {
    console.error("Razorpay webhook secret is not configured.");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const invoiceNumber = await fetchInvoiceNumber();

    // Extract query parameters from the URL
    const url = new URL(req.url);
    const razorpayPaymentId = url.searchParams.get("razorpay_payment_id");
    const razorpayPaymentLinkId = url.searchParams.get(
      "razorpay_payment_link_id"
    );
    const razorpayPaymentLinkReferenceId = url.searchParams.get(
      "razorpay_payment_link_reference_id"
    );
    const razorpayPaymentLinkStatus = url.searchParams.get(
      "razorpay_payment_link_status"
    );
    const razorpaySignature = url.searchParams.get("razorpay_signature");

    // Validate that all required parameters are present
    if (
      !razorpayPaymentId ||
      !razorpayPaymentLinkId ||
      !razorpayPaymentLinkReferenceId ||
      !razorpayPaymentLinkStatus ||
      !razorpaySignature
    ) {
      console.error("Missing required query parameters");
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Validate the payment
    validatePaymentVerification(
      {
        payment_link_id: razorpayPaymentLinkId,
        payment_id: razorpayPaymentId,
        payment_link_reference_id: razorpayPaymentLinkReferenceId,
        payment_link_status: razorpayPaymentLinkStatus,
      },
      razorpaySignature,
      secret
    );

    // Update the transaction in Supabase
    const { error } = await supabase
      .from("transactions")
      .update({
        invoice_id: invoiceNumber,
        razorpay_id: razorpayPaymentLinkId,
        payment_status: razorpayPaymentLinkStatus,
      })
      .eq("transaction_id", razorpayPaymentLinkReferenceId);

    if (error) {
      console.error("Error updating payment status:", error);
    }

    const { data: orders } = await supabase
      .from("transactions")
      .select()
      .eq("transaction_id", razorpayPaymentLinkReferenceId);

    console.log(orders?.[0]);
    const order = orders?.[0];

    // Trigger whatsapp notification
    console.log(order?.phone, order?.name, invoiceNumber);
    await handleWhatsapp(
      order?.phone,
      order?.name,
      formatInvoiceNo(order?.invoice_id, order?.created_at) ?? "",
      "tomorrow"
    );

    // Trigger email notifications
    await handlePlaceEmail(razorpayPaymentLinkReferenceId);
    await handleConfirmEmail(razorpayPaymentLinkReferenceId);

    // Respond with success
    return NextResponse.json({
      message: "Callback received successfully",
      data: {
        razorpayPaymentId,
        razorpayPaymentLinkId,
        razorpayPaymentLinkReferenceId,
        razorpayPaymentLinkStatus,
        razorpaySignature,
      },
    });
  } catch (error) {
    console.error("Error processing callback:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    redirect(`${SITE_URL}/notifications/success`);
  }
}
