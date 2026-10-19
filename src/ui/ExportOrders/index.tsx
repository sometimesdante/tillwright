"use client";

import { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { enIN } from "date-fns/locale/en-IN";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AdminField,
  AdminModal,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../AdminForm";
import { downloadPdf } from "@/utils/downloadPdf";
import { toastOptions } from "@/utils/toastOptions";

registerLocale("en-IN", enIN);
setDefaultLocale("en-IN");

// Downloads a PDF of orders between two dates (IST). Admin only; the server
// checks and loads the orders itself.
export default function ExportOrders() {
  const [showFields, setShowFields] = useState(false);
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(() => new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleClick = () => {
    setErrorMessage("");
    setShowFields(!showFields);
  };

  async function handleExport() {
    if (startDate > endDate) {
      setErrorMessage("Choose a start date on or before the end date.");
      return;
    }
    if (endDate > new Date()) {
      setErrorMessage("The end date can't be in the future.");
      return;
    }

    setBusy(true);
    setErrorMessage("");
    const error = await downloadPdf({
      type: "orders",
      start: format(startDate, "yyyy-MM-dd"),
      end: format(endDate, "yyyy-MM-dd"),
    });
    setBusy(false);
    if (error) {
      setErrorMessage(error);
      return;
    }
    toast.success("Orders report downloaded.", toastOptions);
    handleClick();
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={primaryButtonClass}
      >
        Export
      </button>
      {showFields && (
        <AdminModal title="Export orders" onClose={handleClick}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Start date" htmlFor="export-start">
                <DatePicker
                  id="export-start"
                  selected={startDate}
                  onChange={(date: Date | null) => date && setStartDate(date)}
                  className={adminInputClass}
                />
              </AdminField>
              <AdminField label="End date" htmlFor="export-end">
                <DatePicker
                  id="export-end"
                  selected={endDate}
                  onChange={(date: Date | null) => date && setEndDate(date)}
                  className={adminInputClass}
                />
              </AdminField>
            </div>
            {errorMessage ? (
              <p role="alert" className="text-sm text-danger">
                {errorMessage}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClick}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExport}
                disabled={busy}
                className={primaryButtonClass}
              >
                {busy ? "Preparing…" : "Generate PDF"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
