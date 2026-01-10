import { useState, useCallback } from 'react';

interface UseImageOptimizationReturn {
  optimizeImage: (file: File, maxSize?: number, quality?: number) => Promise<string>;
  isOptimizing: boolean;
  error: string | null;
}

export const useImageOptimization = (): UseImageOptimizationReturn => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeImage = useCallback(async (
    file: File,
    maxSize: number = 300,
    quality: number = 0.8
  ): Promise<string> => {
    setIsOptimizing(true);
    setError(null);

    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => {
          const result = reader.result as string;
          
          if (!result || !result.startsWith('data:image')) {
            reject(new Error('Format d\'image non supporté'));
            return;
          }

          const img = new Image();
          
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Redimensionner si nécessaire
            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = Math.round(height * (maxSize / width));
                width = maxSize;
              } else {
                width = Math.round(width * (maxSize / height));
                height = maxSize;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Impossible de créer le contexte canvas'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            
            // Convertir en JPEG pour réduire la taille
            const optimizedImage = canvas.toDataURL('image/jpeg', quality);
            resolve(optimizedImage);
          };

          img.onerror = () => {
            reject(new Error('Erreur lors du chargement de l\'image'));
          };

          img.src = result;
        };

        reader.onerror = () => {
          reject(new Error('Erreur lors de la lecture du fichier'));
        };

        reader.readAsDataURL(file);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      throw err;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  return { optimizeImage, isOptimizing, error };
};
