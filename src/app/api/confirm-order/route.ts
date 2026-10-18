import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { OrderConfirmationTemplate } from "@/ui/Components/email-order-confirm";
import { fetchTransaction } from "@/utils/functions/fetchTransaction";
import { siteConfig } from "@/utils/siteConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { transaction_id } = await request.json();
  const CurrentTransaction = await fetchTransaction(transaction_id);

  console.log(CurrentTransaction);

  try {
    const { data, error } = await resend.emails.send({
      from: siteConfig.emailFrom,
      to: [CurrentTransaction.email],
      subject: "Your order has been confirmed!",
      react: OrderConfirmationTemplate({
        firstName: CurrentTransaction?.email,
      }),
    });

    if (error) {
      return NextResponse.json({ error: "Internal Server Error" });
    }
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
