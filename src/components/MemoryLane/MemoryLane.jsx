import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMilestones, deleteMilestone } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Milestone from './Milestone';
import MilestoneForm from './MilestoneForm';

const MemoryLane = () => {
  const { isAdmin } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // milestone to edit

  useEffect(() => { fetchMilestones(); }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      setMilestones(await getMilestones());
      setError(null);
    } catch {
      setError('something went a little wrong ♡');
    } finally {
      setLoading(false);
    }
  };

  // Called by MilestoneForm on save
  const handleSaved = (saved, wasEdit) => {
    if (wasEdit) {
      setMilestones((prev) => prev.map((m) => (m._id === saved._id ? saved : m)));
    } else {
      setMilestones((prev) => [...prev, saved]);
    }
  };

  const handleEdit = (milestone) => {
    setEditTarget(milestone);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this milestone?')) return;
    try {
      await deleteMilestone(id);
      setMilestones((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  return (
    <div className="w-full relative pt-8 pb-32 px-6 md:px-12">
      {/* Decorative Border */}
      <div className="fixed inset-4 md:inset-8 border border-burgundy/15 pointer-events-none z-0" />

      {/* Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-12 relative z-10 pt-8">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-display text-[8px] tracking-[0.5em] uppercase text-dark/25 mb-4"
        >
          our story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-script text-6xl md:text-7xl text-wine mb-4"
        >
          Memory Lane
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-dark/50 text-base"
        >
          &ldquo;how we became us&rdquo;
        </motion.p>

        {/* + add milestone — admin only */}
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={openAdd}
            className="mt-6 font-serif text-[10px] tracking-[0.3em] uppercase text-wine/50 hover:text-wine transition-colors block mx-auto"
          >
            + add milestone
          </motion.button>
        )}
      </div>

      {/* Timeline Section */}
      <div className="relative w-full max-w-5xl mx-auto z-10 pt-8">
        {/* Vertical line */}
        <div className="absolute top-0 bottom-0 left-8 md:left-24 w-[1px] bg-gradient-to-b from-transparent via-wine/20 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center pt-20">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              className="font-serif italic text-wine/40 text-sm"
            >
              dusting off the albums...
            </motion.span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center pt-20 gap-4">
            <p className="font-serif italic text-wine/50">{error}</p>
            <button onClick={fetchMilestones} className="font-serif text-[9px] tracking-widest uppercase text-wine/40 hover:text-wine">try again</button>
          </div>
        ) : (
          <div className="relative py-12">
            <AnimatePresence>
              {milestones.map((milestone, index) => (
                <div key={milestone._id || index} className="relative group/row">
                  <Milestone
                    milestone={milestone}
                    isExpanded={expandedMilestoneId === milestone._id}
                    onToggle={() => setExpandedMilestoneId(expandedMilestoneId === milestone._id ? null : milestone._id)}
                  />
                  {/* Edit / Delete controls — admin only, appear on hover */}
                  {isAdmin && (
                    <div className="absolute top-2 right-0 md:right-4 z-20 flex gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(milestone); }}
                        className="font-serif text-[8px] tracking-widest uppercase text-dark/30 hover:text-wine transition-colors"
                      >
                        edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(milestone._id); }}
                        className="font-serif text-[8px] tracking-widest uppercase text-dark/30 hover:text-wine transition-colors"
                      >
                        remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </AnimatePresence>

            {milestones.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif italic text-dark/30 text-sm">no milestones yet</p>
                {isAdmin && (
                  <button onClick={openAdd} className="mt-4 font-serif text-[9px] tracking-widest uppercase text-wine/50 hover:text-wine transition-colors">
                    + add the first one
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* End decoration */}
        {!loading && !error && milestones.length > 0 && (
          <div className="w-full text-center mt-20 mb-8">
            <span className="font-script text-3xl text-wine/30">to be continued...</span>
          </div>
        )}
      </div>

      <MilestoneForm
        isOpen={formOpen}
        milestone={editTarget}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default MemoryLane;
