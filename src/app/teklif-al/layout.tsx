import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ücretsiz Keşif ve Fiyat Teklifi | Best Kapı Adana",
  description:
    "Adana ve çevre illerde çelik kapı ücretsiz keşif ve fiyat teklifi alın. Best Pen güvencesiyle profesyonel montaj. Hemen arayın veya WhatsApp'tan yazın.",
  robots: { index: false, follow: false },
};

export default function TeklifAlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
