"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ChevronDown, ChevronRight, Plus, Trash2, RotateCcw } from "lucide-react";

// Default content for each section - used as fallback when DB is empty
const DEFAULTS: Record<string, Record<string, any>> = {
  home: {
    hero: {
      badges: ["Best Pen Güvencesi", "Adana'nın Tercihi", "TSE Belgeli"],
      titleLine1: "Adana'da",
      titleLine2: "Çelik Kapı",
      subtitle: "Best Kapı ile evinizin güvenliğini ve estetiğini bir üst seviyeye taşıyın. Adana ve çevre illerde kaliteli çelik kapı çözümleri.",
    },
    stats: [
      { value: "150+", label: "Mutlu Müşteri" },
      { value: "20 Yıl", label: "Sektör Tecrübesi" },
      { value: "4.9/5", label: "Müşteri Puanı" },
      { value: "7/24", label: "Destek Hattı" },
    ],
    features: [
      { title: "Üstün Güvenlik", desc: "Çok noktalı kilit sistemi ve özel çelik alaşım ile eviniz her an güvende.", stat: "%99.8", statLabel: "Güvenlik Oranı" },
      { title: "Akıllı Teknoloji", desc: "Parmak izi, şifre ve kartlı giriş seçenekleriyle modern güvenlik çözümleri.", stat: "3+", statLabel: "Kilit Teknolojisi" },
      { title: "Tam İzolasyon", desc: "Isı, ses ve su yalıtımlı özel dolgu malzemesiyle dört mevsim konfor.", stat: "%85", statLabel: "Enerji Tasarrufu" },
      { title: "Profesyonel Montaj", desc: "Uzman ekibimiz tarafından aynı gün kurulum ve 2 yıl montaj garantisi.", stat: "1 Gün", statLabel: "Kurulum Süresi" },
    ],
    process: [
      { title: "Bize Ulaşın", desc: "Telefon, WhatsApp veya formla iletişime geçin." },
      { title: "Keşif & Ölçüm", desc: "Uzman ekibimiz evinize gelerek ücretsiz ölçüm yapar." },
      { title: "Profesyonel Montaj", desc: "Kapınız aynı gün monte edilir." },
      { title: "Garanti & Destek", desc: "2 yıl garanti ve 7/24 teknik destek." },
    ],
    faq: [
      { q: "Çelik kapı montajı ne kadar sürer?", a: "Profesyonel ekibimiz ortalama 2-3 saat içinde montajı tamamlar." },
      { q: "Çelik kapı fiyatları neye göre belirlenir?", a: "Model, kilit sistemi, boyut ve özel taleplere göre fiyatlandırma yapılır." },
      { q: "Garanti süresi ne kadardır?", a: "Tüm çelik kapılarımız 2 yıl üretici garantisi altındadır." },
      { q: "Hangi bölgelere hizmet veriyorsunuz?", a: "Adana, Mersin, Hatay, Osmaniye ve Tarsus'a hizmet veriyoruz." },
      { q: "Eski kapımı değiştirebilir misiniz?", a: "Evet, eski kapınızı söküp yeni çelik kapınızı aynı gün monte ediyoruz." },
    ],
    trust: ["TSE Belgeli Üretim", "CE Sertifikalı", "ISO 9001 Kalite", "Ücretsiz Keşif", "Aynı Gün Montaj", "2 Yıl Garanti", "7/24 Destek", "Kredi Kartına Taksit"],
  },
  about: {
    stats: [
      { value: "150+", label: "Kapı Modeli" },
      { value: "20+ Yıl", label: "Sektör Tecrübesi" },
      { value: "4.9/5", label: "Müşteri Memnuniyeti" },
      { value: "7/24", label: "Servis Desteği" },
    ],
    story: [
      "Best Pen firmasının güçlü altyapısı ve uzun yıllara dayanan tecrübesi ile kurulan Best Kapı, Adana ve çevre illerde çelik kapı sektöründe kalite ve güvenin adresi olmayı hedeflemektedir.",
      "Adana'nın iklim koşullarına uygun, yüksek ısı yalıtımlı ve dayanıklı çelik kapı modellerimiz ile evinizin güvenliğini en üst seviyeye taşıyoruz. TSE, CE ve ISO 9001 belgelerimiz ile kalite standartlarımızı belgeleyen bir firma olarak, her kapıda aynı titizliği gösteriyoruz.",
      "Profesyonel montaj ekibimiz, satış sonrası servis ve garanti hizmetlerimiz ile müşterilerimizin yanında olmaya devam ediyoruz.",
    ],
    values: [
      { title: "TSE Belgeli Üretim", desc: "Tüm kapılarımız TSE standartlarına uygun olarak üretilmektedir." },
      { title: "Profesyonel Montaj Ekibi", desc: "Deneyimli montaj ekibimiz ile kapınız kusursuz bir şekilde takılır." },
      { title: "Satış Sonrası Destek", desc: "7/24 servis desteği ve 20 yıla kadar garanti ile her zaman yanınızdayız." },
      { title: "Geniş Ürün Yelpazesi", desc: "150'den fazla model ile her bütçeye ve zevke uygun çelik kapı seçenekleri." },
      { title: "Bölgesel Güç", desc: "Adana, Mersin, Hatay ve Osmaniye'de güçlü hizmet ağı." },
    ],
    serviceAreas: [
      { city: "Adana Merkez", detail: "Seyhan, Çukurova, Yüreğir, Sarıçam" },
      { city: "Mersin", detail: "Yenişehir, Toroslar, Mezitli" },
      { city: "Hatay", detail: "Antakya, İskenderun, Defne" },
      { city: "Osmaniye", detail: "Merkez, Kadirli, Düziçi" },
      { city: "Tarsus", detail: "Mersin / Tarsus" },
      { city: "Ceyhan", detail: "Adana / Ceyhan" },
    ],
  },
};

