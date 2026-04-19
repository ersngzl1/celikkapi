import { sql } from "@vercel/postgres";
import { doors } from "@/data/doors";

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
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

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

    // Seed products if empty
    const result = await sql`SELECT COUNT(*) as count FROM products`;
    const count = (result.rows[0] as any).count;

    if (count === 0) {
      for (const door of doors) {
        await sql`
          INSERT INTO products (id, name, series, category, color, colorHex, thickness, material, lockSystem, dimensions, weight, insulation, warranty, description, features, image, inStock)
          VALUES (${door.id}, ${door.name}, ${door.series}, ${door.category}, ${door.color}, ${door.colorHex}, ${door.thickness}, ${door.material}, ${door.lockSystem}, ${door.dimensions}, ${door.weight}, ${door.insulation}, ${door.warranty}, ${door.description}, ${JSON.stringify(door.features)}, ${door.image}, ${door.inStock ? 1 : 0})
        `;
      }
    }
  } catch (error) {
    console.error("Database init error:", error);
  }
}

// Product queries
export const productQueries = {
  getAll: async () => {
    const result = await sql`SELECT * FROM products ORDER BY id DESC`;
    return (result.rows || []).map((p: any) => ({
      ...p,
      features: typeof p.features === "string" ? JSON.parse(p.features) : p.features,
    }));
  },

  getById: async (id: number) => {
    const result = await sql`SELECT * FROM products WHERE id = ${id}`;
    const row = result.rows?.[0];
    if (row) {
      row.features = typeof row.features === "string" ? JSON.parse(row.features) : row.features;
    }
    return row;
  },

  create: async (product: any) => {
    await sql`
      INSERT INTO products (id, name, series, category, color, colorHex, thickness, material, lockSystem, dimensions, weight, insulation, warranty, description, features, image, inStock)
      VALUES (${product.id}, ${product.name}, ${product.series}, ${product.category}, ${product.color}, ${product.colorHex}, ${product.thickness}, ${product.material}, ${product.lockSystem}, ${product.dimensions}, ${product.weight}, ${product.insulation}, ${product.warranty}, ${product.description}, ${JSON.stringify(product.features || [])}, ${product.image}, ${product.inStock ? 1 : 0})
    `;
  },

  update: async (id: number, product: any) => {
    await sql`
      UPDATE products SET
        name = ${product.name},
        series = ${product.series},
        category = ${product.category},
        color = ${product.color},
        colorHex = ${product.colorHex},
        thickness = ${product.thickness},
        material = ${product.material},
        lockSystem = ${product.lockSystem},
        dimensions = ${product.dimensions},
        weight = ${product.weight},
        insulation = ${product.insulation},
        warranty = ${product.warranty},
        description = ${product.description},
        features = ${JSON.stringify(product.features || [])},
        image = ${product.image},
        inStock = ${product.inStock ? 1 : 0}
      WHERE id = ${id}
    `;
  },

  delete: async (id: number) => {
    await sql`DELETE FROM products WHERE id = ${id}`;
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
