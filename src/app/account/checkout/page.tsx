"use client";

import useCartStore from "@/store/cartStore";
import AddedCard from "@/ui/AddedCard";
import { Product, User } from "@/utils/types";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/functions/getCurrentUser";
import { handleCheckout } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { sendGAEvent } from "@next/third-parties/google";
import { formatINR } from "@/utils/formatINR";

export default function Checkout() {
  const supabase = createClient();
  const totalItems = useCartStore((state: any) => state.totalItems);
  const totalPrice = useCartStore((state: any) => state.totalPrice);
  const cart = useCartStore((state: any) => state.cart);

  const [userData, setUserData] = useState<User | null>(null);
  const [paymentMode, setPaymentMode] = useState("online");
  const [clickStatus, setClickStatus] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser(); // Call the getCurrentUser function
        setUserData(user); // Store all user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null); // Handle error by setting state to null or a fallback value
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const { error } = await supabase.from("guest_profiles").insert({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as any,
        role: "guest",
        address: formData.get("address") as string,
      });
      if (error) {
        console.log("Error creating user", error);
      }

      handleCheckout(
        formData.get("name") as string,
        formData.get("email") as string,
        formData.get("address") as string,
        formData.get("phone") as any,
        paymentMode,
        cart,
        totalPrice
      );
      sendGAEvent("event", "buttonClicked", { value: "Order placed" });
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  const inputClass =
    "w-full bg-surface-raised border border-line-strong rounded-sm px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-field/30 focus:border-field";
  const dropdownButtonClass =
    "w-full bg-surface-raised border border-line-strong hover:border-ink px-4 py-2.5 rounded-sm text-left text-ink";
  const dropdownPanelClass =
    "w-full min-w-0 absolute left-0 top-full mt-2 p-2 flex flex-col gap-1 bg-surface-raised rounded-md border border-line shadow-float z-50";

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 md:pt-8 pb-8 min-w-0">
      <div className="w-full md:w-1/2 flex flex-col gap-4 min-w-0">
        <h1 className="text-display text-ink">Your cart</h1>
        <div className="flex flex-col gap-3 md:mb-4">
          {cart!.length > 0 ? (
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
            <p>No products available</p>
          )}
        </div>

        <div className="bg-surface-raised rounded-md border border-line p-4">
          <p className="text-sm text-ink-muted">Total items</p>
          <p className="text-lg font-semibold text-ink">{totalItems}</p>
          <p className="text-sm text-ink-muted mt-2">Total price</p>
          <p className="text-lg font-semibold text-ink font-mono tabular-nums">{formatINR(totalPrice)}*</p>
        </div>
      </div>
      <div className="w-full md:max-w-md min-w-0">
        {totalPrice > 0 ? (
          userData?.name ? (
            <div className="bg-surface-raised rounded-md border border-line p-6">
              <h2 className="text-heading text-ink mb-6">Confirm your details</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-ink-muted">Name</p>
                  <p className="font-medium text-ink">{userData?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Phone number</p>
                  <p className="font-medium text-ink">{userData?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Email</p>
                  <p className="font-medium text-ink">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Address</p>
                  <p className="font-medium text-ink">{userData?.address}</p>
                </div>
                <div className="relative">
                  <p className="text-sm font-medium text-ink mb-2">Payment mode</p>
                  <span className="w-full flex flex-col items-stretch relative">
                    <button
                      type="button"
                      onClick={() => setClickStatus(!clickStatus)}
                      className={dropdownButtonClass}
                    >
                      {paymentMode == "online"
                        ? "GPay/Credit/Debit Card"
                        : "Cash on Delivery"}
                    </button>
                    {clickStatus && (
                      <span className={dropdownPanelClass}>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode("online");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2 px-2 text-left text-sm text-ink hover:bg-surface rounded-sm"
                        >
                          GPay/Credit/Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode("cod");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2 px-2 text-left text-sm text-ink hover:bg-surface rounded-sm"
                        >
                          Cash on Delivery
                        </button>
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (
                    userData?.name &&
                    userData?.email &&
                    userData?.address &&
                    userData?.phone &&
                    cart &&
                    totalPrice
                  ) {
                    handleCheckout(
                      userData.name,
                      userData.email,
                      userData.address,
                      userData.phone,
                      paymentMode,
                      cart,
                      totalPrice
                    );
                    sendGAEvent("event", "buttonClicked", {
                      value: "Order placed",
                    });
                  } else {
                    console.error("Some details are missing");
                  }
                }}
                className="w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity mt-6"
              >
                Place your order
              </button>
            </div>
          ) : (
            <div className="bg-surface-raised rounded-md border border-line p-6">
              <h2 className="text-heading text-ink mb-6">Confirm your details</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <span className="flex flex-col gap-2">
                  <label htmlFor="checkout-email" className="text-sm font-medium text-ink">Email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    id="checkout-email"
                    placeholder="customer@mail.com"
                    required
                    className={inputClass}
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label htmlFor="checkout-name" className="text-sm font-medium text-ink">Name</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    id="checkout-name"
                    placeholder="Priya Raman"
                    required
                    className={inputClass}
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label htmlFor="checkout-phone" className="text-sm font-medium text-ink">Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    id="checkout-phone"
                    placeholder="9176111222"
                    required
                    className={inputClass}
                  />
                </span>
                <span className="flex flex-col gap-2">
                  <label htmlFor="checkout-address" className="text-sm font-medium text-ink">Address</label>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    id="checkout-address"
                    placeholder="42 Wallaby Way, Sydney"
                    required
                    className={inputClass}
                  />
                </span>
                <div className="relative">
                  <label className="text-sm font-medium text-ink mb-2 block">Payment mode</label>
                  <span className="w-full flex flex-col items-stretch relative">
                    <button
                      onClick={() => setClickStatus(!clickStatus)}
                      type="button"
                      className={dropdownButtonClass}
                    >
                      {paymentMode == "online"
                        ? "GPay/Credit/Debit Card"
                        : "Cash on Delivery"}
                    </button>
                    {clickStatus && (
                      <span className={dropdownPanelClass}>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode("online");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2 px-2 text-left text-sm text-ink hover:bg-surface rounded-sm"
                        >
                          GPay/Credit/Debit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentMode("cod");
                            setClickStatus(false);
                          }}
                          className="cursor-pointer py-2 px-2 text-left text-sm text-ink hover:bg-surface rounded-sm"
                        >
                          Cash on Delivery
                        </button>
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity mt-4"
                >
                  Place your order
                </button>
              </form>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
