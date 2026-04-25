/**
 * Bulk add EkoGold products to the database
 * Run with: npx tsx scripts/bulk-add-ekogold.ts
 *
 * Requires SITE_URL and ADMIN_PASSWORD environment variables
 * Example: SITE_URL=https://www.bestkapi.com ADMIN_PASSWORD=xxx npx tsx scripts/bulk-add-ekogold.ts
 */

import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const SITE_URL = process.env.SITE_URL || "https://www.bestkapi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const BASE_DIR = "C:/Users/PC/Desktop/best_kapi_ekogold_urunler_DOGRU";

// Color hex mapping
const COLOR_HEX: Record<string, string> = {
  "Antrasit": "#3C3C3C",
  "Saruhan": "#8B6914",
  "Gri Mese": "#7A7A6E",
  "Beyaz": "#F5F5F0",
  "Siyah": "#1A1A1A",
  "Sedir": "#A0522D",
};

// Product descriptions based on visual design
const descriptions: Record<string, string> = {
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
  "021": "Beyaz yüzeyin ferahlığı ve antrasit hatlarin modern çizgileri bir arada. Küçük girişleri bile geniş ve aydınlık gösteren akıllı tasarım.",
  "022": "Antrasit metalik yüzey ve beyaz panel detayları ile endüstriyel şıklık. Loft ve modern yaşam alanlarına mükemmel uyum sağlayan cesur bir seçim.",
  "023": "Gri meşe doğal ahşap dokusu ve antrasit çerçevenin sofistike birleşimi. Geniş panel yapısı ile kapınıza monoblok ve güçlü bir görünüm kazandırır.",
  "024": "Saruhan ahşap sıcaklığı ve antrasit çeliğin dayanıklılığı bir arada. Klasik Türk evlerinden modern villalara uzanan çok yönlü bir tasarım.",
  "025": "Antrasit ana renk ve saruhan ahşap aksan detayları ile Ultralam serisinin güçlü başlangıcı. Ultra dayanıklı laminat kaplama ile uzun ömürlü şıklık.",
  "026": "Beyaz lamine yüzey ve antrasit çerçevenin Ultralam teknolojisi ile buluşması. Ekstra dayanıklı kaplama sayesinde yoğun kullanıma uygun şık bir kapı.",
  "027": "Gri meşe Ultralam kaplama ile doğal ahşap görünümünün en dayanıklı hali. Tek renk bütünlüğü ile kapınıza sofistike ve sade bir karakter katar.",
  "028": "Gri meşe Ultralam kaplama teknolojisi ile üstün dayanıklılık ve doğal estetik. Farklı panel deseni ile serideki diğer modellerden ayrışan özgün bir tasarım.",
};

// Standard features from the image
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

interface Product {
  name: string;
  series: string;
  category: string;
  color: string;
  colorHex: string;
  thickness: string;
  material: string;
  lockSystem: string;
  dimensions: string;
  weight: string;
  insulation: string;
  warranty: string;
  description: string;
  features: string[];
  imageBase64: string;
  imageMime: string;
}

function getColorHex(colorStr: string): string {
  const firstColor = colorStr.split("/")[0].trim();
  return COLOR_HEX[firstColor] || "#3C3C3C";
}

function formatName(model: string): string {
  // EKOGOLD_001 -> Eko Gold 001
  const num = model.replace("EKOGOLD_", "");
  return `Eko Gold ${num}`;
}

function formatColor(rawColor: string): string {
  // SARUHAN / ANTRASIT -> Saruhan / Antrasit
  return rawColor
    .split("/")
    .map(c => {
      const t = c.trim().toLowerCase();
      if (t === "gri mese") return "Gri Meşe";
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .join(" / ");
}

function formatCategory(raw: string): string {
  // EKO LAMINOKS SERI -> Eko Laminoks
  // EKO ULTRALAM SERI -> Eko Ultralam
  const clean = raw.replace(/\s*SERI\s*/i, "").trim();
  return clean
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

async function login(): Promise<string> {
  console.log("Logging in...");
  const res = await fetch(`${SITE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!data.token) {
    throw new Error("Login failed: " + JSON.stringify(data));
  }
  console.log("Login successful");
  return data.token;
}

async function uploadImage(token: string, filePath: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const base64 = buffer.toString("base64");
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 20);

  // Create a File-like blob for formData
  const blob = new Blob([buffer], { type: "image/png" });
  const formData = new FormData();
  formData.append("file", blob, "door.png");

  const res = await fetch(`${SITE_URL}/api/admin/products/upload`, {
    method: "POST",
    headers: {
      "Cookie": `admin_token=${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!data.url) {
    throw new Error("Upload failed: " + JSON.stringify(data));
  }
  return data.url;
}

async function createProduct(token: string, product: any): Promise<void> {
  const res = await fetch(`${SITE_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `admin_token=${token}`,
    },
    body: JSON.stringify(product),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Create product failed: ${JSON.stringify(data)}`);
  }
}

async function ensureCategory(token: string, value: string, label: string): Promise<void> {
  try {
    await fetch(`${SITE_URL}/api/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `admin_token=${token}`,
      },
      body: JSON.stringify({ value, label }),
    });
  } catch {
    // Category might already exist
  }
}

// CSV data
const products = [
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

async function main() {
  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD environment variable required");
    console.error("Usage: SITE_URL=https://www.bestkapi.com ADMIN_PASSWORD=xxx npx tsx scripts/bulk-add-ekogold.ts");
    process.exit(1);
  }

  const token = await login();

  // Ensure categories exist
  console.log("\nCreating categories...");
  await ensureCategory(token, "eko-laminoks", "Eko Laminoks");
  await ensureCategory(token, "eko-ultralam", "Eko Ultralam");
  console.log("Categories ready.");

  // Process each product
  for (const p of products) {
    const num = p.model.replace("EKOGOLD_", "");
    const name = formatName(p.model);
    const color = formatColor(p.color);
    const category = formatCategory(p.category);
    const colorHex = getColorHex(color);
    const imagePath = join(BASE_DIR, p.folder, `${p.model}.png`);
    const desc = descriptions[num] || `${name} çelik kapı modeli. ${color} renk seçeneği ile modern ve güvenli bir giriş kapısı.`;

    console.log(`\n[${num}/28] ${name} (${color})...`);

    // Upload image
    console.log(`  Uploading image...`);
    let imageUrl: string;
    try {
      imageUrl = await uploadImage(token, imagePath);
      console.log(`  Image: ${imageUrl}`);
    } catch (err) {
      console.error(`  Image upload failed:`, err);
      continue;
    }

    // Create product
    const product = {
      name,
      series: "Gold İkizler",
      category,
      color,
      colorHex,
      thickness: "1.2 mm",
      material: "Laminoks Çelik",
      lockSystem: "Çoklu Kilit Sistemi",
      dimensions: "2050 x 960 mm",
      weight: "75 kg",
      insulation: "Poliüretan Dolgulu",
      warranty: "2 Yıl",
      description: desc,
      features: standardFeatures,
      image: imageUrl,
      inStock: 1,
    };

    // Override material for Ultralam series
    if (p.category.includes("ULTRALAM")) {
      product.material = "Ultralam Çelik";
    }

    try {
      await createProduct(token, product);
      console.log(`  Product created successfully!`);
    } catch (err) {
      console.error(`  Product creation failed:`, err);
    }

    // Small delay to avoid overwhelming the server
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\n=== Done! All products processed. ===");
}

main().catch(console.error);
