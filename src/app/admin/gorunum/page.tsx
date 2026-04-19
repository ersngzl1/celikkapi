"use client";

import { useState, useEffect } from "react";
import {
  Upload, Monitor, Smartphone, Eye,
  Check, RotateCcw, Save, Image as ImageIcon,
  Layout, Paintbrush, X, RefreshCw, Type,
} from "lucide-react";

const colorPresets = [
  { name: "Klasik Kirmizi", primary: "#dc2626", secondary: "#1e293b", accent: "#ef4444" },
  { name: "Koyu Bordo", primary: "#991b1b", secondary: "#0f172a", accent: "#b91c1c" },
  { name: "Modern Lacivert", primary: "#1e40af", secondary: "#1e293b", accent: "#3b82f6" },
  { name: "Elegant Siyah", primary: "#18181b", secondary: "#09090b", accent: "#dc2626" },
];

export default function GorunumPage() {
  const [activeTab, setActiveTab] = useState<"logo" | "colors" | "layout">("logo");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#dc2626");
  const [secondaryColor, setSecondaryColor] = useState("#1e293b");
  const [accentColor, setAccentColor] = useState("#ef4444");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("+903221234567");
  const [whatsappMessage, setWhatsappMessage] = useState("Merhabalar, çelik kapı hakkında bilgi almak istiyorum.");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => {
        if (data.logo) setLogoPreview(data.logo);
        if (data.favicon) setFaviconPreview(data.favicon);
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.secondaryColor) setSecondaryColor(data.secondaryColor);
        if (data.accentColor) setAccentColor(data.accentColor);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
        if (data.whatsappMessage) setWhatsappMessage(data.whatsappMessage);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (file: File, type: "logo" | "favicon") => {
    setUploading(type);
    try {
      // Dosyayi base64'e cevir
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const ext = file.name.split(".").pop() || "png";

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, type, ext }),
      });
      const data = await res.json();

      if (data.success) {
        const cacheBuster = `${data.path}?t=${Date.now()}`;
        if (type === "logo") setLogoPreview(cacheBuster);
        else setFaviconPreview(cacheBuster);
      } else {
        alert(data.error || "Yukleme hatasi!");
      }
    } catch {
      alert("Yukleme hatasi!");
    } finally {
      setUploading(null);
    }
  };

  const handleRemove = async (type: "logo" | "favicon") => {
    if (type === "logo") setLogoPreview(null);
    else setFaviconPreview(null);

    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [type]: "" }),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryColor, secondaryColor, accentColor, whatsappNumber, whatsappMessage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Kaydetme hatasi!");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "logo" as const, label: "Logo & Favicon", icon: ImageIcon },
    { id: "colors" as const, label: "Renkler", icon: Paintbrush },
    { id: "layout" as const, label: "Sayfa Ayarlari", icon: Layout },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gorunum Ayarlari</h2>
          <p className="text-sm text-slate-500 mt-0.5">Logo, renkler ve sayfa ayarlari</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Kaydedildi!" : saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logo Tab */}
      {activeTab === "logo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-1">Site Logosu</h3>
            <p className="text-xs text-slate-500 mb-5">Onerilen boyut: 200x60px, PNG veya SVG</p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-red-300 transition-colors">
              {logoPreview ? (
                <div className="relative inline-block">
                  <img src={logoPreview} alt="Logo" className="max-h-16 mx-auto" />
                  <button
                    onClick={() => handleRemove("logo")}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium mb-1">Logo yukleyin</p>
                  <p className="text-xs text-slate-400">PNG, SVG veya JPG - Max 2MB</p>
                </>
              )}
            </div>

            <div className="mt-4">
              <label className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors cursor-pointer ${uploading === "logo" ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading === "logo" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Yukleniyor...</>
                ) : (
                  <><Upload className="w-4 h-4" /> {logoPreview ? "Logo Degistir" : "Logo Sec"}</>
                )}
                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) { alert("Dosya 2MB'dan buyuk olamaz!"); return; }
                    handleUpload(file, "logo");
                  }
                  e.target.value = "";
                }} />
              </label>
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-1">Favicon</h3>
            <p className="text-xs text-slate-500 mb-5">Tarayici sekmesinde gorunen ikon - 32x32px</p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-red-300 transition-colors">
              {faviconPreview ? (
                <div className="relative inline-block">
                  <img src={faviconPreview} alt="Favicon" className="w-10 h-10 mx-auto" />
                  <button
                    onClick={() => handleRemove("favicon")}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 font-medium mb-1">Favicon yukleyin</p>
                  <p className="text-xs text-slate-400">PNG veya ICO - 32x32px</p>
                </>
              )}
            </div>

            <div className="mt-4">
              <label className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors cursor-pointer ${uploading === "favicon" ? "opacity-50 pointer-events-none" : ""}`}>
                {uploading === "favicon" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Yukleniyor...</>
                ) : (
                  <><Upload className="w-4 h-4" /> {faviconPreview ? "Favicon Degistir" : "Favicon Sec"}</>
                )}
                <input type="file" accept="image/png,image/x-icon,image/jpeg" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 1 * 1024 * 1024) { alert("Dosya 1MB'dan buyuk olamaz!"); return; }
                    handleUpload(file, "favicon");
                  }
                  e.target.value = "";
                }} />
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Onizleme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Masaustu Navbar</span>
                </div>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-8 object-contain" />
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">B</span>
                        </div>
                        <span className="text-white font-bold text-sm">Best Kapi</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-medium">Tarayici Sekmesi</span>
                </div>
                <div className="bg-slate-100 rounded-lg p-3">
                  <div className="flex items-center gap-2 bg-white rounded px-3 py-1.5 max-w-[250px]">
                    {faviconPreview ? (
                      <img src={faviconPreview} alt="Favicon" className="w-4 h-4" />
                    ) : (
                      <div className="w-4 h-4 rounded bg-red-600 flex items-center justify-center">
                        <span className="text-white text-[6px] font-bold">B</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-700 truncate">Best Kapi - Celik Kapi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === "colors" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-1">Renk Sablonlari</h3>
            <p className="text-xs text-slate-500 mb-5">Hazir renk sablonlarindan secin</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                    setAccentColor(preset.accent);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                    primaryColor === preset.primary ? "border-red-500 shadow-md" : "border-slate-200"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-5">Ozel Renkler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Ana Renk", value: primaryColor, set: setPrimaryColor },
                { label: "Ikincil Renk", value: secondaryColor, set: setSecondaryColor },
                { label: "Vurgu Renk", value: accentColor, set: setAccentColor },
              ].map((c) => (
                <div key={c.label}>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">{c.label}</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={c.value} onChange={(e) => c.set(e.target.value)} className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer" />
                    <input type="text" value={c.value} onChange={(e) => c.set(e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Onizleme</h3>
            <div className="rounded-xl p-6" style={{ backgroundColor: secondaryColor }}>
              <h4 className="text-lg font-bold text-white mb-2">Ornek Baslik</h4>
              <p className="text-sm text-white/70 mb-4">Bu metin ikincil renk uzerine yazilmistir.</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>Ana Buton</button>
                <button className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: accentColor }}>Vurgu Buton</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === "layout" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-5">WhatsApp Ayarlari</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">WhatsApp Numarasi</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm"
                  placeholder="+90 322 123 45 67"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Varsayilan Mesaj</label>
                <textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
