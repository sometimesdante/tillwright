import { siteConfig } from "@/utils/siteConfig";

export default function Contact() {
  const { grievanceOfficer } = siteConfig;

  return (
    <div className="w-full max-w-2xl mx-auto min-w-0">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8">
        <h1 className="text-display text-ink mb-6">
          Contact us
        </h1>
        <p className="text-ink leading-relaxed mb-6">
          Have a question about a product, an order or a delivery? We&apos;re
          happy to help. Include your order number if your question is about an
          existing order, and we&apos;ll get back to you within one business day.
        </p>
        <div className="flex flex-col gap-4">
          <p className="text-lg font-semibold text-field">
            {siteConfig.legalName}
          </p>
          <p className="text-ink">
            <span className="text-sm text-ink-muted">Mobile:</span>{" "}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="text-field no-underline hover:underline"
            >
              {siteConfig.phone}
            </a>
          </p>
          <p className="text-ink">
            <span className="text-sm text-ink-muted">Email:</span>{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-field no-underline hover:underline"
            >
              {siteConfig.email}
            </a>
          </p>
          <p className="text-ink">
            <span className="text-sm text-ink-muted">Support hours:</span>{" "}
            {siteConfig.supportHours}
          </p>
          <p className="text-ink">
            <span className="text-sm text-ink-muted">Address:</span>
            {siteConfig.addressLines.map((line) => (
              <span key={line}>
                <br />
                {line}
              </span>
            ))}
          </p>
        </div>

        <section className="mt-8 pt-6 border-t border-line">
          <h2 className="text-heading text-ink mb-3">
            Grievance officer
          </h2>
          <p className="text-ink leading-relaxed mb-4">
            If you are not satisfied with how your query or complaint has been
            handled, you can contact our Grievance Officer. We acknowledge
            complaints within 48 hours and aim to resolve them within one month.
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-ink">
              {grievanceOfficer.name}
            </p>
            <p className="text-ink">
              <span className="text-sm text-ink-muted">Email:</span>{" "}
              <a
                href={`mailto:${grievanceOfficer.email}`}
                className="text-field no-underline hover:underline"
              >
                {grievanceOfficer.email}
              </a>
            </p>
            <p className="text-ink">
              <span className="text-sm text-ink-muted">Phone:</span>{" "}
              <a
                href={`tel:${grievanceOfficer.phone.replace(/\s/g, "")}`}
                className="text-field no-underline hover:underline"
              >
                {grievanceOfficer.phone}
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
