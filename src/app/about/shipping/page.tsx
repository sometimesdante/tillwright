import Link from "next/link";
import { siteConfig } from "@/utils/siteConfig";

export default function Shipping() {
  const { policies } = siteConfig;

  return (
    <div className="w-full md:w-1/2 mx-auto">
      <h1 className="text-3xl mb-4">Shipping policy</h1>
      <p>Last updated: {policies.lastUpdated}</p>
      <p>
        This policy explains where we deliver, how long it takes and what to
        expect once you place an order with {siteConfig.name}.
      </p>

      <h2>Delivery areas</h2>
      <p>
        We currently deliver to {policies.deliveryArea}. Enter your full
        address at checkout. If we can&apos;t deliver to your location, we will
        contact you before dispatching your order and issue a full refund for
        any payment made.
      </p>

      <h2>Order processing</h2>
      <p>
        Orders are processed within {policies.processingTime} of being placed.
        Orders placed on Sundays or public holidays are processed on the next
        business day. During sales or busy periods, processing may take a
        little longer; we will let you know if your order is delayed.
      </p>

      <h2>Delivery times</h2>
      <p>
        Once dispatched, most orders arrive within {policies.deliveryTime}.
        Delivery times are estimates and may be affected by weather, local
        restrictions or other events outside our control.
      </p>

      <h2>Shipping charges</h2>
      <p>
        {policies.shippingCharges} Any applicable charges are always shown at
        checkout before you pay.
      </p>

      <h2>Order updates</h2>
      <p>
        You will receive an email and a WhatsApp message when your order is
        confirmed, and another WhatsApp message when it is dispatched. You can
        also check the payment and delivery status of every order from the
        Orders page in your account.
      </p>

      <h2>Receiving your order</h2>
      <ul>
        <li>
          Please make sure your address and phone number are correct. We are
          not responsible for delays caused by incorrect details.
        </li>
        <li>
          If no one is available to receive the order, our delivery partner
          will call you to reschedule. Orders that cannot be delivered after
          repeated attempts may be cancelled; prepaid orders will then be
          refunded.
        </li>
        <li>
          For Cash on Delivery orders, please keep the exact amount ready at
          the time of delivery.
        </li>
      </ul>

      <h2>Damaged or missing items</h2>
      <p>
        Please check your order when it arrives. If anything is damaged,
        missing or incorrect, contact us within {policies.damageReportWindow}{" "}
        with your order number and photos. See our{" "}
        <Link href="/about/returns">Cancellation and Refunds</Link> policy for
        details.
      </p>

      <h2>Questions</h2>
      <p>
        For questions about your delivery, contact us at {siteConfig.email} or{" "}
        {siteConfig.phone} ({siteConfig.supportHours}).
      </p>
    </div>
  );
}
