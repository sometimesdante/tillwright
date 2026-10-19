import "server-only";

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { siteConfig } from "@/utils/siteConfig";
import { SITE_URL } from "@/utils/siteUrl";

// While printing, the page may only load fonts, the Tailwind Play CDN and
// images from this site. Everything else is blocked, so a PDF can't be used
// to make the server fetch internal or arbitrary URLs.
const ALLOWED_HOSTS = new Set([
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.tailwindcss.com",
  new URL(siteConfig.websiteUrl).host,
  new URL(SITE_URL).host,
]);

function isAllowed(url: string) {
  if (url.startsWith("data:") || url === "about:blank") return true;
  try {
    const { protocol, host } = new URL(url);
    return (protocol === "https:" || protocol === "http:") && ALLOWED_HOSTS.has(host);
  } catch {
    return false;
  }
}

async function launch() {
  // The Sparticuz build is Linux-only (Vercel, Lambda). For local work on
  // Windows or macOS, set CHROME_EXECUTABLE_PATH to an installed Chrome.
  const localChrome = process.env.CHROME_EXECUTABLE_PATH;
  if (localChrome) {
    return puppeteer.launch({
      executablePath: localChrome,
      args: ["--hide-scrollbars"],
      defaultViewport: { width: 1920, height: 1080 },
      headless: true,
    });
  }
  // chromium-min's major version must match the Chrome that puppeteer-core
  // targets (puppeteer-core 25.11 → Chrome 153). Upgrade them together.
  return puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: [...chromium.args, "--hide-scrollbars"],
      headless: "shell",
    }),
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar`,
    ),
    headless: "shell",
  });
}

export async function renderPdf(html: string): Promise<Uint8Array> {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (isAllowed(request.url())) request.continue();
      else request.abort("blockedbyclient");
    });
    // setContent no longer accepts "networkidle0"; wait for the fonts and
    // Tailwind CDN that PDF_HEAD loads before printing.
    await page.setContent(html, { waitUntil: "load", timeout: 30000 });
    await page.waitForNetworkIdle({ idleTime: 500 });
    return await page.pdf({ format: "A4", printBackground: true });
  } finally {
    await browser.close();
  }
}
