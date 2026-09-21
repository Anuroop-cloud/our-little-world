import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotes, createNote } from '../../services/api';
import { useEffect } from 'react';
import NoteCard from './NoteCard';
import { useAuth } from '../../context/AuthContext';

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      const note = await createNote({ content: draft.trim() });
      setNotes((prev) => [note, ...prev]);
      setDraft('');
      setComposing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => setNotes((prev) => prev.filter((n) => n._id !== id));

  return (
    <div className="min-h-screen pb-32 px-6 md:px-12 pt-8">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto text-center mb-16">
        <p className="font-display text-[8px] tracking-[0.5em] uppercase text-dark/25 mb-4">private</p>
        <h2 className="font-script text-5xl md:text-6xl text-wine mb-4">Notes</h2>
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="h-px w-12 bg-taupe/40" />
          <span className="font-serif italic text-sm text-dark/40">little things I wanted to tell you</span>
          <span className="h-px w-12 bg-taupe/40" />
        </div>

        {/* + new note */}
        <button
          onClick={() => setComposing((v) => !v)}
          className="font-serif text-[10px] tracking-[0.25em] uppercase text-wine/50 hover:text-wine transition-colors mt-2"
        >
          {composing ? '— cancel' : '+ new note'}
        </button>
      </div>

      {/* Compose */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto mb-10 overflow-hidden"
          >
            <div className="border border-wine/20 bg-cream/20 p-7">
              <p className="font-serif text-[9px] tracking-[0.25em] uppercase text-wine/50 mb-4">
                from {user?.display_name}
              </p>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="write something..."
                rows={4}
                className="w-full bg-transparent font-serif italic text-sm text-dark placeholder:text-dark/25 focus:outline-none resize-none leading-relaxed"
                autoFocus
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleCreate}
                  disabled={!draft.trim() || saving}
                  className="font-serif text-[9px] tracking-[0.3em] uppercase text-wine/60 hover:text-wine disabled:opacity-30 transition-colors"
                >
                  {saving ? 'saving...' : 'leave note →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes list */}
      <div className="max-w-3xl mx-auto space-y-5">
        {loading && (
          <p className="font-serif italic text-center text-dark/30 text-sm py-16">gathering notes...</p>
        )}
        {!loading && notes.length === 0 && (
          <p className="font-serif italic text-center text-dark/30 text-sm py-16">nothing written yet — leave the first note ♡</p>
        )}
        <AnimatePresence initial={false}>
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
