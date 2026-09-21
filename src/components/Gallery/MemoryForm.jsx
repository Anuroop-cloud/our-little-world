import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { createMemory } from '../../services/api';
import ImageUploader from '../shared/ImageUploader';

const CATEGORIES = ['PEOPLE', 'PLACES', 'LITTLE THINGS', 'FAVORITES'];

const MemoryForm = ({ isOpen, onClose, onAdded }) => {
  const empty = { image_url: '', title: '', caption: '', date: '', location: '', category: 'LITTLE THINGS', monochrome: false };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) { alert('Please add an image.'); return; }
    setSaving(true);
    try {
      const created = await createMemory({ ...form, rotation: Math.floor(Math.random() * 6) - 3 });
      onAdded(created);
      onClose();
      setForm(empty);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!saving ? onClose : undefined}
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm cursor-pointer" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-paper border border-taupe/30 shadow-2xl p-8 md:p-10 overflow-y-auto max-h-[90vh]"
          >
            <button onClick={!saving ? onClose : undefined}
              className="absolute top-4 right-4 font-serif text-[9px] tracking-widest text-dark/30 hover:text-wine">
              close
            </button>

            <div className="text-center mb-8">
              <h2 className="font-script text-3xl text-wine">Add a Memory</h2>
              <p className="font-serif italic text-xs text-dark/40 mt-1">another piece of our story</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <ImageUploader label="Photo" value={form.image_url} onChange={(url) => set('image_url', url)} required />

              <div>
                <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Title</label>
                <input type="text" required value={form.title} onChange={(e) => set('title', e.target.value)}
                  placeholder="a beautiful day..."
                  className="w-full bg-transparent border-b border-wine/20 py-2 font-display text-lg text-dark focus:outline-none focus:border-wine transition-colors placeholder:font-serif placeholder:text-sm placeholder:text-dark/25" />
              </div>

              <div>
                <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Caption</label>
                <textarea rows={2} required value={form.caption} onChange={(e) => set('caption', e.target.value)}
                  placeholder="write something sweet..."
                  className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Date</label>
                  <input type="text" required value={form.date} onChange={(e) => set('date', e.target.value)}
                    placeholder="DD · MM · YYYY"
                    className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25" />
                </div>
                <div>
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Location</label>
                  <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)}
                    placeholder="somewhere special"
                    className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Category</label>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)}
                    className="bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="font-serif text-[10px] tracking-widest uppercase text-dark/40">monochrome</span>
                  <div onClick={() => set('monochrome', !form.monochrome)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${form.monochrome ? 'bg-wine/60' : 'bg-taupe/30'}`}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-paper transition-all ${form.monochrome ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </label>
              </div>

              <div className="pt-4 text-center">
                <button type="submit" disabled={saving}
                  className="group relative inline-flex items-center justify-center px-10 py-3 font-serif text-[10px] tracking-[0.4em] uppercase text-wine disabled:opacity-40">
                  <span className="absolute inset-0 border border-wine/30 transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 border border-wine/10 scale-105 transition-transform duration-500 group-hover:scale-100" />
                  {saving ? 'saving...' : 'Save Memory'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MemoryForm;
