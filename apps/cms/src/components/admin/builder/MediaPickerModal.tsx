'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload, Search, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

export interface MediaItem {
  id: string | number;
  url?: string;
  filename?: string;
  alt?: string;
  sizes?: {
    thumbnail?: {
      url?: string;
    };
  };
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  currentMediaId?: string | number | null;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentMediaId,
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = query
        ? `/api/media?where[alt][contains]=${encodeURIComponent(query)}&limit=30&sort=-createdAt`
        : `/api/media?limit=30&sort=-createdAt`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat pustaka media`);
      const data = await res.json();
      setItems(data.docs || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia(search);
    }
  }, [isOpen, fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors?.[0]?.message || 'Gagal mengunggah media');
      }

      const newMedia = await res.json();
      const doc = newMedia.doc;
      if (doc) {
        setItems((prev) => [doc, ...prev]);
        setSelectedItem(doc);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Pilih Media / Foto</h3>
            <p className="text-xs text-slate-500">Pilih dari pustaka media atau unggah foto baru</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMedia(search)}
              placeholder="Cari foto berdasarkan nama..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none"
            />
          </div>

          <label className="flex items-center gap-1.5 py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs">
            {isUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            <span>{isUploading ? 'Mengunggah...' : 'Unggah Foto'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {error && (
            <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 size={24} className="animate-spin text-teal-600" />
              <span className="text-xs">Memuat pustaka foto...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium">Belum ada media ditemukan</p>
              <p className="text-[11px] text-slate-400 mt-1">Unggah foto baru menggunakan tombol di atas</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id || currentMediaId === item.id;
                const thumbUrl = item.sizes?.thumbnail?.url || item.url;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all bg-white text-left ${
                      isSelected
                        ? 'border-teal-600 ring-2 ring-teal-500/30'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={item.alt || item.filename || 'Media'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[10px] text-white font-medium truncate">
                        {item.alt || item.filename || 'Foto'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate max-w-[50%]">
            {selectedItem ? (
              <span>Terpilih: <strong>{selectedItem.alt || selectedItem.filename}</strong></span>
            ) : (
              <span>Pilih foto untuk melanjutkan</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedItem) {
                  onSelect(selectedItem);
                  onClose();
                }
              }}
              disabled={!selectedItem}
              className="py-1.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Gunakan Foto Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
