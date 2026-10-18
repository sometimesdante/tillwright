import { SITE_URL } from "@/utils/siteUrl";

export async function handleConfirmEmail(transaction_id: string) {
  console.log("handleConfirmEmail has been triggered", transaction_id);
  try {
    const response = await fetch(`${SITE_URL}/api/confirm-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id }),
    });

    if (response.ok) {
      console.log("Success, email has been sent!");
    } else {
      console.error("Failed, email was not sent!");
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
