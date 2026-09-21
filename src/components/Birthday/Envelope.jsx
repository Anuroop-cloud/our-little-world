import { useState } from 'react';
import { motion } from 'framer-motion';

const Envelope = ({ onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 relative z-10">

      {/* Invitation text above */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="font-serif italic text-dark/40 text-sm tracking-widest mb-12 uppercase"
      >
        24 · 09 · 2026
      </motion.p>

      {/* The Envelope */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={onOpen}
        className="relative cursor-pointer"
        style={{ width: 'min(420px, 90vw)' }}
      >
        {/* Main envelope body */}
        <div className="relative bg-cream border border-burgundy/25 shadow-lg overflow-hidden"
          style={{ paddingTop: '70%' }}
        >
          {/* Envelope flap (top triangle) */}
          <div
            className="absolute inset-x-0 top-0 z-10"
            style={{
              height: '42%',
              background: 'linear-gradient(135deg, #E8D8C4 50%, transparent 50%), linear-gradient(225deg, #E8D8C4 50%, transparent 50%)',
              backgroundSize: '50% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left top, right top',
              borderBottom: '1px solid rgba(109, 41, 50, 0.15)',
            }}
          />

          {/* Bottom fold lines */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 border-t border-burgundy/10" />

          {/* Center seal / content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 pb-4" style={{ paddingTop: '20%' }}>

            {/* Wax-seal style medallion */}
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 rounded-full border border-burgundy/30 flex items-center justify-center mb-6 bg-paper/60 shadow-sm"
            >
              <span className="font-script text-3xl text-wine/70">♡</span>
            </motion.div>

            <p className="font-serif text-[10px] tracking-[0.4em] text-wine/50 uppercase mb-2">
              for
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-wine tracking-wide mb-2">
              Pooja
            </h2>

            <div className="w-8 h-[1px] bg-wine/25 my-4" />

            <motion.p
              animate={{ opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.4 }}
              className="font-serif italic text-dark/50 text-sm text-center"
            >
              open slowly
            </motion.p>
          </div>
        </div>

        {/* Corner fold decorations */}
        <div className="absolute bottom-0 left-0 w-0 h-0"
          style={{
            borderBottom: '28px solid rgba(200, 183, 163, 0.4)',
            borderRight: '28px solid transparent',
          }}
        />
        <div className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderBottom: '28px solid rgba(200, 183, 163, 0.4)',
            borderLeft: '28px solid transparent',
          }}
        />
      </motion.div>

      {/* Small label below */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="font-serif italic text-dark/30 text-xs mt-10"
      >
        a little something for you
      </motion.p>
    </div>
  );
};

export default Envelope;
