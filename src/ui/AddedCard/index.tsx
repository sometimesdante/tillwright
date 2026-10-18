"use client";

import useCartStore from "@/store/cartStore";
import QuantityIcon from "../QuantityIcon";
import { Product } from "@/utils/types";

const AddedCard = ({ name, count, product }: Product) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="w-full flex gap-2 justify-between items-center rounded-md border border-line bg-surface p-3 min-w-0">
      <p className="text-sm font-medium text-ink truncate min-w-0 flex-1">
        {name}
      </p>
      <div className="flex items-center gap-1 flex-shrink-0 border border-field rounded-full overflow-hidden bg-surface-raised">
        <button
          type="button"
          className="p-1.5 hover:bg-field-soft transition-colors"
          onClick={() => removeFromCart(product)}
          aria-label="Decrease quantity"
        >
          <QuantityIcon type="remove" size={20} />
        </button>
        <span className="min-w-[1.5rem] font-semibold text-sm text-ink text-center">
          {count}
        </span>
        <button
          type="button"
          className="p-1.5 hover:bg-field-soft transition-colors"
          onClick={() => addToCart(product)}
          aria-label="Increase quantity"
        >
          <QuantityIcon type="add" size={20} />
        </button>
      </div>
    </div>
  );
};

export default AddedCard;
