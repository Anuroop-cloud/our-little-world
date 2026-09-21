import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, getChatMessages, deleteMessage as apiDeleteMessage } from '../../services/api';

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function ChatMessage({ msg, currentUser, isAdmin, onDelete }) {
  const isOwn = msg.sender_username === currentUser?.username;
  const canDelete = isOwn || isAdmin;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}
    >
      <p className={`font-serif text-[8px] tracking-[0.2em] uppercase mb-1 ${isOwn ? 'text-wine/50' : 'text-dark/35'}`}>
        {msg.sender_display_name}
      </p>
      <div className="group flex items-end gap-2">
        {canDelete && !isOwn && (
          <button onClick={() => onDelete(msg._id)} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity font-serif text-[8px] text-dark/35 hover:text-wine/60 p-1">
            ✕
          </button>
        )}
        <div
          className={`max-w-xs md:max-w-sm px-5 py-3 ${
            isOwn
              ? 'bg-wine/10 border border-wine/20 text-dark'
              : 'bg-cream/60 border border-taupe/30 text-dark'
          }`}
        >
          <p className="font-serif text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          {msg.edited && <p className="font-serif text-[8px] text-dark/25 mt-1">edited</p>}
        </div>
        {canDelete && isOwn && (
          <button onClick={() => onDelete(msg._id)} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity font-serif text-[8px] text-dark/35 hover:text-wine/60 p-1">
            ✕
          </button>
        )}
      </div>
      <p className="font-serif text-[8px] text-dark/25 tracking-wide">{formatTime(msg.created_at)}</p>
    </motion.div>
  );
}

function ChatComposer({ onSend, loading }) {
  const [text, setText] = useState('');

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) { onSend(text.trim()); setText(''); }
    }
  };

  return (
    <div className="border-t-2 border-taupe/40 bg-cream/40 px-5 py-4">
      {/* Label */}
      <p className="font-serif text-[9px] tracking-[0.3em] uppercase mb-2" style={{ color: 'var(--color-dim)' }}>
        write a message
      </p>
      <div className="flex items-end gap-4 border border-taupe/50 bg-paper px-4 py-3 focus-within:border-wine/40 transition-colors">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="say something nice ♡"
          rows={2}
          autoFocus={false}
          className="flex-1 resize-none bg-transparent font-serif text-sm text-dark focus:outline-none leading-relaxed"
          style={{ minHeight: '2.5rem', maxHeight: '8rem', overflowY: 'auto', color: 'var(--color-dark)', caretColor: 'var(--color-wine)' }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
        />
        <button
          onClick={() => { if (text.trim()) { onSend(text.trim()); setText(''); } }}
          disabled={!text.trim() || loading}
          className="font-serif text-[10px] tracking-[0.25em] uppercase transition-colors shrink-0 self-end pb-0.5 disabled:opacity-30"
          style={{ color: 'var(--color-wine)' }}
        >
          {loading ? '...' : 'send →'}
        </button>
      </div>
      <p className="font-serif text-[8px] tracking-widest mt-1.5" style={{ color: 'var(--color-ghost)' }}>enter to send · shift+enter for new line</p>
    </div>
  );
}

export default function Chat() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const bottomRef = useRef(null);
  const wsRef = useRef(null);

  // Load history
  useEffect(() => {
    getChatMessages().then(setMessages).catch(console.error);
  }, []);

  // WebSocket
  useEffect(() => {
    const token = localStorage.getItem('olw_token');
    if (!token) return;
    const ws = new WebSocket(`ws://localhost:8000/api/chat/ws?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'new_message') {
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === 'delete_message') {
        setMessages((prev) => prev.filter((m) => (m._id || m.id) !== data.message_id));
      } else if (data.type === 'edit_message') {
        setMessages((prev) => prev.map((m) =>
          (m._id || m.id) === data.message._id ? { ...m, ...data.message } : m
        ));
      } else if (data.type === 'user_online' || data.type === 'user_offline') {
        setOnlineUsers(data.online || []);
      }
    };

    // Heartbeat
    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
    }, 25000);

    return () => {
      clearInterval(ping);
      ws.close();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    setSending(true);
    try {
      await sendMessage({ message: text });
      // WS broadcast will add it; if WS fails, also add optimistically
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => (m._id || m.id) !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const otherUser = onlineUsers.find((u) => u !== user?.username);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
      {/* Header */}
      <div className="text-center py-6 border-b border-taupe/25 px-6 shrink-0">
        <p className="font-display text-[8px] tracking-[0.5em] uppercase text-dark/25 mb-2">private</p>
        <h2 className="font-script text-4xl text-wine">our chat</h2>
        <p className="font-serif italic text-xs text-dark/35 mt-1">just us in here ♡</p>
        {onlineUsers.length > 0 && (
          <p className="font-serif text-[8px] tracking-widest uppercase text-wine/40 mt-2">
            {onlineUsers.join(', ')} online
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <p className="font-serif italic text-sm text-dark/30">no messages yet — say something ♡</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg._id || msg.id}
              msg={msg}
              currentUser={user}
              isAdmin={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="shrink-0">
        <ChatComposer onSend={handleSend} loading={sending} />
      </div>
    </div>
  );
}
