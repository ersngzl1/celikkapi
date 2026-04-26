import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Best Kapı | Adana Çelik Kapı - Güvenliğiniz Bizim İşimiz",
    template: "%s | Best Kapı Adana",
  },
  description:
    "Adana ve çevre illerde çelik kapı satış ve montaj. Best Pen güvencesiyle kaliteli çelik kapılar. AI ile kapınızı evinizde deneyin. TSE, CE, ISO 9001 belgeli.",
  keywords: [
    "adana çelik kapı", "çelik kapı adana", "adana çelik kapı fiyatları",
    "adana güvenlik kapısı", "çelik kapı montaj adana", "çelik kapı tamiri adana",
    "best kapı adana", "best pen çelik kapı",
    "adana oda kapısı", "oda kapısı fiyatları adana", "iç oda kapısı modelleri",
    "villa kapısı adana", "apartman çelik kapı", "bina giriş kapısı adana",
    "çelik kapı modelleri 2025", "en iyi çelik kapı markaları",
    "çelik kapı kilidi", "çelik kapı yalıtım", "çelik kapı montajı nasıl yapılır",
    "mersin çelik kapı", "hatay çelik kapı", "osmaniye çelik kapı", "tarsus çelik kapı",
    "çukurova çelik kapı", "seyhan çelik kapı", "yüreğir çelik kapı",
    "çelik kapı fiyatları", "ucuz çelik kapı adana", "kaliteli çelik kapı",
  ],
  authors: [{ name: "Best Kapı" }],
  creator: "Best Kapı",
  publisher: "Best Kapı - Best Pen",
  metadataBase: new URL("https://bestkapi.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Kapı | Adana Çelik Kapı - Güvenliğiniz Bizim İşimiz",
    description:
      "Adana ve çevre illerde çelik kapı satış ve montaj. Best Pen güvencesiyle premium çelik kapılar. AI ile kapınızı evinizde deneyin.",
    locale: "tr_TR",
    type: "website",
    siteName: "Best Kapı",
    url: "https://bestkapi.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Kapı | Adana Çelik Kapı",
    description: "Adana ve çevre illerde çelik kapı satış ve montaj. AI ile kapınızı evinizde deneyin.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/uploads/favicon.png",
    apple: "/uploads/favicon.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Best Kapı",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Best Kapı",
  description: "Adana ve çevre illerde çelik kapı satış, montaj ve servis hizmeti.",
  url: "https://bestkapi.com",
  telephone: "+903221234567",
  email: "info@bestkapi.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yüreğir Sanayi Sitesi",
    addressLocality: "Yüreğir",
    addressRegion: "Adana",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.0,
    longitude: 35.32,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "18:00",
  },
  priceRange: "$$",
  image: "https://bestkapi.com/doors/celik-1.jpg",
  areaServed: ["Adana", "Mersin", "Hatay", "Osmaniye", "Tarsus", "Ceyhan"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Çelik Kapı Modelleri",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Çelik Kapılar" },
      { "@type": "OfferCatalog", name: "Oda Kapıları" },
      { "@type": "OfferCatalog", name: "Villa Kapıları" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Theme: Flash önlemek için synchronous — bu render-blocking olmalı */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <FloatingCTA />
          <MobileBottomNav />
          <ServiceWorkerRegister />
        </ThemeProvider>

        {/* Google Analytics 4 — loaded after page is interactive */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YYJ8P3NDF0" strategy="afterInteractive" />
        <Script id="ga-config" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-YYJ8P3NDF0',{page_path:window.location.pathname});`}
        </Script>
      </body>
    </html>
  );
}
