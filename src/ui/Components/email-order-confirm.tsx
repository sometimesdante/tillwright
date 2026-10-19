import { EmailTemplateProps } from "@/utils/types";
import { siteConfig } from "@/utils/siteConfig";

export const OrderConfirmationTemplate = ({
  firstName,
}: Readonly<EmailTemplateProps>) => (
  <div>
    <h3>Hello {firstName}</h3>
    <p>
      Thanks for your order. We've received it and we're getting it ready.
      <br />
      You can expect your order within {siteConfig.policies.deliveryTime}. If
      it hasn&apos;t arrived by then, please contact us at {siteConfig.phone}{" "}
      or {siteConfig.email}.
    </p>
    <p>
      Kind regards,
      <br />
      {siteConfig.emailSignature}
    </p>
  </div>
);
