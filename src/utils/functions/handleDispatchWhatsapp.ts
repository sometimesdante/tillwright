import axios from "axios";

export async function handleDispatchWhatsapp(
  contact: string,
  name: string,
  order_number: string
) {
  try {
    console.log("triggered message");
    const response = await axios({
      url: `${process.env.WHATSAPP_URL}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        messaging_product: "whatsapp",
        to: `91${contact}`,
        type: "template",
        template: {
          name: "order_dispatched",
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                // { type: "text", text: name },
                { type: "text", text: order_number },
              ],
            },
          ],
        },
      }),
    });
    console.log("Success:", response.data);
  } catch (error: any) {
    console.error(
      "Error sending WhatsApp text:",
      error.response?.data || error
    );
  }
}
