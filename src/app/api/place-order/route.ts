import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { OrderPlacedTemplate } from "@/ui/Components/email-order-place";
import { fetchTransaction } from "@/utils/functions/fetchTransaction";
import { siteConfig } from "@/utils/siteConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { transaction_id } = await request.json();
  const CurrentTransaction = await fetchTransaction(transaction_id);

  console.log(CurrentTransaction);

  try {
    console.log("reached api trigger");
    const { data, error } = await resend.emails.send({
      from: siteConfig.emailFrom,
      to: [siteConfig.adminEmail],
      subject: "A new order has been placed",
      react: OrderPlacedTemplate({
        transaction_id: CurrentTransaction?.id,
        email: CurrentTransaction.email,
        payment_status: CurrentTransaction.payment_status,
        products: CurrentTransaction.products,
      }),
    });

    if (error) {
      console.log("failed api trigger");
      return NextResponse.json({ error: "Internal Server Error" });
    }
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
