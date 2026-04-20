import type { Metadata } from "next";
import { initDB, productQueries, generateSlug } from "@/lib/db-vercel";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: idOrSlug } = await params;

  try {
    await initDB();
    const numId = parseInt(idOrSlug);
    const product = !isNaN(numId)
      ? await productQueries.getById(numId)
      : await productQueries.getBySlug(idOrSlug);

    if (!product) {
      return { title: "Ürün Bulunamadı" };
    }

    const slug = product.slug || generateSlug(product.name);
    const title = `${product.name} - ${product.category} | Adana Çelik Kapı`;
    const description = product.description
      ? `${product.name} çelik kapı modeli. ${product.description.slice(0, 140)}. Best Kapı güvencesiyle Adana'da satış ve montaj.`
      : `${product.name} çelik kapı - ${product.series} serisi. ${product.material}, ${product.lockSystem} kilit sistemi. Adana'da satış ve montaj.`;

    return {
      title,
      description,
      keywords: [
        `${product.name.toLowerCase()}`,
        `${product.name.toLowerCase()} fiyat`,
        `${product.series.toLowerCase()} çelik kapı`,
        `${product.category.toLowerCase()} adana`,
        "çelik kapı fiyatları",
        "adana çelik kapı",
      ],
      alternates: { canonical: `/urun/${slug}` },
      openGraph: {
        title: `${product.name} - ${product.category}`,
        description,
        images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
      },
    };
  } catch {
    return { title: "Ürün Detayı" };
  }
}

export default function UrunLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
