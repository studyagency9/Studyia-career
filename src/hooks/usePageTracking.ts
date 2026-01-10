import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook pour tracker les pages vues (Google Analytics, etc.)
 * À configurer avec votre service d'analytics préféré
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      });
    }

    // Alternative: Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview');
    }

    // Alternative: Matomo
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['setCustomUrl', location.pathname + location.search]);
      (window as any)._paq.push(['trackPageView']);
    }

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('Page view:', location.pathname + location.search);
    }
  }, [location]);
};
