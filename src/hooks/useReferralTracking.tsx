import { useEffect } from 'react';

/**
 * Hook personnalisé pour suivre les codes de parrainage à partir de l'URL.
 * Il détecte le paramètre 'ref' dans l'URL et le stocke dans le localStorage.
 */
export const useReferralTracking = () => {
  useEffect(() => {
    // Exécuté une seule fois au chargement de l'application
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');

    if (referralCode) {
      // Si un code de parrainage est trouvé, on le stocke.
      // Il sera utilisé plus tard lors d'une action (inscription, paiement).
      console.log(`Referral code detected: ${referralCode}`);
      localStorage.setItem('referralCode', referralCode);
    }
  }, []); // Le tableau vide assure que l'effet ne s'exécute qu'une fois.
};
