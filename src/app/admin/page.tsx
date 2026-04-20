"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, MessageSquare, Star, Eye, TrendingUp,
  ArrowUpRight, Phone, Clock, Users, Sparkles, BarChart3,
  ArrowUp, ArrowDown, Activity, Globe, MousePointerClick,
  Smartphone, Monitor, Brain, Palette, Loader2, Images,
} from "lucide-react";

interface Stats {
  products: { total: number; inStock: number };
  reviews: { total: number; avgRating: string };
  contacts: { total: number; new: number };
  gallery: { total: number; featured: number };
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  product: string;
  status: string;
  createdat: string;
}

const quickActions = [
  { label: "Yeni Ürün Ekle", icon: Package, href: "/admin/urunler", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "Formları Gör", icon: MessageSquare, href: "/admin/iletisim-formlari", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
  { label: "Yorum Ekle", icon: Star, href: "/admin/yorumlar", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "Galeri", icon: Images, href: "/admin/galeri", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
  { label: "AI Ayarları", icon: Brain, href: "/admin/yapay-zeka", color: "text-red-600 bg-red-50 hover:bg-red-100" },
  { label: "Site Ayarları", icon: BarChart3, href: "/admin/site-ayarlari", color: "text-slate-700 bg-slate-50 hover:bg-slate-100" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then(r => r.json()),
      fetch("/api/admin/contacts").then(r => r.json()),
    ]).then(([statsData, contactsData]) => {
      if (!statsData.error) setStats(statsData);
      if (Array.isArray(contactsData)) setContacts(contactsData.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Tüm Ürünler", value: String(stats.products.total), change: `${stats.products.inStock} stokta`, up: true, icon: Package, color: "bg-red-500", href: "/admin/urunler" },
    { label: "İletişim Formları", value: String(stats.contacts.total), change: `${stats.contacts.new} yeni`, up: stats.contacts.new > 0, icon: MessageSquare, color: "bg-red-600", href: "/admin/iletisim-formlari" },
    { label: "Müşteri Yorumları", value: String(stats.reviews.total), change: `${stats.reviews.avgRating}★ ort.`, up: true, icon: Star, color: "bg-slate-800", href: "/admin/yorumlar" },
    { label: "Galeri", value: String(stats.gallery.total), change: `${stats.gallery.featured} öne çıkan`, up: true, icon: Images, color: "bg-slate-600", href: "/admin/galeri" },
  ] : [];

  const statusLabels: Record<string, { label: string; color: string }> = {
    new: { label: "Yeni", color: "bg-red-100 text-red-700" },
    read: { label: "Okundu", color: "bg-blue-100 text-blue-700" },
    replied: { label: "Yanıtlandı", color: "bg-green-100 text-green-700" },
    archived: { label: "Arşiv", color: "bg-slate-100 text-slate-500" },
  };

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
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse">
              <div className="h-10 w-10 bg-slate-200 rounded-lg mb-3" />
              <div className="h-6 w-16 bg-slate-200 rounded mb-1" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${stat.up ? "text-green-600 bg-green-50" : "text-slate-500 bg-slate-100"}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </Link>
            );
          })}
        </div>
      )}

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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400">Henüz iletişim formu yok.</div>
            ) : contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${contact.status === "new" ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {contact.name.split(" ").map((n: string) => n[0]).join("")}
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
                  <div className="text-[10px] text-slate-400">{new Date(contact.createdat).toLocaleDateString("tr-TR")}</div>
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

          {/* DB Stats */}
          {stats && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4">Veritabanı Özeti</h3>
              <div className="space-y-3">
                {[
                  { label: "Ürün (stokta)", value: `${stats.products.inStock}/${stats.products.total}`, bar: stats.products.total > 0 ? (stats.products.inStock / stats.products.total) * 100 : 0, color: "bg-red-500" },
                  { label: "Yorumlar", value: `${stats.reviews.total} yorum`, bar: Math.min(stats.reviews.total * 10, 100), color: "bg-amber-500" },
                  { label: "Galeri görseli", value: `${stats.gallery.total} adet`, bar: Math.min(stats.gallery.total * 5, 100), color: "bg-blue-500" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 font-medium">{d.label}</span>
                        <span className="text-xs font-bold text-slate-800">{d.value}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full transition-all`} style={{ width: `${d.bar}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
