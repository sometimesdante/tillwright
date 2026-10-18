# Email templates

Branded HTML emails to paste into Supabase (account emails) and Resend (order emails). They use the brand tokens and fonts from `public/brand-docs`, with Helvetica and Arial as fallbacks for mail clients that block web fonts. Store details (name, address, phone, policies) are written in from `src/utils/siteConfig.ts`, so if you change those, find and replace them here too.

| Folder | Paste into | Sent by |
| --- | --- | --- |
| [`supabase/`](supabase/) | Supabase **Authentication > Emails** | Supabase, when someone signs up, changes their email, and so on |
| [`resend/`](resend/) | Resend **Templates** | Your code, with `resend.emails.send({ template })` |

The logo is a PNG at `public/email/tillwright-wordmark.png`, because Gmail and Outlook don't show SVG. Emails load it from your live site, so it only appears once the site is deployed.

## Supabase: account emails

| File | Template in the dashboard | Subject | Used by the app today |
| --- | --- | --- | --- |
| `confirm-signup.html` | Confirm sign up | `Confirm your email for Tillwright` | Yes, on sign-up |
| `change-email.html` | Change email address | `Confirm your new email address` | Yes, when an email is changed on `/account/profile` |
| `reset-password.html` | Reset password | `Reset your Tillwright password` | No: the app has no "forgot password" form yet |
| `magic-link.html` | Magic link or OTP | `Your Tillwright sign-in link` | No: the app signs in with a password |
| `invite-user.html` | Invite user | `You're invited to Tillwright` | Only if you invite users from the Supabase dashboard |
| `reauthentication.html` | Reauthentication | `Your Tillwright confirmation code` | Only if you turn on "secure password change" |

To install them:

1. Open your project's **Authentication > Emails** page and pick a template.
2. Paste the subject from the table above into **Subject**.
3. Switch the body to **Source**, then replace its contents with the whole HTML file.
4. Save. Repeat for each template.

Before you go live:

- Set **Authentication > URL Configuration > Site URL** to your deployed address, for example `https://www.tillwright.app`. Every link and the logo use `{{ .SiteURL }}`.
- Set up custom SMTP under **Authentication > Emails > SMTP Settings**. Supabase's built-in sender has a low hourly limit and is meant for testing. Resend works here too: host `smtp.resend.com`, port `465`, username `resend`, and your Resend API key as the password.

### How the links work

The links don't use Supabase's default `{{ .ConfirmationURL }}`. They point at this app's `/auth/confirm` route, which verifies the token on the server and sets the session cookie:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=<type>&next=/account/profile
```

| Template | `type` |
| --- | --- |
| Confirm sign up, Magic link | `email` |
| Invite user | `invite` |
| Change email address | `email_change` |
| Reset password | `recovery` |

Every link lands on `/account/profile`. For reset password and invite user, that signs the person in, but the app has no page to set a new password yet. Add one (for example `/account/update-password`, calling `supabase.auth.updateUser({ password })`) and change `next=` in those two templates before you rely on them.

## Resend: order emails

| File | Subject | Send it when |
| --- | --- | --- |
| `order-confirmed.html` | `Order {{{ORDER_NUMBER}}} is confirmed` | An order is placed (COD) or paid (Razorpay) |
| `order-out-for-delivery.html` | `Order {{{ORDER_NUMBER}}} is on its way` | Delivery status changes to `out for delivery` |
| `order-delivered.html` | `Order {{{ORDER_NUMBER}}} was delivered` | Delivery status changes to `delivered` |
| `order-cancelled.html` | `Order {{{ORDER_NUMBER}}} is cancelled` | Delivery status changes to `cancelled` |
| `new-order-shop.html` | `New order {{{ORDER_NUMBER}}}: {{{ORDER_TOTAL}}}` | An order is placed; goes to `siteConfig.adminEmail` |

To install them:

1. In Resend, open **Templates** and create a template. Give it the file name as its ID or alias (for example `order-confirmed`).
2. Paste or import the HTML file, and set the subject from the table.
3. Add the variables below. Give each a fallback, or every send must include it.
4. Publish. Resend only sends published templates.

### Variables

| Variable | Example | Where it comes from |
| --- | --- | --- |
| `ORDER_NUMBER` | `INV-2026-0007` | `formatInvoiceNo(order.invoice_id, order.created_at)` |
| `ORDER_DATE` | `18 Oct 2026, 6:00 PM` | `order.created_at` in IST, `d MMM yyyy, h:mm a` |
| `ITEMS` | `Desk mat, 900 × 400 mm × 1<br>Ceramic mug, 350 ml × 1` | `order.products`, one `name × count` per line |
| `ORDER_TOTAL` | `₹1,897.00` | `formatINR(order.amount)` |
| `PAYMENT_METHOD` | `Paid online (Razorpay)` or `Cash on delivery` | `order.payment_status` |
| `DELIVERY_ADDRESS` | `41, 3rd Cross, HSR Layout…` | `order.address` |
| `CUSTOMER_NAME` | `Siddharth Rao` | `order.name` |
| `CUSTOMER_PHONE` | `9845011206` | `order.phone` (shop email only) |
| `CUSTOMER_EMAIL` | `siddharth.rao@example.com` | `order.email` (shop email only) |

`EMAIL` and `FIRST_NAME` are reserved by Resend, so the templates use `CUSTOMER_EMAIL` and `CUSTOMER_NAME` instead. `ITEMS` joins lines with `<br>`. If your Resend account shows the tag as text, join the items with `, ` instead.

### Sending one

```ts
import { Resend } from "resend";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { formatINR } from "@/utils/formatINR";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";
import { siteConfig } from "@/utils/siteConfig";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(template: string, order: any) {
  const orderNumber = formatInvoiceNo(order.invoice_id, order.created_at) ?? "";
  await resend.emails.send({
    from: siteConfig.emailFrom,
    to: order.email,
    // Overrides the template subject, in case variables aren't filled there.
    subject: `Order ${orderNumber} is on its way`,
    template: {
      id: template, // for example "order-out-for-delivery"
      variables: {
        ORDER_NUMBER: orderNumber,
        ORDER_DATE: format(toZonedTime(order.created_at, "Asia/Kolkata"), "d MMM yyyy, h:mm a"),
        ITEMS: order.products.map((p: any) => `${p.name} × ${p.count}`).join("<br>"),
        ORDER_TOTAL: formatINR(order.amount),
        PAYMENT_METHOD: order.payment_status === "cod" ? "Cash on delivery" : "Paid online (Razorpay)",
        DELIVERY_ADDRESS: order.address,
        CUSTOMER_NAME: order.name,
      },
    },
  });
}
```

### What the app sends today

The app already sends two order emails, written as React components rather than Resend templates:

- `src/ui/Components/email-order-confirm.tsx` to the customer, which `order-confirmed.html` replaces.
- `src/ui/Components/email-order-place.tsx` to the shop, which `new-order-shop.html` replaces.

Out for delivery, delivered and cancelled emails aren't sent yet. Delivery updates go out on WhatsApp only (`notifyOrderDispatched`). To send them, call a helper like `sendOrderEmail` from the same place, after `OrderStatus` saves the new status.
