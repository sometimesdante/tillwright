import Link from "next/link";

export default function Failure() {
  return (
    <div className="w-full max-w-md mx-auto min-w-0 flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface-raised rounded-md border border-line p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
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
