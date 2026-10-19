import { connection } from "next/server";
import CheckoutForm from "./CheckoutForm";

// Offers online payment only when Razorpay is configured, so a store without
// keys (such as the demo) starts on cash on delivery.
export default async function Checkout() {
  await connection();
  const onlinePaymentEnabled = Boolean(
    process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET,
  );
  return <CheckoutForm onlinePaymentEnabled={onlinePaymentEnabled} />;
}
