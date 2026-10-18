import { siteConfig } from "@/utils/siteConfig";

// Base URL for functional links (API routes, payment callback, redirects).
// Override per environment with NEXT_PUBLIC_SITE_URL, e.g. http://localhost:3000 locally.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || siteConfig.websiteUrl;
