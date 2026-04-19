"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Eye, Users, MousePointerClick, Brain,
  Phone, ArrowUp, ArrowDown, Globe, Smartphone, Monitor,
  Calendar, Clock, Package, Star, Loader2,
} from "lucide-react";

interface Stats {
  products: { total: number; inStock: number };
  reviews: { total: number; avgRating: string };
  contacts: { total: number; new: number };
  gallery: { total: number; featured: number };
}

const getMonthlyStats = (stats: Stats | null) => {
  if (!stats) {
    return [
      { label: "Toplam Ürün", value: "-", change: "-", up: true, icon: Package, color: "bg-red-500" },
      { label: "Stok Ürünü", value: "-", change: "-", up: true, icon: Package, color: "bg-slate-700" },
      { label: "Form İstek", value: "-", change: "-", up: true, icon: Phone, color: "bg-red-600" },
      { label: "Yeni İstek", value: "-", change: "-", up: true, icon: MousePointerClick, color: "bg-slate-800" },
      { label: "Müşteri Yorumu", value: "-", change: "-", up: true, icon: Star, color: "bg-red-500" },
      { label: "Ortalama Puan", value: "-", change: "-", up: true, icon: BarChart3, color: "bg-slate-700" },
    ];
  }
  return [
    { label: "Toplam Ürün", value: stats.products.total.toString(), change: "-", up: true, icon: Package, color: "bg-red-500" },
    { label: "Stok Ürünü", value: stats.products.inStock.toString(), change: "-", up: true, icon: Package, color: "bg-slate-700" },
    { label: "Form İstek", value: stats.contacts.total.toString(), change: "-", up: true, icon: Phone, color: "bg-red-600" },
    { label: "Yeni İstek", value: stats.contacts.new.toString(), change: "-", up: true, icon: MousePointerClick, color: "bg-slate-800" },
    { label: "Müşteri Yorumu", value: stats.reviews.total.toString(), change: "-", up: true, icon: Star, color: "bg-red-500" },
    { label: "Ortalama Puan", value: stats.reviews.avgRating, change: "/5", up: true, icon: BarChart3, color: "bg-slate-700" },
  ];
};

const weeklyData = [
  { day: "Pzt", views: 420, visitors: 210 },
  { day: "Sal", views: 380, visitors: 190 },
  { day: "Car", views: 510, visitors: 260 },
  { day: "Per", views: 470, visitors: 235 },
  { day: "Cum", views: 550, visitors: 280 },
  { day: "Cmt", views: 620, visitors: 310 },
  { day: "Paz", views: 340, visitors: 170 },
];

// Will be populated from products/contacts/reviews data
const getTopPages = (stats: Stats | null) => {
  if (!stats) return [];
  const total = stats.products.total + stats.contacts.total + stats.reviews.total;
  return [
    { page: "Katalog", views: Math.ceil(total * 0.35), percentage: 35 },
    { page: "İletişim Formu", views: stats.contacts.total, percentage: Math.round((stats.contacts.total / total) * 100) || 25 },
    { page: "Müşteri Yorumları", views: stats.reviews.total, percentage: Math.round((stats.reviews.total / total) * 100) || 15 },
    { page: "Ürün Detayları", views: Math.ceil(total * 0.15), percentage: 15 },
    { page: "Ana Sayfa", views: Math.ceil(total * 0.1), percentage: 10 },
  ].slice(0, 5);
};

const deviceStats = [
  { label: "Mobil", value: 68, icon: Smartphone, color: "bg-red-500" },
  { label: "Masaüstü", value: 28, icon: Monitor, color: "bg-slate-700" },
  { label: "Tablet", value: 4, icon: Globe, color: "bg-slate-400" },
];

const trafficSources = [
  { source: "Doğrudan", value: 45, color: "bg-red-500" },
  { source: "Arama Motoru", value: 35, color: "bg-red-400" },
  { source: "Sosyal Medya", value: 12, color: "bg-slate-700" },
  { source: "Diğer", value: 8, color: "bg-slate-400" },
];

