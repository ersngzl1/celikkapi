"use client";

import { useState, useRef, useCallback, Suspense } from "react";
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
} from "lucide-react";
import { doors } from "@/data/doors";
import Image from "next/image";

export default function AIDeneme() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 pb-16"><div className="container-custom text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: 'var(--gold)' }} /></div></div>}>
      <AIDenemeContent />
    </Suspense>
  );
}

function AIDenemeContent() {
  const searchParams = useSearchParams();
  const doorParam = searchParams.get("door");
  const preselectedDoorId = doorParam ? Number(doorParam) : null;
  const preselectedDoor = preselectedDoorId ? doors.find(d => d.id === preselectedDoorId) : null;
  const initialDoorId = preselectedDoor ? preselectedDoor.id : doors[0].id;

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoor, setSelectedDoor] = useState<number>(initialDoorId);
  const [showDoorPanel, setShowDoorPanel] = useState(!preselectedDoor);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Dosya 10MB'dan büyük olamaz!");
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
  };

  const currentDoor = doors.find((d) => d.id === selectedDoor) || doors[0];

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

  const generateImage = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setError(null);
    setResultImage(null);

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

      if (!res.ok) {
        setError(data.error || "Görsel üretimi başarısız oldu.");
        return;
      }

      if (data.output) {
        setResultImage(data.output);
      } else {
        setError("Sonuç görseli alınamadı.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setUploadedImage(null);
    setResultImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen" style={{ paddingBottom: '64px' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,165,92,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,165,92,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(200,165,92,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,92,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container-custom relative z-10" style={{ padding: '40px 24px 48px' }}>
          <span className="badge-gold" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Sparkles className="w-3.5 h-3.5" />
            AI ile Kapınızı Görün
          </span>

          {preselectedDoor ? (
            <>
              <h1 className="animate-slide-up font-serif text-3xl md:text-5xl font-extrabold text-[var(--text-primary)]" style={{ lineHeight: '1.1', maxWidth: '700px' }}>
                <span className="text-gold">{preselectedDoor.name}</span> Evinizde Nasıl Durur?
              </h1>
              <p className="animate-slide-up-delay-1 text-sm md:text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
                Evinizin kapı fotoğrafını yükleyin, <strong className="text-[var(--gold-light)]">{preselectedDoor.name}</strong> modelini yapay zeka ile evinizde görün!
              </p>
              <div className="animate-slide-up-delay-2 flex items-center gap-4 card-gold" style={{ marginTop: '20px', padding: '16px', maxWidth: '400px' }}>
                <div className="rounded-lg overflow-hidden relative flex-shrink-0" style={{ width: '56px', height: '72px' }}>
                  <Image src={preselectedDoor.image} alt={preselectedDoor.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif font-bold text-[var(--text-primary)] truncate">{preselectedDoor.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{preselectedDoor.series} &bull; {preselectedDoor.color}</p>
                </div>
                <button
                  onClick={() => setShowDoorPanel(!showDoorPanel)}
                  className="flex items-center gap-1 text-xs font-semibold transition-colors flex-shrink-0"
                  style={{ color: 'var(--gold-light)', padding: '6px 10px', borderRadius: '8px', background: 'var(--gold-badge-bg)' }}
                >
                  Değiştir {showDoorPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="animate-slide-up font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)]" style={{ lineHeight: '1.1' }}>
                Kapı <span className="text-gold">Nasıl Durur?</span> Hemen Görün!
              </h1>
              <p className="animate-slide-up-delay-1 text-sm md:text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
                Evinizin kapı fotoğrafını yükleyin, beğendiğiniz kapı modelini seçin. Yapay zeka kapıyı evinize yerleştirsin!
              </p>
              <div className="animate-slide-up-delay-2 flex flex-wrap gap-3" style={{ marginTop: '20px' }}>
                {[
                  { n: "1", text: "Fotoğraf yükleyin" },
                  { n: "2", text: "Kapı modeli seçin" },
                  { n: "3", text: "AI sonucu görün!" },
                ].map((s) => (
                  <div key={s.n} className="flex items-center gap-2" style={{ padding: '8px 14px', borderRadius: '10px', background: 'var(--gold-badge-bg)', border: '1px solid var(--gold-badge-border)' }}>
                    <span className="flex items-center justify-center font-bold text-xs" style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>{s.n}</span>
                    <span className="text-sm font-medium text-[var(--gold-light)]">{s.text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: '24px' }}>
        <div className={`grid grid-cols-1 ${showDoorPanel ? "xl:grid-cols-[1fr_360px]" : ""} gap-6`}>
          {/* Main Area */}
          <div className={showDoorPanel ? "order-2 xl:order-1" : ""}>
            {!uploadedImage ? (
              <div
                className={`relative rounded-2xl overflow-hidden transition-all duration-300`}
                style={{
                  aspectRatio: '4/3',
                  border: isDragging ? '2px solid var(--gold)' : '2px dashed var(--border-light)',
                  background: isDragging ? 'var(--gold-glow)' : 'var(--bg-card)',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ padding: '32px' }}>
                  <div className="flex items-center justify-center" style={{
                    width: '72px', height: '72px', borderRadius: '20px', marginBottom: '24px',
                    background: isDragging ? 'var(--stat-hover-bg)' : 'var(--gold-glow)',
                    border: '1px solid var(--stat-border)',
                  }}>
                    <Upload className="w-8 h-8" style={{ color: isDragging ? 'var(--gold)' : 'var(--gold-dark)' }} />
                  </div>
                  <p className="text-base font-semibold text-[var(--text-primary)] text-center" style={{ marginBottom: '8px' }}>
                    {isDragging ? "Bırakın..." : "Ev Giriş Fotoğrafınızı Yükleyin"}
                  </p>
                  <p className="text-sm text-[var(--text-muted)] text-center" style={{ marginBottom: '24px' }}>
                    Sürükleyip bırakın veya dosya seçin
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm font-bold rounded-xl transition-all cta-gold"
                    style={{ padding: '12px 24px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Fotoğraf Seç
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                  <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '16px' }}>JPG, PNG, WebP &bull; Maks. 10MB</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Images Grid */}
                <div className={`grid ${resultImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
                  {/* Uploaded */}
                  <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: 'var(--glass-bg)', color: 'white', backdropFilter: 'blur(8px)' }}>
                      Yüklenen Fotoğraf
                    </div>
                    <img src={uploadedImage} alt="Yüklenen fotoğraf" className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                  </div>

                  {/* Result */}
                  {resultImage && (
                    <div className="relative rounded-2xl overflow-hidden" style={{ border: '2px solid var(--gold)' }}>
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)' }}>
                        <Sparkles className="w-3 h-3" /> AI Sonucu
                      </div>
                      <img src={resultImage} alt="AI sonucu" className="w-full object-cover" style={{ aspectRatio: '4/3' }} />
                      <a
                        href={resultImage}
                        download={`bestkapi-${currentDoor.name}.png`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-lg transition-colors"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                      >
                        <Download className="w-3.5 h-3.5" /> İndir
                      </a>
                    </div>
                  )}
                </div>

                {/* Processing */}
                {isProcessing && (
                  <div className="flex flex-col items-center justify-center card-gold" style={{ padding: '32px' }}>
                    <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'var(--gold)', marginBottom: '16px' }} />
                    <p className="text-sm font-medium text-[var(--text-primary)]">AI görsel üretiyor...</p>
                    <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>Bu işlem 30-60 saniye sürebilir</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl" style={{ padding: '16px', background: 'var(--gold-glow)', border: '1px solid var(--gold-badge-border)' }}>
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)', marginTop: '2px' }} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{error}</p>
                      {error.includes("throttled") || error.includes("rate limit") || error.includes("credit") ? (
                        <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>Replicate hesabınıza kredi yükleyin veya biraz bekleyip tekrar deneyin.</p>
                      ) : error.includes("ayarlanmamis") || error.includes("ayarlanmamış") ? (
                        <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>Admin panelinden Replicate API anahtarınızı girin.</p>
                      ) : (
                        <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '4px' }}>Tekrar deneyin. Sorun devam ederse admin panelini kontrol edin.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={generateImage}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 font-bold rounded-xl transition-all cta-gold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '14px 24px', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', color: 'var(--bg-primary)', fontSize: '15px' }}
                  >
                    {isProcessing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Üretiliyor...</>
                    ) : resultImage ? (
                      <><RotateCcw className="w-4 h-4" /> Tekrar Üret</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> AI ile Üret</>
                    )}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    style={{ padding: '14px 24px', border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
                  >
                    Farklı Fotoğraf
                  </button>
                  <button
                    onClick={resetAll}
                    disabled={isProcessing}
                    className="rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    style={{ padding: '14px 24px', color: 'var(--text-muted)' }}
                  >
                    <X className="w-4 h-4 inline" style={{ marginRight: '4px' }} /> Sıfırla
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                </div>

                {/* Selected Door Info */}
                <div className="flex items-center gap-4 card-gold" style={{ padding: '16px' }}>
                  <div className="rounded-lg overflow-hidden relative flex-shrink-0" style={{ width: '56px', height: '72px' }}>
                    <Image src={currentDoor.image} alt={currentDoor.name} width={56} height={72} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{currentDoor.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{currentDoor.series} &bull; {currentDoor.color}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Door Selection Panel */}
          {showDoorPanel && (
            <div className={preselectedDoor ? "" : "order-1 xl:order-2"}>
              <div className="xl:sticky xl:top-24">
                <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--gold)', fontWeight: 700, marginBottom: '16px' }}>
                  Kapı Modeli Seçin
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-2 gap-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  {doors.map((door) => {
                    const isSelected = selectedDoor === door.id;
                    return (
                      <button
                        key={door.id}
                        onClick={() => selectDoor(door.id)}
                        className="group text-left transition-all duration-300"
                        style={{
                          padding: '12px',
                          borderRadius: '14px',
                          border: isSelected ? '1px solid rgba(200, 165, 92, 0.3)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--gold-badge-bg)' : 'var(--bg-card)',
                          boxShadow: isSelected ? '0 0 20px var(--gold-glow)' : 'none',
                        }}
                      >
                        <div className="rounded-lg relative overflow-hidden" style={{ aspectRatio: '3/4', background: 'var(--bg-secondary)', marginBottom: '10px' }}>
                          <Image src={door.image} alt={door.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <p className="text-xs font-semibold truncate" style={{ color: isSelected ? 'var(--gold-light)' : 'var(--text-primary)' }}>
                          {door.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{door.series}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="card-gold" style={{ marginTop: '16px', padding: '16px' }}>
                  <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]" style={{ marginBottom: '4px' }}>{currentDoor.name}</h4>
                  <p className="text-xs text-[var(--text-muted)]" style={{ marginBottom: '12px' }}>{currentDoor.series}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-[var(--text-muted)]">Kalınlık:</span> <span className="text-[var(--text-secondary)]">{currentDoor.thickness}</span></div>
                    <div><span className="text-[var(--text-muted)]">Renk:</span> <span className="text-[var(--text-secondary)]">{currentDoor.color}</span></div>
                    <div><span className="text-[var(--text-muted)]">Kilit:</span> <span className="text-[var(--text-secondary)]">{currentDoor.lockSystem}</span></div>
                    <div><span className="text-[var(--text-muted)]">Boyut:</span> <span className="text-[var(--text-secondary)]">{currentDoor.dimensions}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp CTA */}
        <div className="relative overflow-hidden" style={{ marginTop: '48px', borderRadius: '20px', background: 'var(--hero-gradient)', border: '1px solid var(--border)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,92,0.08)_0%,transparent_70%)]" />
          <div className="relative z-10 text-center" style={{ padding: '48px 24px' }}>
            <h3 className="font-serif text-xl md:text-2xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '12px' }}>
              Beğendiğiniz kapıyı buldunuz mu?
            </h3>
            <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto" style={{ marginBottom: '24px' }}>
              WhatsApp&apos;tan bize yazın, fiyat ve montaj bilgisi alalım.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/903221234567?text=Merhabalar%2C%20%C3%A7elik%20kap%C4%B1%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all wa-glow"
                style={{ padding: '14px 28px', fontSize: '15px' }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp ile Hemen Yazın
              </a>
              <a href="tel:+903221234567" className="flex items-center gap-2 text-[var(--text-primary)] font-bold rounded-xl transition-all text-sm"
                style={{ padding: '14px 24px', border: '1px solid var(--border-light)' }}>
                <Phone className="w-4 h-4" style={{ color: 'var(--gold)' }} /> (0322) 123 45 67
              </a>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginTop: '80px' }}>
          <h3 className="text-center font-serif text-2xl md:text-3xl font-extrabold text-[var(--text-primary)]" style={{ marginBottom: '40px' }}>
            Nasıl <span className="text-gold">Çalışır?</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Fotoğraf Çekin", desc: "Telefonunuzla evinizin kapısının fotoğrafını çekin ve yukarıdaki alana yükleyin." },
              { step: "02", title: "Kapı Seçin", desc: "Sağ panelden beğendiğiniz kapı modelini seçin." },
              { step: "03", title: "AI Üretsin!", desc: "Yapay zeka seçtiğiniz kapıyı evinize yerleştirsin. Beğenirseniz bizi arayın!" },
            ].map((item) => (
              <div key={item.step} className="text-center card-gold" style={{ padding: '24px' }}>
                <div className="flex items-center justify-center mx-auto" style={{
                  width: '48px', height: '48px', borderRadius: '14px', marginBottom: '16px',
                  background: 'var(--gold-badge-bg)', border: '1px solid var(--stat-border)',
                }}>
                  <span className="font-serif text-lg font-bold text-[var(--gold)]">{item.step}</span>
                </div>
                <h4 className="font-serif text-base font-semibold text-[var(--text-primary)]" style={{ marginBottom: '8px' }}>{item.title}</h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
