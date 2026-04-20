import { MetadataRoute } from "next";
import { initDB, productQueries, generateSlug } from "@/lib/db-vercel";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bestkapi.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/katalog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/ai-deneme`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/iletisim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  try {
    await initDB();
    const products = await productQueries.getAll();
    const productPages = products.map((product: any) => ({
      url: `${baseUrl}/urun/${product.slug || generateSlug(product.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
