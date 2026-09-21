import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from './Envelope';
import BirthdayLetter from './BirthdayLetter';

const BirthdaySection = ({ onBack, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen w-full relative pt-24 pb-32 px-6 md:px-12 selection:bg-taupe/30 overflow-x-hidden">

      {/* Decorative Border */}
      <div className="fixed inset-4 md:inset-8 border border-burgundy/20 pointer-events-none z-0" />

      {/* Subtle background warm transition when letter is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 40%, rgba(232,216,196,0.25) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Back Navigation */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={onBack}
        className="fixed top-12 left-12 md:top-16 md:left-16 z-40 text-xs tracking-[0.2em] uppercase text-wine/60 hover:text-wine transition-colors font-serif group flex items-center gap-2"
      >
        <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> songs
      </motion.button>

      {/* Next Navigation — only visible once letter is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            onClick={onNext}
            className="fixed top-12 right-12 md:top-16 md:right-16 z-40 text-xs tracking-[0.2em] uppercase text-wine/60 hover:text-wine transition-colors font-serif group flex items-center gap-2"
          >
            and finally <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-16 relative z-10 pt-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-display text-4xl md:text-5xl text-wine mb-4 tracking-wide"
        >
          {isOpen ? 'FOR POOJA' : 'FOR POOJA'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-dark/60 text-lg"
        >
          &ldquo;a little something for you&rdquo;
        </motion.p>

        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-[1px] bg-wine/30 mx-auto mt-10 mb-4"
        />
      </div>

      {/* Main content — AnimatePresence between envelope and letter */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="envelope"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Envelope onOpen={() => setIsOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <BirthdayLetter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default BirthdaySection;
