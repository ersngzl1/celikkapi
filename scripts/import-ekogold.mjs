/**
 * Import EkoGold products to the live site
 *
 * Usage: node scripts/import-ekogold.mjs
 *
 * This script:
 * 1. Logs into the admin panel
 * 2. Reads all product images from the desktop folder
 * 3. Sends them in batches to the bulk-import API
 */

import { readFileSync } from "fs";
import { join } from "path";

const SITE_URL = "https://www.bestkapi.com";
const ADMIN_USER = "admin";
const ADMIN_PASS = "best2026";

const BASE_DIR = "C:/Users/PC/Desktop/best_kapi_ekogold_urunler_DOGRU";

const COLOR_HEX = {
  "Antrasit": "#3C3C3C",
  "Saruhan": "#8B6914",
  "Gri Meşe": "#7A7A6E",
  "Beyaz": "#F5F5F0",
  "Siyah": "#1A1A1A",
  "Sedir": "#A0522D",
};

const standardFeatures = [
  "1.2mm Çelik Sac",
  "Silinebilir Yüzey",
  "Çizilmeye Dirençli",
  "Antibakteriyel Yüzey",
  "Ses İzolasyonu",
  "Isı İzolasyonu",
  "Dayanıklı Gövde",
  "Modern Tasarım",
];

