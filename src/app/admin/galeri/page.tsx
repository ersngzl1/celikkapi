"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Upload, X, Image as ImageIcon, ArrowLeftRight } from "lucide-react";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  featured: number;
  ordering: number;
}

type ModalType = "single" | "beforeafter" | null;

export default function GaleriPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingBefore, setUploadingBefore] = useState(false);
  const [uploadingAfter, setUploadingAfter] = useState(false);

  // Single image form
  const [singleForm, setSingleForm] = useState({
    title: "",
    location: "",
    image: "",
    imagePreview: "",
  });

  // Before/after form
  const [baForm, setBaForm] = useState({
    title: "",
    location: "",
    doorModel: "",
    beforeImage: "",
    afterImage: "",
    beforePreview: "",
    afterPreview: "",
  });

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const uploadImage = async (
    file: File,
    target: "main" | "before" | "after"
  ) => {
    if (target === "main") setUploadingMain(true);
    else if (target === "before") setUploadingBefore(true);
    else setUploadingAfter(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (target === "main") {
          setSingleForm((p) => ({
            ...p,
            image: data.url,
            imagePreview: data.preview,
          }));
        } else if (target === "before") {
          setBaForm((p) => ({
            ...p,
            beforeImage: data.url,
            beforePreview: data.preview,
          }));
        } else {
          setBaForm((p) => ({
            ...p,
            afterImage: data.url,
            afterPreview: data.preview,
          }));
        }
      } else {
        alert(`Yükleme hatası: ${data.error}`);
      }
    } catch {
      alert("Yükleme başarısız");
    } finally {
      if (target === "main") setUploadingMain(false);
      else if (target === "before") setUploadingBefore(false);
      else setUploadingAfter(false);
    }
  };

  const handleSaveSingle = async () => {
    if (!singleForm.title || !singleForm.image) {
      alert("Başlık ve fotoğraf zorunludur");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        src: singleForm.image,
        alt: singleForm.title,
        category: JSON.stringify({
          type: "single",
          location: singleForm.location,
        }),
        featured: 1,
        ordering: items.length,
      };
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await fetch("/api/admin/gallery").then((r) => r.json());
        setItems(Array.isArray(updated) ? updated : []);
        setModalType(null);
        setSingleForm({ title: "", location: "", image: "", imagePreview: "" });
      } else {
        const err = await res.json();
        alert(`Kaydedilemedi: ${err.error}`);
      }
    } catch {
      alert("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBA = async () => {
    if (!baForm.title || !baForm.afterImage) {
      alert("Başlık ve Sonra fotoğrafı zorunludur");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        src: baForm.afterImage,
        alt: baForm.title,
        category: JSON.stringify({
          type: "beforeafter",
          location: baForm.location,
          doorModel: baForm.doorModel,
          beforeImage: baForm.beforeImage,
        }),
        featured: 1,
        ordering: items.length,
      };
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await fetch("/api/admin/gallery").then((r) => r.json());
        setItems(Array.isArray(updated) ? updated : []);
        setModalType(null);
        setBaForm({
          title: "",
          location: "",
          doorModel: "",
          beforeImage: "",
          afterImage: "",
          beforePreview: "",
          afterPreview: "",
        });
      } else {
        const err = await res.json();
        alert(`Kaydedilemedi: ${err.error}`);
      }
    } catch {
      alert("Hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setDeleteConfirm(null);
      }
    } catch {
      alert("Silinemedi");
    }
  };

  const parseCategory = (cat: string) => {
    try {
      return JSON.parse(cat);
    } catch {
      return {};
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Galeri</h2>
          <p className="text-sm text-slate-500">
            {items.length} fotoğraf
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalType("single")}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <ImageIcon className="w-4 h-4" /> Tek Görsel Ekle
          </button>
          <button
            onClick={() => setModalType("beforeafter")}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" /> Önce & Sonra
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((item) => {
          const meta = parseCategory(item.category);
          const isSingle = meta.type === "single" || !meta.beforeImage;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all"
            >
              {isSingle ? (
                /* Tek görsel */
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                    ÖRNEK ÇALIŞMA
                  </span>
                </div>
              ) : (
                /* Önce & Sonra */
                <div className="grid grid-cols-2 gap-0.5 bg-slate-200 h-48">
                  <div className="relative overflow-hidden">
                    {meta.beforeImage ? (
                      <img
                        src={meta.beforeImage}
                        alt="Önce"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                        Önce
                      </div>
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded">
                      ÖNCE
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                      SONRA
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-sm text-slate-800">{item.alt}</h3>
                {meta.location && (
                  <p className="text-xs text-slate-500 mt-1">
                    📍 {meta.location}
                  </p>
                )}
                {meta.doorModel && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Model: {meta.doorModel}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  {deleteConfirm === item.id ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-2 bg-red-600 text-white text-xs rounded-lg font-bold"
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 py-2 bg-slate-200 text-xs rounded-lg font-bold"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="ml-auto p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">
            <p className="text-sm">Henüz fotoğraf eklenmemiş.</p>
            <button
              onClick={() => setModalType("single")}
              className="mt-3 text-red-600 font-semibold text-sm"
            >
              İlk fotoğrafı ekle
            </button>
          </div>
        )}
      </div>

      {/* Tek Görsel Modal */}
      {modalType === "single" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                Örnek Çalışma Ekle
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Başlık *
                </label>
                <input
                  value={singleForm.title}
                  onChange={(e) =>
                    setSingleForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  placeholder="Çelik kapı montajı"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Konum
                </label>
                <input
                  value={singleForm.location}
                  onChange={(e) =>
                    setSingleForm((p) => ({ ...p, location: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  placeholder="Adana, Çukurova"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Fotoğraf *
                </label>
                <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors overflow-hidden relative">
                  {singleForm.imagePreview ? (
                    <img
                      src={singleForm.imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {uploadingMain ? (
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-300" />
                      )}
                      <span className="text-sm text-slate-400 mt-2">
                        Fotoğraf yükle
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      uploadImage(e.target.files[0], "main")
                    }
                    disabled={uploadingMain}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveSingle}
                disabled={saving || uploadingMain}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Önce & Sonra Modal */}
      {modalType === "beforeafter" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                Önce & Sonra Ekle
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Başlık *
                </label>
                <input
                  value={baForm.title}
                  onChange={(e) =>
                    setBaForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  placeholder="Villa Giriş Kapısı"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Konum
                  </label>
                  <input
                    value={baForm.location}
                    onChange={(e) =>
                      setBaForm((p) => ({ ...p, location: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Adana, Çukurova"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kapı Modeli
                  </label>
                  <input
                    value={baForm.doorModel}
                    onChange={(e) =>
                      setBaForm((p) => ({ ...p, doorModel: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                    placeholder="Vega Modern"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Önce Fotoğrafı
                  </label>
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors overflow-hidden relative">
                    {baForm.beforePreview ? (
                      <img
                        src={baForm.beforePreview}
                        alt="before"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {uploadingBefore ? (
                          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        ) : (
                          <Upload className="w-6 h-6 text-slate-300" />
                        )}
                        <span className="text-xs text-slate-400 mt-1">
                          Yükle
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        uploadImage(e.target.files[0], "before")
                      }
                      disabled={uploadingBefore}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Sonra Fotoğrafı *
                  </label>
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-red-200 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors overflow-hidden relative">
                    {baForm.afterPreview ? (
                      <img
                        src={baForm.afterPreview}
                        alt="after"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        {uploadingAfter ? (
                          <Loader2 className="w-6 h-6 animate-spin text-red-400" />
                        ) : (
                          <Upload className="w-6 h-6 text-red-200" />
                        )}
                        <span className="text-xs text-red-300 mt-1">
                          Yükle *
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        uploadImage(e.target.files[0], "after")
                      }
                      disabled={uploadingAfter}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSaveBA}
                disabled={saving || uploadingBefore || uploadingAfter}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
