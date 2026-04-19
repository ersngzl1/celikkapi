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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>}>
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
  const [doorsList, setDoorsList] = useState(doors);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Load products from API
  useEffect(() => {
    const loadDoors = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setDoorsList(data);
        }
      } catch (error) {
        console.error("Error loading doors from API, using demo:", error);
        setDoorsList(doors);
      }
    };
    loadDoors();
  }, []);

  const filtered = doorsList
    .filter((door) => {
      if (category !== "all" && door.category !== category) return false;
      if (color !== "all" && door.color !== color) return false;
      return true;
    })
    .filter((d) =>
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
      <div ref={heroRef} className="relative -mt-[1px] overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-10 right-[20%] w-32 h-32 rounded-full blur-3xl animate-float" style={{ background: 'var(--gold-badge-bg)' }} />

        <div className="container-custom relative z-10" style={{ padding: '40px 24px 48px' }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="animate-slide-up badge-gold" style={{ marginBottom: '20px', display: 'inline-flex' }}>
                <Shield className="w-3.5 h-3.5" />
                {doors.length} Model Mevcut
              </span>
              <h1 className="animate-slide-up-delay-1 font-serif text-4xl md:text-6xl font-extrabold text-[var(--text-primary)]" style={{ lineHeight: '1.1' }}>
                Çelik Kapı<br />
                <span className="text-gold">Kataloğu</span>
              </h1>
              <p className="animate-slide-up-delay-2 text-[var(--text-muted)] text-sm md:text-base max-w-md leading-relaxed" style={{ marginTop: '16px' }}>
                Adana ve çevre illerde hizmet verdiğimiz tüm çelik kapı modellerimizi keşfedin.
              </p>
              <div className="animate-slide-up-delay-3 flex gap-3" style={{ marginTop: '24px' }}>
                <Link
                  href="/ai-deneme"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] cta-gold"
                  style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}
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
                    background: category === cat.value ? 'var(--stat-border)' : undefined,
                    borderColor: category === cat.value ? 'var(--gold-badge-border)' : undefined,
                  }}
                >
                  <span className="text-2xl font-extrabold transition-colors" style={{ color: category === cat.value ? 'var(--gold-light)' : 'rgba(255,255,255,0.35)' }}>
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
              className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background: category === cat.value ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--bg-card)',
                color: category === cat.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: category === cat.value ? 'none' : '1px solid var(--border)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-[56px] z-30 -mx-4 px-4 py-3 glass-dark mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Model veya seri ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark"
                style={{ paddingLeft: '44px' }}
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
                    className="input-dark appearance-none cursor-pointer"
                    style={{ paddingRight: '36px', paddingLeft: '16px' }}
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
                  className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold text-[var(--gold-light)] hover:text-[var(--gold)] rounded-xl transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Temizle
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: showFilters || hasActiveFilters ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--bg-card)',
                color: showFilters || hasActiveFilters ? 'var(--bg-primary)' : 'var(--text-primary)',
                border: showFilters || hasActiveFilters ? 'none' : '1px solid var(--border)',
              }}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && !showFilters && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />}
            </button>

            <div className="hidden sm:flex items-center gap-1 rounded-xl p-1" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
              <button
                onClick={() => setViewMode("grid")}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: viewMode === "grid" ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
                  color: viewMode === "grid" ? 'var(--bg-primary)' : 'var(--text-muted)',
                }}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className="p-2 rounded-lg transition-all"
                style={{
                  background: viewMode === "list" ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'transparent',
                  color: viewMode === "list" ? 'var(--bg-primary)' : 'var(--text-muted)',
                }}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}>
              {[
                { value: color, setter: setColor, options: colorOptions },
              ].map((filter, idx) => (
                <select
                  key={idx}
                  value={filter.value}
                  onChange={(e) => filter.setter(e.target.value)}
                  className="input-dark"
                >
                  {filter.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ))}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[var(--gold-light)]">
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
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Search className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <p className="text-lg font-semibold text-[var(--text-primary)]">Sonuç bulunamadı</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Farklı filtreler deneyebilirsiniz.</p>
              <button onClick={clearFilters} className="mt-4 px-6 py-2.5 text-sm font-bold rounded-xl transition-colors cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                Filtreleri Temizle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 stagger-children">
              {filtered.map((door) => (
                <div key={door.id} className="animate-on-scroll group">
                  <Link href={`/urun/${door.id}`} className="block relative rounded-2xl overflow-hidden h-[320px] sm:h-[380px] md:h-[440px] card-hover-glow" style={{ border: '1px solid var(--border)' }}>
                    <Image src={door.image} alt={door.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 group-hover:from-black/95 transition-colors duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className="text-[9px] md:text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-lg" style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}>{door.category}</span>
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)' }}>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: door.colorHex, border: '1px solid var(--border-light)' }} />
                        <span className="text-[9px] md:text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{door.color}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-10">
                      <p className="text-[9px] md:text-[11px] text-[var(--gold-light)] font-semibold uppercase tracking-widest">{door.series}</p>
                      <h3 className="font-serif text-sm md:text-xl font-bold" style={{ color: 'var(--text-primary)', marginTop: '6px', marginBottom: '10px' }}>{door.name}</h3>

                      <div className="flex gap-1.5 md:gap-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                        <Link href={`/ai-deneme?door=${door.id}`} className="flex-1 flex items-center justify-center gap-1 py-2.5 md:py-3 text-[10px] md:text-xs font-bold rounded-xl transition-all cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                          <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> AI Dene
                        </Link>
                        <button className="flex-1 flex items-center justify-center gap-1 py-2.5 md:py-3 text-[10px] md:text-xs font-bold rounded-xl transition-all" style={{ background: 'var(--bg-elevated)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                          <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> Detay
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 stagger-children">
              {filtered.map((door) => (
                <div key={door.id} className="animate-on-scroll group">
                  <div className="flex flex-col sm:flex-row items-stretch gap-0 rounded-2xl overflow-hidden transition-all duration-400" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <Link href={`/urun/${door.id}`} className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
                      <Image src={door.image} alt={door.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="192px" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm" style={{ background: 'var(--gold)', color: 'var(--bg-primary)' }}>{door.category}</span>
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs text-[var(--text-muted)] font-medium">{door.series}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: door.colorHex, border: '1px solid var(--border-light)' }} />
                            <span className="text-xs text-[var(--text-muted)]">{door.color}</span>
                          </div>
                        </div>
                        <Link href={`/urun/${door.id}`}>
                          <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold-light)] transition-colors">{door.name}</h3>
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2 leading-relaxed">{door.description}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <Link href={`/ai-deneme?door=${door.id}`} className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition-all hover:scale-[1.02] cta-gold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                          <Sparkles className="w-3.5 h-3.5" /> AI ile Dene
                        </Link>
                        <Link href={`/urun/${door.id}`} className="flex items-center gap-1.5 px-5 py-2.5 text-[var(--text-primary)] text-xs font-bold rounded-xl transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
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
        <div className="animate-on-scroll-scale relative overflow-hidden" style={{ marginTop: '64px', borderRadius: '24px', background: 'var(--hero-gradient)', border: '1px solid var(--border)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,92,0.08)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="relative z-10 text-center" style={{ padding: '48px 24px' }}>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '12px' }}>
              Aradığınız modeli bulamadınız mı?
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] max-w-md mx-auto" style={{ marginBottom: '28px' }}>
              150&apos;den fazla modelimiz ile size özel çözümler sunuyoruz
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto sm:max-w-none">
              <a href="https://wa.me/903221234567" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl text-sm transition-all hover:scale-[1.02] wa-glow">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a href="tel:+903221234567" className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 text-[var(--text-primary)] font-bold rounded-xl text-sm transition-all" style={{ border: '1px solid var(--border-light)' }}>
                <Phone className="w-4 h-4 flex-shrink-0" /> (0322) 123 45 67
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