const descriptions = {
  "001": "Doğal saruhan ahşap dokusu ve antrasit çelik gövdenin uyumu ile modern yaşam alanlarına zarif bir giriş sunar. Dikey çıta detayları kapıya derinlik ve karakter katar.",
  "002": "Antrasit metalik yüzey ile gri meşe ahşap panellerin sofistike birleşimi. Geometrik tasarımı ile dikkat çeken bu model, minimalist mekanlar için ideal bir tercih.",
  "003": "Saruhan ceviz tonları ve antrasit çelik çerçevenin kusursuz dengesi. Yatay ve dikey hatların zarif geçişleri ile modern mimariye uyum sağlar.",
  "004": "Saf beyaz yüzey ve antrasit detayların sade şıklığı. Temiz hatları ile aydınlık ve ferah mekanlar için tasarlanmış, minimalist bir çelik kapı.",
  "005": "Saruhan ahşap desenli geniş paneller ve antrasit çelik çerçeve ile güçlü bir ilk izlenim bırakan model. Doğal sıcaklığı ile evinize davetkar bir atmosfer katar.",
  "006": "Antrasit gövde üzerinde beyaz panel detaylarının yarattığı çarpıcı kontrast. Modern ve cesur tasarımı ile fark yaratan bir giriş kapısı.",
  "007": "Beyaz lamine yüzey üzerine antrasit çizgi detayları ile sade ve şık bir tasarım. Aydınlık mekanlara uyum sağlayan zarif bir çelik kapı modeli.",
  "008": "Saruhan doğal ahşap dokusu ve antrasit metal çerçevenin güçlü birleşimi. Geniş panel tasarımı ile mekanınıza prestijli bir görünüm kazandırır.",
  "009": "Saruhan ceviz tonları ve siyah çelik detayların dramatik uyumu. Koyu tonların yarattığı sofistike atmosfer ile lüks konutlar için ideal bir tercih.",
  "010": "Yatay ahşap çıtaların dinamik ritmi ile saruhan ve antrasit tonların buluşması. Doğadan ilham alan bu tasarım, kapınızı bir sanat eserine dönüştürür.",
  "011": "Saruhan doğal doku ve antrasit çelik harmonisi ile klasik zarafeti modern çizgilerle yorumlayan bir model. Her tarz dekora uyum sağlayan çok yönlü tasarım.",
  "012": "Gri meşe ahşap paneller ve antrasit çelik gövdenin soğuk tonlu elegansı. Endüstriyel ve modern iç mekanlara mükemmel uyum sağlar.",
  "013": "Gri meşe dokunun geniş yüzeylerde sergilendiği, antrasit detaylarla tamamlanan etkileyici bir tasarım. Büyük girişler için ideal boyut ve görsellik sunar.",
  "014": "Sedir ağacının sıcak kızıl tonları ve antrasit çeliğin güçlü duruşu bir arada. Doğal ve otantik bir giriş deneyimi sunan benzersiz bir model.",
  "015": "Saruhan ahşap ve antrasit çeliğin dengeli birleşimi ile hem sıcak hem modern bir karakter taşıyan kapı. Her mevsim, her mekanda göz dolduran tasarım.",
  "016": "Gri meşe tonlarının sakinleştirici etkisi ve antrasit çerçevenin net hatları. Ofis girişleri ve modern konutlar için profesyonel bir görünüm sunar.",
  "017": "Beyaz lamine yüzey ve ince antrasit bordür detayları ile minimalist estetiğin doruk noktası. Sade ama etkileyici bir giriş kapısı arayanlar için.",
  "018": "Antrasit ana gövde üzerinde beyaz panel aksan ile cesur ve çağdaş bir tasarım. Kontrastların gücünü yansıtan modern bir çelik kapı.",
  "019": "Saruhan ceviz deseni ve antrasit çelik çerçevenin klasik buluşması. Zamansız tasarımı ile yıllar boyu değerini koruyan bir yatırım.",
  "020": "Gri meşe ahşap dokusu ve antrasit metalin soğuk zarfeti. Modern apartman ve villa girişlerine profesyonel bir dokunuş ekler.",
  "021": "Beyaz yüzeyin ferahlığı ve antrasit hatların modern çizgileri bir arada. Küçük girişleri bile geniş ve aydınlık gösteren akıllı tasarım.",
  "022": "Antrasit metalik yüzey ve beyaz panel detayları ile endüstriyel şıklık. Loft ve modern yaşam alanlarına mükemmel uyum sağlayan cesur bir seçim.",
  "023": "Gri meşe doğal ahşap dokusu ve antrasit çerçevenin sofistike birleşimi. Geniş panel yapısı ile kapınıza monoblok ve güçlü bir görünüm kazandırır.",
  "024": "Saruhan ahşap sıcaklığı ve antrasit çeliğin dayanıklılığı bir arada. Klasik Türk evlerinden modern villalara uzanan çok yönlü bir tasarım.",
  "025": "Antrasit ana renk ve saruhan ahşap aksan detayları ile Ultralam serisinin güçlü başlangıcı. Ultra dayanıklı laminat kaplama ile uzun ömürlü şıklık.",
  "026": "Beyaz lamine yüzey ve antrasit çerçevenin Ultralam teknolojisi ile buluşması. Ekstra dayanıklı kaplama sayesinde yoğun kullanıma uygun şık bir kapı.",
  "027": "Gri meşe Ultralam kaplama ile doğal ahşap görünümünün en dayanıklı hali. Tek renk bütünlüğü ile kapınıza sofistike ve sade bir karakter katar.",
  "028": "Gri meşe Ultralam kaplama teknolojisi ile üstün dayanıklılık ve doğal estetik. Farklı panel deseni ile serideki diğer modellerden ayrışan özgün bir tasarım.",
};

