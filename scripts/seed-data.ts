// Demo data for "Tillwright Supply", the developer merch demo store.
// scripts/seed.ts writes this to Supabase. Edit here, then run `npm run seed`.
//
// Money: `price` includes GST. `pretax` is the price before GST and `tax` is
// the GST rate in percent, which is how the app stores it (the invoice works
// out the tax amount as price - pretax). `purchase` is our cost per unit.

export type SeedProduct = {
  slug: string; // image file is seed-<slug>.webp in scripts/seed-assets
  name: string;
  category: string;
  description: string;
  mrp: number;
  price: number;
  pretax: number;
  tax: 5 | 18;
  purchase: number;
  inventory: number;
};

export const products: SeedProduct[] = [
  {
    slug: "hoodie",
    name: "Ship-it hoodie, 400 gsm cotton",
    category: "Merch",
    description:
      "Heavyweight 400 gsm brushed-back cotton fleece in forest green, with “ship it” printed in gold across the chest. Relaxed fit, a double-lined hood and a kangaroo pocket that holds a phone and a coiled USB-C cable. Wash cold inside out and dry flat; expect about 3% shrinkage on the first wash.",
    mrp: 1890,
    price: 1890,
    pretax: 1800,
    tax: 5,
    purchase: 950,
    inventory: 0,
  },
  {
    slug: "keycaps",
    name: "PBT keycap set, 75% layout",
    category: "Merch",
    description:
      "92 double-shot PBT keycaps in white, with a burnt-orange 6.25u spacebar and shortcut sub-legends on the front of every key. Cherry profile, fits most 75% boards on MX-style switches, and the legends won’t fade or turn shiny. Comes with a wire keycap puller.",
    mrp: 2950,
    price: 2950,
    pretax: 2500,
    tax: 18,
    purchase: 1450,
    inventory: 3,
  },
  {
    slug: "desk-mat",
    name: "Desk mat, 900 × 400 mm",
    category: "Merch",
    description:
      "Charcoal merino wool felt on a 2 mm natural cork base, 900 × 400 mm and 4 mm thick overall. Fits a full keyboard and a mouse with room for a mug, and takes the clack out of a mechanical board. Lint-roll it weekly and spot clean with cold water.",
    mrp: 1599,
    price: 1298,
    pretax: 1100,
    tax: 18,
    purchase: 520,
    inventory: 25,
  },
  {
    slug: "stickers",
    name: "Sticker pack, 12 die-cut vinyl",
    category: "Merch",
    description:
      "Twelve die-cut vinyl stickers, 50 to 75 mm each, with a matte laminate that survives laptop bags and the occasional coffee. Includes “works on my machine”, “LGTM” and “git push” (no --force). They peel off cleanly for the first few months, in case you change your mind.",
    mrp: 149,
    price: 149,
    pretax: 126.27,
    tax: 18,
    purchase: 62,
    inventory: 120,
  },
  {
    slug: "mug",
    name: "Ceramic mug, 350 ml",
    category: "Merch",
    description:
      "White stoneware mug, matte outside and glossy inside, 350 ml to the brim and 380 g empty. The handle takes three fingers and the wide base doesn’t wobble on a desk mat. Microwave and dishwasher safe.",
    mrp: 599,
    price: 599,
    pretax: 570.48,
    tax: 5,
    purchase: 310,
    inventory: 40,
  },
  {
    slug: "notebook",
    name: "Dot-grid notebook, A5",
    category: "Stationery",
    description:
      "A5 hardcover in forest-green linen with 160 numbered pages of 100 gsm ivory paper, printed in a 5 mm dot grid that takes fountain pen without bleeding through. Lay-flat binding, a gold elastic band and a back pocket for receipts. 290 g.",
    mrp: 349,
    price: 349,
    pretax: 332.38,
    tax: 5,
    purchase: 175,
    inventory: 60,
  },
];

export type SeedAccount = {
  email: string;
  passwordEnv: "SEED_ADMIN_PASSWORD" | "SEED_CUSTOMER_PASSWORD";
  role: "admin" | "customer";
  // Stored in auth user_metadata, where the profile and checkout pages read it.
  metadata: { name: string; phone?: string; address?: string };
};

