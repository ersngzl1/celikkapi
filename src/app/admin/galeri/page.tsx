"use client";

import { useState } from "react";
import { Plus, Trash2, X, Save, Upload, Image as ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  id: number;
  title: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  doorModel: string;
}

const mockGallery: GalleryItem[] = [
  { id: 1, title: "Villa Giris Kapisi", location: "Adana, Cukurova", beforeImage: "/doors/celik-1.jpg", afterImage: "/doors/celik-4.jpg", doorModel: "Vega Modern" },
  { id: 2, title: "Apartman Kapisi", location: "Adana, Seyhan", beforeImage: "/doors/celik-2.jpg", afterImage: "/doors/celik-3.jpg", doorModel: "Titan Pro" },
  { id: 3, title: "Mustakil Ev", location: "Mersin, Mezitli", beforeImage: "/doors/celik-5.jpg", afterImage: "/doors/celik-6.jpg", doorModel: "Atlas Guard" },
];

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>(mockGallery);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<GalleryItem>({ id: 0, title: "", location: "", beforeImage: "", afterImage: "", doorModel: "" });

  const openNew = () => {
    setForm({ id: Date.now(), title: "", location: "", beforeImage: "", afterImage: "", doorModel: "" });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item: GalleryItem) => {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    if (editId) {
      setItems(prev => prev.map(i => i.id === form.id ? form : i));
    } else {
      setItems(prev => [...prev, form]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Galeri / Once & Sonra</h2>
          <p className="text-sm text-slate-500">{items.length} montaj ornegi</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Yeni Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all">
            <div className="grid grid-cols-2 gap-0.5 bg-slate-200">
              <div className="relative aspect-square">
                <Image src={item.beforeImage} alt="Once" fill className="object-cover" sizes="200px" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded">ONCE</span>
              </div>
              <div className="relative aspect-square">
                <Image src={item.afterImage} alt="Sonra" fill className="object-cover" sizes="200px" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">SONRA</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <MapPin className="w-3 h-3" /> {item.location}
              </div>
              <p className="text-xs text-slate-400 mt-1">Model: {item.doorModel}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(item)} className="flex-1 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100">
                  Duzenle
                </button>
                {deleteConfirm === item.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-2 bg-red-600 text-white text-xs rounded-lg font-bold">Sil</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-2 bg-slate-200 text-xs rounded-lg font-bold">Iptal</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">{editId ? "Duzenle" : "Yeni Montaj Ornegi"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Baslik *</label>
                <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Villa Giris Kapisi" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Konum</label>
                  <input value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Adana, Cukurova" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Kapi Modeli</label>
                  <input value={form.doorModel} onChange={(e) => setForm(p => ({ ...p, doorModel: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Vega Modern" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Once Gorseli</label>
                  <input value={form.beforeImage} onChange={(e) => setForm(p => ({ ...p, beforeImage: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="/gallery/once-1.jpg" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Sonra Gorseli</label>
                  <input value={form.afterImage} onChange={(e) => setForm(p => ({ ...p, afterImage: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="/gallery/sonra-1.jpg" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Iptal</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg">
                <Save className="w-4 h-4" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
