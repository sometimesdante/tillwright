"use client";

import useCartStore from "@/store/cartStore";
import Image from "next/image";
import CartIcon from "@/../public/icons/cart.png";

const Cart = () => {
  const totalItems = useCartStore((state) => state.totalItems);
  const cartOpen = useCartStore((state) => state.cartOpen);
  const toggleCartOpen = useCartStore((state) => state.toggleCartOpen);

  return (
    <div className="w-full md:w-1/3 flex flex-col items-end">
      <button
        type="button"
        onClick={toggleCartOpen}
        data-cart-toggle
        className="flex gap-2 items-center text-slate-200 bg-slate-600 rounded-md px-4 font-semibold py-2"
      >
        {cartOpen ? "Hide Cart" : "View Cart"}{" "}
        {totalItems > 0 ? `(${totalItems})` : null}
        <Image src={CartIcon} width={18} height={18} alt="" />
      </button>
    </div>
  );
};

export default Cart;
