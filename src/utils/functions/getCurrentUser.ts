import { createClient } from "@/utils/supabase/client";
import { User } from "@/utils/types";

export async function getCurrentUser() {
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

  return userData;
}
