"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Phone, Clock, MapPin } from "lucide-react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/katalog", label: "Katalog" },
  { href: "/ai-deneme", label: "Kapımı Görüntüle" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => { if (data.logo) setLogo(data.logo); })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Top bar */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }} className="hidden md:block text-xs">
        <div className="container-custom flex items-center justify-between" style={{ padding: '8px 0' }}>
          <div className="flex items-center gap-5">
            <a href="https://wa.me/903221234567?text=Merhabalar%2C%20%C3%A7elik%20kap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors font-semibold text-[var(--text-secondary)]">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp ile Yazın
            </a>
            <span style={{ width: '1px', height: '12px', background: 'var(--border-light)' }} />
            <a href="tel:+903221234567" className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--gold-light)] transition-colors">
              <Phone className="w-3 h-3" />
              (0322) 123 45 67
            </a>
            <span style={{ width: '1px', height: '12px', background: 'var(--border-light)' }} />
            <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <Clock className="w-3 h-3" />
              Pzt - Cmt: 09:00 - 18:00
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
              <MapPin className="w-3 h-3" />
              Adana ve Çevre İller
            </span>
            <span style={{ width: '1px', height: '12px', background: 'var(--border-light)' }} />
            <div className="flex items-center gap-2">
              {["TSE", "CE", "ISO"].map((badge) => (
                <span key={badge} style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(200, 165, 92, 0.1)', border: '1px solid rgba(200, 165, 92, 0.15)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--gold-light)' }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <nav
        className="sticky top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10, 10, 10, 0.92)' : 'var(--bg-primary)',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          padding: scrolled ? '10px 0' : '14px 0',
        }}
      >
        <div className="container-custom flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            {logo ? (
              <img src={logo} alt="Best Kapı" className="h-10 object-contain" />
            ) : (
              <>
                <div
                  className="flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #D4B87A 0%, #A88A3E 100%)',
                    boxShadow: '0 4px 16px rgba(200, 165, 92, 0.3)',
                  }}
                >
                  <Shield className="w-5 h-5 text-[var(--bg-primary)]" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-gold font-serif text-xl font-extrabold tracking-tight leading-none">
                    Best Kapı
                  </span>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)', marginTop: '3px', lineHeight: 1 }}>
                    Adana Çelik Kapı
                  </span>
                </div>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}
                  className="relative transition-all duration-300"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(200, 165, 92, 0.08)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2px',
                        background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="https://wa.me/903221234567?text=Merhabalar%2C%20%C3%A7elik%20kap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-white text-sm font-bold rounded-xl hover:bg-[#20BD5A] transition-all duration-300 wa-glow"
              style={{ padding: '10px 20px', background: '#25D366' }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <Link href="/iletisim"
              className="text-sm font-bold rounded-xl transition-all duration-300 cta-gold"
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--bg-primary)' }}
            >
              Teklif Al
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <a href="https://wa.me/903221234567?text=Merhabalar%2C%20%C3%A7elik%20kap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-[#25D366] text-white wa-glow"
              style={{ width: '40px', height: '40px' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="tel:+903221234567"
              className="flex items-center justify-center rounded-xl text-[var(--bg-primary)] cta-gold"
              style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))' }}
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
