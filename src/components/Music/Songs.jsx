import { motion } from 'framer-motion';
import { songs } from '../../data/songs';
import SongCard from './SongCard';

const Songs = ({ onBack, onNext }) => {
  return (
    <div className="min-h-screen w-full relative pt-24 pb-40 px-6 md:px-12 selection:bg-taupe/30">

      {/* Decorative Border */}
      <div className="fixed inset-4 md:inset-8 border border-burgundy/20 pointer-events-none z-0" />

      {/* Back Navigation */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={onBack}
        className="fixed top-12 left-12 md:top-16 md:left-16 z-40 text-xs tracking-[0.2em] uppercase text-wine/60 hover:text-wine transition-colors font-serif group flex items-center gap-2"
      >
        <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> our space
      </motion.button>

      {/* Next Navigation */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={onNext}
        className="fixed top-12 right-12 md:top-16 md:right-16 z-40 text-xs tracking-[0.2em] uppercase text-wine/60 hover:text-wine transition-colors font-serif group flex items-center gap-2"
      >
        for you <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
      </motion.button>

      {/* Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-24 relative z-10 pt-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-display text-4xl md:text-5xl text-wine mb-6 tracking-wide"
        >
          SONGS THAT REMIND ME OF YOU
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-dark/70 text-lg md:text-xl flex flex-col items-center gap-1"
        >
          <p>&ldquo;little pieces of us,</p>
          <p>hidden inside songs&rdquo;</p>
        </motion.div>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-[1px] bg-wine/30 mx-auto mt-12 mb-8"
        />
      </div>

      {/* Songs Grid — scattered, editorial */}
      <div className="relative w-full max-w-6xl mx-auto z-10">

        {/* Row 1 — 4 cards */}
        <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 gap-y-16 md:gap-y-20 mb-8 md:mb-16">
          {songs.slice(0, 4).map((song, i) => (
            <SongCard key={song.id} song={song} index={i} />
          ))}
        </div>

        {/* Decorative divider text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center my-6 md:my-10"
        >
          <span className="font-script text-3xl text-wine/30">♪</span>
        </motion.div>

        {/* Row 2 — 3 cards */}
        <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-10 gap-y-16">
          {songs.slice(4).map((song, i) => (
            <SongCard key={song.id} song={song} index={i + 4} />
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mt-24 relative z-10"
      >
        <p className="font-serif italic text-dark/40 text-sm">
          click any album to open it
        </p>
      </motion.div>

    </div>
  );
};

export default Songs;
