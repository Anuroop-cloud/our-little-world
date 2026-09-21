import { motion } from 'framer-motion';

const TodoItem = ({ item, onToggle, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 group py-2"
    >
      <button 
        onClick={() => onToggle(item._id || item.id)}
        className="relative flex-shrink-0 w-5 h-5 border border-wine/40 flex items-center justify-center transition-colors hover:border-wine"
      >
        {item.completed && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-burgundy font-script text-xl leading-none absolute -top-2 -left-1"
          >
            ✓
          </motion.div>
        )}
      </button>

      <div className="flex-1 overflow-hidden relative">
        <span className={`font-serif text-lg md:text-xl transition-all duration-500 ${item.completed ? 'text-wine/40' : 'text-dark/80'}`}>
          {item.title}
        </span>
        {item.completed && (
          <motion.div 
            layoutId={`strike-${item._id || item.id}`}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="absolute left-0 top-1/2 h-[1px] bg-wine/30" 
          />
        )}
      </div>

      <button 
        onClick={() => onDelete(item._id || item.id)}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest text-wine/50 hover:text-burgundy font-serif p-1"
      >
        remove
      </button>
    </motion.div>
  );
};

export default TodoItem;
