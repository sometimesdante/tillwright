import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { siteConfig } from "@/utils/siteConfig";
import { Images, LayoutDashboard, LogOut, Package, ReceiptText } from "lucide-react";
import Icon from "@/ui/Icon";



const links = [
  { href: "/admin", title: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", title: "Manage orders", icon: ReceiptText },
  { href: "/admin/products", title: "Manage products", icon: Package },
  { href: "/admin/gallery", title: "Gallery", icon: Images },
];

export default function Sidebar() {
  return (
    <div className="w-16 h-full fixed top-0 left-0 z-20 bg-surface-raised border-r border-line">
      <div className="h-screen py-4 flex flex-col justify-between items-center">
        <div className="flex flex-col gap-4 items-center">
          <Link href="/" title="Home">
            <Image
              loading="eager"
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
              <Icon icon={link.icon} className="text-field" />
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
            <Icon icon={LogOut} className="text-field" />
          </button>
        </div>
      </div>
    </div>
  );
}
