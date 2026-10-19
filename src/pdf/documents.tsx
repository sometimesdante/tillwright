import "server-only";

import type { ReactElement } from "react";
import { Order, Product } from "@/utils/types";
import { PDF_HEAD } from "@/utils/pdfHead";
import {
  InvoiceTemplate,
  OrdersReportTemplate,
  ProductsListTemplate,
} from "./templates";

// Reports run over several pages, so they get print margins; the invoice is
// laid out to fill one A4 page.
const REPORT_MARGINS = `<style>@media print { @page { size: A4; margin: 8mm 0 4mm 0; } }</style>`;

async function document(body: ReactElement, extraHead = "") {
  // Next.js rejects a static react-dom/server import in app routes, so load
  // it when a PDF is actually rendered.
  const { renderToStaticMarkup } = await import("react-dom/server");
  return `<!doctype html><html><head>${PDF_HEAD}${extraHead}</head><body>${renderToStaticMarkup(body)}</body></html>`;
}

export const invoiceHtml = (order: Order) =>
  document(<InvoiceTemplate transaction={order} />);

export const ordersReportHtml = (orders: Order[], start: string, end: string) =>
  document(
    <OrdersReportTemplate ordersList={orders} start={start} end={end} />,
    REPORT_MARGINS,
  );

export const productsListHtml = (products: Product[]) =>
  document(<ProductsListTemplate products={products} />, REPORT_MARGINS);
