import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { initDB, productQueries, reviewQueries, contactQueries, galleryQueries } from "@/lib/db-vercel";

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();

    const [products, reviews, contacts, gallery] = await Promise.all([
      productQueries.getAll(),
      reviewQueries.getAll(),
      contactQueries.getAll(),
      galleryQueries.getAll(),
    ]);

    const stats = {
      products: {
        total: products.length,
        inStock: products.filter((p: any) => p.inStock).length,
      },
      reviews: {
        total: reviews.length,
        avgRating: reviews.length > 0
          ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
          : "0",
      },
      contacts: {
        total: contacts.length,
        new: contacts.filter((c: any) => c.status === "new").length,
      },
      gallery: {
        total: gallery.length,
        featured: gallery.filter((g: any) => g.featured).length,
      },
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
