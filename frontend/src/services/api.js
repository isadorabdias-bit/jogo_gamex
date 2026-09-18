const API_BASE = 'http://localhost:3001/api';

/**
 * Função utilitária para requisições com autenticação automática
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mathplay_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || 'Ocorreu um erro na requisição.';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Autenticação
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getMe: () => request('/auth/me'),

  updateProfile: (profileData) => request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  // Jogos
  getQuestions: (gameType, difficulty) => 
    request(`/games/questions?gameType=${gameType}&difficulty=${difficulty}`),

  saveSession: (sessionData) => request('/games/save-session', {
    method: 'POST',
    body: JSON.stringify(sessionData)
  }),

  // Estatísticas e Dashboards
  getDashboard: () => request('/stats/dashboard'),
  getLeaderboard: () => request('/stats/leaderboard'),
  getTeacherOverview: () => request('/stats/teacher')
};
