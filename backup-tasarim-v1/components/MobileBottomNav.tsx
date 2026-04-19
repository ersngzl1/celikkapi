"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Sparkles, Info, Phone } from "lucide-react";

const tabs = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/katalog", label: "Katalog", icon: Grid3X3 },
  { href: "/ai-deneme", label: "AI Dene", icon: Sparkles, accent: true },
  { href: "/hakkimizda", label: "Hakkımızda", icon: Info },
  { href: "/iletisim", label: "İletişim", icon: Phone },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bottom-nav-glass safe-bottom"
      style={{ borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}
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
                      ? 'linear-gradient(135deg, #B91C1C, #DC2626)'
                      : 'linear-gradient(135deg, #DC2626, #EF4444)',
                    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    marginTop: '2px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#DC2626' : 'var(--text-muted)',
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
                  background: isActive ? 'rgba(220, 38, 38, 0.08)' : 'transparent',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? '#DC2626' : 'var(--text-muted)' }}
                />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  marginTop: '2px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#DC2626' : 'var(--text-muted)',
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
