import axios from 'axios';

// Déterminer si nous sommes en développement ou en production
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('192.168');

// URL de base de l'API - utiliser le proxy local en développement
const baseURL = isDev ? '/api' : 'https://studyia-career-backend.onrender.com/api';

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

// NOTE: La logique de rafraîchissement du token a été omise pour l'instant
// car elle nécessite une gestion plus complexe des différents types d'utilisateurs (associé/partenaire).
// Elle pourra être ajoutée ultérieurement si nécessaire.

export default api;
