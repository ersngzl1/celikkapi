import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çelik Kapı Modelleri ve Fiyatları - Katalog",
  description:
    "Adana'da satışa sunulan tüm çelik kapı ve oda kapısı modelleri. Best Kapı güvencesiyle TSE belgeli çelik kapılar, villa kapıları ve iç mekan kapıları. Fiyat bilgisi için iletişime geçin.",
  keywords: [
    "çelik kapı modelleri", "çelik kapı kataloğu", "adana çelik kapı modelleri",
    "çelik kapı fiyatları adana", "oda kapısı modelleri", "villa kapısı modelleri",
  ],
  alternates: { canonical: "/katalog" },
  openGraph: {
    title: "Çelik Kapı Modelleri - Best Kapı Adana",
    description: "Adana'da tüm çelik kapı ve oda kapısı modellerini inceleyin. TSE belgeli, garantili kapılar.",
  },
};

export default function KatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
