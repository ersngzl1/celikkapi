import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Best Kapı - Adana Çelik Kapı",
  description:
    "Best Kapı, Best Pen güvencesiyle Adana ve çevre illerde çelik kapı satış ve montaj hizmeti vermektedir. Yılların tecrübesi, TSE belgeli üretim ve profesyonel montaj.",
  keywords:
    "best kapı hakkında, adana çelik kapı firması, best pen, adana güvenlik kapısı, çelik kapı adana",
};

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
