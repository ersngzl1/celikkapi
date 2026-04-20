export interface Door {
  id: number;
  name: string;
  series: string;
  description: string;
  category: "premium" | "luks" | "klasik" | "modern" | "oda";
  color: string;
  colorHex: string;
  material: string;
  thickness: string;
  lockSystem: string;
  dimensions: string;
  weight: string;
  insulation: string;
  warranty: string;
  features: string[];
  inStock: boolean;
  image: string;
  slug?: string;
}

export const doors: Door[] = [
  {
    id: 1,
    name: "Atlas Elite",
    series: "Atlas Serisi",
    description:
      "Üstün güvenlik ve estetik tasarımın buluştuğu, çok noktalı kilit sistemiyle donatılmış premium çelik kapı. Adana'nın sıcak iklimine uygun yalıtım teknolojisi.",
    category: "premium",
    color: "Antrasit Gri",
    colorHex: "#3B3B3B",
    material: "1.5mm Soğuk Haddelenmiş Çelik",
    thickness: "90mm",
    lockSystem: "Çok Noktalı Kasa Kilit",
    dimensions: "2100 x 900 mm",
    weight: "85 kg",
    insulation: "A+ Sınıfı Isı Yalıtım",
    warranty: "10 Yıl",
    features: [
      "Parmak izi okuyucu",
      "Gece kilidi",
      "Çelik barel",
      "Ses yalıtımı",
      "Yangın dayanımı",
    ],
    inStock: true,
    image: "/doors/celik-1.jpg",
  },
  {
    id: 2,
    name: "Titan Pro",
    series: "Titan Serisi",
    description:
      "Yüksek güvenlik standartlarında, modern çizgileriyle dikkat çeken, villa ve müstakil evler için ideal çelik kapı.",
    category: "luks",
    color: "Ceviz Kaplama",
    colorHex: "#5C3A21",
    material: "2mm Soğuk Haddelenmiş Çelik",
    thickness: "100mm",
    lockSystem: "Motorlu Çok Noktalı Kilit",
    dimensions: "2200 x 1000 mm",
    weight: "110 kg",
    insulation: "A++ Sınıfı Isı Yalıtım",
    warranty: "15 Yıl",
    features: [
      "Motorlu kilit sistemi",
      "Uzaktan kumanda",
      "Parmak izi okuyucu",
      "Alarm entegrasyonu",
      "Çift cidarlı yapı",
      "Yangın dayanımı",
    ],
    inStock: true,
    image: "/doors/celik-2.jpg",
  },
  {
    id: 3,
    name: "Nova Klasik",
    series: "Nova Serisi",
    description:
      "Zamansız klasik tasarımıyla her mekana uyum sağlayan, güvenilir ve ekonomik çelik kapı modeli.",
    category: "klasik",
    color: "Altın Meşe",
    colorHex: "#A67C52",
    material: "1.2mm Soğuk Haddelenmiş Çelik",
    thickness: "80mm",
    lockSystem: "Çok Noktalı Silindir Kilit",
    dimensions: "2050 x 880 mm",
    weight: "68 kg",
    insulation: "B+ Sınıfı Isı Yalıtım",
    warranty: "7 Yıl",
    features: [
      "Gece kilidi",
      "Çelik barel",
      "Ses yalıtımı",
      "Dürbün",
    ],
    inStock: true,
    image: "/doors/celik-3.jpg",
  },
  {
    id: 4,
    name: "Vega Modern",
    series: "Vega Serisi",
    description:
      "Minimalist tasarım anlayışıyla üretilmiş, gizli menteşe sistemiyle sıfır profil görünümü sunan çelik kapı.",
    category: "modern",
    color: "Mat Siyah",
    colorHex: "#1A1A1A",
    material: "1.5mm Soğuk Haddelenmiş Çelik",
    thickness: "95mm",
    lockSystem: "Dijital Akıllı Kilit",
    dimensions: "2150 x 950 mm",
    weight: "92 kg",
    insulation: "A+ Sınıfı Isı Yalıtım",
    warranty: "12 Yıl",
    features: [
      "Dijital şifreli kilit",
      "Kartlı giriş",
      "Gizli menteşe",
      "Parmak izi okuyucu",
      "Wi-Fi bağlantı",
    ],
    inStock: true,
    image: "/doors/celik-4.jpg",
  },
  {
    id: 5,
    name: "Olympus Guard",
    series: "Olympus Serisi",
    description:
      "En üst düzey güvenlik sertifikasına sahip, zırhlı yapısıyla banka kasası güvenliğinde çelik kapı.",
    category: "luks",
    color: "Bronz",
    colorHex: "#8C6239",
    material: "3mm Zırhlı Çelik",
    thickness: "120mm",
    lockSystem: "TSE Onaylı Zırhlı Kilit",
    dimensions: "2200 x 1000 mm",
    weight: "145 kg",
    insulation: "A++ Sınıfı Isı Yalıtım",
    warranty: "20 Yıl",
    features: [
      "Zırhlı yapı",
      "Biyometrik giriş",
      "Alarm sistemi entegrasyonu",
      "Motorlu kilit",
      "Deprem dayanıklı menteşe",
      "Yangın kapısı sertifikası",
      "Çift cidarlı izolasyon",
    ],
    inStock: true,
    image: "/doors/celik-5.jpg",
  },
  {
    id: 6,
    name: "Artemis Soft",
    series: "Artemis Serisi",
    description:
      "Yumuşak hatlarıyla fark yaratan, iç mekan tasarımına uyum sağlayan şık ve zarif çelik kapı.",
    category: "modern",
    color: "Krem Beyaz",
    colorHex: "#E8E0D0",
    material: "1.5mm Soğuk Haddelenmiş Çelik",
    thickness: "85mm",
    lockSystem: "Çok Noktalı Kasa Kilit",
    dimensions: "2100 x 900 mm",
    weight: "78 kg",
    insulation: "A Sınıfı Isı Yalıtım",
    warranty: "10 Yıl",
    features: [
      "Yumuşak kapanış",
      "Gece kilidi",
      "Parmak izi okuyucu",
      "Ses yalıtımı",
      "Dekoratif cam panel",
    ],
    inStock: true,
    image: "/doors/celik-6.jpg",
  },
  {
    id: 7,
    name: "Hera Villa",
    series: "Hera Serisi",
    description:
      "Villa girişleri için özel tasarlanmış, çift kanatlı, gösterişli ve dayanıklı premium çelik kapı.",
    category: "premium",
    color: "Koyu Ceviz",
    colorHex: "#3E2415",
    material: "2mm Soğuk Haddelenmiş Çelik",
    thickness: "110mm",
    lockSystem: "Motorlu Çift Kilit Sistemi",
    dimensions: "2300 x 1600 mm (Çift Kanat)",
    weight: "180 kg",
    insulation: "A++ Sınıfı Isı Yalıtım",
    warranty: "15 Yıl",
    features: [
      "Çift kanat",
      "Motorlu kilit",
      "Uzaktan kumanda",
      "Biyometrik giriş",
      "Kamera entegrasyonu",
      "Dekoratif ferforje",
      "Isı cam panel",
    ],
    inStock: true,
    image: "/doors/celik-7.jpg",
  },
  {
    id: 8,
    name: "Sphinx Ekonomik",
    series: "Sphinx Serisi",
    description:
      "Kaliteden ödün vermeden bütçe dostu çözüm sunan, güvenilir ve sağlam çelik kapı modeli.",
    category: "klasik",
    color: "Koyu Gri",
    colorHex: "#4A4A4A",
    material: "1mm Soğuk Haddelenmiş Çelik",
    thickness: "70mm",
    lockSystem: "Silindir Kilit",
    dimensions: "2050 x 860 mm",
    weight: "55 kg",
    insulation: "B Sınıfı Isı Yalıtım",
    warranty: "5 Yıl",
    features: [
      "Gece kilidi",
      "Dürbün",
      "Çelik barel",
    ],
    inStock: true,
    image: "/doors/celik-8.jpg",
  },
  {
    id: 101,
    name: "Harmony",
    series: "İç Mekan Serisi",
    description: "Minimalist çizgileriyle modern evlere uyum sağlayan iç mekan kapısı.",
    category: "oda",
    color: "Beyaz",
    colorHex: "#F5F5F0",
    material: "MDF Kaplama",
    thickness: "40mm",
    lockSystem: "Oda Kilidi",
    dimensions: "2050 x 800 mm",
    weight: "25 kg",
    insulation: "Standart",
    warranty: "3 Yıl",
    features: ["Sessiz kapanış", "Gizli menteşe", "Mat yüzey"],
    inStock: true,
    image: "/doors/oda-1.jpg",
  },
  {
    id: 102,
    name: "Natura",
    series: "İç Mekan Serisi",
    description: "Doğal ahşap dokusuyla sıcak ve samimi bir atmosfer yaratan oda kapısı.",
    category: "oda",
    color: "Doğal Meşe",
    colorHex: "#B8956A",
    material: "Lamine Kaplama",
    thickness: "40mm",
    lockSystem: "Oda Kilidi",
    dimensions: "2050 x 800 mm",
    weight: "22 kg",
    insulation: "Standart",
    warranty: "3 Yıl",
    features: ["Ahşap doku", "Su dayanımı", "Kolay bakım"],
    inStock: true,
    image: "/doors/oda-2.jpg",
  },
  {
    id: 103,
    name: "Elegance",
    series: "İç Mekan Serisi",
    description: "Camlı paneli ile mekanlara ferahlık ve şıklık katan zarif iç kapı.",
    category: "oda",
    color: "Antrasit",
    colorHex: "#4A4A4A",
    material: "Boyalı MDF",
    thickness: "40mm",
    lockSystem: "Oda Kilidi",
    dimensions: "2050 x 800 mm",
    weight: "28 kg",
    insulation: "Standart",
    warranty: "3 Yıl",
    features: ["Buzlu cam panel", "Alüminyum çerçeve", "Modern tasarım"],
    inStock: true,
    image: "/doors/oda-3.jpg",
  },
  {
    id: 104,
    name: "Serene",
    series: "İç Mekan Serisi",
    description: "Yumuşak tonlarıyla yatak odaları için ideal, sessiz ve zarif kapı modeli.",
    category: "oda",
    color: "Krem",
    colorHex: "#E8DFD0",
    material: "Lake Boyalı",
    thickness: "40mm",
    lockSystem: "Oda Kilidi",
    dimensions: "2050 x 800 mm",
    weight: "24 kg",
    insulation: "Standart",
    warranty: "3 Yıl",
    features: ["Lake boya", "Ses yalıtımı", "Yumuşak kapanış"],
    inStock: true,
    image: "/doors/oda-4.jpg",
  },
];

