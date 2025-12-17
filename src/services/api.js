import axios from 'axios';

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'https://sportpro-backend-1.onrender.com/api';

// Créer une instance axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Si pas de connexion au serveur
    if (!error.response) {
      console.error('Pas de réponse du serveur. Vérifiez que le backend est démarré.');
    }
    
    return Promise.reject(error);
  }
);

// Fonctions API
export const newsApi = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
};

export const eventsApi = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  register: (id) => api.post(`/events/${id}/register`),
};

export const equipmentApi = {
  getAll: (params) => api.get('/equipment', { params }),
  getCategories: () => api.get('/equipment/categories'),
  getById: (id) => api.get(`/equipment/${id}`),
};

export const contactApi = {
  sendMessage: (data) => api.post('/contact', data),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Fonction pour tester la connexion API
export const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ Connexion API réussie:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Impossible de se connecter à l\'API:', error.message);
    return false;
  }
};

export default api;
