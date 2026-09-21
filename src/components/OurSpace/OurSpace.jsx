import { motion } from 'framer-motion';
import TodoList from './TodoList';
import Places from './Places';
import Goals from './Goals';

const OurSpace = ({ onBack, onNext }) => {
  return (
    <div className="min-h-screen w-full relative pt-24 pb-32 px-6 md:px-12 selection:bg-taupe/30">
      
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
        <span className="transform transition-transform group-hover:-translate-x-1">&larr;</span> memories
      </motion.button>

      {/* Next Navigation */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onClick={onNext}
        className="fixed top-12 right-12 md:top-16 md:right-16 z-40 text-xs tracking-[0.2em] uppercase text-wine/60 hover:text-wine transition-colors font-serif group flex items-center gap-2"
      >
        songs <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
      </motion.button>

      {/* Header Section */}
      <div className="w-full max-w-4xl mx-auto text-center mb-24 relative z-10 pt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-display text-4xl md:text-5xl text-wine mb-6 tracking-wide"
        >
          OUR LITTLE SPACE
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif italic text-dark/70 text-lg md:text-xl flex flex-col items-center gap-2"
        >
          <p>"things we want to do,</p>
          <p>places we want to go,</p>
          <p>dreams we share"</p>
        </motion.div>
        
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 40 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-[1px] bg-wine/30 mx-auto mt-12 mb-8" 
        />
      </div>

      {/* Main Content Area */}
      <div className="relative w-full max-w-6xl mx-auto z-10 flex flex-col gap-32">
        
        {/* Section 1: Todos (Editorial asymmetrical placement) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full flex justify-center md:justify-end pr-0 md:pr-12 lg:pr-24"
        >
          <TodoList />
        </motion.section>

        {/* Section 2: Places */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Places />
        </motion.section>

        {/* Section 3: Goals */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <Goals />
        </motion.section>

      </div>
      
    </div>
  );
};

export default OurSpace;
