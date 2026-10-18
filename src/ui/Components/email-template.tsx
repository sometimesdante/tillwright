import { EmailTemplateProps } from "@/utils/types";

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome {firstName}</h1>
  </div>
);
