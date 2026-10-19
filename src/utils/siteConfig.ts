// Store details used across the site, invoices, emails and policy pages.
// Edit this file to make the template your own. The About and policy pages
// are written to be usable as-is, but read them through once and have a legal
// professional review them before going live.
export const siteConfig = {
  // --- Brand ---
  name: "Tillwright",
  // Registered business name, shown on invoices and in legal pages.
  legalName: "Tillwright",
  description: "Shop online and get your order delivered to your door.",
  website: "tillwright.vercel.app",
  // Public site address, used for links in emails and logo URLs in PDFs.
  websiteUrl: "https://tillwright.vercel.app",
  // The mark alone: favicon-sized spaces, the admin sidebar and PDFs.
  logoPath: "/brand-docs/assets/Logos/tillwright-mark.svg",
  // Mark plus name, for the site header (brand-docs: headers use the wordmark).
  wordmarkPath: "/brand-docs/assets/Logos/tillwright-wordmark.svg",

  // --- Contact ---
  email: "orders@tillwright.app",
  phone: "+91 98401 27364",
  addressLines: [
    "No. 14, 2nd Floor,",
    "Vasantham Complex, Arcot Road,",
    "Valasaravakkam, Chennai, TN, 600087",
  ],
  city: "Chennai",
  state: "Tamil Nadu",
  supportHours: "Monday to Saturday, 10:00 AM – 6:00 PM IST",

  // Indian e-commerce rules require a named Grievance Officer. Replace the
  // name with a real person responsible for handling complaints.
  grievanceOfficer: {
    name: "Grievance Officer",
    email: "orders@tillwright.app",
    phone: "+91 98401 27364",
  },

  // "Request new item" link in the cart. Replace with your own Google Form
  // (Send > link icon in Google Forms gives you the URL).
  requestProductFormUrl:
    "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform",

  // --- Invoices ---
  // Registration numbers printed on invoices. Add, remove or relabel as
  // needed (FSSAI only applies to food businesses).
  registrations: [
    { label: "GST Number", value: "33AABCT4821K1ZQ" },
    { label: "PAN Number", value: "AABCT4821K" },
    { label: "FSSAI Number", value: "22426019000317" },
  ],

  // --- Emails ---
  // The sending address must be on a domain verified in Resend.
  emailFrom: "Tillwright <onboarding@resend.dev>",
  // Where new-order notifications are sent.
  adminEmail: "orders@tillwright.app",
  emailSignature: "The Tillwright Team",

  // --- Policies ---
  // These values are used in the Shipping, Returns, Terms and Privacy pages
  // and in the order confirmation email.
  policies: {
    lastUpdated: "October 18, 2026",
    deliveryArea: "Chennai and surrounding areas",
    processingTime: "1–2 business days",
    deliveryTime: "24–48 hours",
    shippingCharges: "Delivery is free on all orders.",
    damageReportWindow: "48 hours of delivery",
    returnWindow: "7 days of delivery",
    refundTime: "5–7 business days",
    nonReturnable:
      "perishable goods, opened or used personal-care items, and items marked as non-returnable on the product page",
  },
};

export const fullAddress = siteConfig.addressLines.join(" ");
