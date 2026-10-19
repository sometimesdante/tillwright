"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AdminField,
  AdminModal,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../AdminForm";
import { createCustomInvoice } from "@/app/admin/orders/actions";
import { downloadPdf } from "@/utils/downloadPdf";
import { toastOptions } from "@/utils/toastOptions";

// A one-line invoice for a sale made outside the store. The server assigns
// the next invoice number in the series, so numbers can't clash or skip.
export default function CustomInvoice() {
  const router = useRouter();
  const [showFields, setShowFields] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    setShowFields(!showFields);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);

    const result = await createCustomInvoice({
      amount: Number(formData.get("amount")),
      description: String(formData.get("description") ?? ""),
    });
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }

    toast.success(
      "Preparing your invoice. The download starts in a few seconds.",
      toastOptions,
    );
    const pdfError = await downloadPdf({ type: "invoice", orderId: result.orderId });
    if (pdfError) toast.error(pdfError, toastOptions);
    setBusy(false);
    setShowFields(false);
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={toggle} className={secondaryButtonClass}>
        Custom invoice
      </button>
      {showFields && (
        <AdminModal title="Create custom invoice" onClose={toggle}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AdminField label="Description" htmlFor="custom-description">
              <input
                type="text"
                name="description"
                id="custom-description"
                placeholder="Miscellaneous"
                maxLength={120}
                className={adminInputClass}
              />
            </AdminField>
            <AdminField label="Amount (₹, tax included)" htmlFor="custom-amount">
              <input
                type="number"
                name="amount"
                id="custom-amount"
                min="0.01"
                step="0.01"
                placeholder="1299.00"
                className={adminInputClass}
                required
              />
            </AdminField>
            <p className="text-sm text-ink-muted">
              The invoice number is assigned automatically, next in the series.
            </p>
            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={toggle}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className={primaryButtonClass}
              >
                {busy ? "Creating…" : "Create and download"}
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}
