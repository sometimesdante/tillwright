import { siteConfig } from "@/utils/siteConfig";

export default function Returns() {
  const { policies } = siteConfig;

  return (
    <div className="w-full md:w-1/2 mx-auto">
      <h1 className="text-3xl">Cancellation and refunds</h1>
      <p>Last updated: {policies.lastUpdated}</p>
      <p>
        We want you to be happy with every order from {siteConfig.name}. If
        something isn&apos;t right, this policy explains how to cancel an
        order, report a problem or request a refund.
      </p>

      <h2>Cancelling an order</h2>
      <p>
        You can cancel an order at any time before it is dispatched. Contact us
        at {siteConfig.email} or {siteConfig.phone} with your order number, and
        we will confirm the cancellation. Prepaid orders cancelled before
        dispatch are refunded in full.
      </p>
      <p>
        Once an order has been dispatched it can no longer be cancelled, but
        you may be able to return it as described below.
      </p>
      <p>
        We may cancel an order if a product is out of stock, if we cannot
        deliver to your address, or if we suspect fraudulent activity. If we
        cancel your order, any payment made will be refunded in full.
      </p>

      <h2>Damaged, Defective or Incorrect Items</h2>
      <p>
        If an item arrives damaged, defective, expired or different from what
        you ordered, contact us within {policies.damageReportWindow} with:
      </p>
      <ul>
        <li>your order number,</li>
        <li>a short description of the problem, and</li>
        <li>clear photos of the item and its packaging.</li>
      </ul>
      <p>
        Once we have reviewed your request, we will send you a replacement or
        issue a full refund, including any delivery charges. You will not need
        to pay for return shipping on damaged or incorrect items.
      </p>

      <h2>Returning other items</h2>
      <p>
        If you have changed your mind about a product, you can request a return
        within {policies.returnWindow}. To be eligible, the item must be unused,
        in its original packaging and in the same condition you received it.
      </p>
      <p>
        The following items cannot be returned unless they arrive damaged or
        incorrect: {policies.nonReturnable}.
      </p>

      <h2>How to request a return</h2>
      <ol>
        <li>
          Email {siteConfig.email} with your order number and the items you
          want to return.
        </li>
        <li>
          We will confirm whether the items are eligible and arrange a pickup
          or tell you how to send them back.
        </li>
        <li>
          Once we receive and inspect the items, we will let you know whether
          your refund has been approved.
        </li>
      </ol>

      <h2>Refunds</h2>
      <ul>
        <li>
          <strong>Online payments:</strong> refunds are issued to your original
          payment method through Razorpay and usually reach your account within{" "}
          {policies.refundTime}, depending on your bank.
        </li>
        <li>
          <strong>Cash on Delivery:</strong> refunds are paid by UPI or bank
          transfer to an account you provide, within {policies.refundTime} of
          approval.
        </li>
      </ul>
      <p>
        If your refund hasn&apos;t arrived after this time, check with your
        bank first, then contact us and we will help you track it.
      </p>

      <h2>Contact us</h2>
      <p>
        For any questions about cancellations, returns or refunds, contact us
        at {siteConfig.email} or {siteConfig.phone} ({siteConfig.supportHours}).
      </p>
    </div>
  );
}
