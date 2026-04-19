"use client";

import { useState } from "react";
import { Search, Phone, Mail, Eye, Trash2, CheckCircle2, Clock, MessageSquare, Filter, X } from "lucide-react";

interface ContactForm {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  product: string;
  date: string;
  status: "new" | "read" | "replied" | "archived";
}

const mockData: ContactForm[] = [
  { id: 1, name: "Ahmet Yılmaz", phone: "0532 111 22 33", email: "ahmet@gmail.com", message: "Villa kapısı için fiyat bilgisi istiyorum. 120cm genişliğinde çift kanat çelik kapı.", product: "Vega Modern", date: "2026-04-09 14:30", status: "new" },
  { id: 2, name: "Fatma Demir", phone: "0544 222 33 44", email: "fatma@gmail.com", message: "Apartman giriş kapısı değiştirmek istiyorum. Bina yöneticisiyim, 12 daire için toplu teklif.", product: "Titan Pro", date: "2026-04-09 11:15", status: "new" },
  { id: 3, name: "Mehmet Kara", phone: "0555 333 44 55", email: "mehmet@hotmail.com", message: "Oda kapısı fiyatları hakkında bilgi almak istiyorum. 4 adet lazım.", product: "Oda Kapısı", date: "2026-04-08 16:45", status: "read" },
  { id: 4, name: "Ayşe Çelik", phone: "0533 444 55 66", email: "ayse@outlook.com", message: "İnşaat firması olarak toplu alış yapabiliriz. Seri bina projesi için teklif bekliyorum.", product: "Genel", date: "2026-04-08 09:20", status: "replied" },
  { id: 5, name: "Ali Öztürk", phone: "0542 555 66 77", email: "ali@gmail.com", message: "Mersin'den arıyorum. Montaj yapıyor musunuz?", product: "Atlas Guard", date: "2026-04-07 15:00", status: "replied" },
  { id: 6, name: "Zeynep Aksoy", phone: "0537 666 77 88", email: "zeynep@gmail.com", message: "Çelik kapı sesi çok yapıyoruz, yalıtımlı model var mı?", product: "Nova Elite", date: "2026-04-06 13:30", status: "archived" },
];

const statusLabels = {
  new: { label: "Yeni", color: "bg-red-100 text-red-700" },
  read: { label: "Okundu", color: "bg-blue-100 text-blue-700" },
  replied: { label: "Yanıtlandı", color: "bg-green-100 text-green-700" },
  archived: { label: "Arşiv", color: "bg-slate-100 text-slate-500" },
};

export default function IletisimFormlariPage() {
  const [items, setItems] = useState<ContactForm[]>(mockData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ContactForm | null>(null);

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: number, status: ContactForm["status"]) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const newCount = items.filter(i => i.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">İletişim Formları</h2>
          <p className="text-sm text-slate-500">{items.length} form, {newCount} yeni</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim veya mesaj ara..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "Tümü" },
              { value: "new", label: `Yeni (${newCount})` },
              { value: "read", label: "Okundu" },
              { value: "replied", label: "Yanıtlandı" },
            ].map(f => (
              <button key={f.value} onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === f.value ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id}
                onClick={() => { setSelected(item); if (item.status === "new") updateStatus(item.id, "read"); }}
                className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                  selected?.id === item.id ? "bg-red-50 border-l-4 border-l-red-500" : ""
                } ${item.status === "new" ? "bg-red-50/50" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  item.status === "new" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {item.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-800">{item.name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${statusLabels[item.status].color}`}>
                      {statusLabels[item.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                    <span className="text-[10px] text-slate-400">{item.product}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-500">Sonuç bulunamadı.</div>
          )}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 h-fit sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-slate-100"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${selected.phone}`} className="text-blue-600 font-medium">{selected.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${selected.email}`} className="text-blue-600">{selected.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{selected.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Ürün: {selected.product}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl mb-5">
              <p className="text-sm text-slate-700 leading-relaxed">{selected.message}</p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <a href={`https://wa.me/90${selected.phone.replace(/\s/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-lg">
                  WhatsApp
                </a>
                <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg">
                  <Phone className="w-4 h-4" /> Ara
                </a>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(selected.id, "replied")} className="flex-1 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100">
                  <CheckCircle2 className="w-3 h-3 inline mr-1" /> Yanıtlandı
                </button>
                <button onClick={() => updateStatus(selected.id, "archived")} className="flex-1 py-2 bg-slate-50 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-100">
                  Arşivle
                </button>
                <button onClick={() => deleteItem(selected.id)} className="py-2 px-3 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-400 h-fit">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            Detay görmek için bir form seçin
          </div>
        )}
      </div>
    </div>
  );
}
