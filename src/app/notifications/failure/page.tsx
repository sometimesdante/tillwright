import Link from "next/link";
import { X } from "lucide-react";
import Icon from "@/ui/Icon";

export default function Failure() {
  return (
    <div className="w-full max-w-md mx-auto min-w-0 flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <Icon icon={X} className="text-danger" />
        </div>
        <h2 className="text-heading text-ink mb-2">
          Payment failed
        </h2>
        <p className="text-ink-muted text-sm mb-6">
          Your payment could not be completed. Please try again or contact support.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-field text-on-field font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity text-center no-underline"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
