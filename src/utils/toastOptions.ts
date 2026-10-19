import { Slide, type ToastOptions } from "react-toastify";

// Shared settings for the small notices shown after an action.
export const toastOptions: ToastOptions = {
  position: "bottom-left",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Slide,
};
