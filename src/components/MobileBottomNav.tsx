"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Sparkles, DoorOpen, Phone } from "lucide-react";

const tabs = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/celik-kapi", label: "Çelik Kapı", icon: Shield },
  { href: "/ai-deneme", label: "AI Dene", icon: Sparkles, accent: true },
  { href: "/oda-kapisi", label: "Oda Kapısı", icon: DoorOpen },
  { href: "/iletisim", label: "İletişim", icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-dark safe-bottom"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-around" style={{ padding: '6px 4px 8px' }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          if (tab.accent) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center"
                style={{ marginTop: '-20px' }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))'
                      : 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                    boxShadow: '0 4px 15px var(--gold-badge-border)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    marginTop: '2px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center"
              style={{ padding: '4px 8px', minWidth: '56px' }}
            >
              <div
                className="flex items-center justify-center transition-colors"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isActive ? 'var(--stat-hover-bg)' : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? 'var(--gold-light)' : 'var(--text-muted)' }}
                />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  marginTop: '2px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
