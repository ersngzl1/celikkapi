declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Hazır fonksiyonlar
export const trackWhatsApp = (source: string) =>
  trackEvent("whatsapp_click", { event_category: "iletisim", event_label: source });

export const trackPhone = (source: string) =>
  trackEvent("phone_click", { event_category: "iletisim", event_label: source });

export const trackTeklif = (source: string) =>
  trackEvent("teklif_click", { event_category: "iletisim", event_label: source });

export const trackAIDeneme = (source: string) =>
  trackEvent("ai_deneme_click", { event_category: "ozellik", event_label: source });

export const trackProductView = (productName: string) =>
  trackEvent("product_view", { event_category: "urun", event_label: productName });

export const trackCatalogClick = (catalog: string) =>
  trackEvent("catalog_click", { event_category: "navigasyon", event_label: catalog });
