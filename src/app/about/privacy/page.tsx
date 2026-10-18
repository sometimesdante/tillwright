import { fullAddress, siteConfig } from "@/utils/siteConfig";

export default function Privacy() {
  const { grievanceOfficer, policies } = siteConfig;

  return (
    <div className="w-full md:w-1/2 mx-auto">
      <h1 className="text-3xl">Privacy policy</h1>
      <p>Last updated: {policies.lastUpdated}</p>
      <p>
        This Privacy Policy explains how {siteConfig.legalName} (&quot;we&quot;,
        &quot;us&quot; or &quot;our&quot;) collects, uses, shares and protects
        your personal data when you use{" "}
        <a
          href={siteConfig.websiteUrl}
          rel="external nofollow noopener"
          target="_blank"
        >
          {siteConfig.website}
        </a>{" "}
        (the &quot;Website&quot;). It is written to meet the requirements of
        India&apos;s Digital Personal Data Protection Act, 2023 and the
        Information Technology Act, 2000. By using the Website, you agree to
        the practices described here.
      </p>

      <h2>Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Account details:</strong> your name, email address, phone
          number and password when you create an account.
        </li>
        <li>
          <strong>Order details:</strong> your delivery address, the products
          you order, your order history and any notes you add at checkout.
        </li>
        <li>
          <strong>Communications:</strong> messages you send us by email,
          phone or WhatsApp, such as support requests and feedback.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage data:</strong> pages you visit, the time spent on them,
          your browser and device type, and your IP address.
        </li>
        <li>
          <strong>Cookies:</strong> small files that keep you signed in,
          remember your cart and help us understand how the Website is used.
        </li>
      </ul>
      <h3>Payment information</h3>
      <p>
        Online payments are processed by Razorpay. Your card, UPI and bank
        details are entered directly with Razorpay and are never stored on our
        servers. We only receive confirmation of whether a payment succeeded,
        along with a transaction reference.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To create and manage your account.</li>
        <li>To process, deliver and support your orders.</li>
        <li>
          To send order confirmations and delivery updates by email and
          WhatsApp.
        </li>
        <li>To respond to your questions, complaints and requests.</li>
        <li>To prevent fraud and keep the Website secure.</li>
        <li>To understand how the Website is used and improve it.</li>
        <li>To meet our legal, tax and accounting obligations.</li>
      </ul>
      <p>
        We will only send you promotional messages if you have agreed to
        receive them, and you can opt out at any time.
      </p>

      <h2>Who we share your information with</h2>
      <p>
        We do not sell your personal data. We share it only with the service
        providers we rely on to run the store, and only as much as they need:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong>, which hosts our database and manages
          account sign-in.
        </li>
        <li>
          <strong>Razorpay</strong>, which processes online payments and
          refunds.
        </li>
        <li>
          <strong>Resend</strong>, which delivers our order emails.
        </li>
        <li>
          <strong>WhatsApp (Meta)</strong>, which delivers order notifications
          to your phone.
        </li>
        <li>
          <strong>Google Analytics</strong>, which helps us understand how the
          Website is used.
        </li>
        <li>
          <strong>Delivery partners</strong>, who receive your name, address
          and phone number to deliver your order.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law, by a court order
        or by a government authority, or to protect our rights and the safety
        of our customers.
      </p>
      <p>
        Some of these providers may store or process data outside India. Where
        this happens, we rely on providers that apply appropriate safeguards to
        protect your information.
      </p>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and remember your cart,
        and analytics cookies to understand how visitors use the Website. You
        can block or delete cookies in your browser settings, but some parts of
        the Website, such as signing in and checkout, may not work without
        them.
      </p>

      <h2>How long we keep your information</h2>
      <p>
        We keep your account information for as long as your account is
        active. Order and invoice records are kept for as long as required by
        Indian tax and accounting laws (generally up to 8 years). When data is
        no longer needed, we delete or anonymise it.
      </p>

      <h2>Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>access a summary of the personal data we hold about you,</li>
        <li>correct or update inaccurate or incomplete data,</li>
        <li>
          ask us to delete your data, unless we need to keep it for legal
          reasons,
        </li>
        <li>withdraw any consent you have given us,</li>
        <li>
          nominate another person to exercise these rights on your behalf, and
        </li>
        <li>raise a complaint with our Grievance Officer.</li>
      </ul>
      <p>
        To exercise any of these rights, email us at {siteConfig.email}. We
        will respond within 30 days.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your
        information, including encrypted connections (HTTPS) and restricted
        access to customer data. However, no method of transmission or storage
        over the internet is completely secure, and we cannot guarantee
        absolute security.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        The Website is intended for users aged 18 and over. We do not
        knowingly collect personal data from children. If you believe a child
        has given us their information, please contact us and we will delete
        it.
      </p>

      <h2>Links to other websites</h2>
      <p>
        The Website may link to websites we do not operate. We are not
        responsible for their content or privacy practices, so please review
        their privacy policies.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with a new &quot;Last updated&quot; date. If we make
        significant changes, we will notify you by email or through the
        Website.
      </p>

      <h2>Grievance officer</h2>
      <p>
        If you have concerns about how your personal data is handled, you can
        contact our Grievance Officer:
      </p>
      <ul>
        <li>{grievanceOfficer.name}</li>
        <li>Email: {grievanceOfficer.email}</li>
        <li>Phone: {grievanceOfficer.phone}</li>
      </ul>

      <h2>Contact us</h2>
      <p>If you have any questions about this Privacy Policy, contact us:</p>
      <ul>
        <li>By email: {siteConfig.email}</li>
        <li>By phone: {siteConfig.phone}</li>
        <li>By post: {fullAddress}</li>
      </ul>
    </div>
  );
}
