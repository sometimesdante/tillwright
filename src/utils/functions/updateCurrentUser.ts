import { createClient } from "../supabase/client";
import { User } from "@/utils/types";
import { Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export async function updateCurrentUser(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData: User = {
    email: user?.email,
    name: user?.user_metadata.name,
    phone: user?.user_metadata.phone,
    address: user?.user_metadata.address,
  };

  const { data, error } = await supabase.auth.updateUser({
    email: (formData.get("email") as string) || userData?.email,
    data: {
      name: (formData.get("name") as string) || user?.user_metadata.name,
      phone: (formData.get("phone") as any) || user?.user_metadata.phone,
      address:
        (formData.get("address") as string) || user?.user_metadata.address,
    },
  });

  toast.success("Your details have been updated, please refresh this page", {
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

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
