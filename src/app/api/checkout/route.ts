import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { SITE_URL } from "@/utils/siteUrl";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { email, address, totalPrice, name, contact, cart } =
    await request.json();

  // Initialize Razorpay instance with credentials from environment variables
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });

  const refId = nanoid();

  try {
    // Create a payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: totalPrice * 100,
      currency: "INR",
      reference_id: refId,
      description: "For products purchased",
      customer: {
        name: name,
        email: email,
        contact: contact,
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: true,
      callback_url: `${SITE_URL}/api/verify`,
      callback_method: "get",
    });

    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          transaction_id: refId,
          name: name,
          email: email,
          phone: contact,
          address: address,
          payment_status: "pending",
          delivery_status: "pending",
          amount: totalPrice,
          products: cart,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Respond with the payment link
    return NextResponse.json(paymentLink, { status: 200 });
  } catch (error: any) {
    console.error("Error creating payment link:", error);
    if (
      error.statusCode === 400 &&
      error.error?.code === "BAD_REQUEST_ERROR" &&
      error.error?.description.includes("amount should be minimum  100 for INR")
    ) {
      console.error("Amount is below the minimum threshold for Razorpay.");
      return NextResponse.redirect(
        `${SITE_URL}/notifications/failure`,
        307
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
