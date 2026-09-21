import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MemoryViewer = ({ memory, onClose, onDelete }) => {
  if (!memory) return null;
  const handleDelete = () => onDelete?.(memory._id || memory.id);

  return (
    <AnimatePresence>
      {memory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:p-12 selection:bg-taupe/30">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="absolute inset-0 bg-paper/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-transparent flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar pb-8"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="fixed top-6 right-6 md:top-12 md:right-12 z-50 p-2 text-wine/50 hover:text-wine transition-colors bg-paper/80 backdrop-blur-md rounded-full shadow-sm"
            >
              <X size={24} strokeWidth={1.2} />
            </button>

            {/* Top decorative line */}
            <div className="w-16 h-[1px] bg-wine/30 mb-8 mt-4" />
            
            {/* Date */}
            <span className="font-serif text-xs tracking-[0.3em] text-wine/60 uppercase mb-12">
              {memory.date}
            </span>

            {/* Image Container */}
            <div className={`relative w-full md:w-[85%] bg-cream p-4 pb-12 shadow-xl border border-burgundy/10 rotate-[-1deg] ${memory.monochrome ? 'grayscale sepia-[.1]' : ''}`}>
               {/* Tape decoration */}
               <div className="absolute -top-3 inset-x-0 mx-auto w-20 h-8 bg-white/40 backdrop-blur-sm border border-white/20 rotate-[2deg] shadow-sm z-10" />
               
               <img 
                 src={memory.image_url || memory.image} 
                 alt={memory.title}
                 className="w-full h-auto object-cover border border-taupe/20"
               />
               
               {/* Under-image title */}
               <h3 className="font-display text-3xl md:text-4xl text-wine text-center mt-8 mb-2">
                 {memory.title}
               </h3>
               
               {/* Caption */}
               <p className="font-serif text-lg text-dark/70 italic text-center max-w-sm mx-auto leading-relaxed mb-6">
                 &ldquo;{memory.caption}&rdquo;
               </p>
               
               {/* Location */}
               <div className="text-center">
                 <span className="font-script text-2xl text-wine/50">{memory.location}</span>
               </div>
            </div>

            {/* Bottom decorative line */}
            <div className="w-16 h-[1px] bg-wine/30 mt-16 mb-6" />

            {/* Admin delete */}
            {onDelete && (
              <button
                onClick={handleDelete}
                className="font-serif text-[9px] tracking-[0.3em] uppercase text-dark/25 hover:text-wine transition-colors"
              >
                remove this memory
              </button>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MemoryViewer;
