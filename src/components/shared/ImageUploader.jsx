/**
 * ImageUploader — shared component for any image upload field.
 * Supports: drag-and-drop, click-to-browse, URL fallback.
 * Uploads to Cloudinary via /api/upload/ and returns the URL.
 */
import { useState, useRef } from 'react';
import { uploadImage } from '../../services/api';

export default function ImageUploader({ value, onChange, label = 'Image', required = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState('file'); // 'file' | 'url'
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      const url = result.secure_url || result.url;
      setPreview(url);
      onChange(url);
    } catch (e) {
      alert('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e) => upload(e.target.files?.[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files?.[0]);
  };
  const handleUrlChange = (e) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="font-serif text-[10px] tracking-[0.25em] uppercase text-wine/70">{label}</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setMode('file')}
            className={`font-serif text-[9px] tracking-widest uppercase transition-colors ${mode === 'file' ? 'text-wine' : 'text-dark/30 hover:text-wine/60'}`}>
            upload
          </button>
          <span className="text-taupe/40 text-[9px]">|</span>
          <button type="button" onClick={() => setMode('url')}
            className={`font-serif text-[9px] tracking-widest uppercase transition-colors ${mode === 'url' ? 'text-wine' : 'text-dark/30 hover:text-wine/60'}`}>
            url
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border border-dashed transition-colors duration-300 cursor-pointer overflow-hidden ${
            dragOver ? 'border-wine/60 bg-wine/5' : 'border-taupe/40 hover:border-wine/30'
          }`}
          style={{ minHeight: '120px' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />

          {uploading ? (
            <div className="flex items-center justify-center h-32">
              <span className="font-serif text-[10px] tracking-widest text-wine/50 animate-pulse">uploading...</span>
            </div>
          ) : preview ? (
            <div className="relative group">
              <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
              <div className="absolute inset-0 bg-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-serif text-[9px] tracking-widest text-paper uppercase">replace</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <span className="text-taupe/50 text-2xl">↑</span>
              <span className="font-serif text-[10px] tracking-widest text-dark/30">drag or click to upload</span>
              <span className="font-serif text-[9px] text-dark/20">max 10 MB</span>
            </div>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={preview}
          onChange={handleUrlChange}
          required={required && !preview}
          placeholder="https://..."
          className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark placeholder:text-dark/25 focus:outline-none focus:border-wine transition-colors"
        />
      )}

      {/* Preview when URL mode and has value */}
      {mode === 'url' && preview && (
        <img src={preview} alt="preview" className="w-full max-h-40 object-cover mt-2 border border-taupe/20" />
      )}
    </div>
  );
}
