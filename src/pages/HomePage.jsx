import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Layout/Header';
import { useAuth } from '../context/AuthContext';
import { getMemories, getMilestones, getNotes, getChatMessages } from '../services/api';

function PreviewCard({ title, to, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={to} className="block group">
        <div className="border border-taupe/30 bg-paper p-6 hover:border-wine/30 transition-colors duration-500 relative overflow-hidden">
          <p className="font-display text-[8px] tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-ghost)' }}>{title}</p>
          {children}
          <p className="font-serif text-[9px] tracking-[0.2em] uppercase text-wine group-hover:text-burgundy transition-colors mt-4" style={{ opacity: 0.75 }}>
            view →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState({ memory: null, milestone: null, note: null, chat: null });

  useEffect(() => {
    Promise.allSettled([getMemories(), getMilestones(), getNotes(), getChatMessages()])
      .then(([m, ms, n, c]) => {
        setData({
          memory:    m.status === 'fulfilled'  ? m.value?.[0]  : null,
          milestone: ms.status === 'fulfilled' ? ms.value?.[0] : null,
          note:      n.status === 'fulfilled'  ? n.value?.[0]  : null,
          chat:      c.status === 'fulfilled'  ? c.value?.[c.value?.length - 1] : null,
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="pt-24 pb-32 px-6 md:px-12 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="text-center py-16 md:py-24"
        >
          <p className="font-display text-[8px] tracking-[0.6em] uppercase mb-6" style={{ color: 'var(--color-ghost)' }}>our little world</p>
          <h1 className="font-script text-6xl md:text-8xl text-wine mb-3">
            {user?.display_name}
          </h1>
          <div className="flex items-center gap-4 justify-center mt-4">
            <span className="h-px w-16 bg-taupe/40" />
            <span className="font-serif text-sm" style={{ color: 'var(--color-dim)' }}>Anuroop × Pooja</span>
            <span className="h-px w-16 bg-taupe/40" />
          </div>
        </motion.div>

        {/* Editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Latest Memory */}
          <PreviewCard title="Our Latest Memory" to="/memories" delay={0.1}>
            {data.memory ? (
              <>
                <div className="w-full h-40 overflow-hidden mb-3 bg-taupe/10">
                  <img
                    src={data.memory.image_url}
                    alt={data.memory.title}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                </div>
                <h3 className="font-display text-sm text-dark tracking-wide">{data.memory.title}</h3>
                <p className="font-serif italic text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{data.memory.caption}</p>
              </>
            ) : (
              <p className="font-serif italic text-sm" style={{ color: 'var(--color-dim)' }}>no memories yet</p>
            )}
          </PreviewCard>

          {/* Latest Milestone */}
          <PreviewCard title="Our Story" to="/story" delay={0.2}>
            {data.milestone ? (
              <>
                <p className="font-serif text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-wine)', opacity: 0.8 }}>{data.milestone.date}</p>
                <h3 className="font-display text-base text-dark tracking-wide mb-2">{data.milestone.title}</h3>
                <p className="font-serif italic text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted)' }}>{data.milestone.description}</p>
              </>
            ) : (
              <p className="font-serif italic text-sm" style={{ color: 'var(--color-dim)' }}>no milestones yet</p>
            )}
          </PreviewCard>

          {/* Latest Note */}
          <PreviewCard title="Latest Note" to="/notes" delay={0.3}>
            {data.note ? (
              <>
                <p className="font-serif italic text-sm leading-relaxed line-clamp-4 mb-3" style={{ color: 'var(--color-muted)' }}>
                  &ldquo;{data.note.content}&rdquo;
                </p>
                <p className="font-serif text-[9px] tracking-widest" style={{ color: 'var(--color-dim)' }}>— {data.note.display_name}</p>
              </>
            ) : (
              <p className="font-serif italic text-sm" style={{ color: 'var(--color-dim)' }}>nothing written yet</p>
            )}
          </PreviewCard>

          {/* Chat */}
          <PreviewCard title="Our Chat" to="/chat" delay={0.4}>
            {data.chat ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="font-serif text-[9px] tracking-widest mt-0.5 shrink-0" style={{ color: 'var(--color-dim)' }}>{data.chat.sender_display_name}</span>
                  <p className="font-serif text-sm italic line-clamp-3" style={{ color: 'var(--color-muted)' }}>&ldquo;{data.chat.message}&rdquo;</p>
                </div>
              </>
            ) : (
              <p className="font-serif italic text-sm" style={{ color: 'var(--color-dim)' }}>no messages yet</p>
            )}
          </PreviewCard>

          {/* Songs */}
          <PreviewCard title="Songs That Remind Me of You" to="/songs" delay={0.5}>
            <p className="font-script text-2xl text-wine mb-2" style={{ opacity: 0.65 }}>♪</p>
            <p className="font-serif italic text-xs leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              little pieces of us, hidden inside songs
            </p>
          </PreviewCard>



        </div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="text-center mt-24"
        >
          <span className="font-script text-2xl text-wine/20">♡</span>
        </motion.div>
      </div>
    </div>
  );
}
