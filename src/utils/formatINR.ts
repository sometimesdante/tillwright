// Money in the brand format: ₹ with Indian digit grouping and two decimals,
// for example ₹1,299.00 or ₹1,00,000.00.
export function formatINR(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// The same grouping and decimals without the symbol. PDFs print "Rs." in
// front, because the serverless Chromium that renders them may have no font
// with the ₹ glyph.
export function formatAmount(value: number | string | null | undefined) {
  return formatINR(value).slice(1);
}
