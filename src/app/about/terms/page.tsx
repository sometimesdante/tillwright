import Link from "next/link";
import { fullAddress, siteConfig } from "@/utils/siteConfig";

export default function Terms() {
  const { grievanceOfficer, policies } = siteConfig;

  return (
    <div className="w-full md:w-1/2 mx-auto">
      <h1 className="text-3xl">Terms and Conditions</h1>
      <p>Last updated: {policies.lastUpdated}</p>
      <p>
        These Terms and Conditions (&quot;Terms&quot;) govern your use of{" "}
        <a
          href={siteConfig.websiteUrl}
          rel="external nofollow noopener"
          target="_blank"
        >
          {siteConfig.website}
        </a>{" "}
        (the &quot;Website&quot;) and any purchase you make through it. The
        Website is operated by {siteConfig.legalName} (&quot;we&quot;,
        &quot;us&quot; or &quot;our&quot;), {fullAddress}. By using the Website
        or placing an order, you agree to these Terms. If you do not agree,
        please do not use the Website.
      </p>

      <h2>Eligibility</h2>
      <p>
        You must be at least 18 years old and able to enter into a binding
        contract under Indian law to place an order. By placing an order, you
        confirm that you meet these requirements.
      </p>

      <h2>Your Account</h2>
      <ul>
        <li>
          You are responsible for keeping your account details accurate and up
          to date, and for keeping your password confidential.
        </li>
        <li>
          You are responsible for all activity under your account. Tell us
          immediately if you suspect unauthorised use.
        </li>
        <li>
          We may suspend or close accounts that are used for fraud, abuse or in
          breach of these Terms.
        </li>
      </ul>

      <h2>Products and Pricing</h2>
      <ul>
        <li>
          All prices are in Indian Rupees (INR) and include applicable taxes
          unless stated otherwise.
        </li>
        <li>
          We try to describe and photograph products accurately, but colours,
          packaging and appearance may vary slightly from what you see on
          screen.
        </li>
        <li>
          Prices and availability can change without notice. If a product is
          listed at an incorrect price because of an error, we may cancel the
          order and refund any payment made.
        </li>
        <li>We may limit the quantity of any product available per order.</li>
      </ul>

      <h2>Placing an Order</h2>
      <p>
        Placing an order is an offer to buy the products in your cart. Your
        order is accepted when we send you an order confirmation. We may
        decline or cancel an order, for example if a product is out of stock,
        we cannot deliver to your address, or we suspect fraudulent activity.
        If we cancel an order, any payment made will be refunded in full.
      </p>

      <h2>Payment</h2>
      <ul>
        <li>
          Online payments are processed securely by Razorpay, which supports
          UPI, debit and credit cards, net banking and wallets. Your use of
          Razorpay is also subject to Razorpay&apos;s own terms.
        </li>
        <li>
          Cash on Delivery is available on eligible orders. Please pay the full
          amount to the delivery partner when you receive your order.
        </li>
        <li>
          We may withdraw Cash on Delivery for accounts with repeated
          undelivered or refused orders.
        </li>
      </ul>

      <h2>Delivery, Cancellations and Refunds</h2>
      <p>
        Delivery is covered by our{" "}
        <Link href="/about/shipping">Shipping Policy</Link>, and cancellations,
        returns and refunds by our{" "}
        <Link href="/about/returns">Cancellation and Refunds</Link> policy. Both
        form part of these Terms.
      </p>

      <h2>Communications</h2>
      <p>
        By placing an order, you agree that we may contact you by email, phone
        and WhatsApp about your order, including confirmations, delivery
        updates and support. We will only send promotional messages if you
        have agreed to receive them.
      </p>

      <h2>Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Website for any unlawful or fraudulent purpose,</li>
        <li>
          attempt to gain unauthorised access to the Website, its systems or
          other users&apos; accounts,
        </li>
        <li>
          interfere with the Website&apos;s operation, for example through
          viruses, automated scraping or excessive requests, or
        </li>
        <li>
          place orders with no intention of accepting them, or misuse offers
          and promotions.
        </li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All content on the Website, including text, images, logos and design,
        belongs to {siteConfig.legalName} or its licensors and is protected by
        copyright and trademark laws. You may not copy, reproduce or use it for
        commercial purposes without our written permission.
      </p>

      <h2>Links to Other Websites</h2>
      <p>
        The Website may contain links to third-party websites, such as payment
        providers. We do not control these websites and are not responsible
        for their content, policies or practices.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any
        indirect, incidental or consequential loss arising from your use of the
        Website or any product purchased through it. Our total liability for
        any claim relating to an order is limited to the amount you paid for
        that order. Nothing in these Terms limits any rights you have as a
        consumer under Indian law.
      </p>

      <h2>Events Outside Our Control</h2>
      <p>
        We are not responsible for delays or failures caused by events beyond
        our reasonable control, such as natural disasters, strikes, government
        restrictions, or outages at our payment or delivery partners.
      </p>

      <h2>Governing Law and Disputes</h2>
      <p>
        These Terms are governed by the laws of India. We encourage you to
        contact us first so we can try to resolve any dispute informally. If a
        dispute cannot be resolved, it will be subject to the exclusive
        jurisdiction of the courts in {siteConfig.city}, {siteConfig.state}.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Changes will be posted on
        this page with a new &quot;Last updated&quot; date. Orders are governed
        by the Terms in place at the time the order was placed.
      </p>

      <h2>Grievance Officer</h2>
      <p>
        In line with the Consumer Protection (E-Commerce) Rules, 2020, you can
        raise complaints with our Grievance Officer. We acknowledge complaints
        within 48 hours and aim to resolve them within one month.
      </p>
      <ul>
        <li>{grievanceOfficer.name}</li>
        <li>Email: {grievanceOfficer.email}</li>
        <li>Phone: {grievanceOfficer.phone}</li>
      </ul>

      <h2>Contact Us</h2>
      <p>If you have any questions about these Terms, contact us:</p>
      <ul>
        <li>By email: {siteConfig.email}</li>
        <li>By phone: {siteConfig.phone}</li>
        <li>By post: {fullAddress}</li>
      </ul>
    </div>
  );
}
