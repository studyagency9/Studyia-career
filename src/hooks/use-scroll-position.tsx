import { useEffect, useState } from 'react';

/**
 * Hook pour sauvegarder et restaurer la position de défilement
 * @param key - Clé unique pour identifier la position de défilement dans le localStorage
 * @param dependencies - Dépendances pour déclencher la sauvegarde de la position
 */
export function useScrollPosition(key: string, dependencies: any[] = []) {
  // État pour suivre si la position a été restaurée
  const [hasRestored, setHasRestored] = useState(false);

  // Restaurer la position de défilement au chargement
  useEffect(() => {
    // Ne restaurer qu'une seule fois
    if (hasRestored) return;

    const savedPosition = localStorage.getItem(`scroll_position_${key}`);
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        setTimeout(() => {
          window.scrollTo({
            top: position.y,
            left: position.x,
            behavior: 'auto'
          });
          setHasRestored(true);
        }, 100); // Petit délai pour s'assurer que le DOM est prêt
      } catch (e) {
        console.error('Erreur lors de la restauration de la position de défilement:', e);
      }
    } else {
      setHasRestored(true);
    }
  }, [key, hasRestored]);

  // Sauvegarder la position de défilement lors du défilement
  useEffect(() => {
    if (!hasRestored) return;

    const handleScroll = () => {
      const position = {
        x: window.scrollX,
        y: window.scrollY
      };
      localStorage.setItem(`scroll_position_${key}`, JSON.stringify(position));
    };

    // Utiliser un throttle pour éviter trop d'appels
    let timeout: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (timeout === null) {
        timeout = setTimeout(() => {
          handleScroll();
          timeout = null;
        }, 200);
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [key, hasRestored, ...dependencies]);

  // Fonction pour effacer manuellement la position sauvegardée
  const clearSavedPosition = () => {
    localStorage.removeItem(`scroll_position_${key}`);
  };

  return { clearSavedPosition };
}
