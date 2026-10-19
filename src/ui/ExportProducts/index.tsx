"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download } from "lucide-react";
import Icon from "@/ui/Icon";
import { secondaryButtonClass } from "../AdminForm";
import { downloadPdf } from "@/utils/downloadPdf";
import { toastOptions } from "@/utils/toastOptions";

// Downloads a PDF of in-stock products. Admin only; the server checks.
export default function ExportProducts() {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    toast.success(
      "Preparing the products list. The download starts in a few seconds.",
      toastOptions,
    );
    const error = await downloadPdf({ type: "products" });
    if (error) toast.error(error, toastOptions);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={secondaryButtonClass}
    >
      <Icon icon={Download} />
      Export PDF
    </button>
  );
}
