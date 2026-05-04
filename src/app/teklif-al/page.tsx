"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Shield,
  CheckCircle2,
  Star,
  Send,
  Loader2,
  Clock,
  Award,
  Truck,
  ArrowRight,
  X,
  ZoomIn,
} from "lucide-react";
import { useSettings } from "@/lib/useSettings";
import { trackWhatsApp, trackPhone } from "@/lib/analytics";

interface Product {
  id: number;
  name: string;
  slug: string;
  series: string;
  image: string;
  category: string;
}

export default function TeklifAlPage() {
  const { settings } = useSettings();
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    "Merhaba, çelik kapı fiyat teklifi almak istiyorum."
  )}`;

  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<{ id: number; src: string; alt: string }[]>([]);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const steelDoors = data.filter((p: Product) => p.category === "celik-kapi");
        setProducts(steelDoors.slice(0, 6));
      })
      .catch(() => {});

    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setGallery(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({ name: "", phone: "", doorType: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          subject: "Reklam - Teklif Talebi",
          message: `Kapı Tipi: ${form.doorType || "Belirtilmedi"}\nNot: ${form.note || "-"}`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        // GTM conversion event
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-584444459",
            event_category: "form",
            event_label: "teklif_al_landing",
          });
        }
      } else {
        setError("Gönderilemedi. Lütfen telefon ile arayın.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen telefon ile arayın.");
    }
    setSubmitting(false);
  };

  const reviews = [
    { name: "Ahmet Y.", text: "Çok kaliteli kapı, montaj ekibi çok profesyoneldi. Kesinlikle tavsiye ederim.", rating: 5, location: "Adana / Çukurova" },
    { name: "Fatma K.", text: "Fiyat performans olarak en iyisi. Kapımız çok sağlam ve şık görünüyor.", rating: 5, location: "Mersin" },
    { name: "Mehmet D.", text: "Hızlı teslimat ve temiz iş. Komşularımız da aynı firmadan yaptırdı.", rating: 5, location: "Adana / Seyhan" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Minimal Top Bar */}
      <div
        style={{
          background: "var(--hero-gradient)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 0",
        }}
      >
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {(settings.logoDark || settings.logoLight) ? (
              <img src={settings.logoDark || settings.logoLight} alt="Best Kapı" className="h-8 object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#C8102E",
                  }}
                >
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-serif text-lg font-extrabold text-white">
                  <span style={{ color: "#C8102E" }}>Best</span> Kapı
                </span>
              </div>
            )}
          </div>
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
            onClick={() => trackPhone("landing_topbar")}
            className="gtm-phone flex items-center gap-2 text-white font-bold text-sm"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{settings.phone}</span>
            <span className="sm:hidden">Ara</span>
          </a>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hero-gradient)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.06)_0%,transparent_60%)]" />

        <div
          className="container-custom relative z-10"
          style={{ padding: "48px 24px 56px" }}
        >
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "rgba(37, 211, 102, 0.12)",
                color: "#25D366",
                border: "1px solid rgba(37, 211, 102, 0.2)",
                marginBottom: "20px",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Ücretsiz Keşif Hizmeti
            </div>

            <h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight"
              style={{ marginBottom: "16px" }}
            >
              Adana Çelik Kapı
              <br />
              <span style={{ color: "#C8102E" }}>Fiyat Teklifi Alın</span>
            </h1>

            <p
              className="text-base sm:text-lg text-white/70 max-w-lg leading-relaxed"
              style={{ marginBottom: "32px" }}
            >
              Best Pen güvencesiyle TSE, CE ve ISO belgeli çelik kapılar.
              Profesyonel montaj dahil, 20 yıla kadar garanti.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4" style={{ marginBottom: "32px" }}>
              {[
                { icon: Award, text: "TSE & CE Belgeli" },
                { icon: Truck, text: "Ücretsiz Montaj" },
                { icon: Shield, text: "20 Yıl Garanti" },
                { icon: Clock, text: "Aynı Gün Keşif" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-xs sm:text-sm text-white/80"
                >
                  <item.icon className="w-4 h-4" style={{ color: "#C8102E" }} />
                  {item.text}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp("landing_hero")}
                className="gtm-whatsapp flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all text-[15px] shadow-lg"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp ile Hemen Yazın
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                onClick={() => trackPhone("landing_hero")}
                className="gtm-phone flex items-center justify-center gap-2.5 px-8 py-4 text-white font-bold rounded-xl transition-all text-[15px] shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #C8102E, #A00D24)",
                }}
              >
                <Phone className="w-5 h-5" />
                Hemen Ara: {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      {products.length > 0 && (
        <section style={{ padding: "48px 0 0", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
          <div className="container-custom" style={{ padding: "0 24px 48px" }}>
            <div className="text-center" style={{ marginBottom: "32px" }}>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: "8px" }}>
                Çelik Kapı <span className="text-gold">Modellerimiz</span>
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                TSE, CE ve ISO 9001 belgeli, profesyonel montaj dahil
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {products.map((door) => (
                <div
                  key={door.id}
                  className="group relative rounded-2xl overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="relative" style={{ aspectRatio: "3/4", padding: "12px" }}>
                    <Image
                      src={door.image}
                      alt={door.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                  <div style={{ padding: "12px 16px 16px" }}>
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{door.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{door.series}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center" style={{ marginTop: "24px" }}>
              <Link
                href="/celik-kapi"
                className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                style={{ color: "var(--gold)" }}
              >
                Tüm modelleri görüntüle <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Örnek Çalışmalar */}
      {gallery.length > 0 && (
        <section style={{ padding: "48px 0", background: "var(--bg-primary)" }}>
          <div className="container-custom" style={{ padding: "0 24px" }}>
            <div className="text-center" style={{ marginBottom: "32px" }}>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: "8px" }}>
                Örnek <span className="text-gold">Çalışmalarımız</span>
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Montajını yaptığımız kapılardan bazıları
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                  className="group relative rounded-2xl overflow-hidden text-left cursor-pointer"
                  style={{
                    aspectRatio: "4/3",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt || "Montaj örneği"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  {item.alt && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm text-white font-semibold drop-shadow-lg">{item.alt}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form + Reviews */}
      <section
        className="container-custom"
        style={{ padding: "48px 24px 64px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <div>
            <div className="card-gold" style={{ padding: "32px" }}>
              {submitted ? (
                <div className="flex flex-col items-center text-center" style={{ padding: "40px 0" }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "20px",
                      background: "rgba(37, 211, 102, 0.1)",
                      border: "1px solid rgba(37, 211, 102, 0.15)",
                      marginBottom: "20px",
                    }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-[#25D366]" />
                  </div>
                  <h3
                    className="font-serif text-xl font-bold text-[var(--text-primary)]"
                    style={{ marginBottom: "8px" }}
                  >
                    Talebiniz Alındı!
                  </h3>
                  <p
                    className="text-sm text-[var(--text-secondary)] max-w-xs"
                    style={{ marginBottom: "24px" }}
                  >
                    Ekibimiz en kısa sürede sizi arayacaktır. Acil durumlar
                    için doğrudan arayabilirsiniz.
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                    onClick={() => trackPhone("landing_form_success")}
                    className="gtm-phone flex items-center gap-2 px-6 py-3 font-bold rounded-xl text-white text-sm"
                    style={{ background: "#C8102E" }}
                  >
                    <Phone className="w-4 h-4" />
                    {settings.phone}
                  </a>
                </div>
              ) : (
                <>
                  <h2
                    className="font-serif text-xl font-bold text-[var(--text-primary)]"
                    style={{ marginBottom: "4px" }}
                  >
                    Ücretsiz Teklif Alın
                  </h2>
                  <p
                    className="text-sm text-[var(--text-muted)]"
                    style={{ marginBottom: "24px" }}
                  >
                    Bilgilerinizi bırakın, sizi hemen arayalım.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gold)",
                          marginBottom: "6px",
                          fontWeight: 600,
                        }}
                      >
                        Ad Soyad *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Adınız Soyadınız"
                        className="input-dark"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gold)",
                          marginBottom: "6px",
                          fontWeight: 600,
                        }}
                      >
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(5XX) XXX XX XX"
                        className="input-dark"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gold)",
                          marginBottom: "6px",
                          fontWeight: 600,
                        }}
                      >
                        Kapı Tipi
                      </label>
                      <select
                        value={form.doorType}
                        onChange={(e) => setForm({ ...form, doorType: e.target.value })}
                        className="input-dark"
                        style={{ cursor: "pointer" }}
                      >
                        <option value="">Seçin (opsiyonel)</option>
                        <option value="celik-kapi">Çelik Kapı</option>
                        <option value="oda-kapisi">Oda Kapısı</option>
                        <option value="villa-kapisi">Villa Kapısı</option>
                        <option value="bina-giris">Bina Giriş Kapısı</option>
                        <option value="diger">Diğer / Bilmiyorum</option>
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--gold)",
                          marginBottom: "6px",
                          fontWeight: 600,
                        }}
                      >
                        Not (opsiyonel)
                      </label>
                      <textarea
                        value={form.note}
                        onChange={(e) => setForm({ ...form, note: e.target.value })}
                        placeholder="Varsa eklemek istediğiniz bilgi..."
                        rows={3}
                        className="input-dark"
                        style={{ resize: "none" }}
                      />
                    </div>

                    {error && (
                      <div
                        style={{
                          padding: "10px 14px",
                          background: "rgba(229, 62, 62, 0.1)",
                          border: "1px solid rgba(229, 62, 62, 0.2)",
                          borderRadius: "10px",
                          fontSize: "13px",
                          color: "#E53E3E",
                        }}
                      >
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 font-bold rounded-xl transition-all text-white disabled:opacity-50"
                      style={{
                        padding: "14px",
                        background: "linear-gradient(135deg, #C8102E, #A00D24)",
                        fontSize: "15px",
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Beni Arayın
                        </>
                      )}
                    </button>
                  </form>

                  <div
                    className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]"
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Bilgileriniz güvende
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 30 dk içinde dönüş
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reviews + Trust */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              className="font-serif text-lg font-bold text-[var(--text-primary)]"
              style={{ marginBottom: "4px" }}
            >
              Müşterilerimiz Ne Diyor?
            </h3>

            {reviews.map((r) => (
              <div
                key={r.name}
                className="card-gold"
                style={{ padding: "20px" }}
              >
                <div className="flex items-center gap-1" style={{ marginBottom: "8px" }}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current"
                      style={{ color: "#FBBF24" }}
                    />
                  ))}
                </div>
                <p
                  className="text-sm text-[var(--text-secondary)] leading-relaxed"
                  style={{ marginBottom: "10px" }}
                >
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {r.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {r.location}
                  </span>
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                background: "var(--hero-gradient)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <p
                className="text-sm text-white/70"
                style={{ marginBottom: "16px" }}
              >
                Hemen ulaşın, bugün keşfe gelelim
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsApp("landing_bottom")}
                  className="gtm-whatsapp flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                  onClick={() => trackPhone("landing_bottom")}
                  className="gtm-phone flex-1 flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl transition-all text-sm"
                  style={{ background: "#C8102E" }}
                >
                  <Phone className="w-4 h-4" />
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          {lightbox.alt && (
            <div className="absolute bottom-6 left-0 right-0 text-center z-10">
              <p className="text-sm text-white/80 font-semibold">{lightbox.alt}</p>
            </div>
          )}
          <div
            className="w-full h-full"
            style={{ touchAction: "pinch-zoom" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt || "Örnek çalışma"}
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom"
        style={{
          padding: "12px 16px",
          background: "var(--glass-bg-heavy)",
          borderTop: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex gap-3">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
            onClick={() => trackPhone("landing_sticky")}
            className="gtm-phone flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-bold rounded-xl text-sm"
            style={{ background: "#C8102E" }}
          >
            <Phone className="w-4 h-4" />
            Hemen Ara
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsApp("landing_sticky")}
            className="gtm-whatsapp flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
