"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, MessageSquare, Settings,
  Images, Star, LogOut, Menu, X, Shield, ExternalLink,
  Bell, Brain, ChevronRight, Palette, FileText,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newContacts, setNewContacts] = useState(0);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNewContacts(data.filter((c: any) => c.status === "new").length);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  const navGroups = [
    {
      label: "Genel",
      links: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/iletisim-formlari", label: "İletişim Formları", icon: MessageSquare, badge: newContacts },
      ],
    },
    {
      label: "İçerik",
      links: [
        { href: "/admin/urunler", label: "Ürünler", icon: Package },
        { href: "/admin/galeri", label: "Galeri", icon: Images },
        { href: "/admin/yorumlar", label: "Yorumlar", icon: Star },
        { href: "/admin/icerikler", label: "Sayfa İçerikleri", icon: FileText },
      ],
    },
    {
      label: "Ayarlar",
      links: [
        { href: "/admin/site-ayarlari", label: "Site Ayarları", icon: Settings },
        { href: "/admin/gorunum", label: "Görünüm", icon: Palette },
        { href: "/admin/yapay-zeka", label: "Yapay Zeka", icon: Brain },
      ],
    },
  ];

  const activeLabel = navGroups.flatMap(g => g.links).find(l => l.href === pathname)?.label || "Admin";

  return (
    <div className="min-h-screen flex" style={{ background: "#F1F5F9" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0F172A", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#DC2626,#991B1B)" }}>
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Best Kapı</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="px-3 mb-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.links.map(link => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        background: isActive ? "rgba(220,38,38,0.15)" : "transparent",
                        color: isActive ? "#FCA5A5" : "rgba(255,255,255,0.5)",
                        fontWeight: isActive ? 600 : 400,
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)"; }}
                      onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; } }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{link.label}</span>
                      {"badge" in link && (link.badge ?? 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "#DC2626", minWidth: "18px", textAlign: "center" }}>
                          {link.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: "#FCA5A5" }} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "12px" }}>
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
          >
            <ExternalLink className="w-4 h-4" />
            Siteyi Görüntüle
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: "rgba(248,113,113,0.7)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.1)"; (e.currentTarget as HTMLElement).style.color = "#FCA5A5"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.7)"; }}
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 py-3"
          style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg transition-colors hover:bg-slate-100">
              {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-none">{activeLabel}</h1>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-none">Best Kapı Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {newContacts > 0 && (
              <Link href="/admin/iletisim-formlari"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: "#FEF2F2", color: "#DC2626" }}>
                <Bell className="w-3.5 h-3.5" />
                {newContacts} yeni form
              </Link>
            )}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#DC2626,#991B1B)" }}>
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
