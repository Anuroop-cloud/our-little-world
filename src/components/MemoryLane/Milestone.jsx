import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Milestone = ({ milestone, isExpanded: isPinned, onToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const expanded = isPinned || isHovered;

  const photos = milestone.photos?.length > 0 
    ? milestone.photos 
    : milestone.image_url ? [{ url: milestone.image_url }] : [];

  return (
    <div 
      className="relative w-full py-6 group cursor-pointer"
      onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setIsHovered(true); }}
      onMouseLeave={() => { if (window.matchMedia('(hover: hover)').matches) setIsHovered(false); }}
      onClick={(e) => {
        // Only toggle pin if clicking on the main area, not buttons
        if (e.target.tagName !== 'BUTTON') {
          onToggle();
        }
      }}
    >
      
      {/* Timeline Marker (Dot) */}
      <div className="absolute left-8 md:left-24 top-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 w-8 h-8">
        <motion.div 
          animate={{ scale: expanded ? 1.2 : 1 }}
          className={`w-2 h-2 rounded-full ring-4 ring-paper transition-colors duration-300 ${expanded ? 'bg-burgundy' : 'bg-wine/60 group-hover:bg-wine/80'}`}
        />
      </div>

      {/* Content Container */}
      <div className="w-full pl-20 md:pl-40 pr-6">
        
        {/* Collapsed view (Always visible) */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <span className="font-serif text-[10px] tracking-[0.3em] text-wine/60 uppercase">
              {milestone.date}
            </span>
            {isPinned && <span className="text-wine/40 text-[10px]">📌</span>}
          </div>
          <h3 className={`font-display text-xl md:text-2xl mt-1 transition-colors duration-300 ${expanded ? 'text-burgundy' : 'text-wine group-hover:text-wine/80'}`}>
            {milestone.title}
          </h3>
        </div>

        {/* Expanded View */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-8 flex flex-col gap-6">
                
                {/* Description */}
                {milestone.description && (
                  <p className="font-serif text-dark/70 italic text-lg leading-relaxed max-w-2xl">
                    {milestone.description}
                  </p>
                )}

                {/* Photos Gallery */}
                {photos.length > 0 && (
                  <div className={`grid gap-4 ${photos.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-md'}`}>
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-[4/3] bg-paper p-2 border border-taupe/30 shadow-sm group/photo hover:scale-[1.02] transition-transform duration-500">
                        <div className={`w-full h-full overflow-hidden ${milestone.monochrome ? 'grayscale sepia-[.1]' : ''}`}>
                          <img src={photo.url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                        {/* Photo tape */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/40 backdrop-blur-sm shadow-sm" />
                        
                        {/* Optional photo caption */}
                        {photo.caption && (
                          <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300">
                            <span className="bg-paper/80 backdrop-blur-md px-3 py-1 font-serif text-[10px] tracking-widest text-wine/80">
                              {photo.caption}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional general caption */}
                {milestone.caption && (
                  <span className="font-script text-xl text-wine/60">
                    "{milestone.caption}"
                  </span>
                )}

                {/* Metadata */}
                {(milestone.location || photos[0]?.uploadedAt) && (
                  <div className="flex gap-4 font-serif text-[9px] tracking-widest text-dark/40 uppercase mt-4 border-t border-taupe/20 pt-4 max-w-sm">
                    {milestone.location && <span>📍 {milestone.location}</span>}
                    {photos[0]?.uploadedAt && <span>uploaded {photos[0].uploadedAt}</span>}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Milestone;
