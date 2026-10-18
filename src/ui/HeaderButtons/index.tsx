"use client";

import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/../public/icons/cart.png";
import useCartStore from "@/store/cartStore";

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function HeaderButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  const toggleCartOpen = useCartStore((state) => state.toggleCartOpen);
  const cartOpen = useCartStore((state) => state.cartOpen);
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href={isLoggedIn ? "/account/profile" : "/auth/login"}
        aria-label="Account"
        className="inline-flex items-center justify-center gap-2 h-9 w-9 sm:w-auto sm:h-auto bg-surface-raised border border-line text-ink text-sm font-medium sm:px-4 sm:py-2 rounded-md no-underline hover:bg-gray-50 transition-colors flex-shrink-0"
      >
        <PersonIcon className="text-ink-muted w-[18px] h-[18px] flex-shrink-0" />
        <span className="hidden sm:inline">Account</span>
      </Link>
      <button
        type="button"
        onClick={toggleCartOpen}
        data-cart-toggle
        aria-label={`${cartOpen ? "Hide" : "View"} cart${
          totalItems > 0 ? `, ${totalItems} items` : ""
        }`}
        className="inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 min-w-9 px-3 sm:h-auto sm:px-4 sm:py-2 bg-field text-on-field text-sm font-medium rounded-md hover:opacity-90 transition-opacity flex-shrink-0"
      >
        <Image src={CartIcon} width={18} height={18} alt="" className="w-[18px] h-[18px] flex-shrink-0" aria-hidden />
        <span className="hidden sm:inline whitespace-nowrap">{cartOpen ? "Hide Cart" : "View Cart"}</span>
        {totalItems > 0 ? (
          <span className="flex-shrink-0">
            <span className="sm:hidden">{totalItems}</span>
            <span className="hidden sm:inline">({totalItems})</span>
          </span>
        ) : null}
      </button>
    </div>
  );
}
