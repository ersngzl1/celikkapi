"use client";

import { useState } from "react";
import { doors, categories } from "@/data/doors";
import Image from "next/image";
import {
  Plus, Search, Edit2, Trash2, Eye, MoreVertical, Filter,
  ChevronDown, X, Save, Upload, Sparkles,
} from "lucide-react";

interface DoorForm {
  id: number;
  name: string;
  series: string;
  category: string;
  color: string;
  colorHex: string;
  thickness: string;
  material: string;
  lockSystem: string;
  dimensions: string;
  weight: string;
  insulation: string;
  warranty: string;
  description: string;
  features: string[];
  image: string;
}

const emptyForm: DoorForm = {
  id: 0, name: "", series: "", category: "premium", color: "", colorHex: "#1E293B",
  thickness: "", material: "", lockSystem: "", dimensions: "", weight: "", insulation: "",
  warranty: "2 Yil", description: "", features: [], image: "/doors/celik-1.jpg",
};

interface GeneratingStatus {
  doorId: number;
  isGenerating: boolean;
}

export default function UrunlerPage() {
  const [items, setItems] = useState(doors);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<DoorForm | null>(null);
  const [form, setForm] = useState<DoorForm>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [generatingDoor, setGeneratingDoor] = useState<number | null>(null);

  const categoryLabel = (cat: string) => categories.find(c => c.value === cat)?.label || cat;

  const filtered = items.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.series.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openNew = () => {
    setForm({ ...emptyForm, id: Date.now() });
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (door: typeof doors[0]) => {
    setForm({
      ...door,
      features: [...door.features],
    });
    setEditItem(door as unknown as DoorForm);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.series) return;
    if (editItem) {
      setItems(prev => prev.map(d => d.id === form.id ? { ...d, ...form } as typeof doors[0] : d));
    } else {
      setItems(prev => [...prev, form as unknown as typeof doors[0]]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(d => d.id !== id));
    setDeleteConfirm(null);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setForm(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const generateVisuals = async (door: typeof doors[0]) => {
    setGeneratingDoor(door.id);
    try {
      const res = await fetch("/api/admin/generate-door-visuals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doorId: door.id,
          doorName: door.name,
          doorColor: door.color,
          doorSeries: door.series,
        }),
      });

      if (!res.ok) {
        alert("Görsel üretimi başarısız");
        return;
      }

      const data = await res.json();
      alert("AI görsel üretimi başlatıldı. Biraz bekleyiniz...");
      // Store images in data.images - in production would save to database/storage
      console.log("Generated visuals:", data);
    } catch (error) {
      console.error("Error:", error);
      alert("Görsel üretimi hatası");
    } finally {
      setGeneratingDoor(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tüm Ürünler</h2>
          <p className="text-sm text-slate-500">{items.length} ürün kayıtlı</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün adı veya seri ara..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
            />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500">
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ürün</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Seri</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Renk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Kalınlık</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Garanti</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((door) => (
                <tr key={door.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg overflow-hidden relative flex-shrink-0 border border-slate-200">
                        <Image src={door.image} alt={door.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{door.name}</div>
                        <div className="text-xs text-slate-500">{categoryLabel(door.category)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">{door.series}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: door.colorHex }} />
                      <span className="text-sm text-slate-600">{door.color}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden lg:table-cell">{door.thickness}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">{door.warranty}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        onClick={() => generateVisuals(door)}
                        disabled={generatingDoor === door.id}
                        className={`p-2 rounded-lg transition-colors ${generatingDoor === door.id ? "bg-purple-100 text-purple-400 cursor-not-allowed" : "hover:bg-purple-50 text-purple-600"}`}
                        title="AI ile görsel oluştur"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(door)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Düzenle">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <a href={`/urun/${door.id}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Önizle">
                        <Eye className="w-4 h-4" />
                      </a>
                      {deleteConfirm === door.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(door.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">Sil</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded font-bold">İptal</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(door.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Sil">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-500">Ürün bulunamadı.</div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">{editItem ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ürün Adı *</label>
                  <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Vega Modern" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Seri *</label>
                  <input value={form.series} onChange={(e) => setForm(p => ({ ...p, series: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Premium Serisi" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500">
                    <option value="premium">Premium</option>
                    <option value="luks">Lüks</option>
                    <option value="modern">Modern</option>
                    <option value="klasik">Klasik</option>
                    <option value="oda">Oda Kapısı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input value={form.color} onChange={(e) => setForm(p => ({ ...p, color: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Antrasit" />
                    <input type="color" value={form.colorHex} onChange={(e) => setForm(p => ({ ...p, colorHex: e.target.value }))}
                      className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kalınlık</label>
                  <input value={form.thickness} onChange={(e) => setForm(p => ({ ...p, thickness: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="70mm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Malzeme</label>
                  <input value={form.material} onChange={(e) => setForm(p => ({ ...p, material: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="1.5mm Çelik" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kilit Sistemi</label>
                  <input value={form.lockSystem} onChange={(e) => setForm(p => ({ ...p, lockSystem: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Kale Multikilit" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Boyut</label>
                  <input value={form.dimensions} onChange={(e) => setForm(p => ({ ...p, dimensions: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="90x205 cm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ağırlık</label>
                  <input value={form.weight} onChange={(e) => setForm(p => ({ ...p, weight: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="75 kg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Yalıtım</label>
                  <input value={form.insulation} onChange={(e) => setForm(p => ({ ...p, insulation: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Ses + Isı Yalıtım" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Garanti</label>
                  <select value={form.warranty} onChange={(e) => setForm(p => ({ ...p, warranty: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500">
                    <option>1 Yil</option>
                    <option>2 Yil</option>
                    <option>3 Yil</option>
                    <option>5 Yil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Görsel</label>
                  <div className="flex items-center gap-2">
                    <input value={form.image} onChange={(e) => setForm(p => ({ ...p, image: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="/doors/celik-1.jpg" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="imageUpload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      title="Resim yükle"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Açıklama</label>
                <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Ürün açıklaması..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Özellikler</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Özellik ekle ve Enter'a bas" />
                  <button onClick={addFeature} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                İptal
              </button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors">
                <Save className="w-4 h-4" /> {editItem ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
