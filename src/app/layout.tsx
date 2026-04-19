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
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YYJ8P3NDF0"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YYJ8P3NDF0', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
