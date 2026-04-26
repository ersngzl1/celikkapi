import { sql } from "@vercel/postgres";
import { doors } from "@/data/doors";

export function generateSlug(name: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return name
    .split("")
    .map(c => turkishMap[c] || c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function initDB() {
  try {
    // Create tables if they don't exist
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        series TEXT NOT NULL,
        category TEXT NOT NULL,
        color TEXT NOT NULL,
        colorHex TEXT NOT NULL,
        thickness TEXT NOT NULL,
        material TEXT NOT NULL,
        lockSystem TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        weight TEXT NOT NULL,
        insulation TEXT NOT NULL,
        warranty TEXT NOT NULL,
        description TEXT NOT NULL,
        features TEXT NOT NULL,
        image TEXT NOT NULL,
        inStock INTEGER NOT NULL DEFAULT 1,
        featured INTEGER NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    // Add featured column if missing (migration)
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS featured INTEGER NOT NULL DEFAULT 0`;
    } catch {};

    // Add slug column if missing (migration)
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT`;
      // Generate slugs for existing products that don't have one
      const noSlug = await sql`SELECT id, name FROM products WHERE slug IS NULL OR slug = ''`;
      for (const row of noSlug.rows || []) {
        const slug = generateSlug(row.name as string);
        await sql`UPDATE products SET slug = ${slug} WHERE id = ${row.id}`;
      }
    } catch {};

    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        text TEXT NOT NULL,
        location TEXT,
        verified INTEGER NOT NULL DEFAULT 0,
        date TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        src TEXT NOT NULL,
        alt TEXT NOT NULL,
        category TEXT NOT NULL,
        featured INTEGER NOT NULL DEFAULT 0,
        ordering INTEGER NOT NULL DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        product TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        page TEXT NOT NULL,
        section TEXT NOT NULL,
        data TEXT NOT NULL DEFAULT '{}',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page, section)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        value TEXT UNIQUE NOT NULL,
        label TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS images (
        hash TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        mime TEXT NOT NULL DEFAULT 'image/jpeg',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed products if empty
    const result = await sql`SELECT COUNT(*) as count FROM products`;
    const count = (result.rows[0] as any).count;

    if (count === 0) {
      for (const door of doors) {
        const slug = generateSlug(door.name);
        await sql`
          INSERT INTO products (id, name, slug, series, category, color, colorHex, thickness, material, lockSystem, dimensions, weight, insulation, warranty, description, features, image, inStock)
          VALUES (${door.id}, ${door.name}, ${slug}, ${door.series}, ${door.category}, ${door.color}, ${door.colorHex}, ${door.thickness}, ${door.material}, ${door.lockSystem}, ${door.dimensions}, ${door.weight}, ${door.insulation}, ${door.warranty}, ${door.description}, ${JSON.stringify(door.features)}, ${door.image}, ${door.inStock ? 1 : 0})
        `;
      }
    }
  } catch (error) {
    console.error("Database init error:", error);
  }
}

// Map PostgreSQL lowercase columns to camelCase
function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    series: p.series,
    category: p.category,
    color: p.color,
    colorHex: p.colorhex ?? p.colorHex ?? "#1E293B",
    thickness: p.thickness,
    material: p.material,
    lockSystem: p.locksystem ?? p.lockSystem ?? "",
    dimensions: p.dimensions,
    weight: p.weight,
    insulation: p.insulation,
    warranty: p.warranty,
    description: p.description,
    features: typeof p.features === "string" ? JSON.parse(p.features) : (p.features || []),
    image: p.image,
    installedImage: p.installedimage ?? p.installedImage ?? null,
    inStock: p.instock ?? p.inStock ?? 1,
    featured: p.featured ?? 0,
    createdAt: p.createdat ?? p.createdAt,
  };
}

