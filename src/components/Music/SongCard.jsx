import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSpotifyThumbnail } from '../../services/spotify';

const SongCard = ({ song, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cover, setCover] = useState(song.fallbackCover);
  const [coverLoaded, setCoverLoaded] = useState(false);

  // Fetch real Spotify album art on mount
  useEffect(() => {
    let cancelled = false;
    fetchSpotifyThumbnail(song.url).then((url) => {
      if (!cancelled && url) setCover(url);
    });
    return () => { cancelled = true; };
  }, [song.url]);

  const handleClick = () => setIsOpen((prev) => !prev);

  const handleListen = (e) => {
    e.stopPropagation();
    window.open(song.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
      className="flex flex-col items-center cursor-pointer group select-none"
      style={{ width: '190px' }}
      onClick={handleClick}
    >
      {/* Album Sleeve */}
      <motion.div
        animate={{
          rotate: isOpen ? 0 : song.rotation,
          scale: isOpen ? 1.07 : 1,
          y: isOpen ? -10 : 0,
        }}
        whileHover={{ rotate: 0, scale: 1.04, y: -5 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-paper p-2 pb-8 border border-taupe/40 shadow-md"
        style={{ width: '174px' }}
      >
        {/* Album Art */}
        <div
          className="relative overflow-hidden bg-taupe/20"
          style={{ width: '158px', height: '158px' }}
        >
          {/* Skeleton shimmer while image loads */}
          {!coverLoaded && (
            <div className="absolute inset-0 animate-pulse bg-taupe/30" />
          )}
          <img
            src={cover}
            alt={song.title}
            onLoad={() => setCoverLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${coverLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-dark/5 mix-blend-multiply" />
        </div>

        {/* Year stamp */}
        <span className="absolute bottom-2 right-3 font-serif text-[10px] tracking-widest text-wine/40">
          {song.year}
        </span>

        {/* Open indicator */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-wine flex items-center justify-center shadow-sm"
            >
              <span className="text-paper text-[9px] font-serif leading-none">♡</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Info Below */}
      <div className="mt-5 text-center px-1 w-full">
        <motion.h4
          animate={{ color: isOpen ? '#561C24' : '#2B2020' }}
          transition={{ duration: 0.4 }}
          className="font-display text-base leading-snug tracking-wide"
        >
          {song.title}
        </motion.h4>
        <p className="font-serif text-xs text-dark/45 mt-0.5 tracking-wide">
          {song.artist}
        </p>

        {/* Expanded panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <p className="font-serif italic text-wine/65 text-sm leading-relaxed px-1 mb-4">
                &ldquo;{song.note}&rdquo;
              </p>
              <button
                onClick={handleListen}
                className="group/btn relative inline-flex items-center justify-center gap-2 px-5 py-1.5 text-[10px] tracking-[0.2em] text-wine uppercase font-serif transition-colors hover:text-burgundy"
              >
                <span className="absolute inset-0 border border-wine/25 transition-transform duration-500 group-hover/btn:scale-105" />
                <span className="absolute inset-0 border border-wine/10 scale-105 transition-transform duration-500 group-hover/btn:scale-100" />
                listen →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SongCard;
