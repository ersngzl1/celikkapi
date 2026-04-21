"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus, Search, Edit2, Trash2, Eye, Filter,
  ChevronDown, X, Save, Upload, Sparkles, Loader2, Star,
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
  inStock?: boolean;
  featured?: number;
  slug?: string;
}

const emptyForm: DoorForm = {
  id: 0,
  name: "",
  series: "",
  category: "premium",
  color: "",
  colorHex: "#1E293B",
  thickness: "",
  material: "",
  lockSystem: "",
  dimensions: "",
  weight: "",
  insulation: "",
  warranty: "2 Yıl",
  description: "",
  features: [],
  image: "/doors/celik-1.jpg",
  inStock: true,
};

const defaultCategories = [
  { value: "premium", label: "Premium" },
  { value: "luks", label: "Lüks" },
  { value: "modern", label: "Modern" },
  { value: "klasik", label: "Klasik" },
  { value: "oda", label: "Oda Kapısı" },
];

interface Category {
  id?: number;
  value: string;
  label: string;
}

export default function UrunlerPage() {
  const [items, setItems] = useState<DoorForm[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<DoorForm | null>(null);
  const [form, setForm] = useState<DoorForm>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingDoor, setGeneratingDoor] = useState<number | null>(null);

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setItems(data);
        } else {
          // API error, load from demo doors as fallback
          const { doors } = await import("@/data/doors");
          setItems(doors);
        }

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          if (cats.length > 0) {
            setCategories(cats);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        const { doors } = await import("@/data/doors");
        setItems(doors);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = items.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.series.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || d.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const openNew = () => {
    // PostgreSQL INTEGER max ~2.1 milyar, Date.now() 1.7 trilyon, taşma yapar
    const newId = Math.floor(Math.random() * 2000000000);
    setForm({ ...emptyForm, id: newId });
    setEditItem(null);
    setUploadPreview(null);
    setShowForm(true);
  };

  const openEdit = (door: DoorForm) => {
    setForm({ ...door, features: [...door.features] });
    setEditItem(door);
    setUploadPreview(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.series) {
      alert("Ürün adı ve seri gereklidir");
      return;
    }

    setSaving(true);
    try {
      const url = editItem ? `/api/admin/products/${editItem.id}` : "/api/admin/products";
      const method = editItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        if (editItem) {
          setItems((prev) =>
            prev.map((d) => (d.id === form.id ? form : d))
          );
        } else {
          setItems((prev) => [...prev, form]);
        }
        setShowForm(false);
        setEditItem(null);
      } else {
        const error = await res.json().catch(() => ({}));
        alert(`Kaydedilemedi: ${error.error || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Hata oluştu: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((d) => d.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Silinemedi!");
    }
  };

  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Dosya boyutu 3MB'dan küçük olmalıdır");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));
        setUploadPreview(data.preview); // base64 preview sadece göstermek için
      } else {
        alert(`Resim yüklenemedi: ${data.error || "Bilinmeyen hata"}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],
    }));
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleToggleFeatured = async (door: DoorForm) => {
    const newVal = door.featured ? 0 : 1;
    try {
      await fetch(`/api/admin/products/${door.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: newVal }),
      });
      setItems(prev => prev.map(d => d.id === door.id ? { ...d, featured: newVal } : d));
    } catch {
      alert("Güncellenemedi");
    }
  };

  const generateVisuals = async (door: DoorForm) => {
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

      alert("AI görsel üretimi başlatıldı. Biraz bekleyiniz...");
    } catch (error) {
      console.error("Error:", error);
      alert("Görsel üretimi hatası");
    } finally {
      setGeneratingDoor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-600" />
          <p className="text-slate-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tüm Ürünler</h2>
          <p className="text-sm text-slate-500">{items.length} ürün kayıtlı</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Ürün Ekle
        </button>
      </div>

      {/* Search & Filter */}
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
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
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
                <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Ana Sayfa</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((door) => (
                <tr key={door.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {door.image && (
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100">
                          {door.image.startsWith("data:") ? (
                            <img
                              src={door.image}
                              alt={door.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={door.image}
                              alt={door.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {door.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {categories.find((c) => c.value === door.category)?.label || door.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">
                    {door.series}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: door.colorHex }}
                      />
                      <span className="text-sm text-slate-600">{door.color}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden lg:table-cell">
                    {door.thickness}
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 hidden md:table-cell">
                    {door.warranty}
                  </td>
                  <td className="px-5 py-3 text-center hidden sm:table-cell">
                    <button
                      onClick={() => handleToggleFeatured(door)}
                      title={door.featured ? "Ana sayfadan kaldır" : "Ana sayfaya ekle"}
                      className={`p-1.5 rounded-lg transition-colors ${door.featured ? "text-amber-500 bg-amber-50 hover:bg-amber-100" : "text-slate-300 hover:text-amber-400 hover:bg-amber-50"}`}
                    >
                      <Star className={`w-4 h-4 ${door.featured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        onClick={() => generateVisuals(door)}
                        disabled={generatingDoor === door.id}
                        className={`p-2 rounded-lg transition-colors ${
                          generatingDoor === door.id
                            ? "bg-purple-100 text-purple-400 cursor-not-allowed"
                            : "hover:bg-purple-50 text-purple-600"
                        }`}
                        title="AI ile görsel oluştur"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(door)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <a
                        href={`/urun/${door.slug || door.id}`}
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Önizle"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      {deleteConfirm === door.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(door.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold"
                          >
                            Sil
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded font-bold"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(door.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Sil"
                        >
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
          <div className="text-center py-12 text-sm text-slate-500">
            Ürün bulunamadı.
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                {editItem ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ürün Adı *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Vega Modern"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Seri *
                  </label>
                  <input
                    value={form.series}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, series: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Premium Serisi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kategori
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, category: e.target.value }))
                      }
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={async () => {
                        const label = prompt("Yeni kategori adı:");
                        if (!label) return;
                        const value = label.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, "-").replace(/-+/g, "-");
                        try {
                          const res = await fetch("/api/admin/categories", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ value, label }),
                          });
                          if (res.ok) {
                            setCategories(prev => [...prev, { value, label }]);
                            setForm(p => ({ ...p, category: value }));
                          }
                        } catch {}
                      }}
                      className="px-3 py-2.5 border border-dashed border-slate-300 rounded-lg text-xs font-semibold text-slate-500 hover:border-red-400 hover:text-red-600 transition-colors whitespace-nowrap"
                    >
                      + Yeni
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Renk
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={form.color}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, color: e.target.value }))
                      }
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                      placeholder="Antrasit"
                    />
                    <input
                      type="color"
                      value={form.colorHex}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, colorHex: e.target.value }))
                      }
                      className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kalınlık
                  </label>
                  <input
                    value={form.thickness}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, thickness: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="70mm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Malzeme
                  </label>
                  <input
                    value={form.material}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, material: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="1.5mm Çelik"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kilit Sistemi
                  </label>
                  <input
                    value={form.lockSystem}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lockSystem: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Kale Multikilit"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Boyut
                  </label>
                  <input
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, dimensions: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="90x205 cm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ağırlık
                  </label>
                  <input
                    value={form.weight}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, weight: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="75 kg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Yalıtım
                  </label>
                  <input
                    value={form.insulation}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, insulation: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Ses + Isı Yalıtım"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Garanti
                  </label>
                  <select
                    value={form.warranty}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, warranty: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  >
                    <option>1 Yıl</option>
                    <option>2 Yıl</option>
                    <option>3 Yıl</option>
                    <option>5 Yıl</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Resim Yükle
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1 text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 disabled:opacity-50"
                    />
                    {uploading && <Loader2 className="w-4 h-4 animate-spin text-red-500" />}
                  </div>
                  {form.image && form.image.startsWith("/api/images/") && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center gap-2">
                      <span className="text-green-500">✓</span> Resim yüklendi
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Veya Görsel URL
                  </label>
                  <input
                    value={form.image}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, image: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Örnek: /doors/celik-1.jpg veya https://..."
                  />
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <strong>📦 Mevcut Resimler:</strong><br/>
                    🚪 Çelik: /doors/celik-1.jpg - celik-8.jpg<br/>
                    🏠 Oda: /doors/oda-1.jpg - oda-4.jpg<br/>
                    <br/>
                    <strong>💡 Veya:</strong> Dış kaynaktan tam URL yaz (https://...)
                  </div>
                </div>

                {(uploadPreview || form.image) && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-2">
                      Resim Önizlemesi
                    </label>
                    <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {uploadPreview ? (
                        <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : form.image && !form.image.startsWith("data:") ? (
                        <Image src={form.image} alt="Preview" fill className="object-cover" sizes="112px" />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Açıklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Ürün açıklaması..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Özellikler
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addFeature())
                    }
                    className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Özellik ekle ve Enter'a bas"
                  />
                  <button
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.features.map((f, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700"
                    >
                      {f}
                      <button
                        onClick={() => removeFeature(i)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editItem ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
