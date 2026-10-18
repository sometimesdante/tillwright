import GenerateBill from "@/ui/GenerateBill";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { formatINR } from "@/utils/formatINR";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";
import { statusLabel } from "@/utils/statusLabel";

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span className="text-ink-muted text-sm">No items</span>;
  }
  return (
    <span className="text-sm text-ink">
      {products.map((item: any) => (
        <span key={item.id}>
          {item.name} × {item.count}
          <br />
        </span>
      ))}
    </span>
  );
}

function OrderRow(order: any) {
  return (
    <div className="bg-surface-raised rounded-md border border-line p-4 mb-4 last:mb-0">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-semibold text-ink font-mono tabular-nums">
            {formatInvoiceNo(order.invoice_id, order.created_at) ??
              "Awaiting payment"}
          </span>
          <span className="text-sm text-ink">
            {format(
              toZonedTime(order.created_at, "Asia/Kolkata"),
              "dd MMM yyyy, HH:mm"
            )}
          </span>
        </div>
        <span className="font-semibold text-field font-mono tabular-nums">{formatINR(order.amount)}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-ink-muted">Payment: </span>
          <span className="text-ink">{statusLabel(order.payment_status)}</span>
        </div>
        <div>
          <span className="text-ink-muted">Delivery: </span>
          <span className="text-ink">{statusLabel(order.delivery_status)}</span>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-xs text-ink-muted mb-1">Items</p>
        <OrderItems products={order.products} />
      </div>
      <div className="pt-2 border-t border-line">
        <GenerateBill id={order.id} />
      </div>
    </div>
  );
}

export default async function Orders() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("transactions")
    .select()
    .eq("email", data?.user?.email);

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto min-w-0">
        <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8 text-center">
          <h1 className="text-display text-ink mb-2">Your orders</h1>
          <p className="text-ink-muted">No orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-w-0">
      <h1 className="text-display text-ink mb-6">Your orders</h1>
      <div className="flex flex-col">
        {orders.map((order: any) => (
          <OrderRow
            key={order.id}
            id={order.id}
            invoice_id={order.invoice_id}
            created_at={order.created_at}
            razorpay_id={order.razorpay_id}
            payment_status={order.payment_status}
            delivery_status={order.delivery_status}
            amount={order.amount}
            products={order.products}
          />
        ))}
      </div>
    </div>
  );
}
