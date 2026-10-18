import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { formatINR } from "@/utils/formatINR";
import { ChevronRight } from "lucide-react";
import Icon from "@/ui/Icon";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";
import { statusLabel } from "@/utils/statusLabel";

const TIMEZONE = "Asia/Kolkata";

const statusStyles: Record<string, string> = {
  pending: "bg-surface text-ink-muted border-line-strong",
  "out for delivery": "bg-surface-raised text-field border-field/40",
  delivered: "bg-field-soft text-field border-field/30",
  cancelled: "bg-danger/10 text-danger border-danger/30",
};

function StatusPill({ status }: { status?: string }) {
  const style =
    (status && statusStyles[status]) ||
    "bg-surface text-ink-muted border-line";
  return (
    <span
      className={`inline-block whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-sm border ${style}`}
    >
      {statusLabel(status) || "No status"}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="text-3xl font-semibold text-ink mt-1">{value}</p>
      {hint ? <p className="text-xs text-ink-muted mt-1">{hint}</p> : null}
    </>
  );
  const className =
    "block bg-surface-raised rounded-md border border-line p-5 no-underline";
  return href ? (
    <Link
      href={href}
      className={`${className} hover:border-field transition-colors`}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

const quickLinks = [
  {
    href: "/admin/orders",
    title: "Manage orders",
    description: "Update delivery status, print bills, export",
  },
  {
    href: "/admin/products",
    title: "Manage products",
    description: "Edit prices, stock and categories",
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    description: "Upload and manage product images",
  },
  {
    href: "/",
    title: "View storefront",
    description: "See the shop as customers do",
  },
];


export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  const role = await supabase
    .from("profiles")
    .select()
    .eq("email", data?.user?.email)
    .single();

  if (error || !data?.user || role.data?.role !== "admin") {
    redirect("/auth/login");
  }

  const todayStart = fromZonedTime(
    startOfDay(toZonedTime(new Date(), TIMEZONE)),
    TIMEZONE,
  ).toISOString();

  const [recent, today, pending, outForDelivery, inStock, outOfStock] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("id, invoice_id, created_at, name, amount, delivery_status")
        .neq("razorpay_id", "NULL")
        .order("invoice_id", { ascending: false })
        .limit(8),
      supabase
        .from("transactions")
        .select("amount")
        .neq("razorpay_id", "NULL")
        .gte("created_at", todayStart),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .neq("razorpay_id", "NULL")
        .eq("delivery_status", "pending"),
      supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .neq("razorpay_id", "NULL")
        .eq("delivery_status", "out for delivery"),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .neq("inventory", 0),
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("inventory", 0),
    ]);

  const todayOrders = today.data ?? [];
  const todayValue = todayOrders.reduce(
    (sum, o) => sum + (Number(o.amount) || 0),
    0,
  );
  const name = data.user.user_metadata?.name as string | undefined;

  return (
    <div className="flex flex-col gap-8 min-w-0">
      <div>
        <p className="text-sm text-ink-muted">
          {format(toZonedTime(new Date(), TIMEZONE), "EEEE, d MMMM yyyy")}
        </p>
        <h1 className="text-display text-ink mt-1">
          {name ? `Welcome back, ${name.split(" ")[0]}` : "Dashboard"}
        </h1>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Orders today"
          value={todayOrders.length}
          hint={`${formatINR(todayValue)} order value`}
          href="/admin/orders"
        />
        <StatCard
          label="Pending delivery"
          value={pending.count ?? 0}
          hint="Not yet dispatched"
          href="/admin/orders"
        />
        <StatCard
          label="Out for delivery"
          value={outForDelivery.count ?? 0}
          href="/admin/orders"
        />
        <StatCard
          label="Products in stock"
          value={inStock.count ?? 0}
          hint={`${outOfStock.count ?? 0} out of stock`}
          href="/admin/products"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-w-0">
        <div className="lg:col-span-2 bg-surface-raised rounded-md border border-line min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h2 className="text-heading text-ink">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-field font-medium no-underline hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.data && recent.data.length > 0 ? (
            <ul className="divide-y divide-line">
              {recent.data.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center gap-3 px-5 py-3 min-w-0"
                >
                  <span className="text-sm font-medium text-ink-muted font-mono tabular-nums whitespace-nowrap w-32 flex-shrink-0">
                    {formatInvoiceNo(order.invoice_id, order.created_at) ?? "—"}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">
                      {order.name || "—"}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {format(
                        toZonedTime(order.created_at, TIMEZONE),
                        "d MMM, h:mm a",
                      )}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-ink font-mono tabular-nums flex-shrink-0">
                    {formatINR(order.amount)}
                  </span>
                  <span className="hidden sm:block w-32 flex-shrink-0 text-right">
                    <StatusPill status={order.delivery_status} />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-ink-muted">
              No orders yet
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-heading text-ink">
            Quick links
          </h2>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between gap-3 bg-surface-raised rounded-md border border-line px-5 py-4 no-underline hover:border-field transition-colors"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">
                  {link.title}
                </span>
                <span className="block text-xs text-ink-muted mt-0.5">
                  {link.description}
                </span>
              </span>
              <Icon icon={ChevronRight} className="text-ink flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
