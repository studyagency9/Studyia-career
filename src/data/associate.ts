export interface Associate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  referralCode: string;
  referralLink: string;
  totalSales: number;
  totalCommission: number;
  availableBalance: number;
  withdrawnAmount: number;
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  cvId?: string;
  clientName?: string;  // Renommé de customerName selon l'API
  clientEmail?: string; // Renommé de customerEmail selon l'API
  amount?: number;      // Montant total de la vente
  commission: number;   // Renommé de commissionAmount selon l'API
  date: string;         // Renommé de createdAt selon l'API
  status: 'pending' | 'validated' | 'rejected'; // Ajout de 'rejected' au lieu de 'cancelled'
  // Champs supplémentaires pour compatibilité avec le code existant
  customerName?: string; // Pour compatibilité
  customerEmail?: string; // Pour compatibilité
  commissionAmount?: number; // Pour compatibilité
  createdAt?: string;    // Pour compatibilité
  validatedAt?: string;  // Pour compatibilité
  cvType?: 'public' | 'partner'; // Pour compatibilité
}

export interface AssociateStats {
  today: {
    sales: number;
    commission: number;
  };
  thisWeek: {
    sales: number;
    commission: number;
  };
  thisMonth: {
    sales: number;
    commission: number;
  };
  allTime: {
    sales: number;
    commission: number;
  };
}
