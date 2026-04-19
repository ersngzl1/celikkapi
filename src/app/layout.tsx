import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import MobileBottomNav from "@/components/MobileBottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
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
    "adana çelik kapı", "çelik kapı adana", "adana güvenlik kapısı",
    "çelik kapı montaj adana", "best kapı", "best pen",
    "mersin çelik kapı", "hatay çelik kapı", "osmaniye çelik kapı",
    "adana kapıcı", "çelik kapı fiyatları", "oda kapısı adana",
    "villa kapısı adana", "apartman kapısı", "çelik kapı modelleri",
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
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Tag Manager — GTM-XXXXXXX buraya yaz */}
        {/* <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');` }} /> */}

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YYJ8P3NDF0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YYJ8P3NDF0', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* Google Search Console — Doğrulama kodu admin'den ayarlanır */}
        {/* <meta name="google-site-verification" content="BURAYA_KODUNUZU_YAZIN" /> */}

        {/* Theme: Flash önlemek için synchronous */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
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
      </body>
    </html>
  );
}
