"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createClient } from "@/utils/supabase/client";
import { Order } from "@/utils/types";
import { renderToString } from "react-dom/server";
import { ToWords } from "to-words";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SITE_URL } from "@/utils/siteUrl";
import { PDF_HEAD } from "@/utils/pdfHead";
import { siteConfig } from "@/utils/siteConfig";

interface GenerateBillProps {
  id: string | number;
}

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

const Template = ({ transaction }: { transaction: Order | null }) => {
  const totalPrice =
    transaction?.products.reduce(
      (acc: any, item: any) => acc + item.price * item.count,
      0,
    ) || 0;
  const totalMRP =
    transaction?.products.reduce(
      (acc: any, item: any) => acc + item.mrp * item.count,
      0,
    ) || 0;
  const difference = totalMRP - totalPrice;

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
          <div className="w-1/2">
            <h5>Customer Details:</h5>
            <p className="font-semibold text-lg">{transaction?.name}</p>
            <p className="mt-4">
              <span className="font-semibold">Phone:</span> {transaction?.phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {transaction?.email}
            </p>
            <p>
              <span className="font-semibold">Address:</span>{" "}
              {transaction?.address}
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
              <span className="text-xl font-semibold">
                You saved <span className="font-mono tabular-nums">Rs. {difference}</span>
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
        <div className="flex justify-between">
          <p>
            <span className="font-semibold">Transaction ID</span>
            <br />
            <span className="font-mono tabular-nums">{transaction?.transaction_id}</span>
          </p>
          <p>
            <span className="font-semibold">Date and Time</span>
            <br />
            {format(
              toZonedTime(transaction?.created_at, "Asia/Kolkata"),
              "HH:mm:ss dd/MM/yyyy",
            )}
          </p>
          <p>
            <span className="font-semibold">Mode of Payment</span>
            <br />
            {transaction?.payment_status == "cod"
              ? "Cash on Delivery"
              : "Online"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function GenerateBill({ id }: GenerateBillProps) {
  const supabase = createClient();

  async function fetchTransaction() {
    const numericId = typeof id === "string" ? Number(id) : id;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select()
        .eq("id", numericId)
        .single();

      if (error) {
        console.error("Error fetching transaction:", error);
      } else {
        generatePDF(data);
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
    }
  }

  async function generatePDF(transactionData: Order) {
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
    <button
      type="button"
      onClick={fetchTransaction}
      className="text-sm font-medium text-field px-3 py-1.5 rounded-md border border-field/40 hover:bg-field-soft transition-colors"
    >
      Print
    </button>
  );
}
