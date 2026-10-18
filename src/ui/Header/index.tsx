import Image from "next/image";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import HeaderButtons from "../HeaderButtons";
import { siteConfig } from "@/utils/siteConfig";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div className="w-full fixed top-0 z-50 py-4 bg-surface-raised border-b border-line overflow-hidden">
      <div className="default-margin w-full flex justify-between items-center gap-2 min-w-0">
        <Link
          href="/"
          className="flex flex-row items-center gap-2 md:gap-4 no-underline min-w-0 flex-1"
        >
          <div className="flex flex-shrink-0">
            <Image
              src={siteConfig.logoPath}
              width={64}
              height={64}
              alt={`${siteConfig.name} logo`}
              className="aspect-square w-6 h-6 md:w-9 md:h-9 block md:hidden"
            />
            <Image
              src={siteConfig.logoPath}
              width={64}
              height={64}
              alt={`${siteConfig.name} logo`}
              className="aspect-square hidden md:block md:w-9 md:h-9"
            />
          </div>
          <p className="no-underline font-display font-semibold text-ink text-lg md:text-2xl tracking-tight truncate min-w-0">
            {siteConfig.name}
          </p>
        </Link>

        <div className="flex-shrink-0">
          <HeaderButtons isLoggedIn={!!data.user} />
        </div>
      </div>
    </div>
  );
}
