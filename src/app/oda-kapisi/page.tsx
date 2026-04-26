"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import {
  Search, Grid3X3, LayoutList, Eye, Shield, Sparkles, Phone, ArrowRight,
  ChevronDown, Loader2, DoorOpen,
} from "lucide-react";
import { Door } from "@/data/doors";
import Image from "next/image";
import { useSettings } from "@/lib/useSettings";

export default function OdaKapisiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>}>
      <OdaKapisiContent />
    </Suspense>
  );
}

function OdaKapisiContent() {
  const { settings } = useSettings();
  const [category, setCategory] = useState("all");
  const [color, setColor] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [doorsList, setDoorsList] = useState<(Door & { slug?: string })[]>([]);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([{ value: "all", label: "Tümü" }]);
  const [colorOptions, setColorOptions] = useState<{ value: string; label: string }[]>([{ value: "all", label: "Tüm Renkler" }]);
  const [loading, setLoading] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // Only room doors
          const roomDoors = data.filter((p: any) => p.category === "oda" || p.category === "Oda Kapısı");
          setDoorsList(roomDoors);
          // Derive categories
          const cats = [...new Set(roomDoors.map((d: any) => d.category))].filter(Boolean).sort() as string[];
          setCategories([
            { value: "all", label: "Tümü" },
            ...cats.map((c: string) => ({ value: c, label: c })),
          ]);
          // Derive colors
          const uniqueColors = [...new Set(roomDoors.map((d: any) => d.color))].filter(Boolean).sort() as string[];
          setColorOptions([
            { value: "all", label: "Tüm Renkler" },
            ...uniqueColors.map((c: string) => ({ value: c, label: c })),
          ]);
        }
      } catch {}
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const filtered = doorsList
    .filter((door) => {
      if (category !== "all" && door.category !== category) return false;
      if (color !== "all" && door.color !== color) return false;
      return true;
    })
    .filter((d) =>
      search ? d.name.toLowerCase().includes(search.toLowerCase()) || d.series.toLowerCase().includes(search.toLowerCase()) : true
    );

  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); }); },
      { threshold: 0.05 }
    );
    el.querySelectorAll(".animate-on-scroll, .animate-on-scroll-scale").forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [filtered]);

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;
  const hasProducts = doorsList.length > 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" /></div>;
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative -mt-[1px] overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="container-custom relative z-10" style={{ padding: '40px 24px 48px' }}>
          <div className="max-w-xl">
            <span className="badge-gold" style={{ marginBottom: '20px', display: 'inline-flex' }}>
              <DoorOpen className="w-3.5 h-3.5" />
              {hasProducts ? `${doorsList.length} Model Mevcut` : "Yakında"}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-white" style={{ lineHeight: '1.1' }}>
              Oda Kapısı<br />
              <span className="text-gold">Modelleri</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed" style={{ marginTop: '16px' }}>
              {hasProducts
                ? "Adana ve çevre illerde hizmet verdiğimiz tüm oda kapısı modellerimizi keşfedin."
                : "Oda kapısı modellerimiz çok yakında burada olacak. Bizi takipte kalın!"}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '20px' }}>
        {hasProducts ? (
          <>
            {/* Search & Filter */}
            <div className="sticky top-[56px] z-30 -mx-4 px-4 py-3 glass-dark mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text" placeholder="Model veya seri ara..." value={search}
                    onChange={(e) => setSearch(e.target.value)} className="input-dark" style={{ paddingLeft: '44px' }}
                  />
                </div>
                <div className="hidden lg:flex items-center gap-2">
                  {[
                    { value: category, setter: setCategory, options: categories },
                    { value: color, setter: setColor, options: colorOptions },
                  ].map((filter, idx) => (
                    <div key={idx} className="relative">
                      <select value={filter.value} onChange={(e) => filter.setter(e.target.value)}
                        className="input-dark appearance-none cursor-pointer" style={{ paddingRight: '36px', paddingLeft: '16px' }}>
                        {filter.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                  {[{ mode: "grid" as const, icon: Grid3X3 }, { mode: "list" as const, icon: LayoutList }].map(({ mode, icon: Icon }) => (
                    <button key={mode} onClick={() => setViewMode(mode)} className="p-2 rounded-md transition-all"
                      style={{ background: viewMode === mode ? 'var(--bg-card)' : 'transparent', color: viewMode === mode ? 'var(--gold)' : 'var(--text-muted)' }}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div ref={resultsRef}>
              <p className="text-sm text-[var(--text-muted)]" style={{ marginBottom: '20px' }}>
                <span className="text-[var(--text-primary)] font-bold">{filtered.length}</span> ürün bulundu
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
                  <p className="text-lg font-semibold text-[var(--text-primary)]">Sonuç bulunamadı</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Farklı filtreler deneyebilirsiniz.</p>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 stagger-children" : "flex flex-col gap-4 stagger-children"}>
                  {filtered.map((door) => (
                    <div key={door.id} className="animate-on-scroll group">
                      <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <Link href={`/urun/${door.slug || door.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'linear-gradient(145deg, #F4F5F7 0%, #ECEDF0 50%, #E4E5EA 100%)' }}>
                          <Image src={door.image} alt={door.name} fill className="object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-lg" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                          <span className="absolute top-2.5 left-2.5 text-[9px] md:text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm" style={{ background: 'var(--gold)', color: '#FFFFFF' }}>{door.category}</span>
                        </Link>
                        <div className="p-3 md:p-4">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: door.colorHex, border: '1px solid var(--border-light)' }} />
                            <span className="text-[10px] md:text-[11px] text-[var(--text-muted)] font-medium truncate">{door.color}</span>
                          </div>
                          <Link href={`/urun/${door.slug || door.id}`}>
                            <h3 className="font-serif text-sm md:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors leading-tight truncate">{door.name}</h3>
                          </Link>
                          <p className="text-[10px] md:text-[11px] text-[var(--text-muted)] mt-0.5">{door.series}</p>
                          <div className="flex gap-1.5 mt-3">
                            <Link href={`/urun/${door.slug || door.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 md:py-2.5 text-[10px] md:text-xs font-bold rounded-lg transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF' }}>
                              <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" /> İncele
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Coming Soon State */
          <div ref={resultsRef} className="text-center" style={{ padding: '80px 24px' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <DoorOpen className="w-10 h-10 text-[var(--gold)]" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '12px' }}>
              Oda Kapısı Modelleri Yakında
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-md mx-auto leading-relaxed" style={{ marginBottom: '32px' }}>
              Oda kapısı koleksiyonumuz hazırlanıyor. En yeni modellerimizden haberdar olmak için bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl text-sm transition-all wa-glow">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Yazın
              </a>
              <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center justify-center gap-2 px-7 py-3.5 text-[var(--text-primary)] font-bold rounded-xl text-sm transition-all" style={{ border: '1px solid var(--border)' }}>
                <Phone className="w-4 h-4" /> {settings.phone}
              </a>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="animate-on-scroll-scale relative overflow-hidden" style={{ marginTop: '64px', borderRadius: '24px', background: 'var(--hero-gradient)', border: '1px solid var(--border)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,92,0.08)_0%,transparent_70%)]" />
          <div className="relative z-10 text-center" style={{ padding: '48px 24px' }}>
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold text-white" style={{ marginBottom: '12px' }}>
              Size özel kapı çözümleri
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-white/60 max-w-md mx-auto" style={{ marginBottom: '28px' }}>
              Çelik kapı ve oda kapısı modellerimiz hakkında bilgi almak için bize ulaşın
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/celik-kapi" className="flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF' }}>
                <Shield className="w-4 h-4" /> Çelik Kapı Modelleri
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl text-sm transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                <Phone className="w-4 h-4" /> Bize Ulaşın
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
