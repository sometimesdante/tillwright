import { createClient } from "@/utils/supabase/server";

export async function fetchUserDetails(email: string) {
  console.log(email);
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("email", email);

    if (error) {
      console.error(error);
    } else {
      return data[0];
    }
  } catch (error) {
    console.error(error);
  }
}
