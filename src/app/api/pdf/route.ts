import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { getViewer } from "@/utils/orders/auth";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";
import { invoiceHtml, ordersReportHtml, productsListHtml } from "@/pdf/documents";
import { renderPdf } from "@/pdf/render";

// Renders PDFs from IDs, never from HTML sent by the browser.
//   { type: "invoice", orderId }        the customer's own order, or any order for admins
//   { type: "orders", start, end }      admins: orders between two IST dates (yyyy-MM-dd)
//   { type: "products" }                admins: in-stock products
const IST = "Asia/Kolkata";
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const fail = (status: number, error: string) =>
  NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  const { supabase, user, isAdmin } = await getViewer();
  if (!user) return fail(401, "Sign in to download PDFs.");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Invalid request.");
  }

  let html: string;
  let filename: string;

  try {
    if (body?.type === "invoice") {
      const orderId = Number(body.orderId);
      if (!Number.isInteger(orderId) || orderId <= 0) return fail(400, "Invalid order.");
      // Read with the visitor's session: row-level security returns the order
      // only if it's theirs or they're an admin.
      const { data: order } = await supabase
        .from("transactions")
        .select()
        .eq("id", orderId)
        .maybeSingle();
      if (!order) return fail(404, "Order not found.");
      if (!order.invoice_id) return fail(409, "This order has no invoice yet.");
      html = await invoiceHtml(order);
      filename = `${formatInvoiceNo(order.invoice_id, order.created_at)}.pdf`;
    } else if (body?.type === "orders") {
      if (!isAdmin) return fail(403, "Only admins can export orders.");
      const start = String(body.start ?? "");
      const end = String(body.end ?? "");
      if (!DATE.test(start) || !DATE.test(end) || start > end) {
        return fail(400, "Choose a start date on or before the end date.");
      }
      const from = fromZonedTime(`${start}T00:00:00`, IST);
      const to = fromZonedTime(`${end}T23:59:59.999`, IST);
      const { data: orders, error } = await supabase
        .from("transactions")
        .select()
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .neq("razorpay_id", "NULL")
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (!orders?.length) return fail(404, "There are no orders in that date range.");
      const label = (d: Date) => format(d, "d MMM yyyy");
      html = await ordersReportHtml(orders, label(new Date(`${start}T00:00:00`)), label(new Date(`${end}T00:00:00`)));
      filename = `Orders ${start} to ${end}.pdf`;
    } else if (body?.type === "products") {
      if (!isAdmin) return fail(403, "Only admins can export products.");
      const { data: products, error } = await supabase
        .from("products")
        .select()
        .neq("inventory", 0)
        .order("category", { ascending: true });
      if (error) throw error;
      html = await productsListHtml(products ?? []);
      filename = "Products.pdf";
    } else {
      return fail(400, "Unknown PDF type.");
    }

    const pdf = await renderPdf(html);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return fail(500, "Couldn't generate the PDF. Try again.");
  }
}
