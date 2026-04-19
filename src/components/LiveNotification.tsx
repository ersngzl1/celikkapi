"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, X } from "lucide-react";

const notifications = [
  { name: "Ahmet Y.", city: "Adana", action: "teklif aldi", product: "Atlas Elite" },
  { name: "Mehmet K.", city: "Mersin", action: "siparis verdi", product: "Titan Pro" },
  { name: "Fatma D.", city: "Adana", action: "AI ile denedi", product: "Vega Modern" },
  { name: "Ali R.", city: "Hatay", action: "bilgi istedi", product: "Nova Elite" },
  { name: "Ayse C.", city: "Osmaniye", action: "teklif aldi", product: "Fortress Max" },
  { name: "Hasan B.", city: "Tarsus", action: "siparis verdi", product: "Atlas Elite" },
  { name: "Zeynep T.", city: "Adana", action: "AI ile denedi", product: "Titan Pro" },
  { name: "Mustafa E.", city: "Ceyhan", action: "bilgi istedi", product: "Guardian X" },
  { name: "Elif S.", city: "Mersin", action: "teklif aldi", product: "Vega Modern" },
  { name: "Omer A.", city: "Adana", action: "siparis verdi", product: "Nova Elite" },
];

export default function LiveNotification() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [time, setTime] = useState("");

  const showNext = useCallback(() => {
    if (dismissed) return;
    setCurrent((prev) => (prev + 1) % notifications.length);
    setTime(`${Math.floor(Math.random() * 45) + 2} dk once`);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000);
  }, [dismissed]);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNext();
    }, (Math.random() * 7000) + 8000);

    return () => clearTimeout(initialDelay);
  }, [showNext]);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      showNext();
    }, (Math.random() * 20000) + 20000);

    return () => clearInterval(interval);
  }, [dismissed, showNext]);

  if (dismissed) return null;

  const notif = notifications[current];

  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 left-4 z-40 max-w-xs transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="glass-dark rounded-xl shadow-2xl p-3.5 flex items-start gap-3" style={{ border: '1px solid var(--border)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.15)' }}>
          <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">
            <strong>{notif.name}</strong> ({notif.city}) <span className="text-[var(--gold-light)]">{notif.action}</span>
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {notif.product} &bull; {time}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] mt-0.5 flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
