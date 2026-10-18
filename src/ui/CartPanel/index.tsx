"use client";

import useCartStore from "@/store/cartStore";
import { Product } from "@/utils/types";
import AddedCard from "../AddedCard";
import Link from "next/link";
import { siteConfig } from "@/utils/siteConfig";
import { useEffect, useRef } from "react";
import { formatINR } from "@/utils/formatINR";

export default function CartPanel() {
  const cartOpen = useCartStore((state) => state.cartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      // The toggle button handles its own open/close.
      if (target.closest?.("[data-cart-toggle]")) return;
      if (panelRef.current && !panelRef.current.contains(target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed top-[5.5rem] left-4 right-4 sm:left-auto sm:w-full sm:max-w-sm z-50 bg-surface-raised flex flex-col justify-between gap-4 p-4 rounded-lg shadow-float border border-gray-200 max-h-[calc(100dvh-5.5rem)] md:max-h-[calc(100dvh-7rem)] overflow-hidden"
    >
      <div className="flex flex-col gap-2 flex-1 min-h-0 max-h-64 md:max-h-80 overflow-y-auto">
        {cart && cart.length > 0 ? (
          cart.map((product: Product) => (
            <div key={product?.id}>
              <AddedCard
                name={product.name}
                count={product.count}
                price={product.price}
                product={product}
              />
            </div>
          ))
        ) : (
          <p className="text-ink-muted">No products in cart</p>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t pt-2 flex-shrink-0">
        <Link
          href={siteConfig.requestProductFormUrl}
          className="text-field font-semibold text-sm"
          target="_blank"
        >
          Request new item
        </Link>
        <p className="text-sm font-medium">Total: <span className="font-mono tabular-nums">{formatINR(totalPrice)}</span></p>
        {totalItems > 0 && (
          <span className="flex justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                clearCart();
                setCartOpen(false);
              }}
              className="flex-1 flex justify-center items-center bg-surface-raised border border-line-strong text-ink font-semibold px-4 py-2 rounded-md text-sm"
            >
              Clear
            </button>
            <Link
              href="/account/checkout"
              onClick={() => setCartOpen(false)}
              className="flex-1 text-center text-on-field bg-field py-2 px-4 font-semibold rounded-md no-underline text-sm"
            >
              Checkout
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