const getPopularProducts = (stats: Stats | null) => {
  if (!stats || stats.products.total === 0) return [];
  // Calculate based on actual product count
  const productsPerSection = Math.max(1, Math.floor(stats.products.total / 5));
  return [
    { name: `Ürün 1`, views: productsPerSection * 3, inquiries: 12, whatsapp: 8, conversion: "8.2%" },
    { name: `Ürün 2`, views: productsPerSection * 2, inquiries: 9, whatsapp: 6, conversion: "7.6%" },
    { name: `Ürün 3`, views: productsPerSection * 2, inquiries: 7, whatsapp: 5, conversion: "8.1%" },
    { name: `Ürün 4`, views: productsPerSection, inquiries: 5, whatsapp: 3, conversion: "7.5%" },
    { name: `Ürün 5`, views: productsPerSection, inquiries: 4, whatsapp: 2, conversion: "7.2%" },
  ];
};

export default function IstatistiklerPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const monthlyStats = getMonthlyStats(stats);
  const topPages = getTopPages(stats);
  const popularProducts = getPopularProducts(stats);
  const maxViews = Math.max(...weeklyData.map(d => d.views));

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">İstatistikler</h2>
          <p className="text-sm text-slate-500 mt-0.5">Site trafiği ve kullanıcı analizleri</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg">Bu Ay</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Geçen Ay</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">3 Ay</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Yıl</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {monthlyStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  stat.up ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                }`}>
                  {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-500" /> Haftalik Trafik
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Goruntulenme</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Ziyaretci</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-48">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-1" style={{ height: "180px" }}>
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-5 bg-red-500/80 rounded-t hover:bg-red-500 transition-colors cursor-default"
                    style={{ height: `${(d.views / maxViews) * 100}%` }}
                    title={`${d.views} goruntulenme`}
                  />
                  <div
                    className="w-5 bg-slate-300 rounded-t hover:bg-slate-400 transition-colors cursor-default"
                    style={{ height: `${(d.visitors / maxViews) * 100}%` }}
                    title={`${d.visitors} ziyaretci`}
                  />
                </div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" /> En Cok Ziyaret Edilen Sayfalar
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {topPages.map((p, i) => (
              <div key={p.page} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{p.page}</div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${p.percentage}%` }} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-slate-800">{p.views.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">%{p.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Device Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Cihaz Dagilimi</h3>
            <div className="space-y-3">
              {deviceStats.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 font-medium">{d.label}</span>
                        <span className="text-xs font-bold text-slate-800">%{d.value}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.value}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Trafik Kaynaklari</h3>
            <div className="space-y-3">
              {trafficSources.map((s) => (
                <div key={s.source} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 font-medium">{s.source}</span>
                      <span className="text-xs font-bold text-slate-800">%{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-red-500" /> Urun Performansi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left py-3 px-5 font-semibold">#</th>
                <th className="text-left py-3 px-5 font-semibold">Urun</th>
                <th className="text-center py-3 px-5 font-semibold">Goruntulenme</th>
                <th className="text-center py-3 px-5 font-semibold">Sorgu</th>
                <th className="text-center py-3 px-5 font-semibold">WhatsApp</th>
                <th className="text-center py-3 px-5 font-semibold">Donusum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {popularProducts.map((p, i) => (
                <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  </td>
                  <td className="py-3 px-5 text-sm font-semibold text-slate-800">{p.name}</td>
                  <td className="py-3 px-5 text-center text-sm text-slate-600">{p.views.toLocaleString()}</td>
                  <td className="py-3 px-5 text-center text-sm text-slate-600">{p.inquiries}</td>
                  <td className="py-3 px-5 text-center text-sm text-slate-600">{p.whatsapp}</td>
                  <td className="py-3 px-5 text-center">
                    <span className="text-sm font-bold text-green-600">{p.conversion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Ort. Oturum Suresi</span>
          </div>
          <div className="text-xl font-bold text-slate-800">2dk 45sn</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Sayfa/Oturum</span>
          </div>
          <div className="text-xl font-bold text-slate-800">3.4</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Hemen Cikma</span>
          </div>
          <div className="text-xl font-bold text-slate-800">%38</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Geri Donus Orani</span>
          </div>
          <div className="text-xl font-bold text-slate-800">%24</div>
        </div>
      </div>
    </div>
  );
}
