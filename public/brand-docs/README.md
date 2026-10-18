Tillwright is commerce for your Supabase app: products, carts, orders, checkout and GST invoices that live in the Postgres you already run, with Razorpay, cash on delivery and WhatsApp order updates built in. It ships with a reference storefront you can use as-is or throw away.

The people reading this brand are developers. Mostly that means teams already on Supabase who need to sell something, in-house developers at Indian D2C brands outgrowing Shopify, and agencies who build stores for clients. They skim, they judge a project by its README and its first code block, and they distrust hype. The brand should feel like a well-made tool from a well-run shop: plain, warm, exact. The name joins the shop till and the tilled field, and so does the mark.

## Two layers

- **The Tillwright brand** is for the README, docs, landing page at tillwright.app, GitHub, npm and social posts. Everything below applies to it.
- **The reference storefront** (the demo shop, Tillwright Supply) ships with the Tillwright look as its default theme. Anyone using it is expected to re-skin it, so storefront rules are kept to the last section.

## Positioning

- Headline: **Commerce for your Supabase app.**
- One line: Products, carts, orders and Razorpay-ready checkout in the database you already have. No second server.
- Proof points, in this order: runs on Supabase and Vercel free tiers · Razorpay, COD and UPI · GST invoices as PDF · WhatsApp and email order updates · your data, open source.
- India is the edge, not the whole pitch. Lead with Supabase, then say what is built in for India.
- Compare honestly. "Lighter than Medusa: no Redis, no separate Node server" is fine. Never knock another project.

## Voice and copy

- Write like a good changelog: short, specific, second person. Sentence case everywhere, including buttons and headings.
- Show, then tell. A code block or a command comes before the paragraph explaining it whenever possible.
- Use real names and numbers: `products` table, `RAZORPAY_KEY_ID`, "about 5 minutes", "3 env vars". Not "seamless integration".
- Banned words: blazing, seamless, effortless, revolutionary, powerful, simply, just. No exclamation marks, no emoji, no rocket ships.
- Be upfront about limits. A "What it doesn't do yet" list is part of the brand, not a weakness.
- Errors say what happened and what to do: "Signature check failed. The payment wasn't marked paid. Check RAZORPAY_KEY_SECRET matches your dashboard."
- Money is `₹` with two decimals: ₹1,299.00. Order and invoice numbers keep their real format: INV-2026-0142.

## Colour

- Pages sit on `surface`. Cards and callouts use `surface-raised` with a `line` border, not a shadow.
- `field` is the one action colour: primary buttons, links, the active docs nav item. One primary button per view.
- `rye` is for highlights only: "New" badges, offers, and strings in code. As a fill with `on-rye` text on light grounds, never as text on `surface`.
- `loam` marks India-specific content (GST, COD, UPI callouts) and the invoice header band. Don't use it for actions.
- Code blocks use `code-surface` in both themes, with `code-ink` text and the four `syntax-*` colours. All of them clear 5:1 on `code-surface`.
- Inline code sits on `field-soft` with `radius-sm` and `code-inline` type.
- Docs and the landing page follow the system theme, and both themes are first class. Screenshots of the storefront are shown in light.
- `danger` marks errors and failed payments, always with a word next to it. Keyboard focus is a 2px `focus-ring` with a 2px offset.

## Type

- Headlines use Bricolage Grotesque: `display-xl` for the landing hero and README banner only, `display` for page titles, `heading` for sections.
- Prose uses Instrument Sans: `body` for docs and landing copy, `title` for API entries and feature names, `label` for buttons and nav, `caption` for versions and metadata.
- Code uses IBM Plex Mono: `code` for blocks and terminal snippets, `code-inline` for names in prose. The storefront also uses it for `price` and `receipt` lines.
- Load from Google Fonts: Bricolage Grotesque 600 and 700, Instrument Sans 400, 500 and 600, IBM Plex Mono 400 and 500.

## Layout and shape

- Spacing runs on a 4px base: `space-4` card padding and mobile gutter, `space-6` between cards, `space-8` between sections, `space-12` for the hero.
- Docs: `docs-sidebar` navigation on the left, prose capped at `docs-content`, code blocks may run wider. Every code block has a copy button.
- Landing: sections capped at `landing-max`. The hero shows the headline, one line, two buttons (Get started, View on GitHub) and a real code block, not an illustration.
- Corners: `radius-sm` for inputs, badges and inline code, `radius-md` for buttons, cards and code blocks, `radius-lg` for modals and hero bands, `radius-full` for pills.
- `shadow-float` is for floating layers only (menus, toasts, the cart drawer). Cards stay flat.

## Logo

- Use `tillwright-wordmark.svg` in headers on light grounds and `tillwright-wordmark-reverse.svg` on `field` or dark grounds.
- Use `tillwright-mark.svg` alone for the favicon, the GitHub org avatar, the npm avatar and anywhere under 96px wide.
- Keep clear space of a quarter of the mark's width on every side. Don't stretch, outline or recolour parts of the mark.

## Developer surfaces

- **README:** banner (the Cover), the one-line pitch, badges (licence, version, deploy), a 3-step quickstart in code blocks, the feature list, then "What it doesn't do yet". Badges stay to four or fewer.
- **GitHub social preview:** 1280 × 640, the Cover composition with the headline. This is what shows on LinkedIn and X.
- **Package names:** lowercase and scoped, for example `@tillwright/core`. The product is always written "Tillwright", never "TillWright" or "tillwright" in prose.
- **Diagrams:** flat boxes in `surface-raised` with `line` borders, arrows in `ink-muted`, the Tillwright part in `field`. No 3D, no gradients.

## Iconography

- Lucide icons at 20px with a 1.75px stroke, coloured `ink` or `field`. No filled or emoji icons.
- An icon on its own needs an accessible label.

## The reference storefront

- The demo store is Tillwright Supply, a developer merch shop, so developers see themselves as the customer.
- It uses this brand as its default theme. A real store swaps the logo files and the `field`, `rye` and `loam` values, and keeps type, spacing and voice unless it has its own.
- Storefront copy follows the same voice, with commerce terms: "Add to cart", "Your order is on its way". Weights and volumes use a space and SI symbols: 250 g, 1 L.
