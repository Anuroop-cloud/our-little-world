import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../../services/api';

const INITIAL_TODOS = [
  { id: '1', title: 'watch the sunrise together', completed: false, createdAt: Date.now() },
  { id: '2', title: 'take a completely random road trip', completed: false, createdAt: Date.now() - 1000 },
  { id: '3', title: 'cook dinner together', completed: true, createdAt: Date.now() - 2000 },
  { id: '4', title: 'make a scrapbook', completed: false, createdAt: Date.now() - 3000 },
];

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    const todo = todos.find(t => t._id === id || t.id === id);
    if (!todo) return;
    
    // Optimistic update
    const updated = todos.map(t => (t._id === id || t.id === id) ? { ...t, completed: !t.completed } : t);
    setTodos(updated);
    
    try {
      await updateTodo(id, { completed: !todo.completed });
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchTodos();
    }
  };

  const handleDelete = async (id) => {
    const updated = todos.filter(t => t._id !== id && t.id !== id);
    setTodos(updated);
    
    try {
      await deleteTodo(id);
    } catch (err) {
      console.error(err);
      fetchTodos();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const newTodo = await createTodo({
        title: newItemTitle.trim(),
        completed: false
      });
      setTodos([...todos, newTodo]);
      setNewItemTitle('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-xl border border-wine/10 p-8 md:p-12 relative bg-paper shadow-sm">
      {/* Decorative top tape */}
      <div className="absolute -top-3 inset-x-0 mx-auto w-24 h-6 bg-white/40 backdrop-blur-sm shadow-sm rotate-1 z-10 border border-white/20" />
      
      <h3 className="font-display text-2xl md:text-3xl text-wine mb-8 uppercase tracking-wide text-center">
        Things we want to do
      </h3>

      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {todos.map(todo => (
            <TodoItem 
              key={todo._id || todo.id} 
              item={todo} 
              onToggle={handleToggle} 
              onDelete={handleDelete} 
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-wine/10">
        <AnimatePresence mode="wait">
          {!isAdding ? (
            <motion.button 
              key="add-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(true)}
              className="text-xs font-serif italic text-wine/60 hover:text-burgundy transition-colors"
            >
              + add something
            </motion.button>
          ) : (
            <motion.form 
              key="add-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className="flex items-center gap-4"
            >
              <input 
                type="text"
                autoFocus
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 bg-transparent border-b border-wine/30 pb-1 text-dark/80 font-serif focus:outline-none focus:border-wine transition-colors placeholder:italic placeholder:text-dark/30"
                placeholder="something fun..."
              />
              <button 
                type="submit"
                className="text-xs uppercase tracking-widest text-wine/60 hover:text-burgundy font-serif"
              >
                add
              </button>
              <button 
                type="button"
                onClick={() => { setIsAdding(false); setNewItemTitle(''); }}
                className="text-xs uppercase tracking-widest text-dark/40 hover:text-dark font-serif"
              >
                cancel
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default TodoList;
