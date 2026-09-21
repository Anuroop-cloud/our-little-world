import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from '../shared/ImageUploader';

const GoalCard = ({ goal, onProgressChange, onDelete, onUpdate }) => {
  const [isEditingImg, setIsEditingImg] = useState(false);
  const [tempUrl, setTempUrl] = useState(goal.image_url || '');

  const handleSaveImage = () => {
    if (onUpdate && tempUrl !== goal.image_url) {
      onUpdate(goal._id || goal.id, { image_url: tempUrl });
    }
    setIsEditingImg(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="group relative w-full flex flex-col items-center mb-12"
    >
      <div className="text-wine/60 text-lg mb-2">♡</div>
      
      {isEditingImg ? (
        <div className="w-full max-w-sm mb-4">
          <ImageUploader value={tempUrl} onChange={setTempUrl} label="Photo" />
          <div className="flex justify-center gap-2 mt-2">
            <button onClick={handleSaveImage} className="text-[10px] font-serif uppercase text-wine border border-wine/20 px-2 py-1">save</button>
            <button onClick={() => setIsEditingImg(false)} className="text-[10px] font-serif uppercase text-dark/40 px-2 py-1">cancel</button>
          </div>
        </div>
      ) : goal.image_url ? (
        <div className="relative w-full max-w-sm aspect-video mb-4 group/img overflow-hidden">
          <img src={goal.image_url} alt={goal.title} className="w-full h-full object-cover shadow-sm grayscale-[20%] sepia-[10%]" />
          <button 
            onClick={() => setIsEditingImg(true)}
            className="absolute inset-0 bg-dark/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-paper font-serif text-[10px] tracking-widest uppercase"
          >
            edit photo
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsEditingImg(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-serif uppercase tracking-widest text-wine/50 hover:text-wine mb-2 flex items-center gap-1"
        >
          <span>+</span> photo
        </button>
      )}

      <h4 className="font-display text-2xl md:text-3xl text-wine mb-3 group-hover:text-burgundy transition-colors text-center">
        {goal.title}
      </h4>
      
      {goal.description && (
        <p className="font-serif text-dark/70 italic text-center max-w-sm mb-6 leading-relaxed">
          {goal.description}
        </p>
      )}

      {/* Progress control */}
      <div className="flex items-center gap-4 w-full max-w-xs">
        <button 
          onClick={() => onProgressChange(goal._id || goal.id, -10)}
          className="text-wine/40 hover:text-wine font-serif text-xl px-2 transition-colors"
        >
          -
        </button>
        
        <div className="flex-1 h-[2px] bg-wine/10 relative rounded-full">
           <motion.div 
             className="absolute top-0 left-0 bottom-0 bg-wine/40 rounded-full"
             initial={{ width: 0 }}
             animate={{ width: `${goal.progress}%` }}
             transition={{ duration: 0.5, ease: "easeOut" }}
           />
        </div>
        
        <button 
          onClick={() => onProgressChange(goal._id || goal.id, 10)}
          className="text-wine/40 hover:text-wine font-serif text-xl px-2 transition-colors"
        >
          +
        </button>
      </div>

      <button 
        onClick={() => onDelete(goal._id || goal.id)}
        className="absolute top-0 right-0 md:-right-8 opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest text-wine/40 hover:text-burgundy font-serif"
      >
        remove
      </button>

    </motion.div>
  );
};

export default GoalCard;
