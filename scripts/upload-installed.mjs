#!/usr/bin/env node
/**
 * Upload "evde takılmış" (installed) images for EkoGold products
 *
 * Usage: node scripts/upload-installed.mjs
 */

import fs from "fs";
import path from "path";

const BASE_DIR = "C:/Users/PC/Downloads/best_kapi_ekogold_urunler_EVDE_TAKILMIS_DUZGUN_ESLESME";
const API_URL = "https://www.bestkapi.com";

async function login() {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "best2026" }),
  });
  const cookie = res.headers.get("set-cookie");
  if (!cookie) throw new Error("Login failed - no cookie");
  return cookie.split(";")[0];
}

function findInstalledImages() {
  const items = [];
  const dirs = fs.readdirSync(BASE_DIR).filter(d => d.startsWith("EKOGOLD_") && fs.statSync(path.join(BASE_DIR, d)).isDirectory());

  for (const dir of dirs) {
    const dirPath = path.join(BASE_DIR, dir);
    const files = fs.readdirSync(dirPath);

    // Find evde_takilmis image - use folder number for product matching
    const folderMatch = dir.match(/EKOGOLD_(\d+)/);
    if (!folderMatch) continue;
    const modelNum = folderMatch[1]; // e.g. "001"

    // Find the evde_takilmis file in this folder (may have different number in filename)
    const installedFile = files.find(f => f.includes("evde_takilmis") && f.endsWith(".png"));
    if (!installedFile) continue;

    const productName = `Eko Gold ${modelNum}`;
    const imagePath = path.join(dirPath, installedFile);

    items.push({ productName, imagePath, modelNum });
  }

  return items;
}

async function uploadBatch(items, cookie) {
  const payload = items.map(item => {
    const imageBuffer = fs.readFileSync(item.imagePath);
    const imageBase64 = imageBuffer.toString("base64");
    return {
      productName: item.productName,
      imageBase64,
      imageMime: "image/png",
    };
  });

  const res = await fetch(`${API_URL}/api/admin/upload-installed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ items: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  return res.json();
}

async function main() {
  console.log("🔐 Logging in...");
  const cookie = await login();
  console.log("✅ Logged in\n");

  console.log("📁 Scanning for installed images...");
  const items = findInstalledImages();
  console.log(`Found ${items.length} installed images\n`);

  if (items.length === 0) {
    console.log("No images to upload.");
    return;
  }

  // Upload in batches of 2 (images are large)
  const BATCH_SIZE = 2;
  let uploaded = 0;

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const names = batch.map(b => b.productName).join(", ");
    console.log(`📤 Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}: ${names}`);

    try {
      const result = await uploadBatch(batch, cookie);
      console.log(`   ✅ ${JSON.stringify(result.summary)}`);
      uploaded += result.summary.updated || 0;
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }

    // Small delay between batches
    if (i + BATCH_SIZE < items.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n🎉 Done! ${uploaded}/${items.length} installed images uploaded.`);
}

main().catch(console.error);
