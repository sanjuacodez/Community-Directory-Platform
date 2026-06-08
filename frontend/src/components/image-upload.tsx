'use client';

import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  onUpload: (url: string) => void;
  currentUrl?: string | null;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({ onUpload, currentUrl, bucket = 'profiles', folder = 'avatars' }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return; }

    setError('');
    setUploading(true);
    try {
      const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(filename, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      const url = urlData.publicUrl;
      setPreview(url);
      onUpload(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      upload(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }, []);
  const handleDragOut = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) { setPreview(URL.createObjectURL(file)); upload(file); }
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" id="profile-image-label">Profile Image</label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload profile image"
        aria-describedby="profile-image-label"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 ${
          dragActive ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {preview ? (
          <img src={preview} alt="Profile preview" className="w-full h-full rounded-xl object-cover" />
        ) : (
          <div className="text-center p-2">
            <svg className="mx-auto h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="mt-1 text-xs text-zinc-400">Upload</p>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
            <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" role="status" aria-label="Uploading" />
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" aria-hidden="true" />
      </div>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
      <p className="text-xs text-zinc-400">Click or drag & drop. Max 5MB.</p>
    </div>
  );
}
