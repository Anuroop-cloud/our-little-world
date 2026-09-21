/**
 * MilestoneForm — modal for adding and editing milestones.
 * Used by MemoryLane. Admin-only.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createMilestone, updateMilestone } from '../../services/api';
import ImageUploader from '../shared/ImageUploader';

const empty = {
  date: '',
  title: '',
  description: '',
  image_url: '',
  photos: [],
  location: '',
  caption: '',
  monochrome: false,
};

export default function MilestoneForm({ isOpen, onClose, onSaved, milestone }) {
  const isEditing = Boolean(milestone?._id);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState(''); // Temp state for the uploader

  // Populate form when editing
  useEffect(() => {
    if (milestone) {
      let photos = milestone.photos || [];
      // Migrate old image_url if no photos exist
      if (photos.length === 0 && milestone.image_url) {
        photos = [{ url: milestone.image_url, caption: '', uploadedAt: new Date().toLocaleDateString() }];
      }
      setForm({ ...empty, ...milestone, photos });
    } else {
      setForm(empty);
    }
    setNewPhotoUrl('');
  }, [milestone, isOpen]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAddPhoto = (url) => {
    if (!url) return;
    setForm(f => ({
      ...f,
      photos: [...f.photos, { url, caption: '', uploadedAt: new Date().toLocaleDateString() }]
    }));
    setNewPhotoUrl(''); // Reset uploader
  };

  const handleUpdatePhotoCaption = (index, caption) => {
    const updated = [...form.photos];
    updated[index].caption = caption;
    set('photos', updated);
  };

  const handleRemovePhoto = (index) => {
    set('photos', form.photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.photos.length === 0 && !form.image_url) { 
      alert('Please add at least one photo.'); 
      return; 
    }
    setSaving(true);
    try {
      const saved = isEditing
        ? await updateMilestone(milestone._id, form)
        : await createMilestone(form);
      onSaved(saved, isEditing);
      onClose();
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={!saving ? onClose : undefined}
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl bg-paper border border-taupe/30 shadow-2xl p-8 md:p-10 overflow-y-auto max-h-[90vh]"
          >
            <button onClick={!saving ? onClose : undefined}
              className="absolute top-4 right-4 font-serif text-[9px] tracking-widest text-dark/30 hover:text-wine">
              close
            </button>

            <div className="text-center mb-8">
              <h2 className="font-script text-3xl text-wine">
                {isEditing ? 'Edit Milestone' : 'Add a Milestone'}
              </h2>
              <p className="font-serif italic text-xs text-dark/40 mt-1">
                {isEditing ? 'update this moment in our story' : 'a chapter in our story'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Photos upload & list */}
              <div className="border border-taupe/20 p-4 bg-cream/30">
                <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-4 text-center">Photos</label>
                
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {form.photos.map((photo, idx) => (
                      <div key={idx} className="relative bg-paper p-2 border border-taupe/30 shadow-sm flex flex-col gap-2">
                        <img src={photo.url} alt="upload preview" className="w-full h-32 object-cover" />
                        <button 
                          type="button" 
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-3 right-3 bg-dark/50 text-paper w-5 h-5 flex items-center justify-center text-[10px] hover:bg-burgundy transition-colors"
                        >
                          ✕
                        </button>
                        <input
                          type="text"
                          value={photo.caption || ''}
                          onChange={(e) => handleUpdatePhotoCaption(idx, e.target.value)}
                          placeholder="photo caption (optional)"
                          className="w-full bg-transparent border-b border-taupe/30 py-1 font-serif text-[10px] text-dark focus:outline-none focus:border-wine transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 border-t border-taupe/20 pt-4">
                  <ImageUploader
                    key={form.photos.length} // Force re-render of uploader after a successful add to clear state
                    label={form.photos.length === 0 ? "Add First Photo" : "Add Another Photo"}
                    value={newPhotoUrl}
                    onChange={(url) => handleAddPhoto(url)}
                    required={form.photos.length === 0}
                  />
                </div>
              </div>

              {/* Date & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Date</label>
                  <input
                    type="text" required
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                    placeholder="DD · MM · YYYY"
                    className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25"
                  />
                </div>
                <div>
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Title</label>
                  <input
                    type="text" required
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="our first..."
                    className="w-full bg-transparent border-b border-wine/20 py-2 font-display text-xl text-dark focus:outline-none focus:border-wine transition-colors placeholder:font-serif placeholder:text-sm placeholder:text-dark/25"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Description</label>
                <textarea
                  rows={3} required
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="how it felt..."
                  className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25 resize-none"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Overall Caption</label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => set('caption', e.target.value)}
                  placeholder="a short note..."
                  className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25"
                />
              </div>

              {/* Location + monochrome */}
              <div className="flex items-end justify-between gap-6">
                <div className="flex-1">
                  <label className="block font-serif text-[10px] tracking-[0.25em] uppercase text-wine/60 mb-2">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                    placeholder="somewhere special"
                    className="w-full bg-transparent border-b border-wine/20 py-2 font-serif text-sm text-dark focus:outline-none focus:border-wine transition-colors placeholder:text-dark/25"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer shrink-0 pb-2">
                  <span className="font-serif text-[9px] tracking-widest uppercase text-dark/40">monochrome</span>
                  <div
                    onClick={() => set('monochrome', !form.monochrome)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${form.monochrome ? 'bg-wine/60' : 'bg-taupe/30'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-paper transition-all ${form.monochrome ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={saving}
                  className="group relative inline-flex items-center justify-center px-10 py-3 font-serif text-[10px] tracking-[0.4em] uppercase text-wine disabled:opacity-40"
                >
                  <span className="absolute inset-0 border border-wine/30 transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-0 border border-wine/10 scale-105 transition-transform duration-500 group-hover:scale-100" />
                  {saving ? 'saving...' : isEditing ? 'Update' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
