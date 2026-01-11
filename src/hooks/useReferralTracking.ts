import { useEffect } from 'react';

export const useReferralTracking = () => {
  useEffect(() => {
    // Récupérer le code de parrainage depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      // Stocker dans cookie (30 jours)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `studyia_ref=${refCode}; expires=${expiryDate.toUTCString()}; path=/`;
      
      // Stocker dans localStorage
      localStorage.setItem('studyia_referral', refCode);
      
      // Tracker le clic (à implémenter avec l'API backend)
      trackReferralClick(refCode);
      
      // Nettoyer l'URL (optionnel - pour une meilleure UX)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);
};

const trackReferralClick = async (referralCode: string) => {
  try {
    // Pour l'instant, juste logger
    console.log('Referral click tracked:', referralCode);
    
    // Quand le backend sera prêt :
    // await fetch('/api/referral/track-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     referralCode,
    //     landingPage: window.location.pathname,
    //     ipAddress: '', // Sera récupéré côté serveur
    //     userAgent: navigator.userAgent,
    //   }),
    // });
  } catch (error) {
    console.error('Error tracking referral:', error);
  }
};

export const getReferralCode = (): string | null => {
  // Essayer de récupérer depuis localStorage
  const storedCode = localStorage.getItem('studyia_referral');
  if (storedCode) return storedCode;
  
  // Sinon, essayer depuis le cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'studyia_ref') {
      return value;
    }
  }
  
  return null;
};

export const trackConversion = async (cvType: 'public' | 'partner', customerData?: any) => {
  const referralCode = getReferralCode();
  
  if (!referralCode) return;
  
  try {
    console.log('Conversion tracked:', { referralCode, cvType, customerData });
    
    // Quand le backend sera prêt :
    // await fetch('/api/referral/convert', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     referralCode,
    //     cvType,
    //     customerEmail: customerData?.email,
    //     customerName: customerData?.name,
    //   }),
    // });
    
    // Pour l'instant, simuler localement
    simulateLocalConversion(referralCode, cvType);
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};

const simulateLocalConversion = (referralCode: string, cvType: 'public' | 'partner') => {
  // Trouver l'associé
  const associates = JSON.parse(localStorage.getItem('studyia_associates') || '[]');
  const associate = associates.find((a: any) => a.referralCode === referralCode);
  
  if (!associate) return;
  
  // Calculer la commission
  const commissionAmount = cvType === 'public' ? 500 : 6000; // Simplifié
  
  // Créer la vente
  const sale = {
    id: Date.now().toString(),
    associateId: associate.id,
    cvType,
    commissionAmount,
    status: 'validated',
    createdAt: new Date().toISOString(),
    validatedAt: new Date().toISOString(),
  };
  
  // Sauvegarder la vente
  const allSales = JSON.parse(localStorage.getItem('studyia_associate_sales') || '[]');
  allSales.push(sale);
  localStorage.setItem('studyia_associate_sales', JSON.stringify(allSales));
  
  // Mettre à jour l'associé
  associate.totalSales = (associate.totalSales || 0) + 1;
  associate.totalCommission = (associate.totalCommission || 0) + commissionAmount;
  associate.availableBalance = (associate.availableBalance || 0) + commissionAmount;
  
  const associateIndex = associates.findIndex((a: any) => a.id === associate.id);
  associates[associateIndex] = associate;
  localStorage.setItem('studyia_associates', JSON.stringify(associates));
  
  // Si l'associé est connecté, mettre à jour son profil
  const currentAssociate = localStorage.getItem('studyia_associate');
  if (currentAssociate) {
    const parsed = JSON.parse(currentAssociate);
    if (parsed.id === associate.id) {
      localStorage.setItem('studyia_associate', JSON.stringify(associate));
    }
  }
};
