import type { LucideIcon, LucideProps } from "lucide-react";

// Brand icon defaults (public/brand-docs/README.md): Lucide at 20px with a
// 1.75px stroke, coloured ink or field through `className`. Icons are
// decorative; the button or link around them carries the accessible label.
export default function Icon({
  icon: Glyph,
  size = 20,
  ...props
}: { icon: LucideIcon } & LucideProps) {
  return <Glyph size={size} strokeWidth={1.75} aria-hidden {...props} />;
}
