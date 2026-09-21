import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { deleteNote } from '../../services/api';

export default function NoteCard({ note, onDelete }) {
  const { user, isAdmin } = useAuth();
  const canDelete = isAdmin || note.author === user?.username;

  const handleDelete = async () => {
    try {
      await deleteNote(note._id);
      onDelete(note._id);
    } catch (e) {
      console.error(e);
    }
  };

  const date = new Date(note.created_at);
  const formatted = `${String(date.getDate()).padStart(2,'0')} · ${String(date.getMonth()+1).padStart(2,'0')} · ${date.getFullYear()}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border border-taupe/30 bg-cream/30 p-7 hover:border-wine/20 transition-colors duration-500"
    >
      <p className="font-serif text-[9px] tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--color-wine)', opacity: 0.75 }}>for you</p>

      <p className="font-serif italic text-sm md:text-base leading-relaxed" style={{ color: 'var(--color-muted)' }}>
        &ldquo;{note.content}&rdquo;
      </p>

      <div className="flex items-end justify-between mt-5">
        <p className="font-serif text-[9px] tracking-widest" style={{ color: 'var(--color-dim)' }}>— {note.display_name}</p>
        <p className="font-serif text-[9px] tracking-widest" style={{ color: 'var(--color-ghost)' }}>{formatted}</p>
      </div>

      {canDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity font-serif text-[9px] tracking-widest hover:text-wine transition-colors"
          style={{ color: 'var(--color-dim)' }}
        >
          remove
        </button>
      )}
    </motion.div>
  );
}
