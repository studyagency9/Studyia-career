import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * Hook pour gérer la navigation au clavier
 * Améliore l'accessibilité de l'application
 */
export const useKeyboardNavigation = ({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  enabled = true,
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
      }
    },
    [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
};
