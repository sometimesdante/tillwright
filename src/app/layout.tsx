import "@/styles/globals.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/utils/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<Record<string, string | string[]>>;
}>) {
  if (params) await params;
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <ToastContainer />
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID as string} />
      </body>
    </html>
  );
}
