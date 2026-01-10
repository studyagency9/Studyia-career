import { useEffect, useRef } from 'react';

/**
 * Hook pour piéger le focus dans un élément (utile pour les modales)
 * Améliore l'accessibilité en empêchant le focus de sortir d'une modale
 */
export const useFocusTrap = (isActive: boolean = true) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !elementRef.current) return;

    const element = elementRef.current;
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus le premier élément au montage
    firstElement?.focus();

    element.addEventListener('keydown', handleTabKey);

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return elementRef;
};
