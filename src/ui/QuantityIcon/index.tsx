import { Minus, Plus } from "lucide-react";
import Icon from "@/ui/Icon";

export default function QuantityIcon({
  type,
  size = 20,
}: {
  type: "add" | "remove";
  size?: number;
}) {
  return (
    <Icon
      icon={type === "add" ? Plus : Minus}
      size={size}
      className="block text-field"
    />
  );
}
