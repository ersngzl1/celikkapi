import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim - Adana Çelik Kapı",
  description:
    "Best Kapı Adana iletişim bilgileri. Çelik kapı siparişi, fiyat teklifi ve montaj randevusu için bizi arayın. Adana ve çevre illere hizmet veriyoruz.",
  keywords: [
    "best kapı iletişim", "adana çelik kapı telefon", "çelik kapı sipariş",
    "çelik kapı fiyat teklifi", "adana kapıcı telefon",
  ],
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title: "İletişim - Best Kapı Adana",
    description: "Çelik kapı siparişi ve fiyat teklifi için bize ulaşın. Adana ve çevre illere hizmet veriyoruz.",
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
