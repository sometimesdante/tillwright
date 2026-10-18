import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { siteConfig } from "@/utils/siteConfig";

import Dashboard from "@/../public/icons/admin/dashboard.png";
import Orders from "@/../public/icons/admin/orders.png";
import Products from "@/../public/icons/admin/products.png";
import Gallery from "@/../public/icons/admin/gallery.png";
import Logout from "@/../public/icons/logout.png";

// The icon PNGs are white, so use them as a mask over a brand-green fill.
function SidebarIcon({ icon }: { icon: StaticImageData }) {
  const mask = `url(${icon.src}) center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className="block w-6 h-6 bg-field"
      style={{ mask, WebkitMask: mask }}
    />
  );
}

const links = [
  { href: "/admin", title: "Dashboard", icon: Dashboard },
  { href: "/admin/orders", title: "Manage Orders", icon: Orders },
  { href: "/admin/products", title: "Manage Products", icon: Products },
  { href: "/admin/gallery", title: "Gallery", icon: Gallery },
];

export default function Sidebar() {
  return (
    <div className="w-16 h-full fixed top-0 left-0 z-20 bg-surface-raised border-r border-line">
      <div className="h-screen py-4 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-4 items-center">
          <Link href="/" title="Home">
            <Image
              src={siteConfig.logoPath}
              width={42}
              height={42}
              alt={`${siteConfig.name} logo`}
              className="aspect-square"
            />
          </Link>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.title}
              aria-label={link.title}
              className="p-2 rounded-md hover:bg-field-soft transition-colors"
            >
              <SidebarIcon icon={link.icon} />
            </Link>
          ))}
        </div>
        <div>
          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-field-soft transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <SidebarIcon icon={Logout} />
          </button>
        </div>
      </div>
    </div>
  );
}
