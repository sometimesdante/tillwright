"use client";

import Image from "next/image";
import SearchIcon from "@/../public/icons/search.png";
import ProductCard from "@/ui/ProductCard";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/utils/types";
import { useCallback, useEffect, useRef, useState } from "react";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#334155"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}

export default function Home() {
  const chipsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateChipArrows = useCallback(() => {
    const el = chipsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  const scrollChips = (direction: 1 | -1) => {
    const el = chipsRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const [searchText, setSearchText] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [category, setCategory] = useState("All Categories");
  const [categoryArray, setCategoryArray] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    updateChipArrows();
    window.addEventListener("resize", updateChipArrows);
    return () => window.removeEventListener("resize", updateChipArrows);
  }, [categoryArray, updateChipArrows]);

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const { data, error } =
          searchText.length > 0
            ? category == "All Categories"
              ? await supabase
                  .from("products")
                  .select()
                  .neq("inventory", 0)
                  .ilike("name", `%${searchText}%`)
                  .order("name", { ascending: true })
              : await supabase
                  .from("products")
                  .select()
                  .eq("category", category)
                  .neq("inventory", 0)
                  .ilike("name", `%${searchText}%`)
                  .order("name", { ascending: true })
            : category == "All Categories"
              ? await supabase
                  .from("products")
                  .select()
                  .neq("inventory", 0)
                  .order("name", { ascending: true })
              : await supabase
                  .from("products")
                  .select()
                  .eq("category", category)
                  .neq("inventory", 0)
                  .order("name", { ascending: true });
        if (ignore) return;
        if (error) throw error;
        setLoadError(false);
        setProducts(data || []);
      } catch (err) {
        if (ignore) return;
        console.warn("Could not load products:", err);
        setLoadError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    // Categories only feed the filter chips, so on failure keep the
    // "All Categories" default instead of surfacing an error.
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category")
          .neq("inventory", 0)
          .not("category", "is", null)
          .order("category", { ascending: true });

        if (error) throw error;
        if (ignore) return;

        const uniqueCategories = [
          "All Categories",
          ...new Set((data ?? []).map((item) => item.category)),
        ];

        setCategoryArray(uniqueCategories);
      } catch (err) {
        if (ignore) return;
        console.warn("Could not load categories:", err);
        setCategoryArray(["All Categories"]);
      }
    };

    fetchProducts();
    fetchCategories();

    return () => {
      ignore = true;
    };
  }, [searchText, supabase, category, retryCount]);

  return (
    <div className="relative w-full min-w-0">
      <div className="sticky top-[4.25rem] z-40 w-full bg-surface border-b border-line">
        <div className="default-margin flex flex-col md:flex-row gap-3 md:items-center py-3">
          <label className="w-full md:max-w-xs flex-shrink-0 flex items-center rounded-sm bg-surface-raised border border-line-strong focus-within:border-field h-[34px] px-3">
            <Image
              src={SearchIcon}
              width={16}
              height={16}
              alt=""
              className="flex-shrink-0 opacity-60"
            />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="w-full min-w-0 h-full bg-transparent border-0 pl-2 py-0 text-base sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-0"
            />
          </label>
          <div className="relative flex-1 min-w-0">
            {canScrollLeft && (
              <div className="hidden md:flex absolute left-0 inset-y-0 z-10 items-center pr-8 bg-gradient-to-r from-surface from-60% to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => scrollChips(-1)}
                  aria-label="Scroll categories left"
                  className="pointer-events-auto h-[34px] w-[34px] flex items-center justify-center rounded-full bg-surface-raised border border-line hover:border-field"
                >
                  <ChevronIcon direction="left" />
                </button>
              </div>
            )}
            {canScrollRight && (
              <div className="hidden md:flex absolute right-0 inset-y-0 z-10 items-center pl-8 bg-gradient-to-l from-surface from-60% to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => scrollChips(1)}
                  aria-label="Scroll categories right"
                  className="pointer-events-auto h-[34px] w-[34px] flex items-center justify-center rounded-full bg-surface-raised border border-line hover:border-field"
                >
                  <ChevronIcon direction="right" />
                </button>
              </div>
            )}
            <div
              ref={chipsRef}
              onScroll={updateChipArrows}
              className="flex gap-2 min-w-0 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categoryArray.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`flex-shrink-0 whitespace-nowrap h-[34px] text-sm font-medium px-4 rounded-full border transition-colors ${
                    category === c
                      ? "bg-field border-field text-on-field"
                      : "bg-surface-raised border-line text-ink hover:border-field"
                  }`}
                >
                  {c === "All Categories" ? "All" : c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="default-margin default-height pt-4 min-w-0">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 min-w-0">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full rounded-md bg-surface-raised shadow-float overflow-hidden animate-pulse"
                aria-hidden
              >
                <div className="w-full aspect-square bg-line" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-4 w-3/4 rounded bg-line" />
                  <div className="h-3 w-1/2 rounded bg-line" />
                  <div className="h-8 w-full rounded-md bg-line mt-2" />
                </div>
              </div>
            ))
          ) : loadError && products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-ink-muted">
                Couldn't load products. Please check your connection.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setRetryCount((n) => n + 1);
                }}
                className="bg-field text-on-field text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity"
              >
                Try again
              </button>
            </div>
          ) : products.length > 0 ? (
            products.map((product: any) => (
              <div key={product.id}>
                <ProductCard
                  image_url={product.image_url}
                  name={product.name}
                  price={product.price}
                  mrp={product.mrp}
                  category={product.category}
                  product={product}
                />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-ink-muted py-12">
              No products found
            </p>
          )}
        </div>
        <div className="w-full flex justify-center mt-10 mb-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-surface-raised text-ink px-5 py-2.5 rounded-full shadow-float border-0"
            aria-label="Back to top"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6A6A6A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
}
