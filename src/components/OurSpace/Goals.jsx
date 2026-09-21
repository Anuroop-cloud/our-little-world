import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoalCard from './GoalCard';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../../services/api';
import ImageUploader from '../shared/ImageUploader';

const INITIAL_GOALS = [
  { id: '1', title: 'Grow together', description: 'learn, adapt, and always choose each other', progress: 40 },
  { id: '2', title: 'Build our careers', description: 'support each other’s dreams', progress: 20 },
  { id: '3', title: 'Travel more', description: 'see the world together', progress: 10 },
  { id: '4', title: 'Make more memories', description: 'collect moments, not things', progress: 60 },
  { id: '5', title: 'Take care of each other', description: 'always be a safe space', progress: 80 },
];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', image_url: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProgressChange = async (id, amount) => {
    const goal = goals.find(g => g._id === id || g.id === id);
    if (!goal) return;

    const newProgress = Math.min(Math.max(goal.progress + amount, 0), 100);
    
    // Optimistic update
    const updated = goals.map(g => (g._id === id || g.id === id) ? { ...g, progress: newProgress } : g);
    setGoals(updated);
    
    try {
      await updateGoal(id, { progress: newProgress });
    } catch (err) {
      console.error(err);
      fetchGoals();
    }
  };

  const handleDelete = async (id) => {
    const updated = goals.filter(g => g._id !== id && g.id !== id);
    setGoals(updated);
    
    try {
      await deleteGoal(id);
    } catch (err) {
      console.error(err);
      fetchGoals();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    try {
      const created = await createGoal({
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        image_url: newGoal.image_url,
        progress: 0
      });
      setGoals([...goals, created]);
      setNewGoal({ title: '', description: '', image_url: '' });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-16">
      <h3 className="font-display text-2xl md:text-3xl text-wine mb-16 uppercase tracking-wide text-center">
        Things we're building
      </h3>

      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          {goals.map(goal => (
            <GoalCard 
              key={goal._id || goal.id}
              goal={goal}
              onProgressChange={handleProgressChange}
              onDelete={handleDelete}
              onUpdate={async (id, updates) => {
                const updated = goals.map(g => (g._id === id || g.id === id) ? { ...g, ...updates } : g);
                setGoals(updated);
                try {
                  await updateGoal(id, updates);
                } catch (err) {
                  console.error(err);
                  fetchGoals();
                }
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-center w-full">
        <AnimatePresence mode="wait">
          {!isAdding ? (
            <motion.button 
              key="add-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(true)}
              className="text-xs font-serif italic text-wine/60 hover:text-burgundy transition-colors"
            >
              + add a shared dream
            </motion.button>
          ) : (
            <motion.form 
              key="add-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className="flex flex-col gap-4 max-w-sm mx-auto overflow-hidden"
            >
              <input 
                type="text"
                autoFocus
                required
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full bg-transparent border-b border-wine/30 pb-1 text-dark/80 font-display text-xl text-center focus:outline-none focus:border-wine transition-colors placeholder:text-dark/20"
                placeholder="OUR DREAM"
              />
              <input 
                type="text"
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full bg-transparent border-b border-wine/30 pb-1 text-dark/80 font-serif italic text-center focus:outline-none focus:border-wine transition-colors placeholder:text-dark/20"
                placeholder="a little description..."
              />
              <ImageUploader 
                value={newGoal.image_url} 
                onChange={(url) => setNewGoal({...newGoal, image_url: url})} 
                label="Goal Photo (Optional)" 
              />
              <div className="flex justify-center gap-4 mt-4">
                <button 
                  type="submit"
                  className="text-xs uppercase tracking-widest text-wine/60 hover:text-burgundy font-serif border px-3 py-1 border-wine/20"
                >
                  add
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsAdding(false); setNewGoal({ title: '', description: '', image_url: '' }); }}
                  className="text-xs uppercase tracking-widest text-dark/40 hover:text-dark font-serif px-3 py-1"
                >
                  cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Goals;
