"use client";

import Link from "next/link";
import useCartStore from "@/store/cartStore";
import { useEffect } from "react";
import { Check } from "lucide-react";
import Icon from "@/ui/Icon";

export default function Success() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="w-full max-w-md mx-auto min-w-0 flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-field-soft flex items-center justify-center mx-auto mb-4">
          <Icon icon={Check} className="text-field" />
        </div>
        <h2 className="text-heading text-ink mb-2">
          Payment successful
        </h2>
        <p className="text-ink-muted text-sm mb-6">
          Your order has been placed. Thank you for your purchase.
        </p>
        <Link
          href="/account/orders"
          className="inline-block w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity text-center no-underline"
        >
          View your orders
        </Link>
      </div>
    </div>
  );
}
