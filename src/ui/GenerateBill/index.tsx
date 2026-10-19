"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadPdf } from "@/utils/downloadPdf";
import { toastOptions } from "@/utils/toastOptions";

interface GenerateBillProps {
  id: string | number;
}

// Downloads the invoice PDF for an order. The server renders it from the
// order ID and checks the visitor may see that order.
export default function GenerateBill({ id }: GenerateBillProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    toast.success(
      "Preparing your invoice. The download starts in a few seconds.",
      toastOptions,
    );
    const error = await downloadPdf({ type: "invoice", orderId: Number(id) });
    if (error) toast.error(error, toastOptions);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="text-sm font-medium text-field px-3 py-1.5 rounded-md border border-field/40 hover:bg-field-soft transition-colors disabled:opacity-60"
    >
      Print
    </button>
  );
}
