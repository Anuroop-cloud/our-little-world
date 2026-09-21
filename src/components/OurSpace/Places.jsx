import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceCard from './PlaceCard';
import { getPlaces, createPlace, updatePlace, deletePlace } from '../../services/api';
import ImageUploader from '../shared/ImageUploader';

const INITIAL_PLACES = [
  { id: '1', name: 'JAPAN', note: 'someday ♡', visited: false, rotation: -2 },
  { id: '2', name: 'KASHMIR', note: 'snow & mountains', visited: false, rotation: 3 },
  { id: '3', name: 'MEGHALAYA', note: 'living root bridges', visited: false, rotation: -1 },
  { id: '4', name: 'PARIS', note: 'cliché but cute', visited: false, rotation: 2 },
  { id: '5', name: 'GOA', note: 'just for a weekend', visited: true, rotation: -4 },
];

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', note: '', image_url: '' });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const data = await getPlaces();
      setPlaces(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisited = async (id) => {
    const place = places.find(p => p._id === id || p.id === id);
    if (!place) return;

    // Optimistic update
    const updated = places.map(p => (p._id === id || p.id === id) ? { ...p, visited: !p.visited } : p);
    setPlaces(updated);
    
    try {
      await updatePlace(id, { visited: !place.visited });
    } catch (err) {
      console.error(err);
      fetchPlaces();
    }
  };

  const handleDelete = async (id) => {
    const updated = places.filter(p => p._id !== id && p.id !== id);
    setPlaces(updated);
    
    try {
      await deletePlace(id);
    } catch (err) {
      console.error(err);
      fetchPlaces();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newPlace.name.trim()) return;

    try {
      const created = await createPlace({
        name: newPlace.name.trim(),
        note: newPlace.note.trim(),
        image_url: newPlace.image_url,
        visited: false,
        rotation: Math.floor(Math.random() * 8) - 4
      });
      setPlaces([...places, created]);
      setNewPlace({ name: '', note: '', image_url: '' });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full relative py-12">
      <h3 className="font-display text-2xl md:text-3xl text-wine mb-12 uppercase tracking-wide text-center">
        Places we want to go
      </h3>

      <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center">
        <AnimatePresence mode="popLayout">
          {places.map(place => (
            <PlaceCard 
              key={place._id || place.id} 
              place={place} 
              onToggleVisited={handleToggleVisited} 
              onDelete={handleDelete}
              onUpdate={async (id, updates) => {
                const updated = places.map(p => (p._id === id || p.id === id) ? { ...p, ...updates } : p);
                setPlaces(updated);
                try {
                  await updatePlace(id, updates);
                } catch (err) {
                  console.error(err);
                  fetchPlaces();
                }
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-16 text-center w-full max-w-md mx-auto">
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
              + add a destination
            </motion.button>
          ) : (
            <motion.form 
              key="add-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleAdd}
              className="bg-paper p-6 border border-wine/20 shadow-md flex flex-col gap-4"
            >
              <h4 className="font-serif uppercase tracking-widest text-wine text-xs mb-2">New Destination</h4>
              <input 
                type="text"
                required
                autoFocus
                value={newPlace.name}
                onChange={(e) => setNewPlace({...newPlace, name: e.target.value})}
                className="w-full bg-transparent border-b border-wine/30 pb-1 text-dark/80 font-display text-xl uppercase tracking-widest focus:outline-none focus:border-wine transition-colors placeholder:text-dark/20 text-center"
                placeholder="PLACE NAME"
              />
              <input 
                type="text"
                value={newPlace.note}
                onChange={(e) => setNewPlace({...newPlace, note: e.target.value})}
                className="w-full bg-transparent border-b border-wine/30 pb-1 text-dark/80 font-serif italic focus:outline-none focus:border-wine transition-colors placeholder:text-dark/20 text-center"
                placeholder="a little note..."
              />
              <ImageUploader 
                value={newPlace.image_url} 
                onChange={(url) => setNewPlace({...newPlace, image_url: url})} 
                label="Destination Photo (Optional)" 
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
                  onClick={() => { setIsAdding(false); setNewPlace({ name: '', note: '', image_url: '' }); }}
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

export default Places;
