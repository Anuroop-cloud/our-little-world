import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    setError('');
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate('/');
    } catch {
      setError('incorrect username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-paper, #F8F6F2)' }}
    >
      {/* Decorative corner marks */}
      <span className="absolute top-8 left-8 text-taupe/30 font-serif text-xs tracking-widest">I.</span>
      <span className="absolute top-8 right-8 text-taupe/30 font-serif text-xs tracking-widest">I.</span>
      <span className="absolute bottom-8 left-8 text-taupe/30 font-serif text-xs tracking-widest">I.</span>
      <span className="absolute bottom-8 right-8 text-taupe/30 font-serif text-xs tracking-widest">I.</span>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm px-8 text-center"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-12"
        >
          <p className="font-display text-[9px] tracking-[0.5em] uppercase text-dark/30 mb-4">private</p>
          <h1 className="font-script text-5xl text-wine mb-2">our little world</h1>
          <div className="flex items-center gap-3 justify-center my-4">
            <span className="h-px w-12 bg-taupe/40" />
            <span className="font-serif text-taupe text-sm">♡</span>
            <span className="h-px w-12 bg-taupe/40" />
          </div>
          <p className="font-serif italic text-sm text-dark/40 tracking-wide">welcome back</p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="username"
              autoComplete="username"
              className="w-full bg-transparent border-0 border-b border-taupe/50 py-3 text-center font-serif text-sm text-dark placeholder:text-dark/25 focus:outline-none focus:border-wine/60 transition-colors tracking-widest"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="password"
              autoComplete="current-password"
              className="w-full bg-transparent border-0 border-b border-taupe/50 py-3 text-center font-serif text-sm text-dark placeholder:text-dark/25 focus:outline-none focus:border-wine/60 transition-colors tracking-widest"
            />
          </motion.div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-serif italic text-xs text-wine/70 pt-1"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="pt-6"
          >
            <button
              type="submit"
              disabled={loading || !form.username || !form.password}
              className="relative group inline-flex items-center justify-center px-12 py-3 font-serif text-[10px] tracking-[0.4em] uppercase text-wine disabled:opacity-40 transition-opacity"
            >
              <span className="absolute inset-0 border border-wine/30 transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 border border-wine/10 scale-105 transition-transform duration-500 group-hover:scale-100" />
              {loading ? 'entering...' : 'enter'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
