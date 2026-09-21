import { motion } from 'framer-motion';
import { birthdayLetter } from '../../data/birthday';

const letterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const BirthdayLetter = () => {
  return (
    <div className="flex justify-center items-start px-6 py-16 relative z-10 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{ maxWidth: '640px' }}
      >
        {/* Letter paper — layered for depth */}
        <div
          className="absolute inset-0 bg-cream shadow-sm border border-taupe/30"
          style={{ transform: 'rotate(1.5deg) translateY(4px)', zIndex: 0 }}
        />
        <div
          className="absolute inset-0 bg-paper shadow-sm border border-taupe/20"
          style={{ transform: 'rotate(-0.5deg) translateY(2px)', zIndex: 1 }}
        />

        {/* Main letter */}
        <div
          className="relative bg-paper border border-burgundy/15 shadow-xl px-10 py-14 md:px-16 md:py-16"
          style={{ zIndex: 2 }}
        >
          {/* Tape decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/50 backdrop-blur-sm shadow-sm border border-white/30 rotate-1 z-10" />

          {/* Date stamp */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-xs tracking-[0.35em] text-wine/50 uppercase text-right mb-10"
          >
            {birthdayLetter.date}
          </motion.p>

          {/* Decorative top line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '2rem' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[1px] bg-wine/30 mb-8"
          />

          {/* Letter content */}
          <motion.div
            variants={letterVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Greeting */}
            <motion.p
              variants={lineVariants}
              className="font-display text-2xl md:text-3xl text-wine mb-8 tracking-wide"
            >
              {birthdayLetter.greeting}
            </motion.p>

            {/* Body paragraphs */}
            {birthdayLetter.paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={lineVariants}
                className="font-serif text-dark/80 text-lg md:text-xl leading-relaxed mb-6"
              >
                {para}
              </motion.p>
            ))}

            {/* Decorative divider */}
            <motion.div
              variants={lineVariants}
              className="w-full flex items-center justify-center my-10"
            >
              <div className="w-8 h-[1px] bg-wine/20" />
              <span className="font-script text-2xl text-wine/30 mx-4">♡</span>
              <div className="w-8 h-[1px] bg-wine/20" />
            </motion.div>

            {/* Closing */}
            <motion.p
              variants={lineVariants}
              className="font-display text-xl text-wine mb-8 tracking-wide"
            >
              {birthdayLetter.closing}
            </motion.p>

            {/* Signature */}
            <motion.p
              variants={lineVariants}
              className="font-script text-3xl md:text-4xl text-burgundy/80 mt-4"
            >
              {birthdayLetter.signature}
            </motion.p>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '2rem' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[1px] bg-wine/20 mt-12 ml-auto"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default BirthdayLetter;
