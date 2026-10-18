"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CustomOrder } from "@/utils/types";
import { renderToString } from "react-dom/server";
import { ToWords } from "to-words";
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

const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: "",
      },
    },
  },
});

function OrderItems({ products }: { products: any[] }) {
  if (!Array.isArray(products)) {
    return <span>No items</span>;
  }

  return (
    <span>
      {products.map((item: any) => (
        <span key={item.id} className="w-full flex justify-between font-mono tabular-nums">
          <p className="w-64">{item.name}</p>
          <p className="w-24 px-1">{item.count}</p>
          <p className="w-32 px-1">{item.mrp}</p>
          <p className="w-32 px-1">{item.pretax}</p>
          <p className="w-32 px-1">{item.tax}</p>
          <p className="w-32 px-1">
            {((Number(item.price) - Number(item.pretax)) * item.count).toFixed(
              2,
            )}
          </p>
          <p className="w-32 px-1">{item.price * item.count}</p>
        </span>
      ))}
    </span>
  );
}

const Template = ({ transaction }: { transaction: CustomOrder | null }) => {
  return (
    <div className="h-full flex flex-col justify-between px-6 pt-12 pb-6">
      <div className="">
        <h3 className="font-semibold text-xl">
          Invoice Bill No.{" "}
          <span className="font-mono tabular-nums">{transaction?.invoice_id}</span>
        </h3>
        <div className="flex flex-row">
          <div className="w-1/2">
            <h5>Sold by:</h5>
            <p className="font-semibold text-lg">{siteConfig.legalName}</p>
            <div className="mt-4">
              {siteConfig.registrations.map((registration) => (
                <p key={registration.label}>
                  <span className="font-semibold">{registration.label}:</span>{" "}
                  {registration.value}
                </p>
              ))}
              <p>
                <span className="font-semibold">Phone:</span> {siteConfig.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {siteConfig.email}
              </p>
            </div>
            <p>
              <span className="font-semibold">Address:</span>
              {siteConfig.addressLines.map((line) => (
                <span key={line}>
                  <br />
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="my-6">
          <span className="w-full flex justify-between mb-2">
            <p className="w-64 font-semibold">Name</p>
            <p className="w-24 px-1 font-semibold">Qty</p>
            <p className="w-32 px-1 font-semibold">MRP</p>
            <p className="w-32 px-1 font-semibold">Unit Price</p>
            <p className="w-32 px-1 font-semibold">Tax Rate</p>
            <p className="w-32 px-1 font-semibold">Tax Amt</p>
            <p className="w-32 px-1 font-semibold">Total Amt</p>
          </span>
          <span className="my-4">
            <OrderItems products={transaction?.products} />
          </span>
          <span className="my-4">
            <p className="mt-4">
              <span className="font-semibold">Item Quantity</span>{" "}
              {transaction?.products.reduce(
                (sum: number, num: any) => sum + num.count,
                0,
              )}
            </p>
            <p className="flex justify-between">
              <span>
                <span className="font-semibold">Sum Total: </span>
                <span className="font-mono tabular-nums">Rs. {transaction?.amount}</span>*{" "}
              </span>
            </p>
            <p className="mt-4">
              <span className="font-semibold">Amount in words</span>{" "}
              {transaction?.amount && toWords.convert(transaction?.amount)}
            </p>
          </span>
        </div>
      </div>
      <div>
        <h4 className="w-full text-center">
          Thank you for your order, please visit again!
        </h4>
      </div>
    </div>
  );
};

export default function CustomInvoice() {
  const [showFields, setShowFields] = useState(false);

  const supabase = createClient();
  const handleClick = () => {
    setShowFields(!showFields);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    let nextManualId = "MANUAL001";

    const { data: manualTransactions } = await supabase
      .from("transactions")
      .select("transaction_id")
      .like("transaction_id", "MANUAL%")
      .order("invoice_id", { ascending: false })
      .limit(1);

    if (manualTransactions && manualTransactions.length > 0) {
      const lastId = manualTransactions[0].transaction_id;
      const numericPart = parseInt(lastId.replace("MANUAL", ""));
      const nextNumber = numericPart + 1;
      nextManualId = `MANUAL${nextNumber.toString().padStart(3, "0")}`;
    }

    const data = {
      invoiceNumber: formData.get("invoice") as string,
      amount: formData.get("amount") as string,
    };

    const transaction = {
      created_at: "",
      invoice_id: Number(data.invoiceNumber),
      transaction_id: nextManualId,
      payment_status: "cod",
      razorpay_id: "Not Applicable",
      delivery_status: "pending",
      address: siteConfig.city,
      amount: Number(data.amount),
      products: [
        {
          id: 999,
          created_at: "2024-12-02T17:51:29.037654+00:00",
          name: "Miscellaneous",
          category: "Others",
          image_url: "",
          mrp: 0,
          pretax: 0,
          tax: 0,
          price: 0,
          inventory: 0,
          purchase: 0,
          count: 1,
        },
      ],
    };

    try {
      const { error } = await supabase.from("transactions").insert([
        {
          invoice_id: transaction.invoice_id,
          transaction_id: transaction.transaction_id,
          payment_status: transaction.payment_status,
          razorpay_id: transaction.razorpay_id,
          delivery_status: transaction.delivery_status,
          amount: transaction.amount,
          address: transaction.address,
          products: transaction.products,
        },
      ]);
      if (error) {
        console.error("Error creating transaction:", error);
      } else {
        await generatePDF(transaction);
        toast.success(
          "Please wait, your Invoice is getting ready for download!",
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
          },
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      handleClick();
    }
  }

  async function generatePDF(transactionData: CustomOrder) {
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
            </head>
            <body>
              ${renderToString(<Template transaction={transactionData} />)}
            </body>
          </html>
        `,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Invoice No.${transactionData.invoice_id}.pdf`;
      link.click();
    } else {
      console.error("Failed to generate PDF");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={secondaryButtonClass}
      >
        Custom invoice
      </button>
      {showFields && (
        <AdminModal title="Create custom invoice" onClose={handleClick}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AdminField label="Invoice no." htmlFor="invoice">
              <input
                type="text"
                name="invoice"
                id="invoice"
                placeholder="Enter invoice number"
                className={adminInputClass}
                required
              />
            </AdminField>
            <AdminField label="Amount" htmlFor="amount">
              <input
                type="text"
                name="amount"
                id="amount"
                placeholder="Enter invoice amount"
                className={adminInputClass}
                required
              />
            </AdminField>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClick}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button type="submit" className={primaryButtonClass}>
                Generate PDF
              </button>
            </div>
          </form>
        </AdminModal>
      )}
    </>
  );
}
