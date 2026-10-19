"use client";

import AddProduct from "@/ui/AddProduct";
import EditProduct from "@/ui/EditProduct";
import ExportProducts from "@/ui/ExportProducts";
import { adminInputClass } from "@/ui/AdminForm";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatINR } from "@/utils/formatINR";

type StockFilter = "all" | "in" | "out";

const stockFilters: { value: StockFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in", label: "In stock" },
  { value: "out", label: "Out of stock" },
];

const money = (value?: number | string) =>
  value === undefined || value === null || value === "" ? "—" : formatINR(value);

export default function ProductsDashboard() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState<StockFilter>("all");

  // Bumped after an add or edit to load the list again.
  const [version, setVersion] = useState(0);
  const fetchProducts = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data } = await supabase
        .from("products")
        .select()
        .order("id", { ascending: true });
      if (ignore) return;
      setProducts(data || []);
      setLoading(false);
    })();
    return () => {
      ignore = true;
    };
  }, [supabase, version]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort() as string[],
    [products],
  );

  const outOfStockCount = products.filter((p) => p.inventory === 0).length;

  const visible = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (category !== "all" && p.category !== category) return false;
    if (stock === "in" && p.inventory === 0) return false;
    if (stock === "out" && p.inventory !== 0) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-display text-ink">
            Products
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            {loading
              ? "Loading…"
              : `${products.length} products · ${outOfStockCount} out of stock`}
          </p>
        </div>
        <div className="flex gap-2">
          <ExportProducts />
          <AddProduct onProductAdd={fetchProducts} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name"
          aria-label="Search products"
          className={`${adminInputClass} md:max-w-xs`}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className={`${adminInputClass} md:max-w-[14rem]`}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="inline-flex p-1 bg-surface-raised border border-line-strong rounded-full w-fit">
          {stockFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStock(f.value)}
              aria-pressed={stock === f.value}
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                stock === f.value
                  ? "bg-field text-on-field"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-raised rounded-md border border-line overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-muted border-b border-line bg-surface">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Purchase</th>
              <th className="px-4 py-3 font-medium text-right">MRP</th>
              <th className="px-4 py-3 font-medium text-right">Special</th>
              <th className="px-4 py-3 font-medium text-right">Tax</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} aria-hidden>
                  <td colSpan={9} className="px-4 py-3">
                    <div className="h-8 rounded bg-surface animate-pulse" />
                  </td>
                </tr>
              ))
            ) : visible.length > 0 ? (
              visible.map((product) => (
                <tr key={product.id} className="hover:bg-surface">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3 min-w-[14rem]">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={String(product.image_url).trimEnd()}
                          alt=""
                          loading="eager"
                          className="w-10 h-10 rounded-md object-cover bg-surface flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-surface flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink leading-tight">
                          {product.name}
                        </p>
                        <p className="text-xs text-ink-muted">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-ink-muted whitespace-nowrap">
                    {product.category || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-muted font-mono tabular-nums whitespace-nowrap">
                    {money(product.purchase)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-muted font-mono tabular-nums whitespace-nowrap">
                    {money(product.mrp)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-muted font-mono tabular-nums whitespace-nowrap">
                    {money(product.pretax)}
                  </td>
                  <td className="px-4 py-2.5 text-right text-ink-muted font-mono tabular-nums whitespace-nowrap">
                    {product.tax ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-ink font-mono tabular-nums whitespace-nowrap">
                    {money(product.price)}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {product.inventory === 0 ? (
                      <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-sm border bg-danger/10 text-danger border-danger/30">
                        Out of stock
                      </span>
                    ) : (
                      <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-sm border bg-field-soft text-field border-field/30">
                        In stock · {product.inventory}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <EditProduct
                      id={product.id}
                      onProductUpdate={fetchProducts}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-12 text-center text-sm text-ink-muted"
                >
                  {products.length === 0
                    ? "No products yet"
                    : "No products match these filters"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
