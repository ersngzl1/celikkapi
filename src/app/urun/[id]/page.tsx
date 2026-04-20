"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Check,
  ChevronRight,
  Sparkles,
  Phone,
  Ruler,
  Weight,
  Lock,
  Thermometer,
  Award,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import BeforeAfter from "@/components/BeforeAfter";
import { useSettings } from "@/lib/useSettings";

export default function UrunDetay() {
  const params = useParams();
  const idOrSlug = params.id as string;
  const { settings } = useSettings();
  const [door, setDoor] = useState<any>(null);
  const [relatedDoors, setRelatedDoors] = useState<any[]>([]);
  const [galleryExamples, setGalleryExamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, allRes, galleryRes] = await Promise.all([
          fetch(`/api/products/${idOrSlug}`),
          fetch("/api/products"),
          fetch("/api/gallery"),
        ]);
        if (productRes.ok) {
          const data = await productRes.json();
          setDoor(data);
          if (allRes.ok) {
            const all = await allRes.json();
            setRelatedDoors(all.filter((d: any) => d.id !== data.id && d.category === data.category).slice(0, 3));
          }
        }
        if (galleryRes.ok) {
          const gallery = await galleryRes.json();
          if (Array.isArray(gallery)) {
            const parsed = gallery.map((item: any) => {
              let meta: any = {};
              try { meta = typeof item.category === "string" ? JSON.parse(item.category) : item.category || {}; } catch {}
              return { ...item, meta };
            });
            setGalleryExamples(parsed.filter((item: any) => item.meta.beforeImage && item.src).slice(0, 3));
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  if (!door) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-lg text-[var(--text-muted)]">Ürün bulunamadı.</p>
        <Link href="/katalog" className="mt-4 inline-flex items-center gap-2 text-[var(--gold-light)] text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kataloğa Dön
        </Link>
      </div>
    );
  }

  // Galeri resimleri - sadece gerçek kapı fotoğrafı
  const galleryImages = [
    { type: "main", src: door.image, label: "Ana Görünüm" },
  ];

  // relatedDoors loaded via useEffect above

  const specs = [
    { icon: Ruler, label: "Boyut", value: door.dimensions },
    { icon: Weight, label: "Ağırlık", value: door.weight },
    { icon: Lock, label: "Kilit Sistemi", value: door.lockSystem },
    { icon: Thermometer, label: "Yalıtım", value: door.insulation },
    { icon: Shield, label: "Malzeme", value: door.material },
    { icon: Award, label: "Garanti", value: door.warranty },
  ];

  return (
    <div className="min-h-screen" style={{ paddingTop: '16px', paddingBottom: '64px' }}>
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]" style={{ marginBottom: '24px' }}>
          <Link href="/katalog" className="hover:text-[var(--gold-light)] transition-colors font-medium">Katalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-secondary)]">{door.series}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--gold-light)] font-semibold">{door.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Carousel */}
          <div>
            <div className="sticky top-20 space-y-4">
              {/* Main Image */}
              <div className="aspect-[3/4] rounded-2xl relative overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <Image src={galleryImages[activeImageIdx].src} alt={galleryImages[activeImageIdx].label} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />

                {/* Navigation Arrows */}
                <button
                  onClick={() => setActiveImageIdx((activeImageIdx - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setActiveImageIdx((activeImageIdx + 1) % galleryImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)' }}
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>{activeImageIdx + 1} / {galleryImages.length}</span>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 px-2.5 py-1.5 rounded-full z-10" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: door.colorHex, border: '1px solid var(--border-light)' }} />
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{door.color}</span>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden transition-all ${activeImageIdx === idx ? 'ring-2 ring-[var(--gold)]' : 'opacity-60 hover:opacity-100'}`}
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <Image src={img.src} alt={img.label} width={64} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* AI try */}
              <Link
                href={`/ai-deneme?door=${door.id}`}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl transition-all duration-300 text-sm font-bold shadow-lg cta-gold"
                style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'var(--bg-primary)' }}
              >
                <Sparkles className="w-5 h-5" />
                Bu Kapıyı Evinizde Deneyin
              </Link>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Shield, text: `${door.warranty} Garanti` },
                  { icon: Clock, text: "Hızlı Teslimat" },
                  { icon: Award, text: "TSE Belgeli" },
                ].map((badge) => (
                  <div key={badge.text} className="card p-3 text-center">
                    <badge.icon className="w-4 h-4 text-[var(--gold)] mx-auto mb-1" />
                    <span className="text-[10px] font-semibold text-[var(--text-secondary)]">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div>
            <span className="badge-gold mb-3 inline-flex">{door.series}</span>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 mt-2">
              {door.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span className="text-sm text-[var(--text-muted)]">4.9 (128 değerlendirme)</span>
            </div>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-6">
              {door.description}
            </p>

            {/* Teklif Al box */}
            <div className="card-gold" style={{ padding: '20px', marginBottom: '24px' }}>
              <div className="text-lg font-bold text-[var(--gold-light)]" style={{ marginBottom: '8px' }}>
                Fiyat bilgisi için bizimle iletişime geçin
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  Taksit imkanı
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  Profesyonel montaj
                </span>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full" style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.15)' }}>
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                Stokta Mevcut
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-colors shadow-md wa-glow text-[15px]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                className="flex items-center justify-center gap-2 px-6 py-4 font-bold rounded-xl transition-colors cta-gold"
                style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}
              >
                <Phone className="w-4 h-4" />
                Hemen Ara
              </a>
              <Link
                href="/iletisim"
                className="flex items-center justify-center gap-2 px-6 py-4 text-[var(--text-primary)] font-bold rounded-xl transition-colors"
                style={{ border: '1px solid var(--border-light)' }}
              >
                Teklif Formu
              </Link>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {specs.map((spec) => (
                <div key={spec.label} className="card" style={{ padding: '16px' }}>
                  <spec.icon className="w-4 h-4 text-[var(--gold)] mb-2" />
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>{spec.label}</div>
                  <div className="text-sm text-[var(--text-primary)] font-semibold leading-snug">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>Özellikler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(door.features as string[]).map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust section */}
            <div className="card-gold" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>Güvenceler</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "TSE Belgeli Üretim",
                  "CE Sertifikalı",
                  "Keşif & Ölçüm",
                  "Profesyonel Montaj",
                  `${door.warranty} Garanti`,
                  "7/24 Servis Desteği",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Installation Examples - Before & After */}
        {galleryExamples.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'var(--gold-badge-bg)', border: '1px solid var(--gold-badge-border)' }}>
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <span className="text-xs font-semibold text-[var(--gold)]">Montaj Örnekleri</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                Evinizde Nasıl Görünecek?
              </h3>
              <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                Montaj çalışmalarımızdan örnekler. Kaydırarak öncesi ve sonrasını karşılaştırın.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryExamples.map((item, idx) => (
                <div key={item.id || idx} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div className="aspect-[3/4] relative">
                    <BeforeAfter before={item.meta.beforeImage} after={item.src} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h4 className="font-serif text-lg font-bold text-[var(--text-primary)] mb-2">{item.alt || item.meta.doorModel || "Montaj Örneği"}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.meta.location ? `${item.meta.location} — ` : ""}Kaydırarak öncesi ve sonrasını karşılaştırın
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {relatedDoors.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Benzer <span className="text-gold">Modeller</span>
              </h3>
              <Link href="/katalog" className="text-sm font-semibold text-[var(--gold-light)] hover:text-[var(--gold)] flex items-center gap-1">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedDoors.map((d) => (
                <Link key={d.id} href={`/urun/${d.slug || d.id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden card group-hover:-translate-y-1 transition-all duration-500">
                    <div className="aspect-[3/4] relative overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                      <Image src={d.image} alt={d.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-lg font-bold text-[var(--text-primary)]">{d.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-[var(--text-secondary)]">{d.series}</span>
                        <span className="text-xs font-semibold text-[var(--gold-light)]">Detay <ChevronRight className="w-3 h-3 inline" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
