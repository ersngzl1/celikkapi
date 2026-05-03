"use client";

import { Phone } from "lucide-react";
import { useSettings } from "@/lib/useSettings";

export default function PhoneCTA({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { settings } = useSettings();
  return (
    <a
      href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
      className={`gtm-phone ${className || ""}`}
      style={style}
    >
      <Phone className="w-4 h-4" /> {settings.phone}
    </a>
  );
}
