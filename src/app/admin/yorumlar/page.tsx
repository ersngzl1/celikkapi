"use client";

import { useState, useEffect } from "react";
import { Plus, Star, Trash2, X, Save, Eye, EyeOff, Search, Loader2 } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  location: string;
  verified: number;
  date: string;
}

export default function YorumlarPage() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", location: "", verified: true, date: new Date().toISOString().split("T")[0] });

  const load = () => {
    setLoading(true);
    fetch("/api/admin/reviews")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.text.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = items.length > 0
    ? (items.reduce((sum, r) => sum + r.rating, 0) / items.length).toFixed(1)
    : "0";

  const handleSave = async () => {
    if (!form.name || !form.text) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, verified: form.verified ? 1 : 0 }),
      });
      if (res.ok) {
        load();
        setShowForm(false);
        setForm({ name: "", rating: 5, text: "", location: "", verified: true, date: new Date().toISOString().split("T")[0] });
      } else {
        const err = await res.json();
        alert(`Kaydedilemedi: ${err.error}`);
      }
    } catch {
      alert("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(r => r.id !== id));
        setDeleteConfirm(null);
      }
    } catch {
      alert("Silinemedi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Müşteri Yorumları</h2>
          <p className="text-sm text-slate-500">{items.length} yorum, ortalama {avgRating} puan</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Yeni Yorum Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-500">{avgRating}</div>
          <div className="flex justify-center gap-0.5 my-1">
            {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />)}
          </div>
          <div className="text-xs text-slate-500">Ortalama Puan</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{items.length}</div>
          <div className="text-xs text-slate-500">Toplam Yorum</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{items.filter(r => r.verified).length}</div>
          <div className="text-xs text-slate-500">Doğrulanmış</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{items.filter(r => !r.verified).length}</div>
          <div className="text-xs text-slate-500">Doğrulanmamış</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Yorum ara..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-5 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{review.name}</span>
                        {review.verified ? (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Doğrulanmış</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />)}
                        </div>
                        <span className="text-[10px] text-slate-400">{review.date}</span>
                        {review.location && <span className="text-[10px] text-slate-400">📍 {review.location}</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {deleteConfirm === review.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(review.id)} className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">Sil</button>
                      <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-slate-200 text-xs rounded font-bold">X</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(review.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">
              {items.length === 0 ? "Henüz yorum eklenmemiş." : "Sonuç bulunamadı."}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Yeni Yorum</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Müşteri Adı *</label>
                  <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Ahmet Y." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Konum</label>
                  <input value={form.location} onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Adana, Çukurova" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Puan</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setForm(p => ({ ...p, rating: i }))} className="p-1">
                      <Star className={`w-6 h-6 ${i <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tarih</label>
                <input type="date" value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Yorum *</label>
                <textarea value={form.text} onChange={(e) => setForm(p => ({ ...p, text: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Müşteri yorumu..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.verified} onChange={(e) => setForm(p => ({ ...p, verified: e.target.checked }))} id="verified" className="rounded" />
                <label htmlFor="verified" className="text-sm text-slate-600">Doğrulanmış müşteri</label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-200">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
