/* eslint-disable @next/next/no-img-element */
"use client";

import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { renderToString } from "react-dom/server";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SITE_URL } from "@/utils/siteUrl";
import { PDF_HEAD } from "@/utils/pdfHead";
import { siteConfig } from "@/utils/siteConfig";
import { secondaryButtonClass } from "../AdminForm";
import { formatAmount } from "@/utils/formatINR";
import { Download } from "lucide-react";
import Icon from "@/ui/Icon";

const Template = ({ products }: { products: Product[] }) => {
  return (
    <div className="h-full px-6">
      <div className="flex justify-between items-center mb-4">
        <span className="flex gap-4 items-center">
          <img
            src={`${siteConfig.websiteUrl}${siteConfig.logoPath}`}
            className="w-12 h-12"
            alt={`${siteConfig.name} logo`}
          />
          <p className="font-semibold">{siteConfig.name}</p>
        </span>
        <p>Mob: {siteConfig.phone}</p>
      </div>
      <div>
        <div className="flex">
          <span className="w-12 border-2 px-1 font-semibold">ID</span>
          <span className="w-72 border-2 px-1 font-semibold">Name</span>
          <span className="w-40 border-2 px-1 font-semibold">Category</span>
          <span className="w-40 border-2 px-1 font-semibold">Price</span>
        </div>
        {products &&
          products.map((product: Product) => (
            <div key={product?.id} className="flex">
              <span className="w-12 border-2 px-1">{product.id}</span>
              <span className="w-72 border-2 px-1">{product.name}</span>
              <span className="w-40 border-2 px-1">{product.category}</span>
              <span className="w-40 border-2 px-1 font-mono tabular-nums">Rs. {formatAmount(product.price)}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default function ExportProducts() {
  const supabase = createClient();

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select()
      .neq("inventory", 0)
      .order("category", { ascending: true });
    generatePDF(data || []);
    toast.success(
      "Preparing the products list. The download starts in a few seconds.",
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

  async function generatePDF(data: any) {
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
              ${renderToString(<Template products={data} />)}
            </body>
          </html>
        `,
      }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `ProductsList.pdf`;
      link.click();
    } else {
      console.error("Failed to generate PDF");
    }
  }

  return (
    <button
      type="button"
      onClick={fetchProducts}
      className={secondaryButtonClass}
    >
      <Icon icon={Download} />
      Export PDF
    </button>
  );
}
