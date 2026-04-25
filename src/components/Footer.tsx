"use client";

import Link from "next/link";
import { Shield, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useSettings } from "@/lib/useSettings";
import { useTheme } from "@/components/ThemeProvider";

export default function Footer() {
  const { settings } = useSettings();
  const { theme } = useTheme();
  const logo = theme === "dark" ? settings.logoDark : settings.logoLight;
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <footer>
      {/* Pre-footer CTA */}
      <div style={{ background: 'var(--hero-gradient)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: 'var(--gold-glow)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl" style={{ background: 'var(--gold-glow)' }} />

        <div className="container-custom relative z-10" style={{ padding: '48px 24px' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-shrink-0">
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '8px', lineHeight: '1.2' }}>
                Adana&apos;da çelik kapı denince<br className="hidden sm:block" /> <span className="text-gold">akla gelen isim</span>
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                WhatsApp&apos;tan hemen yazın, uzman ekibimiz size en uygun çözümü sunsun.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-colors text-sm wa-glow whitespace-nowrap" style={{ padding: '14px 24px' }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center justify-center gap-2 font-bold rounded-xl transition-colors text-sm whitespace-nowrap cta-gold" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                <Phone className="w-4 h-4 flex-shrink-0" /> {settings.phone}
              </a>
              <Link href="/iletisim" className="flex items-center justify-center gap-2 text-[var(--text-primary)] font-bold rounded-xl transition-colors text-sm whitespace-nowrap" style={{ padding: '14px 24px', border: '1px solid var(--border-light)' }}>
                Teklif Formu <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container-custom" style={{ padding: '48px 24px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5" style={{ marginBottom: '16px' }}>
                {logo ? (
                  <img src={logo} alt="Best Kapı" className="h-9 object-contain" />
                ) : (
                  <>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#0D1B4C',
                        boxShadow: '0 2px 8px rgba(13,27,76,0.2)',
                      }}
                    >
                      <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-serif text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}><span style={{ color: '#C8102E' }}>Best</span> Kapı</span>
                  </>
                )}
              </Link>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs" style={{ marginBottom: '16px' }}>
                Best Pen güvencesiyle Adana ve çevre illerde çelik kapı satış, montaj ve servis hizmeti. Yılların tecrübesiyle güvenliğiniz bizim önceliğimiz.
              </p>
              <div className="flex items-center gap-2">
                {["TSE", "CE", "ISO"].map((badge) => (
                  <div key={badge}
                    className="flex items-center justify-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--gold-light)' }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>
                Hızlı Erişim
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { href: "/katalog", label: "Ürün Kataloğu" },
                  { href: "/ai-deneme", label: "Kapımı Görüntüle" },
                  { href: "/hakkimizda", label: "Hakkımızda" },
                  { href: "/iletisim", label: "İletişim" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--gold-light)] transition-colors flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[var(--gold)]" style={{ marginLeft: '-16px', marginRight: '-3px' }} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service areas */}
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>
                Hizmet Bölgelerimiz
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {["Adana Merkez", "Mersin", "Hatay", "Osmaniye", "Tarsus", "Ceyhan"].map((item) => (
                  <li key={item} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-light)', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>
                İletişim
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.15)' }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div>
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#25D366] hover:text-[#20BD5A] transition-colors">WhatsApp ile Yazın</a>
                    <p className="text-xs text-[var(--text-muted)]">{settings.whatsapp}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)' }}>
                    <Phone className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div>
                    <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--gold-light)] transition-colors">{settings.phone}</a>
                    <p className="text-xs text-[var(--text-muted)]">{settings.workingDays} {settings.workingHours}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)' }}>
                    <Mail className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <a href={`mailto:${settings.email}`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--gold-light)] transition-colors">{settings.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)' }}>
                    <MapPin className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">{settings.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="divider-gold" style={{ marginTop: '40px' }} />
          <div style={{ paddingTop: '24px' }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)]">&copy; 2026 Best Kapı - Best Pen. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <span className="hover:text-[var(--text-secondary)] transition-colors cursor-pointer">Gizlilik Politikası</span>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border-light)' }} />
              <span className="hover:text-[var(--text-secondary)] transition-colors cursor-pointer">Kullanım Koşulları</span>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--border-light)' }} />
              <span className="hover:text-[var(--text-secondary)] transition-colors cursor-pointer">KVKK</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
