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
          className="flex items-center no-underline min-w-0 flex-1"
        >
          {/* Wordmark is 267 × 64: 24px tall on phones, 36px from md up. */}
          <Image
            loading="eager"
            src={siteConfig.wordmarkPath}
            width={267}
            height={64}
            alt={siteConfig.name}
            className="h-6 w-auto md:h-9 flex-shrink-0"
          />
        </Link>

        <div className="flex-shrink-0">
          <HeaderButtons isLoggedIn={!!data.user} />
        </div>
      </div>
    </div>
  );
}
