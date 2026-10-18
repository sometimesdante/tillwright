import { toZonedTime } from "date-fns-tz";

// Invoice numbers in the brand format, INV-2026-0142. The database keeps the
// plain integer series (transactions.invoice_id) so GST numbering stays
// continuous; only the display adds the IST year of the order and padding.
export function formatInvoiceNo(
  invoiceId: number | string | null | undefined,
  createdAt?: string | Date | null,
): string | null {
  if (invoiceId === null || invoiceId === undefined || invoiceId === "") {
    return null;
  }
  const year = toZonedTime(createdAt ?? new Date(), "Asia/Kolkata").getFullYear();
  return `INV-${year}-${String(invoiceId).padStart(4, "0")}`;
}
