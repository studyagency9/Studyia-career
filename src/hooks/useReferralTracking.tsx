import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour suivre les codes de parrainage à partir de l'URL.
 * Il détecte le paramètre 'ref' dans l'URL, le stocke dans le localStorage,
 * et nettoie l'URL pour éviter les problèmes de rafraîchissement.
 */
export const useReferralTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Exécuté une seule fois au chargement de l'application
    const urlParams = new URLSearchParams(location.search);
    const referralCode = urlParams.get('ref');
    const shouldRedirectToBuilder = urlParams.get('createcv') === 'true';

    if (referralCode) {
      // Si un code de parrainage est trouvé, on le stocke.
      // Il sera utilisé plus tard lors d'une action (inscription, paiement).
      console.log(`Referral code detected: ${referralCode}`);
      localStorage.setItem('referralCode', referralCode);
      
      // Si le paramètre createcv est présent, rediriger vers le builder
      if (shouldRedirectToBuilder) {
        navigate('/builder', { replace: true });
        return;
      }
      
      // Sinon, nettoyer l'URL en supprimant le paramètre ref pour éviter les problèmes lors du rafraîchissement
      // Cela remplace l'URL actuelle sans recharger la page
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]); // Dépendances mises à jour pour React
};