export const accounts: SeedAccount[] = [
  {
    email: "admin@tillwright.app",
    passwordEnv: "SEED_ADMIN_PASSWORD",
    role: "admin",
    metadata: { name: "Tillwright Admin" },
  },
  {
    email: "priya.raman@tillwright.app",
    passwordEnv: "SEED_CUSTOMER_PASSWORD",
    role: "customer",
    metadata: {
      name: "Priya Raman",
      phone: "9840011201",
      address:
        "Flat 3B, Lakshmi Apartments, 12 Kamaraj Street, Mylapore, Chennai, TN 600004",
    },
  },
  {
    email: "arjun.mehta@tillwright.app",
    passwordEnv: "SEED_CUSTOMER_PASSWORD",
    role: "customer",
    metadata: { name: "Arjun Mehta", phone: "9820011202" },
  },
];

// Guest checkout writes a guest_profiles row alongside the order.
export const guests = [
  {
    name: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    phone: "9940011203",
    address: "22 Race Course Road, Gopalapuram, Coimbatore, TN 641018",
  },
];

export type SeedOrder = {
  // transaction_id in the app is a nanoid; seeded orders use a seed_ prefix so
  // --reset can find them without touching real orders.
  ref: string;
  daysAgo: number;
  hour: number; // IST, 24h
  name: string;
  email: string;
  phone: string;
  address: string;
  // Online orders: the Razorpay payment link status ("paid", "cancelled").
  // COD orders: "cod", as checkout writes it.
  payment_status: "paid" | "cod" | "cancelled";
  delivery_status: "pending" | "out for delivery" | "delivered" | "cancelled";
  items: { slug: string; count: number }[];
};

const priya = accounts[1];
const priyaContact = {
  name: priya.metadata.name,
  email: priya.email,
  phone: priya.metadata.phone!,
  address: priya.metadata.address!,
};

export const orders: SeedOrder[] = [
  {
    ref: "seed_order_01",
    daysAgo: 28,
    hour: 11,
    ...priyaContact,
    payment_status: "paid",
    delivery_status: "delivered",
    items: [
      { slug: "mug", count: 2 },
      { slug: "stickers", count: 1 },
    ],
  },
  {
    ref: "seed_order_02",
    daysAgo: 24,
    hour: 16,
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@example.com",
    phone: "9890011204",
    address: "B-704, Kumar Pebble Park, Hadapsar, Pune, MH 411028",
    payment_status: "paid",
    delivery_status: "delivered",
    items: [
      { slug: "keycaps", count: 1 },
      { slug: "stickers", count: 2 },
    ],
  },
  {
    ref: "seed_order_03",
    daysAgo: 19,
    hour: 20,
    ...priyaContact,
    payment_status: "cod",
    delivery_status: "delivered",
    items: [{ slug: "hoodie", count: 1 }],
  },
  {
    ref: "seed_order_04",
    daysAgo: 15,
    hour: 10,
    name: "Meera Pillai",
    email: "meera.pillai@example.com",
    phone: "9447011205",
    address: "14/233, Panampilly Nagar, Kochi, KL 682036",
    payment_status: "cod",
    delivery_status: "delivered",
    items: [{ slug: "notebook", count: 3 }],
  },
  {
    // Payment link cancelled. It keeps its invoice number so the invoice
    // series has no gaps for GST filing, and the status records why.
    ref: "seed_order_05",
    daysAgo: 11,
    hour: 14,
    ...priyaContact,
    payment_status: "cancelled",
    delivery_status: "cancelled",
    items: [{ slug: "keycaps", count: 1 }],
  },
  {
    ref: "seed_order_06",
    daysAgo: 2,
    hour: 9,
    ...priyaContact,
    payment_status: "paid",
    delivery_status: "out for delivery",
    items: [
      { slug: "desk-mat", count: 1 },
      { slug: "notebook", count: 2 },
    ],
  },
  {
    ref: "seed_order_07",
    daysAgo: 1,
    hour: 18,
    name: "Siddharth Rao",
    email: "siddharth.rao@example.com",
    phone: "9845011206",
    address: "41, 3rd Cross, HSR Layout Sector 2, Bengaluru, KA 560102",
    payment_status: "paid",
    delivery_status: "pending",
    items: [
      { slug: "desk-mat", count: 1 },
      { slug: "mug", count: 1 },
    ],
  },
  {
    ref: "seed_order_08",
    daysAgo: 0,
    hour: 8,
    ...guests[0],
    payment_status: "cod",
    delivery_status: "pending",
    items: [
      { slug: "stickers", count: 1 },
      { slug: "mug", count: 1 },
    ],
  },
];
