"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useSettings } from "@/lib/useSettings";

export default function IletisimPage() {
  const { settings } = useSettings();
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(data.error || "Mesaj gonderilemedi. Lutfen tekrar deneyin.");
      }
    } catch {
      setSubmitError("Baglanti hatasi. Lutfen tekrar deneyin.");
    }
    setIsSubmitting(false);
  };

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;
  const contactInfo = [
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone,
      href: `tel:${settings.phone.replace(/[^0-9+]/g, "")}`,
      sub: `${settings.workingDays}: ${settings.workingHours}`,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: settings.email,
      href: `mailto:${settings.email}`,
      sub: "24 saat içinde yanıt",
    },
    {
      icon: MapPin,
      label: "Adres",
      value: settings.address,
      href: settings.googleMapsUrl || undefined,
      sub: settings.city,
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: `${settings.workingDays}: ${settings.workingHours}`,
      href: undefined,
      sub: "Pazar: Kapalı",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container-custom relative z-10" style={{ padding: '48px 24px 56px', color: '#FFFFFF' }}>
          <span className="badge-gold" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <MessageSquare className="w-3.5 h-3.5" />
            İletişim
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl" style={{ lineHeight: '1.1' }}>
            Bize <span className="text-gold">Ulaşın</span>
          </h1>
          <p className="text-white/60 max-w-xl text-base md:text-lg leading-relaxed" style={{ marginTop: '16px' }}>
            Adana ve çevre illerde çelik kapı keşif, teklif veya herhangi bir sorunuz için bize ulaşabilirsiniz.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom" style={{ padding: '48px 24px 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-14">
          {/* Form */}
          <div className="order-2 lg:order-1">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center card-gold" style={{ padding: '80px 24px' }}>
                <div
                  className="flex items-center justify-center"
                  style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.15)', marginBottom: '24px' }}
                >
                  <CheckCircle2 style={{ width: '32px', height: '32px', color: '#25D366' }} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--text-primary)]" style={{ marginBottom: '12px' }}>
                  Mesajınız Alındı
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm" style={{ marginBottom: '24px' }}>
                  Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                  Genellikle 24 saat içinde dönüş yapıyoruz.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({ name: "", phone: "", email: "", subject: "", message: "" });
                  }}
                  className="text-sm text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors font-semibold"
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <div className="card-gold" style={{ padding: '32px' }}>
                <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]" style={{ marginBottom: '4px' }}>Mesaj Gönderin</h2>
                <p className="text-sm text-[var(--text-muted)]" style={{ marginBottom: '28px' }}>Tüm alanları doldurun, en kısa sürede dönüş yapalım.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Adınız Soyadınız"
                        className="input-dark"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="(5XX) XXX XX XX"
                        className="input-dark"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="ornek@email.com"
                      className="input-dark"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                      Konu
                    </label>
                    <select
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="input-dark"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">Konu seçin</option>
                      <option value="teklif">Fiyat Teklifi</option>
                      <option value="kesif">Keşif Talebi</option>
                      <option value="bilgi">Ürün Bilgisi</option>
                      <option value="servis">Servis / Bakım</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: '8px', fontWeight: 600 }}>
                      Mesajınız *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Mesajınızı yazın..."
                      className="input-dark"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  {submitError && (
                    <div style={{ padding: '12px 16px', background: 'rgba(229, 62, 62, 0.1)', border: '1px solid rgba(229, 62, 62, 0.2)', borderRadius: '12px', fontSize: '13px', color: '#E53E3E' }}>
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 cta-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
                      color: '#FFFFFF',
                      fontSize: '15px',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Mesaj Gönder
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="card-gold group"
                  style={{ padding: '20px' }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'var(--gold-badge-bg)',
                        border: '1px solid var(--stat-border)',
                      }}
                    >
                      <info.icon className="w-[18px] h-[18px] text-[var(--gold)]" />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                        {info.label}
                      </div>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--gold-light)] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {info.value}
                        </span>
                      )}
                      <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '2px' }}>
                        {info.sub}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="card-gold overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: 'var(--gold-badge-bg)',
                    border: '1px solid var(--stat-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px',
                  }}>
                    <MapPin className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] text-center" style={{ padding: '0 16px' }}>
                    {settings.address}
                  </p>
                  {settings.googleMapsUrl && (
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors font-semibold"
                      style={{ marginTop: '12px' }}
                    >
                      Haritada Göster &rarr;
                    </a>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="gtm-whatsapp flex items-center justify-center gap-2 w-full text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold wa-glow"
                style={{ padding: '14px', background: '#25D366' }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Hemen Yazın
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