const productList = [
  { model: "EKOGOLD_001", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_001_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_002", category: "EKO LAMINOKS SERI", color: "ANTRASIT / GRI MESE", folder: "EKOGOLD_002_ANTRASIT___GRI_MESE" },
  { model: "EKOGOLD_003", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_003_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_004", category: "EKO LAMINOKS SERI", color: "BEYAZ / ANTRASIT", folder: "EKOGOLD_004_BEYAZ___ANTRASIT" },
  { model: "EKOGOLD_005", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_005_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_006", category: "EKO LAMINOKS SERI", color: "ANTRASIT / BEYAZ", folder: "EKOGOLD_006_ANTRASIT___BEYAZ" },
  { model: "EKOGOLD_007", category: "EKO LAMINOKS SERI", color: "BEYAZ / ANTRASIT", folder: "EKOGOLD_007_BEYAZ___ANTRASIT" },
  { model: "EKOGOLD_008", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_008_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_009", category: "EKO LAMINOKS SERI", color: "SARUHAN / SIYAH", folder: "EKOGOLD_009_SARUHAN___SIYAH" },
  { model: "EKOGOLD_010", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_010_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_011", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_011_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_012", category: "EKO LAMINOKS SERI", color: "GRI MESE / ANTRASIT", folder: "EKOGOLD_012_GRI_MESE___ANTRASIT" },
  { model: "EKOGOLD_013", category: "EKO LAMINOKS SERI", color: "GRI MESE / ANTRASIT", folder: "EKOGOLD_013_GRI_MESE___ANTRASIT" },
  { model: "EKOGOLD_014", category: "EKO LAMINOKS SERI", color: "SEDIR / ANTRASIT", folder: "EKOGOLD_014_SEDIR___ANTRASIT" },
  { model: "EKOGOLD_015", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_015_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_016", category: "EKO LAMINOKS SERI", color: "GRI MESE / ANTRASIT", folder: "EKOGOLD_016_GRI_MESE___ANTRASIT" },
  { model: "EKOGOLD_017", category: "EKO LAMINOKS SERI", color: "BEYAZ / ANTRASIT", folder: "EKOGOLD_017_BEYAZ___ANTRASIT" },
  { model: "EKOGOLD_018", category: "EKO LAMINOKS SERI", color: "ANTRASIT / BEYAZ", folder: "EKOGOLD_018_ANTRASIT___BEYAZ" },
  { model: "EKOGOLD_019", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_019_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_020", category: "EKO LAMINOKS SERI", color: "GRI MESE / ANTRASIT", folder: "EKOGOLD_020_GRI_MESE___ANTRASIT" },
  { model: "EKOGOLD_021", category: "EKO LAMINOKS SERI", color: "BEYAZ / ANTRASIT", folder: "EKOGOLD_021_BEYAZ___ANTRASIT" },
  { model: "EKOGOLD_022", category: "EKO LAMINOKS SERI", color: "ANTRASIT / BEYAZ", folder: "EKOGOLD_022_ANTRASIT___BEYAZ" },
  { model: "EKOGOLD_023", category: "EKO LAMINOKS SERI", color: "GRI MESE / ANTRASIT", folder: "EKOGOLD_023_GRI_MESE___ANTRASIT" },
  { model: "EKOGOLD_024", category: "EKO LAMINOKS SERI", color: "SARUHAN / ANTRASIT", folder: "EKOGOLD_024_SARUHAN___ANTRASIT" },
  { model: "EKOGOLD_025", category: "EKO ULTRALAM SERI", color: "ANTRASIT / SARUHAN", folder: "EKOGOLD_025_ANTRASIT___SARUHAN" },
  { model: "EKOGOLD_026", category: "EKO ULTRALAM SERI", color: "BEYAZ / ANTRASIT", folder: "EKOGOLD_026_BEYAZ___ANTRASIT" },
  { model: "EKOGOLD_027", category: "EKO ULTRALAM SERI", color: "GRI MESE", folder: "EKOGOLD_027_GRI_MESE" },
  { model: "EKOGOLD_028", category: "EKO ULTRALAM SERI", color: "GRI MESE", folder: "EKOGOLD_028_GRI_MESE" },
];

function formatColor(raw) {
  return raw
    .split("/")
    .map(c => {
      const t = c.trim().toLowerCase();
      if (t === "gri mese") return "Gri Meşe";
      if (t === "sedir") return "Sedir";
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .join(" / ");
}

function getColorHex(colorStr) {
  const firstColor = colorStr.split("/")[0].trim();
  return COLOR_HEX[firstColor] || "#3C3C3C";
}

function formatCategory(raw) {
  return raw.replace(/\s*SERI\s*/i, "").trim()
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function main() {
  console.log("=== EkoGold Product Import ===\n");

  // Step 1: Login
  console.log("Logging in...");
  const loginRes = await fetch(`${SITE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "best2026" }),
  });

  const cookies = loginRes.headers.getSetCookie?.() || [];
  const tokenCookie = cookies.find(c => c.startsWith("admin_token="));
  if (!tokenCookie) {
    // Try extracting from set-cookie header
    const setCookie = loginRes.headers.get("set-cookie") || "";
    const match = setCookie.match(/admin_token=([^;]+)/);
    if (!match) {
      console.error("Login failed - no token cookie received");
      console.error("Response:", await loginRes.text());
      process.exit(1);
    }
    var cookieValue = `admin_token=${match[1]}`;
  } else {
    var cookieValue = tokenCookie.split(";")[0];
  }
  console.log("Login successful!\n");

  // Step 2: Prepare products in batches (to avoid request size limits)
  const BATCH_SIZE = 2; // 2 products per batch to avoid 413 payload limit
  const batches = [];

  for (let i = 0; i < productList.length; i += BATCH_SIZE) {
    batches.push(productList.slice(i, i + BATCH_SIZE));
  }

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(`\n--- Batch ${batchIdx + 1}/${batches.length} (${batch.length} products) ---`);

    const products = batch.map(p => {
      const num = p.model.replace("EKOGOLD_", "");
      const name = `Eko Gold ${num}`;
      const color = formatColor(p.color);
      const category = formatCategory(p.category);
      const colorHex = getColorHex(color);
      const imagePath = join(BASE_DIR, p.folder, `${p.model}.png`);
      const desc = descriptions[num] || `${name} çelik kapı modeli. ${color} renk seçeneği ile modern ve güvenli bir giriş kapısı.`;

      console.log(`  Preparing: ${name} (${color})`);

      // Read image
      const imageBuffer = readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString("base64");

      return {
        name,
        series: "Gold İkizler",
        category,
        color,
        colorHex,
        thickness: "1.2 mm",
        material: p.category.includes("ULTRALAM") ? "Ultralam Çelik" : "Laminoks Çelik",
        lockSystem: "Çoklu Kilit Sistemi",
        dimensions: "2050 x 960 mm",
        weight: "75 kg",
        insulation: "Poliüretan Dolgulu",
        warranty: "2 Yıl",
        description: desc,
        features: standardFeatures,
        imageBase64,
        imageMime: "image/png",
      };
    });

    console.log(`  Sending batch to API...`);

    try {
      const res = await fetch(`${SITE_URL}/api/admin/bulk-import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookieValue,
        },
        body: JSON.stringify({ products }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`  Batch failed (${res.status}): ${text.slice(0, 200)}`);
        totalErrors += batch.length;
        continue;
      }

      const data = await res.json();
      console.log(`  Result: ${data.summary.created} created, ${data.summary.skipped} skipped, ${data.summary.errors} errors`);

      if (data.results) {
        for (const r of data.results) {
          const icon = r.status === "created" ? "+" : r.status === "skipped" ? "~" : "X";
          console.log(`    [${icon}] ${r.name}: ${r.status}${r.error ? ` (${r.error})` : ""}`);
        }
      }

      totalCreated += data.summary.created;
      totalSkipped += data.summary.skipped;
      totalErrors += data.summary.errors;
    } catch (err) {
      console.error(`  Batch error:`, err.message);
      totalErrors += batch.length;
    }

    // Wait between batches
    if (batchIdx < batches.length - 1) {
      console.log("  Waiting 2s...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n=== IMPORT COMPLETE ===`);
  console.log(`Created: ${totalCreated}`);
  console.log(`Skipped: ${totalSkipped}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Total: ${productList.length}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
