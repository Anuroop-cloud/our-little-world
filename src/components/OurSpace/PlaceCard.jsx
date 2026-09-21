import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from '../shared/ImageUploader';

const PlaceCard = ({ place, onToggleVisited, onDelete, onUpdate }) => {
  const [isEditingImg, setIsEditingImg] = useState(false);
  const [tempUrl, setTempUrl] = useState(place.image_url || '');

  const handleSaveImage = () => {
    if (onUpdate && tempUrl !== place.image_url) {
      onUpdate(place._id || place.id, { image_url: tempUrl });
    }
    setIsEditingImg(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative group w-48 md:w-56 break-inside-avoid mb-6"
    >
      <div 
        className="w-full bg-cream p-4 pb-6 border border-taupe/40 shadow-sm flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md"
        style={{ transform: `rotate(${place.rotation || 0}deg)` }}
      >
        <button 
          onClick={() => onDelete(place._id || place.id)}
          className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs text-wine/50 hover:text-burgundy z-10 p-1"
        >
          ✕
        </button>

        {isEditingImg ? (
          <div className="w-full mb-4">
            <ImageUploader value={tempUrl} onChange={setTempUrl} label="Photo" />
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={handleSaveImage} className="text-[10px] font-serif uppercase text-wine">save</button>
              <button onClick={() => setIsEditingImg(false)} className="text-[10px] font-serif uppercase text-dark/40">cancel</button>
            </div>
          </div>
        ) : place.image_url ? (
          <div className="relative w-full aspect-[4/3] mb-4 group/img">
            <img src={place.image_url} alt={place.name} className="w-full h-full object-cover shadow-sm grayscale-[20%] sepia-[10%]" />
            <button 
              onClick={() => setIsEditingImg(true)}
              className="absolute bottom-2 right-2 bg-dark/70 text-paper px-2 py-1 rounded text-[8px] md:inset-0 md:bg-dark/40 md:opacity-0 md:group-hover/img:opacity-100 md:flex md:items-center md:justify-center md:rounded-none transition-opacity font-serif text-[10px] tracking-widest uppercase"
            >
              edit photo
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingImg(true)}
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-[10px] font-serif uppercase tracking-widest text-wine/60 hover:text-wine mb-2 flex items-center gap-1"
          >
            <span>+</span> photo
          </button>
        )}

        <h4 className="font-display text-xl md:text-2xl text-wine text-center uppercase tracking-widest mt-2 mb-4 relative">
          {place.name}
          {place.visited && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="absolute -top-1 -right-4 text-burgundy font-script text-2xl rotate-12 opacity-80"
             >
               ♡
             </motion.div>
          )}
        </h4>
        
        {place.note && (
          <p className="font-serif italic text-dark/60 text-center text-sm mb-4">
            &ldquo;{place.note}&rdquo;
          </p>
        )}

        <button
          onClick={() => onToggleVisited(place._id || place.id)}
          className={`text-[10px] font-serif uppercase tracking-widest px-3 py-1 border transition-colors ${
            place.visited 
              ? 'border-wine/20 text-wine/50 bg-wine/5' 
              : 'border-wine/40 text-wine hover:bg-wine hover:text-paper'
          }`}
        >
          {place.visited ? 'visited' : 'mark visited'}
        </button>
      </div>
    </motion.div>
  );
};

export default PlaceCard;
