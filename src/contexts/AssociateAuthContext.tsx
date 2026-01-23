import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { setCooldown } from '@/utils/cooldown';
import { Associate, Sale, AssociateStats } from '@/data/associate';

interface AssociateAuthContextType {
  associate: Associate | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  sales: Sale[];
  stats: AssociateStats;
  balance: {
    available: number;
    pending: number;
    withdrawn: number;
    total: number;
  };
  refreshStats: () => void;
  getProfile: () => Promise<Associate | null>;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  fetchReferrals: (period?: string) => Promise<any>;
  fetchDailyStats: () => Promise<any>;
  fetchWeeklyStats: () => Promise<any>;
  fetchMonthlyStats: () => Promise<any>;
  fetchSales: (params?: SalesQueryParams) => Promise<any>;
  fetchRecentSales: (limit?: number) => Promise<any>;
  requestWithdrawal: (data: WithdrawalRequestData) => Promise<any>;
  fetchWithdrawals: (page?: number, limit?: number) => Promise<any>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
}

interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  city?: string;
}

interface SalesQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface WithdrawalRequestData {
  amount: number;
  paymentMethod: string;
  paymentDetails?: {
    phoneNumber?: string;
    provider?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

const AssociateAuthContext = createContext<AssociateAuthContextType | undefined>(undefined);

export const AssociateAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [associate, setAssociate] = useState<Associate | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const verifyAssociateToken = async () => {
      const token = localStorage.getItem('associate_accessToken');
      const localAssociate = localStorage.getItem('associate');
      if (token && localAssociate) {
        try {
          const associateData = JSON.parse(localAssociate);
          
          // Mettre à jour le format du lien de parrainage pour les liens existants
          // qui pointent vers /signup au lieu de la page principale
          const baseUrl = window.location.origin;
          if (associateData.referralLink && associateData.referralLink.includes('/signup')) {
            associateData.referralLink = `${baseUrl}/?ref=${associateData.referralCode}`;
            // Mettre à jour le stockage local avec le nouveau lien
            localStorage.setItem('associate', JSON.stringify(associateData));
            console.log('Lien de parrainage mis à jour:', associateData.referralLink);
          }
          
          setAssociate(associateData);
          // Valider le token en récupérant les données à jour
          const response = await api.get('/associates/dashboard');
          console.log('Dashboard API response:', response.data);
          if (response.data.success) {
            // Générer un lien de parrainage si nécessaire
            if (!associateData.referralLink) {
              const baseUrl = window.location.origin;
              associateData.referralLink = `${baseUrl}/?ref=${associateData.referralCode}`;
            }
            // Mettre à jour les stats si nécessaire
          }
        } catch (error) {
          console.error("Session associé invalide, déconnexion.", error);
          logout();
        }
      }
    };
    verifyAssociateToken();
  }, []);

  const generateReferralCode = (firstName: string): string => {
    const prefix = firstName.substring(0, 4).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${year}${random}`;
  };

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    try {
      const response = await api.post('/associates/signup', data);
      console.log('Signup API response:', response.data);
      if (response.data.success) {
        const { associate, token } = response.data.data;
        
        localStorage.setItem('associate_accessToken', token);
        localStorage.setItem('associate', JSON.stringify(associate));
        
        setAssociate(associate);
        setSales([]); // Pas de ventes pour un nouvel associé

        return true;
      } else {
        // Gérer les erreurs renvoyées par l'API avec succès mais avec une erreur métier
        console.error('Erreur d\'inscription:', response.data.error || 'Erreur inconnue');
      }
    } catch (error: any) {
      // Gérer les erreurs réseau ou CORS
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        console.error('Erreur d\'inscription:', error.response.data?.error || 'Erreur serveur');
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue (problème CORS)
        console.error('Erreur réseau:', 'Aucune réponse du serveur. Vérifiez votre connexion ou les paramètres CORS.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur de configuration:', error.message);
      }
    }
    return false;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/associates/login', { email, password });
      console.log('Login API response:', response.data);
      if (response.data.success) {
        const { associate, token } = response.data.data;

        // Store token as associate_accessToken for compatibility with existing code
        localStorage.setItem('associate_accessToken', token);
        localStorage.setItem('associate', JSON.stringify(associate));

        setAssociate(associate);
        return true;
      } else {
        // Gérer les erreurs renvoyées par l'API avec succès mais avec une erreur métier
        console.error('Erreur de connexion:', response.data.error || 'Erreur inconnue');
        return false;
      }
    } catch (error: any) {
      // Gérer les erreurs réseau ou CORS
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        if (error.response.status === 429) {
          // Erreur 429 - Too Many Requests
          const errorMessage = 'Trop de tentatives de connexion. Veuillez patienter quelques instants avant de réessayer.';
          console.error('Erreur de connexion:', errorMessage);
          // Ajouter un délai avant de permettre une nouvelle tentative
          setCooldown('login', 30000); // 30 secondes de délai
        } else {
          console.error('Erreur de connexion:', error.response.data?.error || 'Erreur serveur');
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue (problème CORS)
        console.error('Erreur réseau:', 'Aucune réponse du serveur. Vérifiez votre connexion ou les paramètres CORS.');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Erreur de configuration:', error.message);
      }
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    // La documentation ne spécifie pas de endpoint /logout pour les associés, nous nettoyons juste le client
    setAssociate(null);
    setSales([]);
    localStorage.removeItem('associate_accessToken');
    localStorage.removeItem('associate');
  }, []);

  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!associate) return;
    try {
      const response = await api.get('/associates/dashboard');
      if (response.data.success) {
        const dashboardData = response.data.data;
        setDashboardData(dashboardData);
        
        // Récupérer les ventes récentes selon la structure de l'API
        // La documentation mentionne recentTransactions, mais vérifions les deux possibilités
        const recentSales = dashboardData.recentTransactions || dashboardData.recentActivity || [];
        
        // Adapter les données des ventes au format attendu par l'interface Sale
        const formattedSales = recentSales.map((sale: any) => ({
          id: sale.id,
          cvId: sale.cvId,
          clientName: sale.clientName,
          clientEmail: sale.clientEmail,
          amount: sale.amount,
          commission: sale.commission,
          date: sale.date || sale.createdAt,
          status: sale.status,
          // Champs pour compatibilité
          customerName: sale.clientName,
          customerEmail: sale.clientEmail,
          commissionAmount: sale.commission,
          createdAt: sale.date || sale.createdAt
        }));
        
        setSales(formattedSales);
        
        // Mettre à jour l'objet associé avec les données du dashboard
        setAssociate(prev => prev ? ({
          ...prev,
          totalSales: dashboardData.totalSales || prev.totalSales,
          totalCommission: dashboardData.totalCommission || prev.totalCommission,
          availableBalance: dashboardData.availableBalance || prev.availableBalance,
          withdrawnAmount: dashboardData.withdrawnAmount || prev.withdrawnAmount
        }) : null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du dashboard:", error);
    }
  }, [associate]);

  useEffect(() => {
    if (associate) {
      fetchDashboardData();
    }
  }, [associate, fetchDashboardData]);

  // Les stats sont dérivées du dashboardData selon la structure de l'API
  const stats: AssociateStats = {
    today: { 
      sales: dashboardData?.dailyStats?.sales || 0, 
      commission: dashboardData?.dailyStats?.commissions || 0 
    },
    thisWeek: { 
      sales: dashboardData?.weeklyStats?.sales || 0, 
      commission: dashboardData?.weeklyStats?.commissions || 0 
    },
    thisMonth: { 
      sales: dashboardData?.monthlyStats?.sales || 0, 
      commission: dashboardData?.monthlyStats?.commissions || 0 
    },
    allTime: { 
      sales: dashboardData?.totalSales || associate?.totalSales || 0, 
      commission: dashboardData?.totalCommission || associate?.totalCommission || 0 
    }
  };

  const balance = {
    available: associate?.availableBalance || 0,
    pending: dashboardData?.pendingCommission || 0, // Supposant que l'API renvoie ce champ
    withdrawn: associate?.withdrawnAmount || 0,
    total: associate?.totalCommission || 0,
  };

  const refreshStats = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fonction pour récupérer le profil de l'associé
  const getProfile = useCallback(async (): Promise<Associate | null> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/profile');
      if (response.data.success) {
        const profileData = response.data.data;
        // Mettre à jour l'état local avec les données du profil
        setAssociate(prev => prev ? { ...prev, ...profileData } : profileData);
        return profileData;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    }
    return null;
  }, [associate]);

  // Fonction pour mettre à jour le profil de l'associé
  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    if (!associate) return false;
    try {
      const response = await api.put('/associates/profile', data);
      if (response.data.success) {
        const updatedProfile = response.data.data;
        // Mettre à jour l'état local avec les données du profil mis à jour
        setAssociate(prev => prev ? { ...prev, ...updatedProfile } : updatedProfile);
        return true;
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error.response?.data?.error || error.message);
    }
    return false;
  }, [associate]);

  // Fonction pour changer le mot de passe
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!associate) return false;
    try {
      const response = await api.put('/associates/password', { currentPassword, newPassword });
      return response.data.success;
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error.response?.data?.error || error.message);
      return false;
    }
  }, [associate]);

  // Fonction pour récupérer les statistiques de parrainage
  const fetchReferrals = useCallback(async (period?: string): Promise<any> => {
    if (!associate) return null;
    try {
      const params = period ? { period } : {};
      const response = await api.get('/associates/referrals', { params });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de parrainage:", error);
      return null;
    }
  }, [associate]);

  // Fonction pour récupérer les statistiques quotidiennes
  const fetchDailyStats = useCallback(async (): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/stats/daily');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques quotidiennes:", error);
      return null;
    }
  }, [associate]);

  // Fonction pour récupérer les statistiques hebdomadaires
  const fetchWeeklyStats = useCallback(async (): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/stats/weekly');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques hebdomadaires:", error);
      return null;
    }
  }, [associate]);

  // Fonction pour récupérer les statistiques mensuelles
  const fetchMonthlyStats = useCallback(async (): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/stats/monthly');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques mensuelles:", error);
      return null;
    }
  }, [associate]);

  // Fonction pour récupérer l'historique des ventes avec filtrage
  const fetchSales = useCallback(async (params: SalesQueryParams = {}): Promise<any> => {
    if (!associate) return { success: false, error: 'Non authentifié' };
    
    console.log('Appel API fetchSales avec params:', params);
    
    // Ne pas utiliser AbortController pour éviter les erreurs CanceledError
    try {
      const response = await api.get('/associates/sales', { params });
      
      // Log complet de la réponse brute
      console.log('Réponse brute du backend:', response);
      console.log('Données de la réponse:', response.data);
      
      if (response.data.success) {
        const salesData = response.data.data;
        console.log('Données sales extraites:', salesData);
        
        // Si c'est la première page, mettre à jour l'état local
        if (!params.page || params.page === 1) {
          // Vérifier que sales existe et est un tableau
          const sales = Array.isArray(salesData.sales) ? salesData.sales : [];
          console.log('Tableau de ventes brut:', sales);
          
          const formattedSales = sales.map((sale: any) => {
            console.log('Vente individuelle brute:', sale);
            return {
              id: sale.id || sale._id || `temp-${Date.now()}`,
              cvId: sale.cvId || '',
              clientName: sale.clientName || '',
              clientEmail: sale.clientEmail || '',
              amount: sale.amount || 0,
              commission: sale.commission || 0,
              date: sale.date || sale.createdAt || new Date().toISOString(),
              status: sale.status || 'pending',
              // Champs pour compatibilité
              customerName: sale.clientName || '',
              customerEmail: sale.clientEmail || '',
              commissionAmount: sale.commission || 0,
              createdAt: sale.date || sale.createdAt || new Date().toISOString(),
              cvType: sale.cvType || 'public'
            };
          });
          console.log('Ventes formatées:', formattedSales);
          setSales(formattedSales);
        }
        return salesData;
      }
      console.log('Réponse API avec erreur:', response.data);
      return { success: false, error: response.data.error || 'Erreur inconnue' };
    } catch (error: any) {
      console.error("Erreur lors de la récupération des ventes:", error);
      console.log('Détails de l\'erreur:', { 
        name: error.name, 
        message: error.message, 
        code: error.code,
        response: error.response,
        request: error.request
      });
      
      // Gérer les erreurs CanceledError
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        // Retourner des données vides mais valides pour éviter l'affichage d'erreur
        return { 
          success: true, 
          data: {
            sales: [],
            pagination: { total: 0, pages: 1, currentPage: 1 }
          },
          error: 'Requête annulée'
        };
      }
      
      // Gérer l'erreur 500 spécifiquement
      if (error.response && error.response.status === 500) {
        // Retourner des données fictives temporaires en cas d'erreur 500
        return { 
          success: true, 
          data: {
            sales: [],
            pagination: { total: 0, pages: 1, currentPage: 1 }
          },
          error: 'Erreur serveur temporaire'
        };
      }
      
      return { 
        success: true, 
        data: {
          sales: [],
          pagination: { total: 0, pages: 1, currentPage: 1 }
        },
        error: error.message || 'Erreur réseau'
      };
    }
  }, [associate]);

  // Fonction pour récupérer les ventes récentes
  const fetchRecentSales = useCallback(async (limit: number = 5): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/sales/recent', { params: { limit } });
      if (response.data.success) {
        const recentSalesData = response.data.data;
        return recentSalesData;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes récentes:", error);
    }
    return null;
  }, [associate]);

  // Fonction pour demander un retrait de fonds
  const requestWithdrawal = useCallback(async (data: WithdrawalRequestData): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.post('/associates/withdrawal', data);
      if (response.data.success) {
        // Rafraîchir les données du dashboard après un retrait
        fetchDashboardData();
        return response.data.data;
      }
    } catch (error: any) {
      console.error("Erreur lors de la demande de retrait:", error.response?.data?.error || error.message);
    }
    return null;
  }, [associate, fetchDashboardData]);

  // Fonction pour récupérer l'historique des retraits
  const fetchWithdrawals = useCallback(async (page: number = 1, limit: number = 20): Promise<any> => {
    if (!associate) return null;
    try {
      const response = await api.get('/associates/withdrawals', { params: { page, limit } });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique des retraits:", error);
      return null;
    }
  }, [associate]);

  return (
    <AssociateAuthContext.Provider
      value={{
        associate,
        isAuthenticated: !!associate,
        login,
        signup,
        logout,
        sales,
        stats,
        balance,
        refreshStats,
        getProfile,
        updateProfile,
        changePassword,
        fetchReferrals,
        fetchDailyStats,
        fetchWeeklyStats,
        fetchMonthlyStats,
        fetchSales,
        fetchRecentSales,
        requestWithdrawal,
        fetchWithdrawals,
      }}
    >
      {children}
    </AssociateAuthContext.Provider>
  );
};

export const useAssociateAuth = () => {
  const context = useContext(AssociateAuthContext);
  if (!context) {
    throw new Error('useAssociateAuth must be used within AssociateAuthProvider');
  }
  return context;
};
