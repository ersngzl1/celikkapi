import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI ile Kapınızı Evinizde Görün",
  description:
    "Yapay zeka teknolojisiyle çelik kapınızı monte edilmeden önce evinizde görün. Fotoğraf yükleyin, kapı modelini seçin, sonucu anında görün.",
  keywords: [
    "çelik kapı görselleştirme", "kapı simülasyon", "AI kapı deneme",
    "kapı nasıl görünür", "çelik kapı evinizde deneyin",
  ],
  alternates: { canonical: "/ai-deneme" },
  openGraph: {
    title: "AI ile Çelik Kapınızı Evinizde Deneyin - Best Kapı",
    description: "Yapay zeka ile çelik kapınızı monte edilmeden önce evinizde görün.",
  },
};

export default function AIDenemeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
