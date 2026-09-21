const BASE = '/api';

function getToken() {
  return localStorage.getItem('olw_token');
}

async function request(endpoint, options = {}) {
  const url = `${BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body instanceof FormData) delete headers['Content-Type'];

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // Token expired — clear and redirect to login
    localStorage.removeItem('olw_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const loginUser   = (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
export const getMe       = () => request('/auth/me');
export const logoutUser  = () => request('/auth/logout', { method: 'POST' });

// ─── MEMORIES ─────────────────────────────────────────────────────────────────
export const getMemories   = () => request('/memories/');
export const createMemory  = (data) => request('/memories/', { method: 'POST', body: JSON.stringify(data) });
export const deleteMemory  = (id)   => request(`/memories/${id}`, { method: 'DELETE' });

// ─── MILESTONES ───────────────────────────────────────────────────────────────
export const getMilestones   = () => request('/milestones/');
export const createMilestone = (data) => request('/milestones/', { method: 'POST', body: JSON.stringify(data) });
export const updateMilestone = (id, data) => request(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMilestone = (id) => request(`/milestones/${id}`, { method: 'DELETE' });

// ─── TODOS ────────────────────────────────────────────────────────────────────
export const getTodos   = () => request('/todos/');
export const createTodo = (data) => request('/todos/', { method: 'POST', body: JSON.stringify(data) });
export const updateTodo = (id, data) => request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteTodo = (id) => request(`/todos/${id}`, { method: 'DELETE' });

// ─── PLACES ───────────────────────────────────────────────────────────────────
export const getPlaces   = () => request('/places/');
export const createPlace = (data) => request('/places/', { method: 'POST', body: JSON.stringify(data) });
export const updatePlace = (id, data) => request(`/places/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePlace = (id) => request(`/places/${id}`, { method: 'DELETE' });

// ─── GOALS ────────────────────────────────────────────────────────────────────
export const getGoals   = () => request('/goals/');
export const createGoal = (data) => request('/goals/', { method: 'POST', body: JSON.stringify(data) });
export const updateGoal = (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGoal = (id) => request(`/goals/${id}`, { method: 'DELETE' });

// ─── NOTES ────────────────────────────────────────────────────────────────────
export const getNotes   = () => request('/notes/');
export const createNote = (data) => request('/notes/', { method: 'POST', body: JSON.stringify(data) });
export const deleteNote = (id) => request(`/notes/${id}`, { method: 'DELETE' });

// ─── CHAT ─────────────────────────────────────────────────────────────────────
export const getChatMessages = () => request('/chat/messages');
export const sendMessage     = (data) => request('/chat/messages', { method: 'POST', body: JSON.stringify(data) });
export const editMessage     = (id, data) => request(`/chat/messages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMessage   = (id) => request(`/chat/messages/${id}`, { method: 'DELETE' });

// ─── UPLOAD ───────────────────────────────────────────────────────────────────
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  return request('/upload/', { method: 'POST', body: fd });
};
