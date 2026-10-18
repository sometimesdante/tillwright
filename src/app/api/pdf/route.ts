import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

export async function POST(request: NextRequest) {
  try {
    const { htmlContent } = await request.json();

    if (!htmlContent) {
      return NextResponse.json(
        { error: "Missing required field: htmlContent" },
        { status: 400 },
      );
    }

    // chromium-min's major version must match the Chrome that puppeteer-core
    // targets (puppeteer-core 25.11 → Chrome 153). Upgrade them together.
    const browser = await puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        headless: "shell",
      }),
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v153.0.0/chromium-v153.0.0-pack.x64.tar`
      ),
      headless: "shell",
    });

    const page = await browser.newPage();
    // setContent no longer accepts "networkidle0"; wait for the fonts and
    // Tailwind CDN that pdfHead loads before printing.
    await page.setContent(htmlContent, { waitUntil: "load", timeout: 30000 });
    await page.waitForNetworkIdle({ idleTime: 500 });

    const pdf = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
