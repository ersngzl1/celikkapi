"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Upload,
  Sparkles,
  X,
  Image as ImageIcon,
  Loader2,
  Phone,
  ChevronDown,
  ChevronUp,
  Download,
  RotateCcw,
  AlertTriangle,
  Camera,
  Search,
} from "lucide-react";
import { doors as fallbackDoors } from "@/data/doors";
import Image from "next/image";
import { useSettings } from "@/lib/useSettings";

export default function AIDeneme() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16"><div className="container-custom text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--gold)' }} /></div></div>}>
      <AIDenemeContent />
    </Suspense>
  );
}

function AIDenemeContent() {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const doorParam = searchParams.get("door");
  const preselectedDoorId = doorParam ? Number(doorParam) : null;
  const [doors, setDoors] = useState<any[]>([]);
  const [doorsLoading, setDoorsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setDoors(data);
        else setDoors(fallbackDoors);
      })
      .catch(() => setDoors(fallbackDoors))
      .finally(() => setDoorsLoading(false));
  }, []);

  const preselectedDoor = preselectedDoorId ? doors.find(d => d.id === preselectedDoorId) : null;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<number>(0);
  const [showDoorPanel, setShowDoorPanel] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync selectedDoor when doors load
  useEffect(() => {
    if (doors.length === 0) return;
    if (preselectedDoorId) {
      const found = doors.find(d => d.id === preselectedDoorId);
      if (found) {
        setSelectedDoor(found.id);
        setShowDoorPanel(false);
        return;
      }
    }
    setSelectedDoor(doors[0]?.id || 0);
  }, [doors, preselectedDoorId]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");

  // Kategori listesi
  const categories = (() => {
    const cats = new Set(doors.map(d => d.category).filter(Boolean));
    return Array.from(cats);
  })();

  // Filtrelenmiş kapılar
  const filteredDoors = doors.filter(d => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const matchSearch = !searchQuery || d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d.series?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Dosya 10MB'dan buyuk olamaz!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }, [handleFile]);

  const selectDoor = (doorId: number) => {
    setSelectedDoor(doorId);
    setResultImage(null);
    setError(null);
    setTimeout(() => {
      uploadAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const currentDoor = doors.find((d) => d.id === selectedDoor) || doors[0];

  if (doorsLoading || doors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--gold)' }} />
      </div>
    );
  }

  const resizeImage = (dataUri: string, maxSize = 1024): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
          else { w = Math.round(w * maxSize / h); h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUri;
    });
  };

  const progressMessages = [
    "Fotograf analiz ediliyor...",
    "Kapi olculeri hesaplaniyor...",
    "Renk uyumu ayarlaniyor...",
    "Perspektif duzeltiliyor...",
    "Kapi modeli yerlestiriliyor...",
    "Golgeler ekleniyor...",
    "Isik ayarlari yapiliyor...",
    "Son retuslar yapiliyor...",
    "Neredeyse hazir...",
  ];

  const generateImage = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setError(null);
    setResultImage(null);
    setProgress(0);
    setProgressMsg(progressMessages[0]);

    let currentProgress = 0;
    let msgIndex = 0;
    const progressInterval = setInterval(() => {
      const increment = currentProgress < 30 ? 3 : currentProgress < 60 ? 2 : currentProgress < 85 ? 1 : 0.3;
      currentProgress = Math.min(currentProgress + increment, 92);
      setProgress(currentProgress);
      const newIndex = Math.min(Math.floor(currentProgress / 11), progressMessages.length - 1);
      if (newIndex !== msgIndex) {
        msgIndex = newIndex;
        setProgressMsg(progressMessages[msgIndex]);
      }
    }, 500);

    try {
      const resizedUserImage = await resizeImage(uploadedImage);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doorImage: currentDoor.image,
          userImage: resizedUserImage,
          doorName: currentDoor.name,
        }),
      });
      const data = await res.json();
      clearInterval(progressInterval);

      if (!res.ok) {
        setProgress(0);
        setError(data.error || "Gorsel uretimi basarisiz oldu.");
        return;
      }
      if (data.output) {
        setProgress(100);
        setProgressMsg("Tamamlandi!");
        await new Promise(r => setTimeout(r, 500));
        setResultImage(data.output);
      } else {
        setProgress(0);
        setError("Sonuc gorseli alinamadi.");
      }
    } catch {
      clearInterval(progressInterval);
      setProgress(0);
      setError("Baglanti hatasi. Lutfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setResultImage(null);
    setError(null);
  };

  const waMessageForDoor = `Merhaba, ${currentDoor?.name || "kapi"} modeli hakkinda bilgi almak istiyorum. AI ile denedim ve begeniyorum.`;

  return (
    <div className="min-h-screen" style={{ paddingBottom: '64px' }}>
      {/* Hero — kompakt */}
      <div className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="container-custom relative z-10" style={{ padding: '32px 24px 36px' }}>
          <span className="badge-gold" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <Sparkles className="w-3.5 h-3.5" />
            AI ile Kapinizi Gorun
          </span>

          {preselectedDoor ? (
            <>
              <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-white" style={{ lineHeight: '1.1', maxWidth: '700px' }}>
                <span className="text-gold">{preselectedDoor.name}</span> Evinizde Nasil Durur?
              </h1>
              <p className="text-sm max-w-lg" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                Fotograf yukleyin, yapay zeka kapiyi evinize yerlestirsin!
              </p>
              <div className="flex items-center gap-4" style={{ marginTop: '16px', padding: '12px 16px', maxWidth: '380px', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="rounded-lg overflow-hidden relative flex-shrink-0" style={{ width: '48px', height: '64px' }}>
                  <Image src={preselectedDoor.image} alt={preselectedDoor.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{preselectedDoor.name}</p>
                  <p className="text-xs text-white/50">{preselectedDoor.series}</p>
                </div>
                <button onClick={() => setShowDoorPanel(!showDoorPanel)}
                  className="text-xs font-semibold flex-shrink-0"
                  style={{ color: 'var(--gold-light)', padding: '6px 10px', borderRadius: '8px', background: 'var(--gold-badge-bg)' }}>
                  Degistir {showDoorPanel ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-extrabold text-white" style={{ lineHeight: '1.1' }}>
                Kapi <span className="text-gold">Nasil Durur?</span> Hemen Gorun!
              </h1>
              <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '12px' }}>
                Kapi modelini secin, evinizin fotografini yukleyin, yapay zeka kapiyi evinize yerlestirsin!
              </p>
            </>
          )}
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '20px' }}>
        <div className={`grid grid-cols-1 ${showDoorPanel ? "xl:grid-cols-[1fr_380px]" : ""} gap-5`}>

          {/* ============ UPLOAD AREA ============ */}
          <div ref={uploadAreaRef} className={showDoorPanel ? "order-2 xl:order-1" : ""}>

            {/* Secili kapi bilgisi — upload ustunde */}
            {currentDoor && !resultImage && (
              <div className="flex items-center gap-3" style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="rounded-lg overflow-hidden relative flex-shrink-0" style={{ width: '40px', height: '52px' }}>
                  <Image src={currentDoor.image} alt={currentDoor.name} width={40} height={52} className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate">{currentDoor.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{currentDoor.series}</p>
                </div>
                {!uploadedImage && (
                  <span className="text-xs text-[var(--gold)] font-medium flex-shrink-0">Secili</span>
                )}
              </div>
            )}

            {!uploadedImage ? (
              /* ---- Upload Zone ---- */
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  aspectRatio: '4/3',
                  border: isDragging ? '2px solid var(--gold)' : '2px dashed var(--border-light)',
                  background: isDragging ? 'var(--gold-glow)' : 'var(--bg-card)',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: '24px' }}>
                  <div className="flex items-center justify-center" style={{
                    width: '64px', height: '64px', borderRadius: '18px', marginBottom: '16px',
                    background: isDragging ? 'var(--stat-hover-bg)' : 'var(--gold-glow)',
                    border: '1px solid var(--stat-border)',
                  }}>
                    <Camera className="w-7 h-7" style={{ color: isDragging ? 'var(--gold)' : 'var(--gold-dark)' }} />
                  </div>
                  <p className="text-base font-bold text-[var(--text-primary)] text-center" style={{ marginBottom: '4px' }}>
                    {isDragging ? "Birakin..." : "Evinizin Fotografini Yukleyin"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] text-center" style={{ marginBottom: '20px' }}>
                    Kapiyi gosterecek sekilde fotografini cekin
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2 text-sm font-bold rounded-xl transition-all cta-gold"
                      style={{ padding: '12px 22px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF' }}
                    >
                      <Camera className="w-4 h-4" />
                      Fotograf Cek
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 text-sm font-bold rounded-xl transition-all"
                      style={{ padding: '12px 22px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Galeriden Sec
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="hidden" />
                </div>
              </div>
            ) : (
              /* ---- Uploaded + Result ---- */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className={`grid ${resultImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
                  {/* Yuklenen */}
                  <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                      Yuklenen Fotograf
                    </div>
                    <img src={uploadedImage} alt="Yuklenen" className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                  </div>

                  {/* AI Sonucu */}
                  {resultImage && (
                    <div className="relative rounded-2xl overflow-hidden" style={{ border: '2px solid var(--gold)' }}>
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF' }}>
                        <Sparkles className="w-3 h-3" /> AI Sonucu
                      </div>
                      <img src={resultImage} alt="AI sonucu" className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                    </div>
                  )}
                </div>

                {/* ====== SONUC BUTONLARI ====== */}
                {resultImage && (
                  <div className="rounded-2xl" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                      <div className="rounded-lg overflow-hidden relative flex-shrink-0" style={{ width: '44px', height: '56px' }}>
                        <Image src={currentDoor.image} alt={currentDoor.name} width={44} height={56} className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">{currentDoor.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{currentDoor.series}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waMessageForDoor)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all"
                        style={{ padding: '14px 16px', fontSize: '14px' }}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp ile Yaz
                      </a>
                      {/* Telefon */}
                      <a
                        href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                        className="flex items-center justify-center gap-2 font-bold rounded-xl transition-all"
                        style={{ padding: '14px 16px', fontSize: '14px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF' }}
                      >
                        <Phone className="w-4 h-4" />
                        Hemen Ara
                      </a>
                      {/* Indir */}
                      <a
                        href={resultImage}
                        download={`bestkapi-${currentDoor.name}.png`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 font-bold rounded-xl transition-all"
                        style={{ padding: '14px 16px', fontSize: '14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                      >
                        <Download className="w-4 h-4" />
                        Gorseli Indir
                      </a>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="card-gold" style={{ padding: '24px' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{progressMsg}</p>
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--gold)' }}>{Math.round(progress)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light))',
                        transition: 'width 0.5s ease-out',
                      }} />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] text-center" style={{ marginTop: '10px' }}>
                      Bu islem 30-60 saniye surebilir
                    </p>
                  </div>
                )}

                {/* Hata */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl" style={{ padding: '16px', background: 'var(--gold-glow)', border: '1px solid var(--gold-badge-border)' }}>
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)', marginTop: '2px' }} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{error}</p>
                      <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>Tekrar deneyin. Sorun devam ederse bizi arayin.</p>
                    </div>
                  </div>
                )}

                {/* Aksiyon Butonlari */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={generateImage}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 font-bold rounded-xl transition-all cta-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '14px 20px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: '#FFFFFF', fontSize: '15px', minWidth: '160px' }}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uretiliyor...</>
                    ) : resultImage ? (
                      <><RotateCcw className="w-4 h-4" /> Tekrar Uret</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> AI ile Uret</>
                    )}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}
                      className="rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ padding: '14px 16px', border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => cameraInputRef.current?.click()} disabled={isProcessing}
                      className="rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ padding: '14px 16px', border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
                      <Camera className="w-4 h-4" />
                    </button>
                    <button onClick={resetAll} disabled={isProcessing}
                      className="rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileInput} className="hidden" />
                </div>
              </div>
            )}
          </div>

          {/* ============ KAPI SECIM PANELI ============ */}
          {showDoorPanel && (
            <div className={preselectedDoor ? "" : "order-1 xl:order-2"}>
              <div className="xl:sticky xl:top-24" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Baslik + Arama */}
                <div>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, marginBottom: '10px' }}>
                    Kapi Modeli Secin
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Kapi ara..."
                      className="w-full text-sm rounded-xl"
                      style={{ padding: '10px 12px 10px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Kategori Tablari */}
                {categories.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    <button
                      onClick={() => setActiveCategory("all")}
                      className="text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                      style={{
                        padding: '8px 14px',
                        background: activeCategory === "all" ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--bg-card)',
                        color: activeCategory === "all" ? '#FFFFFF' : 'var(--text-secondary)',
                        border: activeCategory === "all" ? 'none' : '1px solid var(--border)',
                      }}
                    >
                      Tumu ({doors.length})
                    </button>
                    {categories.map(cat => {
                      const count = doors.filter(d => d.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                          style={{
                            padding: '8px 14px',
                            background: activeCategory === cat ? 'linear-gradient(135deg, var(--gold), var(--gold-dark))' : 'var(--bg-card)',
                            color: activeCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                            border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                          }}
                        >
                          {cat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Kapi Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-2 gap-2.5 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  {filteredDoors.map((door) => {
                    const isSelected = selectedDoor === door.id;
                    return (
                      <button
                        key={door.id}
                        onClick={() => selectDoor(door.id)}
                        className="group text-left transition-all duration-200"
                        style={{
                          padding: '8px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--gold-badge-bg)' : 'var(--bg-card)',
                        }}
                      >
                        <div className="rounded-lg relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'var(--bg-secondary)', marginBottom: '6px' }}>
                          <Image src={door.image} alt={door.name} fill className="object-cover" sizes="100px" />
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(200,165,92,0.15)' }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)' }}>
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold truncate" style={{ color: isSelected ? 'var(--gold)' : 'var(--text-primary)' }}>
                          {door.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {filteredDoors.length === 0 && (
                  <div className="text-center" style={{ padding: '24px' }}>
                    <p className="text-sm text-[var(--text-muted)]">Sonuc bulunamadi</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Alt CTA — sadece sonuc yoksa */}
        {!resultImage && (
          <div className="relative overflow-hidden" style={{ marginTop: '40px', borderRadius: '16px', background: 'var(--hero-gradient)', border: '1px solid var(--border)' }}>
            <div className="relative z-10 text-center" style={{ padding: '32px 20px' }}>
              <h3 className="font-serif text-lg md:text-xl font-extrabold text-white" style={{ marginBottom: '8px' }}>
                Yardima mi ihtiyaciniz var?
              </h3>
              <p className="text-sm text-white/60 max-w-sm mx-auto" style={{ marginBottom: '20px' }}>
                Kapi secimi konusunda yardim almak icin bize ulasin.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all"
                  style={{ padding: '12px 24px', fontSize: '14px' }}>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex items-center gap-2 text-white font-bold rounded-xl transition-all text-sm"
                  style={{ padding: '12px 20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Phone className="w-4 h-4" style={{ color: 'var(--gold)' }} /> {settings.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
