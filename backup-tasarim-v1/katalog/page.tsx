"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  LayoutList,
  Eye,
  Shield,
  Sparkles,
  Phone,
  ArrowRight,
  ChevronDown,
  Filter,
  Loader2,
} from "lucide-react";
import { doors, categories, colorOptions, filterDoors } from "@/data/doors";
import Image from "next/image";

export default function KatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>}>
      <KatalogContent />
    </Suspense>
  );
}

function KatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [category, setCategory] = useState(initialCategory);
  const [color, setColor] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const filtered = filterDoors(category, color).filter((d) =>
    search
      ? d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.series.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const hasActiveFilters =
    category !== "all" || color !== "all" || search !== "";

  const clearFilters = () => {
    setCategory("all");
    setColor("all");
    setSearch("");
  };

  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.05 }
    );
    el.querySelectorAll(".animate-on-scroll, .animate-on-scroll-scale").forEach((child) =>
      observer.observe(child)
    );
    return () => observer.disconnect();
  }, [filtered]);

  const categoryStats = categories.slice(1).map(cat => ({
    ...cat,
    count: doors.filter(d => d.category === cat.value).length
  }));

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div ref={heroRef} className="relative -mt-[1px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A5F 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 right-[20%] w-32 h-32 rounded-full bg-red-500/10 blur-3xl animate-float" />

        <div className="container-custom relative z-10" style={{ padding: '40px 24px 48px' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm" style={{ marginBottom: '20px' }}>
                <Shield className="w-3.5 h-3.5 text-red-400" />
                {doors.length} Model Mevcut
              </span>
              <h1 className="animate-slide-up-delay-1 font-display text-4xl md:text-6xl font-extrabold text-white" style={{ lineHeight: '1.1' }}>
                Çelik Kapı<br />
                <span className="text-red-400">Kataloğu</span>
              </h1>
              <p className="animate-slide-up-delay-2 text-white/50 text-sm md:text-base max-w-md leading-relaxed" style={{ marginTop: '16px' }}>
                Adana ve çevre illerde hizmet verdiğimiz tüm çelik kapı modellerimizi keşfedin.
              </p>
              <div className="animate-slide-up-delay-3 flex gap-3" style={{ marginTop: '24px' }}>
                <Link
                  href="/ai-deneme"
                  className="flex items-center gap-2 px-5 py-3 text-white rounded-xl text-sm font-bold transition-all hover:scale-[1.02] cta-glow"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  AI ile Dene
                </Link>
                <a
                  href="https://wa.me/903221234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-sm font-bold transition-all hover:scale-[1.02] wa-glow"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Category quick stats */}
            <div className="hidden md:grid grid-cols-2 gap-3 animate-slide-up-delay-2">
              {categoryStats.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className="stat-card group flex items-center gap-3 text-left"
                  style={{
                    padding: '14px 20px',
                    background: category === cat.value ? 'rgba(220, 38, 38, 0.15)' : undefined,
                    borderColor: category === cat.value ? 'rgba(220, 38, 38, 0.3)' : undefined,
                  }}
                >
                  <span className="text-2xl font-extrabold transition-colors" style={{ color: category === cat.value ? '#F87171' : 'rgba(255,255,255,0.35)' }}>
                    {cat.count}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: category === cat.value ? 'white' : 'rgba(255,255,255,0.6)' }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '20px' }}>
        {/* Mobile category chips */}
        <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-hide" style={{ paddingBottom: '12px', marginBottom: '16px' }}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                category === cat.value
                  ? "bg-red-600 text-white"
                  : "bg-white border border-[var(--carbon-border)] text-[var(--text-secondary)] hover:border-red-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-[56px] z-30 -mx-4 px-4 py-3 glass border-b border-[var(--carbon-border)] mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Model veya seri ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[var(--carbon-border)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
              />
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {[
                { value: category, setter: setCategory, options: categories },
                { value: color, setter: setColor, options: colorOptions },
              ].map((filter, idx) => (
                <div key={idx} className="relative">
                  <select
                    value={filter.value}
                    onChange={(e) => filter.setter(e.target.value)}
                    className="appearance-none pl-4 pr-9 py-3 bg-white border border-[var(--carbon-border)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-red-400 cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    {filter.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                </div>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Temizle
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                showFilters || hasActiveFilters
                  ? "bg-red-600 text-white"
                  : "bg-white border border-[var(--carbon-border)] text-[var(--text-primary)] hover:border-slate-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>

            <div className="hidden sm:flex items-center gap-1 border border-[var(--carbon-border)] rounded-xl p-1 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-red-600 text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-red-600 text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-3 pt-3 border-t border-[var(--carbon-border)] flex flex-col gap-2">
              {[
                { value: color, setter: setColor, options: colorOptions },
              ].map((filter, idx) => (
                <select
                  key={idx}
                  value={filter.value}
                  onChange={(e) => filter.setter(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[var(--carbon-border)] rounded-xl text-sm text-[var(--text-primary)]"
                >
                  {filter.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ))}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-600">
                  <X className="w-3.5 h-3.5" /> Filtreleri Temizle
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-[var(--text-muted)]">
            <span className="text-[var(--text-primary)] font-bold">{filtered.length}</span> ürün bulundu
            {hasActiveFilters && <span className="text-[var(--text-muted)]"> (filtrelendi)</span>}
          </p>
        </div>

        {/* Products */}
        <div ref={resultsRef}>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">Sonuç bulunamadı</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Farklı filtreler deneyebilirsiniz.</p>
              <button onClick={clearFilters} className="mt-4 px-6 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 font-bold rounded-xl transition-colors">
                Filtreleri Temizle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 stagger-children">
              {filtered.map((door) => (
                <div key={door.id} className="animate-on-scroll group">
                  <div className="relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px] md:h-[440px] card-hover-glow">
                    <Image src={door.image} alt={door.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5 group-hover:from-black/90 transition-colors duration-500" />

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white font-bold shadow-lg">{door.category}</span>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-white/30" style={{ backgroundColor: door.colorHex }} />
                        <span className="text-[9px] md:text-[10px] font-medium text-white/90">{door.color}</span>
                      </div>
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-10">
                      <p className="text-[9px] md:text-[11px] text-white/50 font-semibold uppercase tracking-widest">{door.series}</p>
                      <h3 className="font-display text-sm md:text-xl font-bold text-white mt-0.5 md:mt-1 mb-2.5 md:mb-4 group-hover:text-red-100 transition-colors">{door.name}</h3>

                      {/* Buttons - slide up on hover */}
                      <div className="flex gap-1.5 md:gap-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <Link href={`/ai-deneme?door=${door.id}`} className="flex-1 flex items-center justify-center gap-1 py-2.5 md:py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] md:text-xs font-bold rounded-xl transition-all">
                          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> AI Dene
                        </Link>
                        <Link href={`/urun/${door.id}`} className="flex-1 flex items-center justify-center gap-1 py-2.5 md:py-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold rounded-xl transition-all border border-white/15">
                          <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> Detay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 stagger-children">
              {filtered.map((door) => (
                <div key={door.id} className="animate-on-scroll group">
                  <div className="flex flex-col sm:flex-row items-stretch gap-0 bg-white rounded-2xl border border-[var(--carbon-border)] overflow-hidden hover:border-red-200 hover:shadow-lg transition-all duration-400">
                    <Link href={`/urun/${door.id}`} className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
                      <Image src={door.image} alt={door.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="192px" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600 text-white font-bold shadow-sm">{door.category}</span>
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-[var(--text-muted)] font-medium">{door.series}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: door.colorHex }} />
                            <span className="text-xs text-[var(--text-muted)]">{door.color}</span>
                          </div>
                        </div>
                        <Link href={`/urun/${door.id}`}>
                          <h3 className="font-display text-xl font-bold text-[var(--text-primary)] group-hover:text-red-600 transition-colors">{door.name}</h3>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">{door.description}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <Link href={`/ai-deneme?door=${door.id}`} className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all hover:scale-[1.02]">
                          <Sparkles className="w-3.5 h-3.5" /> AI ile Dene
                        </Link>
                        <Link href={`/urun/${door.id}`} className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[var(--text-primary)] text-xs font-bold rounded-xl transition-all">
                          <Eye className="w-3.5 h-3.5" /> Detay Gör
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="animate-on-scroll-scale relative overflow-hidden" style={{ marginTop: '64px', borderRadius: '24px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1E3A5F 100%)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.12)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="relative z-10 text-center" style={{ padding: '48px 24px' }}>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white" style={{ marginBottom: '12px' }}>
              Aradığınız modeli bulamadınız mı?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-white/50 max-w-md mx-auto" style={{ marginBottom: '28px' }}>
              150&apos;den fazla modelimiz ile size özel çözümler sunuyoruz
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none">
              <a href="https://wa.me/903221234567" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.02] wa-glow">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a href="tel:+903221234567" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl text-sm transition-all stat-card">
                <Phone className="w-4 h-4 flex-shrink-0" /> (0322) 123 45 67
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
