import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/',         label: 'HOME'     },
  { to: '/story',    label: 'STORY'    },
  { to: '/memories', label: 'MEMORIES' },
  { to: '/space',    label: 'SPACE'    },
  { to: '/notes',    label: 'NOTES'    },
  { to: '/chat',     label: 'CHAT'     },
  { to: '/songs',    label: 'SONGS'    },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-taupe/40">
      {/* Top row */}
      <div className="flex items-center justify-between px-6 md:px-12 py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-script text-wine text-xl leading-none select-none">
          <img src="/penguin.svg" alt="logo" className="w-5 h-5 text-wine" style={{ color: 'var(--color-wine)' }} />
          olw
        </NavLink>

        {/* Title — centered */}
        <NavLink to="/" className="absolute left-1/2 -translate-x-1/2 text-center">
          {/* "our little world" — use solid muted color, not opacity hack */}
          <p className="font-display text-[10px] tracking-[0.35em] uppercase leading-none mb-0.5" style={{ color: 'var(--color-ghost)' }}>
            our little world
          </p>
          <p className="font-serif text-[9px] tracking-[0.2em] uppercase" style={{ color: 'var(--color-wine)', opacity: 0.7 }}>
            Anuroop × Pooja
          </p>
        </NavLink>

        {/* Right — user + logout */}
        <div className="flex items-center gap-4">
          <span className="hidden md:block font-serif text-[10px] tracking-[0.15em] uppercase" style={{ color: 'var(--color-muted)' }}>
            {user?.display_name}
          </span>
          <button
            onClick={handleLogout}
            className="font-serif text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-wine"
            style={{ color: 'var(--color-muted)' }}
          >
            leave
          </button>
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex flex-col gap-1 p-1"
            aria-label="Menu"
          >
            <span className={`block w-4 h-px bg-wine transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-4 h-px bg-wine transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-4 h-px bg-wine transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Nav row — desktop */}
      <nav className="hidden md:flex items-center justify-center gap-6 pb-2.5 px-6">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `font-serif text-[9px] tracking-[0.25em] uppercase transition-colors ${
                isActive
                  ? 'text-wine border-b border-wine/60 pb-0.5'
                  : 'hover:text-wine'
              }`
            }
            style={({ isActive }) => isActive ? {} : { color: 'var(--color-muted)' }}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-taupe/30"
          >
            <div className="grid grid-cols-4 gap-0">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-center font-serif text-[8px] tracking-[0.2em] uppercase transition-colors ${
                      isActive ? 'text-wine bg-cream/40' : ''
                    }`
                  }
                  style={({ isActive }) => isActive ? {} : { color: 'var(--color-muted)' }}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
