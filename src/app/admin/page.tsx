"use client";

import Link from "next/link";
import {
  Package, MessageSquare, Star, Eye, TrendingUp,
  ArrowUpRight, Phone, Clock, Users, Sparkles, BarChart3,
  ArrowUp, ArrowDown, Activity, Globe, MousePointerClick,
  Smartphone, Monitor, Brain, Palette,
} from "lucide-react";

const stats = [
  { label: "Tüm Ürünler", value: "12", change: "+2", up: true, icon: Package, color: "bg-red-500", href: "/admin/urunler" },
  { label: "İletişim Formları", value: "24", change: "+8", up: true, icon: MessageSquare, color: "bg-red-600", href: "/admin/iletisim-formlari" },
  { label: "Müşteri Yorumları", value: "18", change: "+3", up: true, icon: Star, color: "bg-slate-800", href: "/admin/yorumlar" },
];

const trafficStats = [
  { label: "Sayfa Görüntülenme", value: "3,248", change: "+12%", icon: Eye },
  { label: "Tekil Ziyaretçi", value: "1,892", change: "+8%", icon: Users },
  { label: "WhatsApp Tıklama", value: "156", change: "+23%", icon: MousePointerClick },
  { label: "AI Deneme", value: "89", change: "+45%", icon: Brain },
];

const recentContacts = [
  { name: "Ahmet Yılmaz", phone: "0532 111 22 33", message: "Villa kapısı fiyat bilgisi", date: "2 saat önce", status: "new" },
  { name: "Fatma Demir", phone: "0544 222 33 44", message: "Çelik kapı montaj", date: "5 saat önce", status: "read" },
  { name: "Mehmet Kara", phone: "0555 333 44 55", message: "Oda kapısı fiyat", date: "1 gün önce", status: "replied" },
  { name: "Ayşe Çelik", phone: "0533 444 55 66", message: "Toplu satış teklifi", date: "2 gün önce", status: "replied" },
];

const popularProducts = [
  { name: "Vega Modern", views: 342, inquiries: 28, conversion: "8.2%" },
  { name: "Titan Pro", views: 289, inquiries: 22, conversion: "7.6%" },
  { name: "Atlas Guard", views: 234, inquiries: 19, conversion: "8.1%" },
  { name: "Nova Elite", views: 198, inquiries: 15, conversion: "7.5%" },
];

const deviceStats = [
  { label: "Mobil", value: 68, icon: Smartphone, color: "bg-red-500" },
  { label: "Masaüstü", value: 28, icon: Monitor, color: "bg-slate-700" },
  { label: "Tablet", value: 4, icon: Globe, color: "bg-slate-400" },
];

const quickActions = [
  { label: "Yeni Ürün Ekle", icon: Package, href: "/admin/urunler", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "Formları Gör", icon: MessageSquare, href: "/admin/iletisim-formlari", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
  { label: "Yorum Ekle", icon: Star, href: "/admin/yorumlar", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "Görünüm Ayarla", icon: Palette, href: "/admin/gorunum", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
  { label: "AI Ayarları", icon: Brain, href: "/admin/yapay-zeka", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "İstatistikler", icon: BarChart3, href: "/admin/istatistikler", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Hoş Geldiniz!</h2>
            <p className="text-sm text-white/60 mt-1">Best Kapı admin panelinize genel bakış.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50 bg-white/10 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  <ArrowUp className="w-3 h-3" />{stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Traffic Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" /> Bu Ayın Trafiği
          </h3>
          <span className="text-xs text-slate-400">Son 30 gün</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trafficStats.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] text-slate-500 font-medium">{t.label}</span>
                </div>
                <div className="text-xl font-bold text-slate-800">{t.value}</div>
                <span className="text-[10px] font-bold text-green-600">{t.change} bu ay</span>
              </div>
            );
          })}
        </div>

        {/* Simple bar chart visualization */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-end gap-1.5 h-24">
            {[35, 42, 28, 55, 48, 62, 45, 70, 58, 75, 65, 82, 72, 90, 68, 85, 78, 92, 88, 95, 82, 98, 75, 88, 92, 78, 85, 90, 95, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-red-500/20 hover:bg-red-500/40 rounded-t transition-colors cursor-default" style={{ height: `${h}%` }} title={`Gün ${i+1}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-400">
            <span>1 Nisan</span>
            <span>15 Nisan</span>
            <span>30 Nisan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Son İletişim Formları</h3>
            <Link href="/admin/iletisim-formlari" className="text-xs font-semibold text-red-600 hover:text-red-700">
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentContacts.map((contact, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{contact.name}</span>
                    {contact.status === "new" && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">Yeni</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{contact.message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-slate-400">{contact.date}</div>
                  <a href={`tel:${contact.phone}`} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> Ara
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href} className={`flex flex-col items-center gap-2 p-3 rounded-xl text-xs font-medium transition-colors text-center ${action.color}`}>
                    <Icon className="w-5 h-5" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Cihaz Dağılımı</h3>
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
                        <div className={`h-full ${d.color} rounded-full transition-all`} style={{ width: `${d.value}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" /> En Popüler Ürünler
          </h3>
          <Link href="/admin/urunler" className="text-xs font-semibold text-red-600 hover:text-red-700">Tümünü Gör</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="text-left py-3 px-5 font-semibold">Ürün</th>
                <th className="text-center py-3 px-5 font-semibold">Görüntülenme</th>
                <th className="text-center py-3 px-5 font-semibold">Sorgu</th>
                <th className="text-center py-3 px-5 font-semibold">Dönüşüm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {popularProducts.map((p, i) => (
                <tr key={p.name} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center text-sm text-slate-600">{p.views}</td>
                  <td className="py-3 px-5 text-center text-sm text-slate-600">{p.inquiries}</td>
                  <td className="py-3 px-5 text-center">
                    <span className="text-sm font-bold text-green-600">{p.conversion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
