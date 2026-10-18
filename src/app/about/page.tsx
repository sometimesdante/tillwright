import Link from "next/link";
import { siteConfig } from "@/utils/siteConfig";

export default function About() {
  const { name, city, policies } = siteConfig;

  return (
    <div className="w-full max-w-2xl mx-auto min-w-0">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8">
        <h1 className="text-display text-ink mb-6">
          About us
        </h1>

        <section className="mb-8">
          <h2 className="text-heading text-ink mb-3">Overview</h2>
          <p className="text-ink leading-relaxed">
            {name} is an independent online store based in {city}. We started
            with a simple idea: buying the things you need should be easy,
            fairly priced and dependable. Every product we list is one we&apos;d
            be happy to buy ourselves, and every order is packed with care by
            our own team.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-heading text-ink mb-3">
            What we stand for
          </h2>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-ink leading-relaxed">
            <li>
              <strong>Quality first.</strong> We choose our products carefully
              and check them before they leave us.
            </li>
            <li>
              <strong>Honest pricing.</strong> The price you see is the price
              you pay, inclusive of taxes. {policies.shippingCharges}
            </li>
            <li>
              <strong>Reliable delivery.</strong> We deliver across{" "}
              {policies.deliveryArea}, usually within {policies.deliveryTime}.
            </li>
            <li>
              <strong>Real support.</strong> If something isn&apos;t right, a
              real person will help you put it right.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-heading text-ink mb-3">
            How ordering works
          </h2>
          <ol className="list-decimal pl-5 flex flex-col gap-2 text-ink leading-relaxed">
            <li>
              Create an account and add the products you want to your cart.
            </li>
            <li>
              Check out and pay securely online through Razorpay (UPI, cards,
              net banking and wallets) or choose Cash on Delivery.
            </li>
            <li>
              We confirm your order by email and WhatsApp, and message you again
              when it&apos;s on its way.
            </li>
            <li>
              Your order arrives at your door. You can track its status anytime
              from the Orders page in your account.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-heading text-ink mb-3">
            Get in touch
          </h2>
          <p className="text-ink leading-relaxed">
            We love hearing from our customers. Reach us at {siteConfig.email}{" "}
            or {siteConfig.phone}, or visit our{" "}
            <Link href="/about/contact">Contact page</Link> for our full address
            and support hours.
          </p>
        </section>
      </div>
    </div>
  );
}
