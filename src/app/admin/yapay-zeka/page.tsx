"use client";

import { useState, useEffect } from "react";
import {
  Brain, Key, Save, Check, AlertTriangle, Eye, EyeOff,
  RefreshCw, TestTube, Copy, ImageIcon, Sparkles,
} from "lucide-react";

const defaultPrompt = `Bu fotoğraftaki kapıyı, verilen çelik kapı modeli ile değiştir. Kapı modelini fotoğraftaki kapının yerine doğal bir şekilde yerleştir. Işıklandırma ve perspektif uyumlu olsun. Sonuç gerçekçi görünsün.`;

export default function YapayZekaPage() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(defaultPrompt);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => {
        if (data.hasApiKey) {
          setApiKey(data.replicateApiKey || "");
          setHasApiKey(true);
        }
        if (data.imagePrompt) setImagePrompt(data.imagePrompt);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replicateApiKey: apiKey, imagePrompt }),
      });
      setSaved(true);
      setHasApiKey(!!apiKey && !apiKey.includes("..."));
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert("Kaydetme hatasi!");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Send key directly in body — endpoint saves it to DB and tests it
      const payload: Record<string, string> = {};
      if (apiKey && !apiKey.includes("...")) {
        payload.apiKey = apiKey;
      }
      const res = await fetch("/api/admin/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.valid) {
        setTestResult({ ok: true, msg: `API anahtari gecerli! Hesap: ${data.username || "OK"} (${data.keyPreview})` });
        setHasApiKey(true);
      } else {
        setTestResult({ ok: false, msg: `API anahtari gecersiz: ${data.error}${data.keyPreview ? ` (${data.keyPreview}, ${data.keyLength} karakter)` : ""}` });
      }
    } catch {
      setTestResult({ ok: false, msg: "Test sirasinda bir hata olustu." });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Yapay Zeka - Gorsel Uretim</h2>
          <p className="text-sm text-slate-500 mt-0.5">Replicate GPT Image API ile kapi gorseli uretimi</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Kaydedildi!" : saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Nasil Calisir */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-red-400" /> Nasil Calisir?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold">Musteri foto yukler</p>
              <p className="text-xs text-white/60">Evinizin kapisi fotografini yukler</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold">Kapi modeli secilir</p>
              <p className="text-xs text-white/60">Katalogdan bir celik kapi secilir</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold">AI gorsel uretir</p>
              <p className="text-xs text-white/60">Kapi modeli + foto Replicate API&apos;ye gonderilir</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Key className="w-4 h-4 text-red-500" />
          <h3 className="font-bold text-slate-800">Replicate API Anahtari</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">replicate.com/account/api-tokens</a> adresinden API anahtarinizi alin
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">API Key</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handleTest}
                disabled={(!apiKey && !hasApiKey) || testing}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                Test Et
              </button>
            </div>
            {testResult && (
              <div className={`mt-2 flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                testResult.ok ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              }`}>
                {testResult.ok ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {testResult.msg}
              </div>
            )}
          </div>

          {hasApiKey && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4" /> API anahtari kayitli
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              API anahtariniz sunucuda guvenli bir sekilde saklanir. Kullanim basina Replicate ucretlendirmesi gecerlidir.
            </p>
          </div>
        </div>
      </div>

      {/* Image Generation Prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-slate-800">Gorsel Uretim Promptu</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setImagePrompt(defaultPrompt)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Varsayilana don"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(imagePrompt)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Kopyala"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Musterinin yuklediği foto ve secilen kapi modeli ile birlikte API&apos;ye gonderilen talimat
        </p>

        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-slate-400">{imagePrompt.length} karakter</span>
          <span className="text-[10px] text-slate-400">Degisken: {"{model_name}"} = secilen kapi adi</span>
        </div>
      </div>

      {/* Kullanim Bilgisi */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Kullanim Bilgisi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-medium mb-1">Kullanilan Model</div>
            <div className="text-sm font-bold text-slate-800">GPT Image 1 (Replicate)</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-medium mb-1">Gorsel Boyutu</div>
            <div className="text-sm font-bold text-slate-800">1024x1024px</div>
          </div>
        </div>
      </div>
    </div>
  );
}
