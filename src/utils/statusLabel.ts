// Order statuses in sentence case: "out for delivery" -> "Out for delivery".
// "cod" is an acronym, so it stays "COD".
export function statusLabel(status?: string | null) {
  if (!status) return "";
  if (status.toLowerCase() === "cod") return "COD";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
