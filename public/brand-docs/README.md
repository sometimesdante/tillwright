Tillwright is a storefront template for growers and small makers who sell direct: a catalogue, a basket, Razorpay checkout, order emails, WhatsApp updates and GST invoices. The brand should feel like a well-run farm shop: plain, warm, exact about weights and money. The name joins the shop till and the tilled field, and so does the mark.

## Voice and copy

- Write in sentence case everywhere: buttons, headings, emails ("Add to basket", "Your order is on its way").
- Lead with the product and its facts: what it is, how much, how it was made. "Groundnut oil, wood-pressed · 1 L" beats "Premium artisanal oil".
- Speak to the customer as "you"; the shop is "we". No exclamation marks, no emoji, no urgency ("Only 2 left!").
- Money is always `₹` with two decimals in `price` style: ₹420.00. Weights and volumes use a space and SI symbols: 500 g, 1 L, 2 kg.
- Errors say what happened and what to do: "Payment didn't go through. Your card wasn't charged. Try again or pay by UPI."
- Order and invoice numbers keep their real format in `receipt` style: INV-2026-0142.

## Colour

- Pages sit on `surface`. Cards, the cart drawer and invoice paper use `surface-raised` with a `line` border, not a shadow.
- `field` is the one action colour: primary buttons (`field` fill, `on-field` label), links, the selected state and in-stock labels. Use one primary button per view.
- `rye` is for offers and price tags only, as a fill with `on-rye` text. Never set `rye` text on `surface`.
- `loam` is a brand fill for illustration blocks and the receipt header band. Don't use it for actions.
- Body text is `ink`; weights, units and dates are `ink-muted`. Both meet 4.5:1 on `surface` and `surface-raised` in light and dark.
- `danger` marks payment failures and out-of-stock items, always with a word next to it.
- Inputs use a `line-strong` border, `radius-sm` corners and turn `field` on focus. Keyboard focus is the `focus-ring` colour: a 2px solid ring with a 2px offset.

## Type

- Headlines use the display family (Bricolage Grotesque): `display-xl` for the storefront hero only, `display` for category and page titles, `heading` for sections.
- Everything else uses the sans family (Instrument Sans): `title` for product names, `body` for descriptions and policies, `label` for buttons and form labels, `caption` for units and metadata.
- Anything a customer adds up uses the mono family (IBM Plex Mono) with tabular figures: `price` for prices and totals, `receipt` for invoice lines and order IDs.
- Load the three faces from Google Fonts: Bricolage Grotesque 600 and 700, Instrument Sans 400, 500 and 600, IBM Plex Mono 400 and 500.

## Layout and shape

- Spacing runs on a 4px base: `space-4` card padding and mobile gutter, `space-6` between cards in the grid, `space-8` between sections, `space-12` for the hero.
- Product grid: 2 columns on phones, 3 on tablets, 4 on desktop, with square product images at `radius-md`.
- Corners: `radius-sm` for inputs and badges, `radius-md` for buttons and cards, `radius-lg` for the cart drawer and modals, `radius-full` for offer pills and the quantity stepper.
- `shadow-float` is for floating layers only (cart drawer, menus, toasts). Cards stay flat.

## Logo

- Use `tillwright-wordmark.svg` in the header on light grounds and `tillwright-wordmark-reverse.svg` on `field` or dark grounds.
- Use `tillwright-mark.svg` alone for the favicon, invoice header and anywhere under 96px wide.
- Keep clear space of a quarter of the mark's width on every side. Don't stretch, outline or recolour parts of the mark.

## Iconography

- Use Lucide icons at 20px with a 1.75px stroke, coloured `ink` or `field`. No filled or emoji icons.
- An icon on its own (cart, search, account) needs an accessible label.

## Making it a client's store

- The template ships with the Tillwright brand. A client store swaps the logo files, `field`, `rye` and `loam`, and keeps the type, spacing and voice rules unless the client has their own.
