import Link from "next/link";
import { X } from "lucide-react";
import Icon from "@/ui/Icon";
import { siteConfig } from "@/utils/siteConfig";

export const metadata = { title: "Something went wrong" };

// Where /auth/confirm and logout send people when a link or session fails,
// usually an email link that was already used or has expired.
export default function ErrorPage() {
  return (
    <section className="default-margin default-height my-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface-raised rounded-md border border-line p-6 sm:p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <Icon icon={X} className="text-danger" />
        </div>
        <h1 className="text-heading text-ink mb-2">That link didn&apos;t work</h1>
        <p className="text-ink-muted mb-6">
          Email links work once and expire after a while. Log in again, or ask
          for a new link. If it keeps happening, write to {siteConfig.email}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/login"
            className="inline-block bg-field text-on-field font-semibold py-2.5 px-4 rounded-md no-underline hover:opacity-90"
          >
            Log in
          </Link>
          <Link
            href="/"
            className="inline-block bg-surface-raised border border-line-strong text-ink font-semibold py-2.5 px-4 rounded-md no-underline hover:bg-surface"
          >
            Back to the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
