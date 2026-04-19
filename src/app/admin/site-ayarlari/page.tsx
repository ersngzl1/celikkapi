"use client";

import { useState } from "react";
import { Save, Phone, MapPin, Clock, Globe, Shield, CheckCircle2, AlertCircle } from "lucide-react";

interface SiteSettings {
  companyName: string;
  slogan: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  workingDays: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  tse: boolean;
  ce: boolean;
  iso: boolean;
  whatsappMessage: string;
}

const defaultSettings: SiteSettings = {
  companyName: "Best Kapı",
  slogan: "Adana Çelik Kapı - Güvenliğiniz Bizim İşimiz",
  phone: "(0322) 123 45 67",
  phone2: "(0322) 765 43 21",
  whatsapp: "903221234567",
  email: "info@bestkapi.com",
  address: "Yüreğir Sanayi Sitesi, Yüreğir / Adana",
  city: "Adana",
  workingHours: "09:00 - 18:00",
  workingDays: "Pazartesi - Cumartesi",
  googleMapsUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  metaTitle: "Best Kapı | Adana Çelik Kapı - Güvenliğiniz Bizim İşimiz",
  metaDescription: "Adana ve çevre illerde çelik kapı satış ve montaj. Best Pen güvencesiyle kaliteli çelik kapılar.",
  metaKeywords: "adana çelik kapı, çelik kapı adana, güvenlik kapısı",
  tse: true,
  ce: true,
  iso: true,
  whatsappMessage: "Merhabalar, çelik kapı hakkında bilgi almak istiyorum.",
};

export default function SiteAyarlariPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social" | "seo">("general");

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Kaydedilemedi!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Kaydedilirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const tabs = [
    { id: "general" as const, label: "Genel", icon: Shield },
    { id: "contact" as const, label: "İletişim", icon: Phone },
    { id: "social" as const, label: "Sosyal Medya", icon: Globe },
    { id: "seo" as const, label: "SEO", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Site Ayarları</h2>
          <p className="text-sm text-slate-500">Web sitenizin genel ayarlarını yönetin</p>
        </div>
        <button onClick={handleSave} disabled={loading || saved} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all disabled:opacity-50 ${
          saved ? "bg-green-600 text-white" : "bg-red-600 hover:bg-red-700 text-white"
        }`}>
          {loading ? <span className="inline-block animate-spin">⏳</span> : saved ? <><CheckCircle2 className="w-4 h-4" /> Kaydedildi</> : <><Save className="w-4 h-4" /> Kaydet</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id ? "bg-red-600 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}>
              <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {activeTab === "general" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Genel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Firma Adı</label>
                <input value={settings.companyName} onChange={(e) => update("companyName", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Slogan</label>
                <input value={settings.slogan} onChange={(e) => update("slogan", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Sertifikalar</label>
              <div className="flex gap-4">
                {(["tse", "ce", "iso"] as const).map(cert => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={settings[cert]} onChange={(e) => update(cert, e.target.checked)} className="rounded" />
                    <span className="text-sm text-slate-700 font-medium uppercase">{cert}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Telefon 1</label>
                <input value={settings.phone} onChange={(e) => update("phone", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Telefon 2</label>
                <input value={settings.phone2} onChange={(e) => update("phone2", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp Numarası</label>
                <input value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="903221234567" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">E-posta</label>
                <input value={settings.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp Oto Mesaj</label>
              <input value={settings.whatsappMessage} onChange={(e) => update("whatsappMessage", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Adres</label>
              <input value={settings.address} onChange={(e) => update("address", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Şehir</label>
                <input value={settings.city} onChange={(e) => update("city", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Çalışma Saatleri</label>
                <input value={settings.workingHours} onChange={(e) => update("workingHours", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Çalışma Günleri</label>
                <input value={settings.workingDays} onChange={(e) => update("workingDays", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Google Maps URL</label>
              <input value={settings.googleMapsUrl} onChange={(e) => update("googleMapsUrl", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="https://maps.google.com/..." />
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sosyal Medya</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Instagram</label>
                <input value={settings.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="https://instagram.com/bestkapi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Facebook</label>
                <input value={settings.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="https://facebook.com/bestkapi" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">YouTube</label>
                <input value={settings.youtubeUrl} onChange={(e) => update("youtubeUrl", e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="https://youtube.com/@bestkapi" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">SEO Ayarları</h3>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <strong>Not:</strong> Bu ayarlar sitenizin Google arama sonuçlarında nasıl görünecekini belirler. Dikkatli doldurun.
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Sayfa Başlığı (Title)</label>
              <input value={settings.metaTitle} onChange={(e) => update("metaTitle", e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              <p className="text-[10px] text-slate-400 mt-1">{settings.metaTitle.length}/60 karakter</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Açıklama (Description)</label>
              <textarea value={settings.metaDescription} onChange={(e) => update("metaDescription", e.target.value)}
                rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none" />
              <p className="text-[10px] text-slate-400 mt-1">{settings.metaDescription.length}/160 karakter</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Anahtar Kelimeler</label>
              <textarea value={settings.metaKeywords} onChange={(e) => update("metaKeywords", e.target.value)}
                rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
                placeholder="Virgul ile ayirin: adana celik kapi, guvenlik kapisi, ..." />
            </div>

            {/* Preview */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Google Önizleme</label>
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <div className="text-blue-700 text-base font-medium truncate">{settings.metaTitle || "Sayfa Başlığı"}</div>
                <div className="text-green-700 text-xs mt-0.5">www.bestkapi.com</div>
                <div className="text-sm text-slate-600 mt-1 line-clamp-2">{settings.metaDescription || "Sayfa açıklaması buraya gelecek..."}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
