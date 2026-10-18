/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { enIN } from "date-fns/locale/en-IN";
import "react-datepicker/dist/react-datepicker.css";
import { createClient } from "@/utils/supabase/client";
import { endOfDay } from "date-fns";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { renderToString } from "react-dom/server";
import { Order } from "@/utils/types";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SITE_URL } from "@/utils/siteUrl";
import { PDF_HEAD } from "@/utils/pdfHead";
import { siteConfig } from "@/utils/siteConfig";
import {
  AdminField,
  AdminModal,
  adminInputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../AdminForm";
import { formatAmount } from "@/utils/formatINR";
import { formatInvoiceNo } from "@/utils/formatInvoiceNo";

const Template = ({
  ordersList,
  start,
  end,
}: {
  ordersList: Order[];
  start: string;
  end: string;
}) => {
  let totalAmount = 0;
  let totalTax = 0;

  for (const order of ordersList) {
    totalAmount += order.amount;
    totalTax += Array.isArray(order.products)
      ? order.products.reduce(
          (sum: number, item: any) =>
            sum + (Number(item.price) - Number(item.pretax)) * item.count,
          0
        )
      : 0;
  }

  return (
    <div className="h-full px-6">
      <div className="flex justify-between items-center mb-4">
        <span className="flex gap-4 items-center">
          <img
            src={`${siteConfig.websiteUrl}${siteConfig.logoPath}`}
            className="w-12 h-12"
            alt={`${siteConfig.name} logo`}
          />
          <h4 className="font-semibold">
            Sales report, {start.slice(3)} to {end.slice(3)}
          </h4>
        </span>
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 -mb-1">
          <p className="w-36 px-2 font-semibold">Invoice</p>
          <p className="w-44 px-1 font-semibold">Order date</p>
          <p className="w-60 px-1 font-semibold">Customer</p>
          <p className="w-32 px-1 font-semibold">Phone</p>
          <p className="w-24 px-1 font-semibold">Tax</p>
          <p className="w-40 px-1 font-semibold">Amount (Rs.)</p>
        </span>
      </div>
      <div>
        {ordersList && ordersList.length > 0 ? (
          ordersList.map((order: any) => {
            return (
              <span
                key={order.id}
                className="flex items-start border-2 bg-white py-1 -mb-1"
              >
                <p className="w-36 px-2 font-mono tabular-nums">
                  {formatInvoiceNo(order.invoice_id, order.created_at)}
                </p>
                <p className="w-44 px-1">
                  {format(
                    toZonedTime(order.created_at, "Asia/Kolkata"),
                    "dd-MM-yyyy"
                  )}
                </p>
                <p className="w-60 px-1">{order.name}</p>
                <p className="w-32 px-1">{order.phone}</p>
                <p className="w-24 px-1 font-mono tabular-nums">
                  {formatAmount(
                    order.products.reduce(
                      (sum: number, item: any) =>
                        sum +
                        (Number(item.price) - Number(item.pretax)) * item.count,
                      0
                    ),
                  )}
                </p>
                <p className="w-40 px-1 font-mono tabular-nums">{formatAmount(order.amount)}</p>
              </span>
            );
          })
        ) : (
          <span className="flex items-start border-2 bg-white py-1 -mb-1">
            <p>No orders available</p>
          </span>
        )}
      </div>
      <div>
        <span className="flex items-start border-2 bg-white py-1 mt-4">
          <p className="w-36 px-2 font-semibold">Total</p>
          <p className="w-44 px-1"></p>
          <p className="w-60 px-1"></p>
          <p className="w-32 px-1"></p>
          <p className="w-24 px-1 font-mono tabular-nums">{formatAmount(totalTax)}</p>
          <p className="w-40 px-1 font-mono tabular-nums">{formatAmount(totalAmount)}</p>
        </span>
      </div>
    </div>
  );
};

export default function ExportOrders() {
  const [showFields, setShowFields] = useState(false);
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [errorMessage, setErrorMessage] = useState("");

  registerLocale("en-IN", enIN);
  setDefaultLocale("en-IN");

  const handleClick = () => {
    setErrorMessage("");
    setShowFields(!showFields);
  };

  async function generatePDF(data: any, start: string, end: string) {
    if (!Array.isArray(data)) {
      console.error("The given data is not an array", data);
      return;
    }

    const response = await fetch(`${SITE_URL}/api/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        htmlContent: `
          <html>
            <head>
              ${PDF_HEAD}
              <style>
                @media print {
                  @page {
                  size: A4;
                  margin: 8mm 0 4mm 0;
                  }
                }
              </style>
            </head>
            <body>
              ${renderToString(
                <Template ordersList={data} start={start} end={end} />
              )}
            </body>
          </html>
        `,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `OrdersList.pdf`;
      link.click();
    } else {
      console.error("Failed to generate PDF");
    }
  }

  async function handleExport() {
    const supabase = await createClient();

    try {
      if (startDate > endDate) {
        setErrorMessage("Error: Start date cannot be greater than end date");
        return;
      }
      if (endDate > currentDate) {
        setErrorMessage("Error: End date cannot be greater than today");
        return;
      }

      const startUTC = startDate.toISOString();
      const endUTC = endOfDay(endDate).toISOString();

      const { data: orders, error } = await supabase
        .from("transactions")
        .select()
        .order("created_at", { ascending: true })
        .gte("created_at", startUTC)
        .lt("created_at", endUTC)
        .neq("razorpay_id", "NULL");

      if (error) {
        throw error;
      }

      if (orders.length > 0) {
        setErrorMessage("");
        generatePDF(orders, startDate.toDateString(), endDate.toDateString());
        toast.success(
          "Preparing the orders report. The download starts in a few seconds.",
          {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          }
        );
        handleClick();
      } else {
        setErrorMessage(
          "There are no orders within the date range that you selected"
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred."
      );
    }
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
                  onChange={(date: any) => setStartDate(date)}
                  className={adminInputClass}
                />
              </AdminField>
              <AdminField label="End date" htmlFor="export-end">
                <DatePicker
                  id="export-end"
                  selected={endDate}
                  onChange={(date: any) => setEndDate(date)}
                  className={adminInputClass}
                />
              </AdminField>
            </div>
            {errorMessage ? (
              <p className="text-sm text-danger">{errorMessage}</p>
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
                className={primaryButtonClass}
              >
                Generate PDF
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