export const categories = [
  { value: "all", label: "Tümü" },
  { value: "premium", label: "Premium" },
  { value: "luks", label: "Lüks" },
  { value: "modern", label: "Modern" },
  { value: "klasik", label: "Klasik" },
  { value: "oda", label: "Oda Kapısı" },
];

export const colorOptions = [
  { value: "all", label: "Tüm Renkler" },
  { value: "Antrasit Gri", label: "Antrasit Gri" },
  { value: "Mat Siyah", label: "Mat Siyah" },
  { value: "Ceviz Kaplama", label: "Ceviz Kaplama" },
  { value: "Koyu Ceviz", label: "Koyu Ceviz" },
  { value: "Altın Meşe", label: "Altın Meşe" },
  { value: "Bronz", label: "Bronz" },
  { value: "Krem Beyaz", label: "Krem Beyaz" },
  { value: "Koyu Gri", label: "Koyu Gri" },
];

export interface RoomDoor {
  id: number;
  name: string;
  description: string;
  color: string;
  colorHex: string;
  material: string;
  features: string[];
  image: string;
}

// Backward compat - admin paneli için
export const roomDoors: RoomDoor[] = getRoomDoors().map(d => ({
  id: d.id,
  name: d.name,
  description: d.description,
  color: d.color,
  colorHex: d.colorHex,
  material: d.material,
  features: d.features,
  image: d.image,
}));


export function getDoorById(id: number): Door | undefined {
  return doors.find((d) => d.id === id);
}

export function getSteelDoors(): Door[] {
  return doors.filter((d) => d.category !== "oda");
}

export function getRoomDoors(): Door[] {
  return doors.filter((d) => d.category === "oda");
}

export function filterDoors(
  category: string,
  color: string
): Door[] {
  return doors.filter((door) => {
    if (category !== "all" && door.category !== category) return false;
    if (color !== "all" && door.color !== color) return false;
    return true;
  });
}
