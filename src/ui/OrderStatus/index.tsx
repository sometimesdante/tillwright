"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateDeliveryStatus } from "@/app/admin/orders/actions";
import { ChevronDown } from "lucide-react";
import Icon from "@/ui/Icon";

const statuses = [
  {
    value: "pending",
    label: "Pending",
    style: "bg-surface text-ink-muted border-line-strong",
  },
  {
    value: "out for delivery",
    label: "Out for delivery",
    style: "bg-surface-raised text-field border-field/40",
  },
  {
    value: "delivered",
    label: "Delivered",
    style: "bg-field-soft text-field border-field/30",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    style: "bg-danger/10 text-danger border-danger/30",
  },
];

export default function OrderStatus({ id }: any) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clickStatus, setClickStatus] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>();
  const menuRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select()
          .eq("id", id)
          .single();

        if (error) throw error;

        setDeliveryStatus(data.delivery_status);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, supabase, clickStatus]);

  useEffect(() => {
    if (!clickStatus) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setClickStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clickStatus]);

  async function UpdateDeliveryStatus(id: string, status: string) {
    setClickStatus(false);
    if (status === deliveryStatus) return;

    // The server checks the admin, adjusts stock on cancel and sends the
    // dispatch message.
    const result = await updateDeliveryStatus(Number(id), status);
    if (!result.ok) {
      console.error(result.error);
      return;
    }
    setDeliveryStatus(status);
  }

  if (loading)
    return <span className="block h-7 w-32 rounded-sm bg-surface animate-pulse" />;
  if (error) return <span className="text-xs text-danger">Error: {error}</span>;

  const current = statuses.find((s) => s.value === deliveryStatus);

  return (
    <span ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setClickStatus(!clickStatus)}
        aria-haspopup="menu"
        aria-expanded={clickStatus}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium pl-2.5 pr-2 py-1 rounded-sm border transition-colors ${
          current?.style ?? "bg-surface text-ink-muted border-line"
        }`}
      >
        {current?.label ?? "No status"}
        <Icon icon={ChevronDown} size={16} />
      </button>
      {clickStatus && (
        <span
          role="menu"
          className="absolute left-0 top-full mt-1.5 z-30 w-44 p-1.5 flex flex-col bg-surface-raised rounded-md border border-line shadow-float"
        >
          {statuses.map((s) => (
            <button
              key={s.value}
              type="button"
              role="menuitem"
              onClick={() => UpdateDeliveryStatus(id, s.value)}
              className={`text-left text-sm px-3 py-2 rounded-sm hover:bg-surface ${
                s.value === deliveryStatus
                  ? "font-semibold text-ink"
                  : "text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
