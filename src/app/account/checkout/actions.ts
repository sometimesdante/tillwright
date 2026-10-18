import { nanoid } from "nanoid";
import { createClient } from "@/utils/supabase/client";
import { handlePlaceEmail } from "@/utils/functions/handlePlaceEmail";
import { handleConfirmEmail } from "@/utils/functions/handleConfirmEmail";
import { fetchInvoiceNumber } from "@/utils/functions/fetchInvoiceNumber";
import { notifyOrderPlaced } from "@/utils/functions/whatsappActions";
import { SITE_URL } from "@/utils/siteUrl";

export async function handleCheckout(
  name: string,
  email: string,
  address: string,
  contact: string,
  mode: string,
  cart: any[],
  totalPrice: number
) {
  const supabase = createClient();

  if (mode === "cod") {
    const refId = nanoid();

    try {
      const invoiceNumber = await fetchInvoiceNumber();
      const { error } = await supabase.from("transactions").insert([
        {
          invoice_id: invoiceNumber,
          transaction_id: refId,
          name: name,
          email: email,
          phone: contact,
          address: address,
          payment_status: mode,
          razorpay_id: "Not Applicable",
          delivery_status: "pending",
          amount: totalPrice,
          products: cart,
        },
      ]);

      // Trigger email notifications
      await handlePlaceEmail(refId);
      await handleConfirmEmail(refId);

      // Trigger whatsapp notification
      await notifyOrderPlaced(refId);

      if (error) {
        console.error("Error inserting transaction:", error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
    window.location.href = `${SITE_URL}/notifications/success`;
  } else if (mode === "online") {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          address,
          contact,
          cart,
          totalPrice,
        }),
      });

      const paymentData = await response.json();

      // Redirect to Razorpay Shortlink
      window.location.href = paymentData.short_url;
    } catch (error) {
      console.error("Error initiating payment link:", error);
    }
  } else {
    console.log("Unsupported payment mode:", mode);
  }
}
