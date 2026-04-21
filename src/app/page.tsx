"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Shield, Lock, Thermometer, Award, ChevronRight, ArrowRight,
  Fingerprint, Wrench, Star, Phone, CheckCircle2, Clock,
  BadgeCheck, Users, Eye, Camera, MousePointerClick, ImageIcon, Sparkles,
} from "lucide-react";
// Products are now fetched from API, no static imports needed
import Image from "next/image";
import BeforeAfter from "@/components/BeforeAfter";
import { useSettings } from "@/lib/useSettings";
import { useContent } from "@/lib/useContent";

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.08 }
    );
    el.querySelectorAll(".animate-on-scroll").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Defaults — used when CMS content is empty
const defaultFeatures = [
  { title: "Üstün Güvenlik", desc: "Çok noktalı kilit sistemi ve özel çelik alaşım ile eviniz her an güvende.", stat: "%99.8", statLabel: "Güvenlik Oranı" },
  { title: "Akıllı Teknoloji", desc: "Parmak izi, şifre ve kartlı giriş seçenekleriyle modern güvenlik çözümleri.", stat: "3+", statLabel: "Kilit Teknolojisi" },
  { title: "Tam İzolasyon", desc: "Isı, ses ve su yalıtımlı özel dolgu malzemesiyle dört mevsim konfor.", stat: "%85", statLabel: "Enerji Tasarrufu" },
  { title: "Profesyonel Montaj", desc: "Uzman ekibimiz tarafından aynı gün kurulum ve 2 yıl montaj garantisi.", stat: "1 Gün", statLabel: "Kurulum Süresi" },
];
const defaultStats = [
  { value: "150+", label: "Mutlu Müşteri" },
  { value: "20 Yıl", label: "Sektör Tecrübesi" },
  { value: "4.9/5", label: "Müşteri Puanı" },
  { value: "7/24", label: "Destek Hattı" },
];
const defaultFaq = [
  { q: "Çelik kapı montajı ne kadar sürer?", a: "Profesyonel ekibimiz ortalama 2-3 saat içinde montajı tamamlar." },
  { q: "Çelik kapı fiyatları neye göre belirlenir?", a: "Model, kilit sistemi, boyut ve özel taleplere göre fiyatlandırma yapılır." },
  { q: "Garanti süresi ne kadardır?", a: "Tüm çelik kapılarımız 2 yıl üretici garantisi altındadır." },
  { q: "Hangi bölgelere hizmet veriyorsunuz?", a: "Adana, Mersin, Hatay, Osmaniye ve Tarsus'a hizmet veriyoruz." },
  { q: "Eski kapımı değiştirebilir misiniz?", a: "Evet, eski kapınızı söküp yeni çelik kapınızı aynı gün monte ediyoruz." },
];
const defaultTrust = ["TSE Belgeli Üretim", "CE Sertifikalı", "ISO 9001 Kalite", "Ücretsiz Keşif", "Aynı Gün Montaj", "2 Yıl Garanti", "7/24 Destek", "Kredi Kartına Taksit"];