// Product queries
export const productQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM products ORDER BY id DESC`;
    return (result.rows || []).map(mapProduct);
  },

  getById: async (id: number) => {
    const result = await sql`SELECT * FROM products WHERE id = ${id}`;
    const row = result.rows?.[0];
    return row ? mapProduct(row) : null;
  },

  getBySlug: async (slug: string) => {
    const result = await sql`SELECT * FROM products WHERE slug = ${slug}`;
    const row = result.rows?.[0];
    return row ? mapProduct(row) : null;
  },

  create: async (product: any) => {
    const slug = product.slug || generateSlug(product.name);
    const colorHex = product.colorHex || product.colorhex || "#1E293B";
    const lockSystem = product.lockSystem || product.locksystem || "";
    const inStock = product.inStock ?? product.instock ?? 1;
    await sql`
      INSERT INTO products (id, name, slug, series, category, color, colorHex, thickness, material, lockSystem, dimensions, weight, insulation, warranty, description, features, image, inStock)
      VALUES (${product.id}, ${product.name}, ${slug}, ${product.series}, ${product.category}, ${product.color}, ${colorHex}, ${product.thickness}, ${product.material}, ${lockSystem}, ${product.dimensions}, ${product.weight}, ${product.insulation}, ${product.warranty}, ${product.description}, ${JSON.stringify(product.features || [])}, ${product.image}, ${inStock ? 1 : 0})
    `;
  },

  update: async (id: number, product: any) => {
    const slug = product.slug || generateSlug(product.name);
    const colorHex = product.colorHex || product.colorhex || "#1E293B";
    const lockSystem = product.lockSystem || product.locksystem || "";
    const inStock = product.inStock ?? product.instock ?? 1;
    await sql`
      UPDATE products SET
        name = ${product.name},
        slug = ${slug},
        series = ${product.series},
        category = ${product.category},
        color = ${product.color},
        colorHex = ${colorHex},
        thickness = ${product.thickness},
        material = ${product.material},
        lockSystem = ${lockSystem},
        dimensions = ${product.dimensions},
        weight = ${product.weight},
        insulation = ${product.insulation},
        warranty = ${product.warranty},
        description = ${product.description},
        features = ${JSON.stringify(product.features || [])},
        image = ${product.image},
        inStock = ${inStock ? 1 : 0}
      WHERE id = ${id}
    `;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM products WHERE id = ${id}`;
  },

  toggleFeatured: async (id: number, featured: number) => {
    await sql`UPDATE products SET featured = ${featured} WHERE id = ${id}`;
  },
};

// Review queries
export const reviewQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM reviews ORDER BY createdAt DESC`;
    return result.rows || [];
  },

  create: async (review: any) => {
    await sql`
      INSERT INTO reviews (name, rating, text, location, verified, date)
      VALUES (${review.name}, ${review.rating}, ${review.text}, ${review.location || null}, ${review.verified ? 1 : 0}, ${review.date})
    `;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM reviews WHERE id = ${id}`;
  },
};

// Gallery queries
export const galleryQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM gallery ORDER BY ordering ASC`;
    return result.rows || [];
  },

  create: async (item: any) => {
    await sql`
      INSERT INTO gallery (src, alt, category, featured, ordering)
      VALUES (${item.src}, ${item.alt}, ${item.category}, ${item.featured ? 1 : 0}, ${item.ordering || 0})
    `;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM gallery WHERE id = ${id}`;
  },
};

// Contact queries
export const contactQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM contacts ORDER BY createdAt DESC`;
    return result.rows || [];
  },

  create: async (contact: any) => {
    await sql`
      INSERT INTO contacts (name, phone, email, message, product, status)
      VALUES (${contact.name}, ${contact.phone}, ${contact.email}, ${contact.message}, ${contact.product}, 'new')
    `;
  },

  updateStatus: async (id: number, status: string) => {
    await sql`UPDATE contacts SET status = ${status} WHERE id = ${id}`;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM contacts WHERE id = ${id}`;
  },
};

// Category queries
export const categoryQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM categories ORDER BY value ASC`;
    return result.rows || [];
  },

  getById: async (id: number) => {
    const result = await sql`SELECT * FROM categories WHERE id = ${id}`;
    return result.rows?.[0];
  },

  create: async (category: any) => {
    const result = await sql`
      INSERT INTO categories (value, label)
      VALUES (${category.value}, ${category.label})
      RETURNING id
    `;
    return result.rows?.[0];
  },

  update: async (id: number, category: any) => {
    await sql`
      UPDATE categories SET
        value = ${category.value},
        label = ${category.label}
      WHERE id = ${id}
    `;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM categories WHERE id = ${id}`;
  },
};

// Image queries
export const imageQueries = {
  save: async (hash: string, data: string, mime: string) => {
    await sql`
      INSERT INTO images (hash, data, mime)
      VALUES (${hash}, ${data}, ${mime})
      ON CONFLICT (hash) DO NOTHING
    `;
  },

  get: async (hash: string) => {
    const result = await sql`SELECT data, mime FROM images WHERE hash = ${hash}`;
    return result.rows?.[0];
  },
};

// Content queries (CMS)
export const contentQueries = {
  getByPage: async (page: string) => {
    const result = await sql`SELECT section, data FROM content WHERE page = ${page}`;
    const content: Record<string, any> = {};
    for (const row of result.rows || []) {
      try { content[row.section as string] = JSON.parse(row.data as string); } catch { content[row.section as string] = row.data; }
    }
    return content;
  },

  get: async (page: string, section: string) => {
    const result = await sql`SELECT data FROM content WHERE page = ${page} AND section = ${section}`;
    const row = result.rows?.[0];
    if (!row) return null;
    try { return JSON.parse(row.data as string); } catch { return row.data; }
  },

  save: async (page: string, section: string, data: any) => {
    const jsonData = typeof data === "string" ? data : JSON.stringify(data);
    await sql`
      INSERT INTO content (page, section, data) VALUES (${page}, ${section}, ${jsonData})
      ON CONFLICT (page, section) DO UPDATE SET data = EXCLUDED.data, updatedAt = NOW()
    `;
  },
};
