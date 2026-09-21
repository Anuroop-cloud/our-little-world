import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMemories, deleteMemory } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MemoryCard from './MemoryCard';
import MemoryViewer from './MemoryViewer';
import MemoryForm from './MemoryForm';

const FILTERS = ['ALL', 'PEOPLE', 'PLACES', 'LITTLE THINGS', 'FAVORITES'];

const Gallery = () => {
  const { isAdmin } = useAuth();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchMemories(); }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      setMemories(await getMemories());
      setError(null);
    } catch {
      setError('something went a little wrong ♡');
    } finally {
      setLoading(false);
    }
  };

  const handleAdded = (m) => setMemories((prev) => [m, ...prev]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this memory?')) return;
    try {
      await deleteMemory(id);
      setMemories((prev) => prev.filter((m) => (m._id || m.id) !== id));
      setSelectedMemory(null);
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const filtered = activeFilter === 'ALL' ? memories : memories.filter((m) => m.category === activeFilter);

  return (
    <div className="min-h-screen w-full relative pt-8 pb-32 px-6 md:px-12">
      <div className="fixed inset-4 md:inset-8 border border-burgundy/15 pointer-events-none z-0" />

      {/* Header */}
      <div className="w-full max-w-6xl mx-auto text-center mb-12 relative z-10 pt-8">
        <p className="font-display text-[8px] tracking-[0.5em] uppercase text-dark/25 mb-4">our memories</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-script text-6xl md:text-7xl text-wine mb-3"
        >
          Gallery
        </motion.h2>
        <p className="font-serif italic text-dark/50 text-base">&ldquo;little pieces of us&rdquo;</p>

        {/* Actions + Filters */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 mt-10 border-b border-wine/10 pb-6">
          {/* Add memory — admin only */}
          {isAdmin ? (
            <button
              onClick={() => setIsFormOpen(true)}
              className="font-serif text-[10px] tracking-[0.3em] uppercase text-wine/50 hover:text-wine transition-colors md:absolute md:left-0"
            >
              + add a memory
            </button>
          ) : <span />}

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-5 md:mx-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-serif text-[9px] tracking-[0.2em] uppercase relative pb-2 transition-colors ${
                  activeFilter === f ? 'text-wine' : 'text-dark/35 hover:text-wine/60'
                }`}
              >
                {f}
                {activeFilter === f && (
                  <motion.div layoutId="filterIndicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-wine/40" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative w-full max-w-6xl mx-auto z-10 min-h-[40vh]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="font-serif italic text-wine/40 text-sm"
            >
              gathering our memories...
            </motion.span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <p className="font-serif italic text-wine/50">{error}</p>
            <button onClick={fetchMemories} className="font-serif text-[9px] tracking-widest uppercase text-wine/40 hover:text-wine">try again</button>
          </div>
        ) : (
          <>
            <motion.div layout className="columns-1 sm:columns-2 md:columns-3 gap-8 md:gap-12">
              <AnimatePresence>
                {filtered.map((memory, i) => (
                  <MemoryCard
                    key={memory._id || memory.id}
                    memory={memory}
                    index={i}
                    onClick={setSelectedMemory}
                    onDelete={isAdmin ? handleDelete : null}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="font-serif italic text-dark/30 text-sm">no memories in this category</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <MemoryViewer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        onDelete={isAdmin ? handleDelete : null}
      />
      <MemoryForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onAdded={handleAdded} />
    </div>
  );
};

export default Gallery;
