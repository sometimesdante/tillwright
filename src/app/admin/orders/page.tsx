import { createClient } from "@/utils/supabase/server";
import OrderStatus from "@/ui/OrderStatus";
import GenerateBill from "@/ui/GenerateBill";
import { redirect } from "next/navigation";
import ExportOrders from "@/ui/ExportOrders";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import CustomInvoice from "@/ui/CustomInvoice";

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span className="text-ink-muted">No items</span>;
  }
  return (
    <ul className="flex flex-col gap-0.5">
      {products.map((item: any) => (
        <li key={item.id} className="text-ink">
          {item.name}{" "}
          <span className="text-ink-muted whitespace-nowrap">× {item.count}</span>
        </li>
      ))}
    </ul>
  );
}

function PaymentPill({ status }: { status?: string }) {
  const value = status?.toLowerCase();
  const style =
    value === "paid"
      ? "bg-field-soft text-field border-field/30"
      : value === "cod"
        ? "bg-violet-50 text-violet-700 border-violet-200"
        : "bg-surface text-ink-muted border-line";
  return (
    <span
      className={`inline-block whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-sm border ${style} ${
        value === "cod" ? "uppercase" : "capitalize"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function OrderRow(order: any) {
  const date = toZonedTime(order.created_at, "Asia/Kolkata");
  return (
    <tr className="align-top hover:bg-surface">
      <td className="px-4 py-3 font-semibold text-ink whitespace-nowrap">
        #{order.invoice_id}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="block text-ink">{format(date, "d MMM yyyy")}</span>
        <span className="block text-xs text-ink-muted">
          {format(date, "h:mm a")}
        </span>
      </td>
      <td className="px-4 py-3 min-w-[14rem] max-w-xs">
        <span className="block font-medium text-ink">
          {order.name || "—"}
        </span>
        {order.phone ? (
          <a
            href={`tel:${order.phone}`}
            className="block text-xs text-ink-muted no-underline hover:text-field"
          >
            {order.phone}
          </a>
        ) : null}
        {order.email ? (
          <span className="block text-xs text-ink-muted break-all">
            {order.email}
          </span>
        ) : null}
        {order.address ? (
          <span className="block text-xs text-ink-muted mt-1">
            {order.address}
          </span>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <PaymentPill status={order.payment_status} />
      </td>
      <td className="px-4 py-3">
        <OrderStatus id={order.id} />
      </td>
      <td className="px-4 py-3 text-right font-semibold text-ink font-mono tabular-nums whitespace-nowrap">
        ₹{Number(order.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 min-w-[14rem] max-w-sm">
        <OrderItems products={order.products} />
      </td>
      <td className="px-4 py-3 text-right">
        <GenerateBill id={order.id} />
      </td>
    </tr>
  );
}

export default async function OrdersDashboard() {
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

  const { data: orders } = await supabase
    .from("transactions")
    .select()
    .order("invoice_id", { ascending: false })
    .neq("razorpay_id", "NULL");

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-ink">
            Orders
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {orders?.length ?? 0} orders · newest first
          </p>
        </div>
        <div className="flex gap-2">
          <CustomInvoice />
          <ExportOrders />
        </div>
      </div>

      <div className="bg-surface-raised rounded-md border border-line overflow-x-auto lg:overflow-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-line bg-surface">
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders && orders.length > 0 ? (
              orders.map((order: any) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  invoice_id={order.invoice_id}
                  created_at={order.created_at}
                  name={order.name}
                  email={order.email}
                  phone={order.phone}
                  address={order.address}
                  payment_status={order.payment_status}
                  delivery_status={order.delivery_status}
                  amount={order.amount}
                  products={order.products}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-ink-muted"
                >
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
