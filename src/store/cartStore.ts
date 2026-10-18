import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/utils/types";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CartState {
  cart: Product[];
  totalItems: number;
  totalPrice: number;
  cartOpen: boolean;
}

interface CartActions {
  addToCart: (Item: Product) => void;
  removeFromCart: (Item: Product) => void;
  removeItemFromCart: (Item: Product) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleCartOpen: () => void;
}

const InitialState: CartState = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  cartOpen: false,
};

const useCartStore = create(
  persist<
    CartState & CartActions,
    [],
    [],
    Pick<CartState, "cart" | "totalItems" | "totalPrice">
  >(
    (set, get) => ({
      cart: InitialState.cart,
      totalItems: InitialState.totalItems,
      totalPrice: InitialState.totalPrice,
      cartOpen: InitialState.cartOpen,

      setCartOpen: (open: boolean) => set({ cartOpen: open }),
      toggleCartOpen: () => set((state) => ({ cartOpen: !state.cartOpen })),

      addToCart: (product: Product) => {
        const cart = get().cart;
        const cartItem = cart.find((item) => item.id === product.id);

        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, count: (item.count as number) + 1 }
              : item
          );
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: product.price
              ? state.totalPrice + product.price
              : state.totalPrice,
          }));
        } else {
          const updatedCart = [...cart, { ...product, count: 1 }];

          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: product.price
              ? state.totalPrice + product.price
              : state.totalPrice,
          }));
        }
        toast.success("Product added to cart", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      },

      removeItemFromCart: (product: Product) => {
        set((state) => ({
          cart: state.cart.filter((item: any) => item.id !== product.id),
          totalItems: product.count && state.totalItems - product.count,
          totalPrice: product.price
            ? product.count && state.totalPrice - product.price * product.count
            : state.totalPrice,
        }));

        toast.success("Product removed from cart", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      },

      removeFromCart: (product: Product) => {
        const cart = get().cart;
        const cartItem = cart.find((item) => item.id === product.id);

        if (cartItem?.count && cartItem.count > 1) {
          // Decrease the count by 1
          const updatedCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, count: (item.count || 1) - 1 }
              : item
          );
          set((state) => ({
            cart: updatedCart,
            totalItems: state.totalItems - 1,
            totalPrice: product.price
              ? state.totalPrice - product.price
              : state.totalPrice,
          }));
        } else {
          // Remove the item if count is 1 or less
          set((state) => ({
            cart: state.cart.filter((item) => item.id !== product.id),
            totalItems: state.totalItems - 1,
            totalPrice: product.price
              ? state.totalPrice - product.price
              : state.totalPrice,
          }));
        }

        toast.success("Product removed from cart", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      },

      clearCart: () => {
        set(() => ({
          cart: InitialState.cart,
          totalItems: InitialState.totalItems,
          totalPrice: InitialState.totalPrice,
        }));

        toast.success("Your cart is empty.", {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        cart: state.cart,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    }
  )
);

export default useCartStore;
