import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
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
          setAssociate(associateData);
          // Valider le token en récupérant les données à jour
          const response = await api.get('/associates/dashboard');
          console.log('Dashboard API response:', response.data);
          if (response.data.success) {
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
      }
    } catch (error: any) {
      // Gérer les erreurs réseau ou CORS
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        console.error('Erreur de connexion:', error.response.data?.error || 'Erreur serveur');
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
