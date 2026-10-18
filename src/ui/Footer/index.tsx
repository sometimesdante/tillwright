import Link from "next/link";
import { siteConfig } from "@/utils/siteConfig";

const linkClass =
  "block py-1.5 text-on-field/75 no-underline hover:text-on-field transition-colors";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-field text-on-field overflow-x-hidden min-w-0">
      <div className="default-margin w-full py-8 md:py-12 min-w-0">
        <div className="md:flex justify-start gap-12 flex-wrap">
          <div>
            <h3 className="font-sans text-label uppercase text-on-field mb-3">Company</h3>
            <nav className="flex flex-col">
              <Link href="/about" className={linkClass}>
                About us
              </Link>
              <Link href="/about/contact" className={linkClass}>
                Contact
              </Link>
              <Link
                href={siteConfig.requestProductFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Request a product
              </Link>
            </nav>
          </div>
          <div className="mt-8 md:mt-0">
            <h3 className="font-sans text-label uppercase text-on-field mb-3">Policies</h3>
            <nav className="flex flex-col">
              <Link href="/about/shipping" className={linkClass}>
                Shipping
              </Link>
              <Link href="/about/returns" className={linkClass}>
                Returns
              </Link>
              <Link href="/about/privacy" className={linkClass}>
                Privacy
              </Link>
              <Link href="/about/terms" className={linkClass}>
                Terms of use
              </Link>
            </nav>
          </div>
        </div>
        <p className="text-caption text-on-field/75 mt-8 pt-6 border-t border-on-field/20 break-words">
          {siteConfig.legalName}, copyright © {currentYear}.
        </p>
      </div>
    </footer>
  );
}
