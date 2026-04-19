"use client";

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
} from "lucide-react";
import { getDoorById, doors } from "@/data/doors";
import Image from "next/image";

export default function UrunDetay() {
  const params = useParams();
  const id = Number(params.id);
  const door = getDoorById(id);

  if (!door) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-lg text-[var(--text-muted)]">Ürün bulunamadı.</p>
        <Link href="/katalog" className="mt-4 inline-flex items-center gap-2 text-[var(--blue-dark)] text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> Kataloğa Dön
        </Link>
      </div>
    );
  }

  const relatedDoors = doors.filter((d) => d.id !== door.id && d.category === door.category).slice(0, 3);

  const specs = [
    { icon: Ruler, label: "Boyut", value: door.dimensions },
    { icon: Weight, label: "Ağırlık", value: door.weight },
    { icon: Lock, label: "Kilit Sistemi", value: door.lockSystem },
    { icon: Thermometer, label: "Yalıtım", value: door.insulation },
    { icon: Shield, label: "Malzeme", value: door.material },
    { icon: Award, label: "Garanti", value: door.warranty },
  ];

  return (
    <div className="min-h-screen pt-4 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
          <Link href="/katalog" className="hover:text-[var(--blue-dark)] transition-colors font-medium">Katalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--text-secondary)]">{door.series}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[var(--blue-dark)] font-semibold">{door.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <div>
            <div className="sticky top-20 space-y-4">
              <div className="aspect-[3/4] rounded-2xl border border-[var(--carbon-border)] relative overflow-hidden shadow-sm">
                <Image src={door.image} alt={door.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-[var(--blue-dark)] text-white font-bold shadow-sm">{door.category}</span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full z-10">
                  <div className="w-4 h-4 rounded-full border border-[var(--carbon-border)]" style={{ backgroundColor: door.colorHex }} />
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{door.color}</span>
                </div>
              </div>

              {/* AI try */}
              <Link
                href={`/ai-deneme?door=${door.id}`}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 text-white rounded-xl transition-all duration-300 text-sm font-bold shadow-lg cta-glow"
                style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}
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
                  <div key={badge.text} className="warm-card p-3 text-center">
                    <badge.icon className="w-4 h-4 text-[var(--blue-dark)] mx-auto mb-1" />
                    <span className="text-[10px] font-semibold text-[var(--text-secondary)]">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div>
            <span className="badge-blue mb-3 inline-flex">{door.series}</span>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3 mt-2">
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
            <div className="premium-card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(220,38,38,0.04) 0%, rgba(220,38,38,0.02) 100%)', borderColor: 'rgba(220,38,38,0.12)' }}>
              <div className="text-lg font-bold" style={{ color: '#B91C1C', marginBottom: '8px' }}>
                Fiyat bilgisi için bizimle iletişime geçin
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Taksit imkanı
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Profesyonel montaj
                </span>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Stokta Mevcut
              </span>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="https://wa.me/903221234567?text=Merhabalar%2C%20%C3%A7elik%20kap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BD5A] transition-colors shadow-md wa-glow text-[15px]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a
                href="tel:+903221234567"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors cta-glow"
              >
                <Phone className="w-4 h-4" />
                Hemen Ara
              </a>
              <Link
                href="/iletisim"
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[var(--carbon-border)] text-[var(--text-primary)] font-bold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                Teklif Formu
              </Link>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {specs.map((spec) => (
                <div key={spec.label} className="warm-card p-4">
                  <spec.icon className="w-4 h-4 text-[var(--blue-dark)] mb-2" />
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 font-semibold">{spec.label}</div>
                  <div className="text-sm text-[var(--text-primary)] font-semibold leading-snug">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-sm uppercase tracking-[0.15em] text-[var(--blue-dark)] font-body font-bold mb-4">Özellikler</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {door.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-[var(--blue)] flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust section */}
            <div className="premium-card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#DC2626', fontWeight: 700, marginBottom: '16px' }}>Güvenceler</h4>
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
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedDoors.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Benzer <span className="text-blue-gradient">Modeller</span>
              </h3>
              <Link href="/katalog" className="text-sm font-semibold text-[var(--blue-dark)] hover:text-[var(--blue)] flex items-center gap-1">
                Tümü <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedDoors.map((d) => (
                <Link key={d.id} href={`/urun/${d.id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden bg-[var(--carbon-elevated)] border border-[var(--carbon-border)] group-hover:border-[var(--blue)]/30 group-hover:shadow-lg transition-all duration-500 group-hover:-translate-y-1">
                    <div className="aspect-[3/4] bg-gradient-to-b from-[var(--carbon-surface)] to-[#E8F0FE] relative overflow-hidden">
                      <Image src={d.image} alt={d.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-display text-lg font-bold text-[var(--text-primary)]">{d.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-[var(--text-secondary)]">{d.series}</span>
                        <span className="text-xs font-semibold text-[var(--accent)]">Detay <ChevronRight className="w-3 h-3 inline" /></span>
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
