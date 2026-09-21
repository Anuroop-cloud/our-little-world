import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StoryPage from './pages/StoryPage';
import MemoriesPage from './pages/MemoriesPage';
import SpacePage from './pages/SpacePage';
import NotesPage from './pages/NotesPage';
import ChatPage from './pages/ChatPage';
import SongsPage from './pages/SongsPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <span className="font-script text-wine text-3xl opacity-40 animate-pulse">♡</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/story"    element={<ProtectedRoute><StoryPage /></ProtectedRoute>} />
      <Route path="/memories" element={<ProtectedRoute><MemoriesPage /></ProtectedRoute>} />
      <Route path="/space"    element={<ProtectedRoute><SpacePage /></ProtectedRoute>} />
      <Route path="/notes"    element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      <Route path="/chat"     element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/songs"    element={<ProtectedRoute><SongsPage /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