type SectionKey = string;

interface TabConfig {
  key: string;
  label: string;
  sections: { key: string; label: string; type: "array" | "object" | "string-array" }[];
}

const TABS: TabConfig[] = [
  {
    key: "home",
    label: "Ana Sayfa",
    sections: [
      { key: "hero", label: "Hero Bölümü", type: "object" },
      { key: "stats", label: "İstatistikler", type: "array" },
      { key: "features", label: "Neden Best Kapı? Kartları", type: "array" },
      { key: "process", label: "Süreç Adımları", type: "array" },
      { key: "faq", label: "Sıkça Sorulan Sorular", type: "array" },
      { key: "trust", label: "Güven Bandı Yazıları", type: "string-array" },
    ],
  },
  {
    key: "about",
    label: "Hakkımızda",
    sections: [
      { key: "stats", label: "İstatistikler", type: "array" },
      { key: "story", label: "Hikaye Paragrafları", type: "string-array" },
      { key: "values", label: "Değerlerimiz / Özellikler", type: "array" },
      { key: "serviceAreas", label: "Hizmet Bölgeleri", type: "array" },
    ],
  },
];

export default function IceriklerPage() {
  const [activeTab, setActiveTab] = useState("home");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      const result: Record<string, Record<string, any>> = {};
      for (const tab of TABS) {
        try {
          const res = await fetch(`/api/admin/content?page=${tab.key}`);
          const data = await res.json();
          result[tab.key] = { ...DEFAULTS[tab.key], ...data };
        } catch {
          result[tab.key] = { ...DEFAULTS[tab.key] };
        }
      }
      setContent(result);
      setLoading(false);
    };
    loadAll();
  }, []);

  const updateSection = (page: string, section: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [page]: { ...prev[page], [section]: value },
    }));
  };

  const saveSection = async (page: string, section: string) => {
    setSaving(`${page}.${section}`);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section, data: content[page]?.[section] }),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch {
      alert("Kaydedilemedi!");
    } finally {
      setSaving(null);
    }
  };

  const resetSection = (page: string, section: string) => {
    if (confirm("Bu bölümü varsayılana döndürmek istediğinize emin misiniz?")) {
      updateSection(page, section, DEFAULTS[page]?.[section]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const currentTab = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Sayfa İçerikleri</h2>
        <p className="text-sm text-slate-500 mt-1">Siteleki yazıları, kartları ve bölümleri buradan düzenleyebilirsiniz.</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setOpenSection(null); }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {currentTab.sections.map(section => {
          const isOpen = openSection === section.key;
          const sectionData = content[activeTab]?.[section.key];
          const isSaving = saving === `${activeTab}.${section.key}`;

          return (
            <div key={section.key} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.key)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-700">{section.label}</span>
                {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-4 space-y-4">
                  {/* Object type (hero) */}
                  {section.type === "object" && sectionData && typeof sectionData === "object" && !Array.isArray(sectionData) && (
                    <div className="space-y-3">
                      {Object.entries(sectionData).map(([key, val]) => (
                        <div key={key}>
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</label>
                          {Array.isArray(val) ? (
                            <div className="space-y-1 mt-1">
                              {(val as string[]).map((item, i) => (
                                <div key={i} className="flex gap-2">
                                  <input
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    value={item}
                                    onChange={e => {
                                      const arr = [...(val as string[])];
                                      arr[i] = e.target.value;
                                      updateSection(activeTab, section.key, { ...sectionData, [key]: arr });
                                    }}
                                  />
                                  <button onClick={() => {
                                    const arr = (val as string[]).filter((_, idx) => idx !== i);
                                    updateSection(activeTab, section.key, { ...sectionData, [key]: arr });
                                  }} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              ))}
                              <button onClick={() => {
                                updateSection(activeTab, section.key, { ...sectionData, [key]: [...(val as string[]), ""] });
                              }} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Ekle</button>
                            </div>
                          ) : (
                            <textarea
                              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                              rows={typeof val === "string" && val.length > 80 ? 3 : 1}
                              value={String(val)}
                              onChange={e => updateSection(activeTab, section.key, { ...sectionData, [key]: e.target.value })}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Array of objects */}
                  {section.type === "array" && Array.isArray(sectionData) && (
                    <div className="space-y-3">
                      {sectionData.map((item: any, i: number) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-lg space-y-2 relative">
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button onClick={() => {
                              const arr = sectionData.filter((_: any, idx: number) => idx !== i);
                              updateSection(activeTab, section.key, arr);
                            }} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                          {Object.entries(item).map(([key, val]) => (
                            <div key={key}>
                              <label className="text-[10px] font-bold text-slate-400 uppercase">{key}</label>
                              <input
                                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm"
                                value={String(val)}
                                onChange={e => {
                                  const arr = [...sectionData];
                                  arr[i] = { ...arr[i], [key]: e.target.value };
                                  updateSection(activeTab, section.key, arr);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                      <button onClick={() => {
                        const template = sectionData[0] ? Object.fromEntries(Object.keys(sectionData[0]).map(k => [k, ""])) : { title: "", desc: "" };
                        updateSection(activeTab, section.key, [...sectionData, template]);
                      }} className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" /> Yeni Ekle
                      </button>
                    </div>
                  )}

                  {/* String array */}
                  {section.type === "string-array" && Array.isArray(sectionData) && (
                    <div className="space-y-2">
                      {sectionData.map((item: string, i: number) => (
                        <div key={i} className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                            value={item}
                            onChange={e => {
                              const arr = [...sectionData];
                              arr[i] = e.target.value;
                              updateSection(activeTab, section.key, arr);
                            }}
                          />
                          <button onClick={() => {
                            updateSection(activeTab, section.key, sectionData.filter((_: string, idx: number) => idx !== i));
                          }} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      <button onClick={() => {
                        updateSection(activeTab, section.key, [...sectionData, ""]);
                      }} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus className="w-3 h-3" /> Ekle</button>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => saveSection(activeTab, section.key)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Kaydet
                    </button>
                    <button
                      onClick={() => resetSection(activeTab, section.key)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" /> Varsayılana Dön
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
