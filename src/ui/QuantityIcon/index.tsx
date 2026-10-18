export default function QuantityIcon({
  type,
  size = 16,
}: {
  type: "add" | "remove";
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#54B226"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
      className="block"
    >
      <path d="M5 12h14" />
      {type === "add" ? <path d="M12 5v14" /> : null}
    </svg>
  );
}
