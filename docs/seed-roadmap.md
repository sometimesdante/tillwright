# Seed roadmap: catalogue items not seeded yet

`npm run seed` creates six products that the current `products` table can represent. The six items below are part of the Tillwright Supply catalogue, but each needs something the app doesn't support yet, so they are not seeded. When the feature lands, move the item into `scripts/seed-data.ts`.

Prices include GST. The GST rates are demo values: check the HSN or SAC code with your accountant before selling.

| Item | Price | Waiting on |
| --- | --- | --- |
| Ship-it tee | ₹799 | Variants |
| Single-origin coffee | ₹549 / ₹999 | Variants |
| Shipping commerce on Supabase (ebook) | ₹899 | Digital goods |
| Template licence | ₹4,999 | Digital goods |
| Starter bundle | ₹999 | Bundles |
| Gift card | ₹500 / ₹1,000 | Gift cards |

## Ship-it tee, 220 gsm cotton

**Waiting on: variants.** Sizes and colours share one listing, with stock per combination.

- Sizes: S, M, L, XL, XXL. Colours: forest green, ivory, charcoal.
- ₹799 at 5% GST (pretax ₹760.95). MRP ₹799. Purchase ₹380.

> Combed cotton jersey, 220 gsm, with a slightly boxy fit and a ribbed collar that stays flat after washing. “ship it” is screen-printed small on the left chest, so it works in a standup call. Wash cold, inside out; dry in the shade.

Needs: a variant model (size × colour), stock per variant, a size picker on the product card, and the variant in the cart line and invoice.

## Single-origin coffee, Chikmagalur

**Waiting on: variants.** One product, two pack sizes.

- 250 g ₹549, 500 g ₹999, at 5% GST. Purchase ₹290 and ₹520.

> Washed arabica from a single estate in Chikmagalur, Karnataka, grown at 1,200 m under silver oak shade. Medium roast with notes of jaggery, orange peel and cocoa. Roasted every Monday and packed in a valved bag; the roast date is on the back.

Needs: weight variants with their own price and stock. Selling food also needs the FSSAI number on the invoice, which `siteConfig.registrations` already supports.

## Shipping commerce on Supabase (ebook)

**Waiting on: digital goods.**

- ₹899 at 18% GST (pretax ₹761.86). No purchase cost; no inventory.

> A practical guide to building a small Indian storefront on Next.js and Supabase: row-level security that actually holds, Razorpay payment links, GST invoices and WhatsApp updates. 180 pages, PDF and EPUB, with the full source for every chapter. Free updates for the 2026 edition.

Needs: a product type that skips the address and delivery status, unlimited stock, and a signed download link sent after payment instead of a shipment.

## Tillwright template licence, single store

**Waiting on: digital goods.**

- ₹4,999 at 18% GST (pretax ₹4,236.44).

> The licence to run this storefront for one shop: source code, the brand docs and twelve months of updates. Use it for your own store or one client store; agencies need one licence per store.

Needs: the same digital-goods support as the ebook, plus a licence key or repository invite issued on payment.

## Starter bundle

**Waiting on: bundles.**

- Ceramic mug, sticker pack and dot-grid notebook for ₹999, against ₹1,097 bought separately.

> Everything for a new desk in one box: the 350 ml mug, twelve die-cut stickers and the A5 dot-grid notebook. Packed together, so it ships in one parcel and arrives as a gift without any extra wrapping.

Needs: a product made of other products, so stock comes out of each item. GST is tricky here: the items carry 5% and 18%, and a mixed supply is taxed at the highest rate, so the bundle needs its own rate on the invoice.

## Gift card

**Waiting on: gift cards.**

- ₹500 and ₹1,000.

> A Tillwright Supply gift card, sent by email with your message. It works on anything in the store, can be split across orders and lasts 12 months.

Needs: a code issued on payment, a balance that checkout can draw down, and expiry. GST is charged on what the card is spent on, not when it is sold, so it must not go through the normal invoice flow.
