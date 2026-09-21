import { motion } from 'framer-motion';

const MemoryCard = ({ memory, index = 0, onClick, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(memory._id || memory.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full mb-8 group cursor-pointer break-inside-avoid"
      onClick={() => onClick(memory)}
    >
      <div
        className="relative bg-paper p-2 pb-8 border border-taupe/30 shadow-sm transition-all duration-500 hover:shadow-md group-hover:scale-[1.01]"
        style={{ transform: `rotate(${memory.rotation || 0}deg)` }}
      >
        {/* Image */}
        <div
          className={`w-full overflow-hidden bg-taupe/20 ${memory.monochrome ? 'grayscale sepia-[.1]' : ''}`}
          style={{ minHeight: '160px' }}
        >
          <img
            src={memory.image_url || memory.image}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ display: 'block' }}
          />
          <div className="absolute inset-0 bg-wine/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Tape on every 3rd card */}
        {index % 3 === 0 && (
          <div className="absolute -top-2 inset-x-0 mx-auto w-12 h-4 bg-white/40 backdrop-blur-sm shadow-sm rotate-[-4deg]" />
        )}

        {/* Title on hover */}
        <div className="absolute bottom-2 left-0 right-0 text-center px-2">
          <p className="font-script text-wine/60 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-1 group-hover:translate-y-0 truncate">
            {memory.title}
          </p>
        </div>
      </div>

      {/* Delete button — admin only, appears on hover */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity font-serif text-[8px] tracking-widest uppercase text-dark/30 hover:text-wine bg-paper/80 px-2 py-1 z-10"
        >
          remove
        </button>
      )}
    </motion.div>
  );
};

export default MemoryCard;
