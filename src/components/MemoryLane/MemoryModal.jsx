import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MemoryModal = ({ milestone, onClose }) => {
  if (!milestone) return null;

  return (
    <AnimatePresence>
      {milestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 md:p-12 selection:bg-taupe/30">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-full bg-paper border border-burgundy/20 shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-wine/50 hover:text-wine transition-colors bg-paper/80 backdrop-blur-md rounded-full"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative bg-taupe/10 p-4 md:p-8 flex items-center justify-center">
               <div className={`relative w-full h-full border border-burgundy/10 shadow-md ${milestone.monochrome ? 'grayscale sepia-[.1]' : ''}`}>
                  <img 
                    src={milestone.image_url || milestone.image} 
                    alt={milestone.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Tape decoration */}
                  <div className="absolute -top-3 inset-x-0 mx-auto w-16 h-6 bg-white/40 backdrop-blur-sm border border-white/20 rotate-[-2deg] shadow-sm" />
               </div>
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
              <span className="font-serif text-xs tracking-[0.2em] text-wine/50 uppercase mb-4">
                {milestone.date}
              </span>
              
              <h2 className="font-display text-3xl md:text-4xl text-wine mb-6 leading-tight">
                {milestone.title}
              </h2>
              
              <div className="w-12 h-[1px] bg-wine/20 mb-6" />
              
              <p className="font-serif text-lg text-dark/80 italic leading-relaxed mb-8">
                {milestone.description}
              </p>
              
              <div className="mt-auto pt-8 flex items-center justify-between text-wine/60 border-t border-wine/10">
                 {milestone.location && (
                   <span className="font-serif text-sm uppercase tracking-wider">{milestone.location}</span>
                 )}
                 <span className="font-script text-xl">{milestone.caption}</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MemoryModal;
