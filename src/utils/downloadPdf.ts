// Asks /api/pdf for a document and saves it. Returns an error message for
// the caller to show, or null on success.
export async function downloadPdf(
  request:
    | { type: "invoice"; orderId: number }
    | { type: "orders"; start: string; end: string }
    | { type: "products" },
): Promise<string | null> {
  const response = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: null }));
    return error ?? "Couldn't generate the PDF. Try again.";
  }

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? "document.pdf";
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return null;
}
