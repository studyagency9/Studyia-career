import axios from 'axios';

// URL de base de l'API - forcer la production pour les tests
const baseURL = 'https://studyiacareer-backend-qpmpz.ondigitalocean.app/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  (config) => {
    // Tenter de récupérer le token de l'associé ou du partenaire
    const token = localStorage.getItem('associate_accessToken') || localStorage.getItem('partner_accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token a expiré ou est invalide (401 Unauthorized)
    if (error.response?.status === 401) {
      console.log('🔒 Session expirée - Redirection vers login...');
      
      // Nettoyer le localStorage
      localStorage.removeItem('associate_accessToken');
      localStorage.removeItem('partner_accessToken');
      localStorage.removeItem('associate_refreshToken');
      localStorage.removeItem('partner_refreshToken');
      
      // Rediriger vers la page de login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
