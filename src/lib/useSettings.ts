"use client";

import { useState, useEffect, useCallback } from "react";

export interface SiteSettings {
  companyName: string;
  slogan: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  workingDays: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  logoLight: string;
  logoDark: string;
  whatsappMessage: string;
}

const defaults: SiteSettings = {
  companyName: "Best Kapı",
  slogan: "Adana Çelik Kapı",
  phone: "",
  phone2: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  workingHours: "",
  workingDays: "",
  googleMapsUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  metaTitle: "",
  metaDescription: "",
  logoLight: "",
  logoDark: "",
  whatsappMessage: "",
};

// Module-level cache with 30 second expiry
let cached: SiteSettings | null = null;
let cacheTime = 0;
let fetchPromise: Promise<SiteSettings> | null = null;
const CACHE_TTL = 30_000; // 30 seconds

function isCacheValid(): boolean {
  return cached !== null && (Date.now() - cacheTime) < CACHE_TTL;
}

async function fetchSettings(): Promise<SiteSettings> {
  if (isCacheValid()) return cached!;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/admin/settings", { cache: "no-store" })
    .then(r => {
      if (!r.ok) throw new Error("Failed");
      return r.json();
    })
    .then(data => {
      // Filter out empty strings so defaults aren't overwritten with ""
      const filtered: Partial<SiteSettings> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v !== "" && v !== null && v !== undefined) {
          (filtered as any)[k] = v;
        }
      }
      cached = { ...defaults, ...filtered };
      cacheTime = Date.now();
      fetchPromise = null;
      return cached;
    })
    .catch(() => {
      fetchPromise = null;
      return cached || defaults;
    });

  return fetchPromise;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cached || defaults);
  const [loading, setLoading] = useState(!isCacheValid());

  useEffect(() => {
    let mounted = true;
    fetchSettings().then(data => {
      if (mounted) {
        setSettings(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}

export function invalidateSettingsCache() {
  cached = null;
  cacheTime = 0;
  fetchPromise = null;
}