export default function HomePage() {
  const revealRef = useScrollReveal();
  const { settings } = useSettings();
  const { content } = useContent("home");
  const [featuredDoors, setFeaturedDoors] = useState<any[]>([]);
  const [roomDoors, setRoomDoors] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTotalProducts(data.length);
          const featured = data.filter((p: any) => p.featured);
          const roomOnes = data.filter((p: any) => p.category === "oda" || p.category === "Oda Kapısı");
          const steelDoors = data.filter((p: any) => p.category !== "oda" && p.category !== "Oda Kapısı");
          // Featured varsa featured, yoksa çelik kapıları göster
          setFeaturedDoors(featured.length > 0 ? featured.slice(0, 6) : steelDoors.slice(0, 6));
          setRoomDoors(roomOnes.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));

    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((item: any) => {
            let meta: any = {};
            try { meta = typeof item.category === "string" ? JSON.parse(item.category) : item.category || {}; } catch {}
            return { ...item, meta };
          });
          setGalleryItems(parsed.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);
  // CMS content with fallbacks
  const hero = content.hero || {};
  const features = content.features || defaultFeatures;
  const stats = content.stats || defaultStats;
  const faq = content.faq || defaultFaq;
  const trustItems = content.trust || defaultTrust;

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;

  return (
    <div ref={revealRef}>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'var(--bg-primary)' }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.12)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,184,122,0.06)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(200,165,92,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.12) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
          <div className="absolute top-20 right-[15%] w-[500px] h-[500px] rounded-full animate-float" style={{ background: 'var(--gold-glow)', filter: 'blur(100px)', opacity: 0.6 }} />
          <div className="absolute bottom-10 left-[10%] w-[400px] h-[400px] rounded-full animate-float" style={{ background: 'var(--gold-glow)', filter: 'blur(80px)', animationDelay: '1.5s', opacity: 0.5 }} />
          <div className="absolute top-[60%] right-[20%] w-[300px] h-[300px] rounded-full animate-float" style={{ background: 'var(--gold-glow)', filter: 'blur(70px)', animationDelay: '2s', opacity: 0.3 }} />
        </div>

        <div className="container-custom relative z-10" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-up">
                <span className="badge-gold"><Award className="w-3 h-3" />Best Pen Güvencesi</span>
                <span className="badge-gold"><Users className="w-3 h-3" />Adana&apos;nın Tercihi</span>
                <span className="badge-gold"><Shield className="w-3 h-3" />TSE Belgeli</span>
              </div>

              <h1 className="font-serif text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[0.92] mb-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <span className="text-[var(--text-primary)]">{hero.titleLine1 || "Adana'da"}</span><br />
                <span className="text-gold">{hero.titleLine2 || "Çelik Kapı"}</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-xl leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {hero.subtitle || "Best Kapı ile evinizin güvenliğini ve estetiğini bir üst seviyeye taşıyın. Adana ve çevre illerde kaliteli çelik kapı çözümleri."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-all duration-300 wa-glow text-[15px]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp ile Yazın <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link href="/katalog" className="group inline-flex items-center justify-center gap-2 px-7 py-4 font-bold rounded-xl transition-all duration-300 cta-gold text-[15px]" style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--bg-primary)' }}>
                  Kataloğu İncele
                </Link>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center justify-center gap-2 px-7 py-4 text-[var(--text-primary)] font-bold rounded-xl transition-all duration-300 text-[15px]" style={{ border: '1px solid var(--border-light)' }}>
                  <Phone className="w-4 h-4 text-[var(--gold)]" /> Hemen Ara
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)] animate-fade-up" style={{ animationDelay: "0.4s" }}>
                {["Profesyonel montaj", "20 yıla kadar garanti", "Adana ve çevre iller"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />{t}</span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="w-[280px] space-y-4">
                {[Shield, Award, Star, Clock].map((Icon, idx) => {
                  const s = stats[idx] || { value: "", label: "" };
                  return { icon: Icon, ...s };
                }).map((stat, idx) => (
                  <div key={stat.label} className="card-gold flex items-center gap-4 group animate-slide-up" style={{ padding: '16px', animationDelay: `${0.3 + idx * 0.12}s`, opacity: 0 }}>
                    <div className="flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300" style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)' }}>
                      <stat.icon className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                      <div className="text-gold font-serif text-xl font-extrabold">{stat.value}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-secondary)' }}>
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4" style={{ marginBottom: '36px' }}>
            <div>
              <span className="animate-on-scroll badge-gold" style={{ marginBottom: '12px', display: 'inline-flex' }}>Koleksiyon</span>
              <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '12px' }}>
                Öne Çıkan <span className="text-gold">Çelik Kapılar</span>
              </h2>
              <p className="animate-on-scroll text-[var(--text-secondary)]" style={{ marginTop: '8px' }}>Adana&apos;da en çok tercih edilen çelik kapı modellerimiz.</p>
            </div>
            <Link href="/katalog" className="animate-on-scroll group inline-flex items-center gap-2 text-sm font-bold text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors">
              Tüm Koleksiyon ({totalProducts || featuredDoors.length} model) <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {productsLoading && featuredDoors.length === 0 && (
              <div className="w-full flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {featuredDoors.map((door) => (
              <div key={door.id} className="snap-start shrink-0 w-[75%] sm:w-[48%] lg:w-[31%]">
                <div className="group relative rounded-2xl overflow-hidden h-[420px] md:h-[480px]" style={{ border: '1px solid var(--border)' }}>
                  <Image src={door.image} alt={door.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 75vw, (max-width: 1024px) 48vw, 31vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold" style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}>{door.category}</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: door.colorHex, border: '1px solid var(--border-light)' }} />
                      <span className="text-[10px] font-medium text-[var(--text-secondary)]">{door.color}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <p className="text-[11px] text-[var(--gold-light)] font-medium uppercase tracking-wider">{door.series}</p>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mt-1 mb-4">{door.name}</h3>

                    <div className="flex gap-2">
                      <Link href={`/ai-deneme?door=${door.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-colors cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                        <Sparkles className="w-3.5 h-3.5" /> AI ile Dene
                      </Link>
                      <Link href={`/urun/${door.slug || door.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-white text-xs font-bold rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <Eye className="w-3.5 h-3.5" /> Detay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/katalog" className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all text-[15px] cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
              Tüm Modelleri Görüntüle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ODA KAPILARI ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-primary)' }}>
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4" style={{ marginBottom: '36px' }}>
            <div>
              <span className="animate-on-scroll badge-gold" style={{ marginBottom: '12px', display: 'inline-flex' }}>İç Mekan</span>
              <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '12px' }}>
                Öne Çıkan <span className="text-gold">Oda Kapıları</span>
              </h2>
              <p className="animate-on-scroll text-[var(--text-secondary)]" style={{ marginTop: '8px' }}>Evinizin iç mekanlarına uyum sağlayan şık oda kapıları.</p>
            </div>
            <Link href="/katalog?category=oda" className="animate-on-scroll group inline-flex items-center gap-2 text-sm font-bold text-[var(--gold-light)] hover:text-[var(--gold)] transition-colors">
              Tüm Koleksiyon ({roomDoors.length} model) <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {roomDoors.map((rd) => (
              <div key={rd.id} className="snap-start shrink-0 w-[75%] sm:w-[48%] lg:w-[31%]">
                <div className="group relative rounded-2xl overflow-hidden h-[420px] md:h-[480px]" style={{ border: '1px solid var(--border)' }}>
                  <Image src={rd.image} alt={rd.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 75vw, (max-width: 1024px) 48vw, 31vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold" style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}>Oda Kapısı</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: rd.colorHex, border: '1px solid var(--border-light)' }} />
                      <span className="text-[10px] font-medium text-[var(--text-secondary)]">{rd.color}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <p className="text-[11px] text-[var(--gold-light)] font-medium uppercase tracking-wider">{rd.series}</p>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mt-1 mb-4">{rd.name}</h3>

                    <div className="flex gap-2">
                      <Link href={`/ai-deneme?door=${rd.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-colors cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                        <Sparkles className="w-3.5 h-3.5" /> AI ile Dene
                      </Link>
                      <Link href={`/urun/${rd.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-white text-xs font-bold rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <Eye className="w-3.5 h-3.5" /> Detay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/katalog?category=oda" className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all text-[15px]" style={{ border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}>
              Tüm Oda Kapısı Modelleri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AI KAPI GÖRÜNTÜLE ─── */}
      <section className="relative overflow-hidden" style={{ padding: '80px 0' }}>
        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="animate-on-scroll badge-gold" style={{ marginBottom: '24px', display: 'inline-flex' }}>
                <Camera className="w-3.5 h-3.5" />
                Kapınızı Evinizde Görün
              </span>
              <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-5 leading-tight">
                Kapıyı Almadan Önce<br /><span className="text-gold">Evinizde Deneyin</span>
              </h2>
              <p className="animate-on-scroll text-base md:text-lg text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
                Nasıl çalışır? Çok basit! Evinizin kapı fotoğrafını çekin, beğendiğiniz kapı modelini seçin, anında evinizde nasıl duracağını görün.
              </p>

              <div className="animate-on-scroll space-y-4 mb-8">
                {[
                  { icon: Camera, title: "1. Fotoğraf Çekin", desc: "Evinizin kapısının fotoğrafını telefonunuzla çekin" },
                  { icon: MousePointerClick, title: "2. Kapı Modeli Seçin", desc: "Beğendiğiniz modeli tıklayın, kapıyı sürükleyerek yerleştirin" },
                  { icon: ImageIcon, title: "3. Sonucu Görün", desc: "Kapınız evinizde nasıl duracak? Anında görün, beğenin!" },
                ].map((step) => (
                  <div key={step.title} className="flex items-center gap-4 rounded-xl p-4 hover:translate-x-2 transition-all duration-300 cursor-default" style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-badge-bg)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--stat-hover-bg)', border: '1px solid var(--gold-badge-border)' }}>
                      <step.icon className="w-6 h-6 text-[var(--gold)]" />
                    </div>
                    <div>
                      <div className="text-[var(--text-primary)] font-bold text-sm">{step.title}</div>
                      <div className="text-[var(--text-muted)] text-xs">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="animate-on-scroll flex flex-col sm:flex-row gap-3">
                <Link href="/ai-deneme" className="group inline-flex items-center gap-3 px-8 py-4 font-extrabold rounded-xl transition-all duration-300 shadow-xl text-[15px] cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                  <Camera className="w-5 h-5" /> Hemen Deneyin - Ücretsiz <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 text-[var(--text-primary)] font-bold rounded-xl transition-colors text-[15px]" style={{ border: '1px solid var(--border-light)' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#25D366]"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Yardım İsteyin
                </a>
              </div>
            </div>

            <div className="animate-on-scroll">
              <div className="rounded-2xl p-3 md:p-5" style={{ border: '1px solid var(--border)', background: 'var(--gold-glow)' }}>
                <div className="aspect-[4/3] rounded-xl flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-center px-6">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--stat-hover-bg)', border: '1px solid var(--gold-badge-border)' }}>
                      <Camera className="w-10 h-10 text-[var(--gold)]" />
                    </div>
                    <p className="text-base text-[var(--text-secondary)] font-semibold mb-1">Kapınızın fotoğrafını yükleyin</p>
                    <p className="text-sm text-[var(--text-muted)]">Telefonunuzla çektiğiniz herhangi bir fotoğraf olur</p>
                  </div>
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'var(--gold-hover-border)' }} />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'var(--gold-hover-border)' }} />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'var(--gold-hover-border)' }} />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'var(--gold-hover-border)' }} />
                </div>
                <div className="flex items-center justify-between mt-3 gap-2">
                  {[
                    { icon: Camera, label: "Fotoğraf Çek" },
                    { icon: MousePointerClick, label: "Kapı Seç" },
                    { icon: ImageIcon, label: "Sonucu Gör" },
                  ].map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-2 flex-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-badge-border)' }}>
                        <span className="text-[10px] font-bold text-[var(--gold-light)]">{idx+1}</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] hidden sm:inline">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BEFORE / AFTER ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-secondary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="animate-on-scroll badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>Montaj Örnekleri</span>
            <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '16px' }}>
              Önce &amp; <span className="text-gold">Sonra</span>
            </h2>
            <p className="animate-on-scroll text-[var(--text-secondary)] max-w-2xl mx-auto" style={{ marginTop: '12px' }}>
              Adana ve çevresindeki montaj çalışmalarımızdan örnekler. Kaydırarak farkı görün.
            </p>
          </div>

          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {galleryItems.map((item, idx) => (
                <div key={item.id || idx}>
                  {item.meta.beforeImage ? (
                    <BeforeAfter
                      before={item.meta.beforeImage}
                      after={item.src}
                      caption={item.alt || item.meta.doorModel || "Montaj Örneği"}
                      location={item.meta.location || ""}
                    />
                  ) : (
                    <div className="group">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden relative" style={{ border: '1px solid var(--border)' }}>
                        <Image src={item.src} alt={item.alt || "Galeri"} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                      </div>
                      {(item.alt || item.meta.location) && (
                        <div className="mt-3 px-1">
                          {item.alt && <p className="text-sm font-semibold text-[var(--text-primary)]">{item.alt}</p>}
                          {item.meta.location && <p className="text-xs text-[var(--text-muted)]">{item.meta.location}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
              <p className="text-[var(--text-secondary)]">Galeri fotoğrafları yakında eklenecek.</p>
            </div>
          )}

          <div className="mt-10 text-center animate-on-scroll">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-all wa-glow text-[15px]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Siz de Kapınızı Yenileyin
            </a>
          </div>
        </div>
      </section>

      {/* ─── TRUST MARQUEE ─── */}
      <section className="overflow-hidden" style={{ padding: '16px 0', background: 'linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-dark))' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[0,1].map((setIdx) => (
            <div key={setIdx} className="flex items-center gap-8 mr-8">
              {trustItems.map((text: string) => (
                <span key={`${setIdx}-${text}`} className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--bg-primary)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)' }} />{text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-primary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="animate-on-scroll badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>Neden Best Kapı?</span>
            <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '16px' }}>
              Adana&apos;da Çelik Kapıda <span className="text-gold">Fark Yaratıyoruz</span>
            </h2>
            <p className="animate-on-scroll text-[var(--text-secondary)] max-w-2xl mx-auto" style={{ marginTop: '12px' }}>
              Yılların tecrübesi ve yenilikçi teknolojilerimizle Adana ve çevresinde güvenli kapı çözümleri sunuyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {[Lock, Fingerprint, Thermometer, Wrench].map((Icon, idx) => {
              const f = features[idx] || { title: "", desc: "", stat: "", statLabel: "" };
              return { icon: Icon, ...f };
            }).map((f) => (
              <div key={f.title} className="animate-on-scroll card-gold group" style={{ padding: '28px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                  <div
                    className="flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                    style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)' }}
                  >
                    <f.icon className="w-[22px] h-[22px] text-[var(--gold)]" />
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-serif text-xl font-extrabold">{f.stat}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{f.statLabel}</div>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)] transition-colors" style={{ marginBottom: '8px' }}>{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-secondary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="animate-on-scroll badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>Süreç</span>
            <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '16px' }}>
              Nasıl <span className="text-gold">Çalışıyoruz?</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {[
              { icon: Phone, num: "01", title: "Bize Ulaşın", desc: "WhatsApp, telefon veya form ile iletişime geçin. Uzman danışmanlık hizmeti." },
              { icon: Eye, num: "02", title: "Keşif & Ölçüm", desc: "Uzman ekibimiz evinize gelir, ölçü alır ve size en uygun modeli önerir." },
              { icon: Wrench, num: "03", title: "Profesyonel Montaj", desc: "Seçtiğiniz kapı, uzman montaj ekibimiz tarafından kusursuz şekilde takılır." },
              { icon: BadgeCheck, num: "04", title: "Garanti & Destek", desc: "20 yıla kadar garanti ve 7/24 servis desteği ile yanınızdayız." },
            ].map((step) => (
              <div key={step.num} className="animate-on-scroll card-gold text-center relative overflow-hidden group" style={{ padding: '28px' }}>
                <div className="absolute font-serif font-extrabold transition-all duration-500" style={{ top: '12px', right: '16px', fontSize: '48px', color: 'var(--gold-glow)' }}>{step.num}</div>
                <div
                  className="flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300"
                  style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)', marginBottom: '16px' }}
                >
                  <step.icon className="w-6 h-6 text-[var(--gold)]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[var(--text-primary)]" style={{ marginBottom: '8px' }}>{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-primary)' }}>
        <div className="container-custom">
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="animate-on-scroll badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>Müşteri Yorumları</span>
            <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold" style={{ marginTop: '16px' }}>
              Adana&apos;da Güvenen <span className="text-gold">Aileler</span>
            </h2>
            <p className="animate-on-scroll text-[var(--text-secondary)]" style={{ marginTop: '12px' }}>Adana ve çevresinden müşterilerimizin deneyimleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto stagger-children">
            {[
              { name: "Ahmet Yılmaz", location: "Adana, Seyhan", text: "Titan Pro modelini aldık, motorlu kilit sistemi gerçekten çok kaliteli. Montaj ekibi son derece profesyoneldi. Adana'da çelik kapı denince Best Kapı diyorum artık.", rating: 5, model: "Titan Pro" },
              { name: "Elif Demir", location: "Adana, Çukurova", text: "WhatsApp'tan yazdık, hemen dönüş yaptılar. Kapıyı evinizde görün özelliği sayesinde kapımızın nasıl duracağını önceden gördük. Sonuç beklentimizin çok üstünde çıktı!", rating: 5, model: "Vega Modern" },
              { name: "Mehmet Kara", location: "Mersin, Yenişehir", text: "3 yıldır Nova Klasik kullanıyoruz, hiçbir sorun yaşamadık. Adana'nın sıcağında bile ısı yalıtımı fark yaratıyor. Kaliteli iş, teşekkürler.", rating: 5, model: "Nova Klasik" },
            ].map((review) => (
              <div key={review.name} className="animate-on-scroll card-gold" style={{ padding: '28px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                  <div className="flex gap-0.5">{Array.from({length:review.rating}).map((_,j)=><Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--gold-light)', background: 'var(--gold-badge-bg)', padding: '3px 10px', borderRadius: '9999px', border: '1px solid var(--stat-border)' }}>{review.model}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed" style={{ marginBottom: '20px' }}>&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3" style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <div
                    className="flex items-center justify-center text-xs font-bold"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}
                  >
                    {review.name.split(" ").map(n=>n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{review.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-on-scroll" style={{ marginTop: '40px' }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}</div>
              <span className="text-lg font-extrabold text-[var(--text-primary)]">4.9/5</span>
            </div>
            <span className="hidden sm:block" style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            <span className="text-sm text-[var(--text-muted)]">Google&apos;da <strong className="text-[var(--text-primary)]">yüzlerce olumlu değerlendirme</strong></span>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: '64px 0 80px', background: 'var(--bg-secondary)' }}>
        <div className="container-custom" style={{ maxWidth: '768px' }}>
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <span className="animate-on-scroll badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>SSS</span>
            <h2 className="animate-on-scroll font-serif text-3xl md:text-4xl font-extrabold" style={{ marginTop: '16px' }}>
              Sıkça Sorulan <span className="text-gold">Sorular</span>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="stagger-children">
            {faq.map((item: any) => (
              <details key={item.q} className="animate-on-scroll card-gold group">
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm text-[var(--text-primary)] hover:text-[var(--gold-light)] transition-colors" style={{ padding: '20px 24px' }}>
                  {item.q}
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 group-open:rotate-90 flex-shrink-0" style={{ marginLeft: '16px' }} />
                </summary>
                <div className="text-sm text-[var(--text-secondary)] leading-relaxed" style={{ padding: '0 24px 20px', marginTop: '-4px' }}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,92,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="container-custom relative z-10 text-center" style={{ padding: '56px 24px' }}>
          <h2 className="animate-on-scroll font-serif text-3xl md:text-5xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '16px' }}>
            <span className="text-gold">Hemen</span> Başlayın
          </h2>
          <p className="animate-on-scroll text-base text-[var(--text-muted)] max-w-lg mx-auto" style={{ marginBottom: '32px' }}>
            Adana ve çevre illerde keşif ve ölçüm hizmetimizden yararlanın. WhatsApp&apos;tan bize yazın, hızlıca dönüş yapalım.
          </p>
          <div className="animate-on-scroll flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-all wa-glow text-[15px]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp ile Hemen Yazın
            </a>
            <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all cta-gold text-[15px]" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
              <Phone className="w-4 h-4" /> {settings.phone}
            </a>
            <Link href="/iletisim" className="inline-flex items-center gap-2 px-8 py-4 text-[var(--text-primary)] font-bold rounded-xl transition-all text-[15px]" style={{ border: '1px solid var(--border-light)' }}>
              Teklif Formu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
