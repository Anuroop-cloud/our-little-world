import { motion } from 'framer-motion';

const FinalPage = ({ onBack }) => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-between relative overflow-hidden selection:bg-burgundy/30"
      style={{ backgroundColor: '#561C24' }}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Thin double border */}
      <div className="absolute inset-4 md:inset-8 border border-cream/10 pointer-events-none z-0" />
      <div className="absolute inset-5 md:inset-9 border border-cream/5 pointer-events-none z-0" />

      {/* Back nav */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        onClick={onBack}
        className="self-start mt-12 ml-12 md:mt-16 md:ml-16 z-40 text-xs tracking-[0.2em] uppercase text-cream/30 hover:text-cream/60 transition-colors font-serif group flex items-center gap-2"
      >
        <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> the letter
      </motion.button>

      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 relative z-10">

        {/* Top small date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-[10px] tracking-[0.4em] uppercase text-cream/30 mb-16"
        >
          24 · 09 · 2026
        </motion.p>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mb-10"
        >
          <h1
            className="font-display uppercase tracking-[0.15em] leading-tight mb-3"
            style={{ color: '#E8D8C4', fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            AND THIS IS ONLY
          </h1>
          <h1
            className="font-display uppercase tracking-[0.15em] leading-tight"
            style={{ color: '#E8D8C4', fontSize: 'clamp(1.6rem, 5vw, 3rem)' }}
          >
            THE BEGINNING.
          </h1>
        </motion.div>

        {/* Heart */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1, type: 'spring', stiffness: 120 }}
          className="mb-10"
        >
          <span
            className="font-script"
            style={{ fontSize: '3rem', color: 'rgba(232,216,196,0.5)' }}
          >
            ♡
          </span>
        </motion.div>

        {/* Names */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="font-serif text-sm tracking-[0.35em] uppercase mb-20"
          style={{ color: 'rgba(232,216,196,0.45)' }}
        >
          Anuroop &times; Pooja
        </motion.p>

        {/* "more memories to come..." */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="font-serif italic"
          style={{ color: 'rgba(232,216,196,0.3)', fontSize: '1rem' }}
        >
          &ldquo;more memories to come...&rdquo;
        </motion.p>
      </div>

      {/* Footer number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="mb-12 z-10"
      >
        <span
          className="font-serif text-xs tracking-[0.5em]"
          style={{ color: 'rgba(232,216,196,0.2)' }}
        >
          01
        </span>
      </motion.div>
    </div>
  );
};

export default FinalPage;
