"use client";

import { useState } from "react";
import { Plus, Star, Trash2, X, Save, Eye, EyeOff, Search } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  visible: boolean;
}

const mockReviews: Review[] = [
  { id: 1, name: "Ahmet Y.", rating: 5, comment: "Harika bir kapi, montaj ekibi cok profesyoneldi. Tesekkurler Best Kapi!", product: "Vega Modern", date: "2026-03-15", visible: true },
  { id: 2, name: "Fatma D.", rating: 5, comment: "Apartman girisimize cift kanat celik kapi yaptirdik. Cok memnunuz, komsular da begendi.", product: "Titan Pro", date: "2026-03-10", visible: true },
  { id: 3, name: "Mehmet K.", rating: 4, comment: "Kaliteli urun, fiyat performans orani iyi. Montaj biraz gecikti ama sonuc guzel oldu.", product: "Atlas Guard", date: "2026-02-28", visible: true },
  { id: 4, name: "Ayse C.", rating: 5, comment: "3 yildir kullaniyoruz, hic sorun yasanmadi. Ses yalitimi mukemmel.", product: "Nova Elite", date: "2026-02-20", visible: true },
  { id: 5, name: "Hasan B.", rating: 4, comment: "Guzel kapi ama renk secenekleri biraz daha fazla olabilirdi.", product: "Fortress Max", date: "2026-02-15", visible: false },
  { id: 6, name: "Elif S.", rating: 5, comment: "WhatsApp'tan yazdim, ayni gun gelip olcu aldilar. 3 gunde montaj tamamlandi. Super hizli!", product: "Shield Pro+", date: "2026-01-30", visible: true },
];

export default function YorumlarPage() {
  const [items, setItems] = useState<Review[]>(mockReviews);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<Review>({ id: 0, name: "", rating: 5, comment: "", product: "", date: "", visible: true });

  const filtered = items.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()));
  const avgRating = (items.reduce((sum, r) => sum + r.rating, 0) / items.length).toFixed(1);

  const openNew = () => {
    setForm({ id: Date.now(), name: "", rating: 5, comment: "", product: "", date: new Date().toISOString().split("T")[0], visible: true });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (review: Review) => {
    setForm({ ...review });
    setEditId(review.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.comment) return;
    if (editId) {
      setItems(prev => prev.map(r => r.id === form.id ? form : r));
    } else {
      setItems(prev => [...prev, form]);
    }
    setShowForm(false);
  };

  const toggleVisibility = (id: number) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, visible: !r.visible } : r));
  };

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Musteri Yorumlari</h2>
          <p className="text-sm text-slate-500">{items.length} yorum, ortalama {avgRating} puan</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors">
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
          <div className="text-2xl font-bold text-green-600">{items.filter(r => r.visible).length}</div>
          <div className="text-xs text-slate-500">Yayinda</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{items.filter(r => !r.visible).length}</div>
          <div className="text-xs text-slate-500">Gizli</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Yorum ara..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className={`bg-white rounded-xl border border-slate-200 p-5 transition-all ${!review.visible ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    {review.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{review.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`w-3 h-3 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />)}
                      </div>
                      <span className="text-[10px] text-slate-400">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-xs text-slate-500 rounded">{review.product}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleVisibility(review.id)} className={`p-2 rounded-lg transition-colors ${review.visible ? "hover:bg-green-50 text-green-600" : "hover:bg-slate-100 text-slate-400"}`}
                  title={review.visible ? "Gizle" : "Yayinla"}>
                  {review.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(review)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"><Star className="w-4 h-4" /></button>
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">{editId ? "Yorumu Duzenle" : "Yeni Yorum"}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Musteri Adi *</label>
                  <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Ahmet Y." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Urun</label>
                  <input value={form.product} onChange={(e) => setForm(p => ({ ...p, product: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" placeholder="Vega Modern" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Puan</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setForm(p => ({ ...p, rating: i }))}
                      className="p-1">
                      <Star className={`w-6 h-6 ${i <= form.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Yorum *</label>
                <textarea value={form.comment} onChange={(e) => setForm(p => ({ ...p, comment: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Musteri yorumu..." />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm(p => ({ ...p, visible: e.target.checked }))} id="visible" className="rounded" />
                <label htmlFor="visible" className="text-sm text-slate-600">Sitede gosterilsin</label>
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
