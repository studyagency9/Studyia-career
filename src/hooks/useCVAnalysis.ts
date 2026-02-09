import { useState } from 'react';
import { useTranslation } from '@/i18n/i18nContext';
import { toast } from '@/hooks/use-toast';
import geminiService, { CVParsed } from '@/services/gemini';

interface UseCVAnalysisOptions {
  onSuccess?: (data: CVParsed) => void;
  onError?: (error: Error) => void;
}

interface UseCVAnalysisReturn {
  analyzeCV: (file: File, systemPrompt: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useCVAnalysis = (options: UseCVAnalysisOptions = {}): UseCVAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const clearError = () => setError(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Setup PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    
    return textContent;
  };

  const analyzeCV = async (file: File, systemPrompt: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Extraction du texte selon le type de fichier
      let cvText = '';
      if (file.type === 'application/pdf') {
        cvText = await extractTextFromPDF(file);
      } else {
        throw new Error(t('upload.docxNotSupported'));
      }

      // Validation du texte extrait
      if (!cvText.trim()) {
        throw new Error('Le texte du CV est vide');
      }

      // Vérification de la configuration Gemini
      if (!geminiService.isConfigured()) {
        throw new Error(t('upload.apiKeyMissing'));
      }

      // Analyse avec Gemini
      const data = await geminiService.analyzeCV(cvText, systemPrompt);

      // Succès
      toast({
        title: t('upload.analysisSuccess'),
        description: t('upload.analysisSuccessDesc'),
      });

      options.onSuccess?.(data);

    } catch (err) {
      console.error("CV Analysis error:", err);
      
      let userMessage = t('upload.genericError');
      
      // Gestion des erreurs spécifiques
      if (err instanceof Error) {
        if (err.message.includes('API key') || err.message.includes('configured')) {
          userMessage = t('upload.apiKeyMissing');
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          userMessage = t('upload.networkError');
        } else if (err.message.includes('docxNotSupported')) {
          userMessage = t('upload.docxNotSupported');
        } else if (err.message.includes('vide')) {
          userMessage = 'Le fichier ne contient pas de texte lisible';
        } else {
          userMessage = t('upload.serviceUnavailable');
        }
      }
      
      setError(userMessage);
      
      // Toast d'erreur
      toast({
        title: t('upload.analysisErrorTitle'),
        description: userMessage,
        variant: 'destructive',
      });

      options.onError?.(err instanceof Error ? err : new Error('Unknown error'));
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyzeCV,
    isLoading,
    error,
    clearError,
  };
};

export default useCVAnalysis;
