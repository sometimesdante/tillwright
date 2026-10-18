"use client";

import useCartStore from "@/store/cartStore";
import { Product } from "@/utils/types";
import Image from "next/image";
import QuantityIcon from "../QuantityIcon";
import { useEffect, useState } from "react";
import { formatINR } from "@/utils/formatINR";

const ProductCard = ({
  image_url,
  name,
  price,
  category,
  description,
  product,
}: Product) => {
  const cart = useCartStore((state: any) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    const cartItem = cart.find(
      (cartProduct: Product) => cartProduct.name === product.name
    );

    if (cartItem) {
      setItem(cartItem);
    } else {
      setItem(null);
    }
  }, [cart, product.name]);

  return (
    <div className="w-full min-w-0 h-full rounded-md border border-line bg-surface-raised overflow-hidden flex flex-col">
      <div className="w-full aspect-square flex-shrink-0 overflow-hidden flex items-center justify-center bg-line rounded-t-md">
        <Image
          loading="eager"
          src={image_url.trimEnd()}
          width={256}
          height={256}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="rounded-b-md bg-surface-raised p-3 flex flex-col flex-1 min-h-[7rem]">
        <p className="text-ink text-base font-medium leading-tight line-clamp-2">
          {name}
        </p>
        {category ? (
          <p className="text-sm text-ink-muted mt-0.5 line-clamp-1">{category}</p>
        ) : null}
        {description ? (
          <p className="text-sm text-ink-muted mt-2 line-clamp-2">
            {description}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 mt-auto pt-2">
          <p className="flex flex-wrap gap-x-1.5 items-baseline">
            <span className="text-ink text-price font-mono tabular-nums">
              {formatINR(price)}
            </span>
            <span className="text-xs text-ink-muted">(Incl. Tax)</span>
          </p>
          {item && item.count ? (
            <span className="w-full h-10 flex items-center justify-between border border-field rounded-full overflow-hidden bg-surface-raised">
              <button
                type="button"
                className="h-full px-3 hover:bg-field-soft transition-colors"
                onClick={() => removeFromCart(product)}
                aria-label="Decrease quantity"
              >
                <QuantityIcon type="remove" size={18} />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-ink">
                {item.count}
              </span>
              <button
                type="button"
                className="h-full px-3 hover:bg-field-soft transition-colors"
                onClick={() => addToCart(product)}
                aria-label="Increase quantity"
              >
                <QuantityIcon type="add" size={18} />
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="w-full h-10 bg-field text-on-field text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
