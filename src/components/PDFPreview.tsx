import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { pdfTemplateComponents } from './PDFTemplates';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText } from 'lucide-react';
import { Button } from './ui/button';
import CustomPDFViewer from './CustomPDFViewer';

// Importer le style CSS pour masquer les boutons de téléchargement et d'impression
import '@/styles/pdf-viewer-override.css';

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    summary: string;
    photo: string;
  };
  targetJob: string;
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  template: string;
  translations?: any;
}

interface PDFPreviewProps {
  data: CVData;
  className?: string;
  translations?: any;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data, className, translations }) => {
  const templateKey = data.template || 'professional';
  const isMobile = useIsMobile();

  const PDFTemplate = 
    (pdfTemplateComponents[templateKey as keyof typeof pdfTemplateComponents] as React.FC<{ data: CVData }>) || 
    pdfTemplateComponents.professional;

  // Ajouter les traductions aux données si elles sont fournies
  const dataWithTranslations = translations ? { ...data, translations } : data;
  
  // Pas besoin de wrapper, on utilisera un filigrane directement dans le PDF

  const fileName = `CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.pdf`.replace(/\s+/g, '_');

  // Effet pour désactiver les raccourcis clavier et les boutons de téléchargement/impression
  React.useEffect(() => {
    // Ne pas exécuter cet effet sur mobile
    if (isMobile) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Désactiver Ctrl+S, Ctrl+P, etc.
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };

    // Désactiver le menu contextuel (clic droit) sur le PDFViewer
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Ajouter les écouteurs d'événement
    document.addEventListener('keydown', handleKeyDown);
    
    // Fonction pour injecter du CSS et du JS dans l'iframe pour désactiver les boutons
    const disableDownloadButtons = () => {
      const pdfIframe = document.querySelector('iframe');
      if (pdfIframe) {
        try {
          // Essayer d'accéder au document de l'iframe
          const iframeDoc = pdfIframe.contentDocument || pdfIframe.contentWindow?.document;
          if (iframeDoc) {
            // Ajouter un écouteur pour le menu contextuel
            iframeDoc.addEventListener('contextmenu', disableContextMenu);
            
            // Créer un élément style pour masquer les boutons
            const styleEl = iframeDoc.createElement('style');
            styleEl.textContent = `
              #download, #print, #secondaryDownload, #secondaryPrint, 
              .toolbarButton.download, .toolbarButton.print {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
              }
            `;
            iframeDoc.head.appendChild(styleEl);
            
            // Observer les mutations pour désactiver les boutons dès qu'ils apparaissent
            const observer = new MutationObserver(() => {
              // Désactiver les boutons de téléchargement et d'impression
              const buttons = iframeDoc.querySelectorAll('#download, #print, #secondaryDownload, #secondaryPrint, .toolbarButton.download, .toolbarButton.print');
              buttons.forEach((button: Element) => {
                if (button instanceof HTMLElement) {
                  button.style.display = 'none';
                  button.style.visibility = 'hidden';
                  button.style.opacity = '0';
                  button.style.pointerEvents = 'none';
                  // La propriété disabled n'existe pas sur tous les HTMLElement
                  button.setAttribute('disabled', 'true');
                  button.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  };
                }
              });
            });
            
            // Observer tout le document pour les changements
            observer.observe(iframeDoc.body, { childList: true, subtree: true });
            
            // Exécuter une fois immédiatement
            observer.disconnect();
            observer.observe(iframeDoc.body, { childList: true, subtree: true });
          }
        } catch (error) {
          console.log('Impossible d\'accéder au document de l\'iframe');
        }
      }
    };
    
    // Exécuter la fonction après un court délai pour s'assurer que l'iframe est chargée
    const interval = setInterval(disableDownloadButtons, 1000);
    
    // Nettoyer les écouteurs d'événement
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [isMobile]);

  // Préparer le contenu à afficher en fonction du type d'appareil
  const renderContent = () => {
    // Sur mobile, afficher uniquement un message sans bouton de téléchargement
    if (isMobile) {
      return (
        <div className={className}>
          <div className="bg-muted/30 border-2 border-dashed border-border rounded-xl p-8 text-center space-y-4">
            <div className="flex justify-center">
              <FileText className="w-16 h-16 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aperçu PDF non disponible sur mobile
              </h3>
              <p className="text-sm text-muted-foreground">
                L'aperçu PDF ne fonctionne pas sur les appareils mobiles. Utilisez le bouton de téléchargement principal pour obtenir votre CV.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Sur desktop, afficher le viewer normal avec le filigrane visuel (pas dans le PDF)
    return (
      <div className={className} style={{ width: '100%', height: '600px', position: 'relative' }}>
        {/* Wrapper pour empêcher le téléchargement direct */}
        <div className="pdf-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
          <CustomPDFViewer width="100%" height="100%" className="pdf-viewer">
            <PDFTemplate data={dataWithTranslations} />
          </CustomPDFViewer>
          
          {/* Overlay spécifique pour bloquer les boutons de téléchargement et d'impression */}
          <div className="pdf-overlay" style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px', /* Largeur pour couvrir les boutons */
            height: '40px', /* Hauteur pour couvrir les boutons */
            zIndex: 9999,
            pointerEvents: 'auto', /* Capture les clics */
            cursor: 'default',
          }} onClick={(e) => e.stopPropagation()} />
          
          {/* Couche invisible pour bloquer uniquement certaines interactions avec le PDF */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              pointerEvents: 'none', // Permet le défilement
            }}
            onContextMenu={(e) => {
              e.preventDefault(); // Bloque le menu contextuel
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    );
  };

  // Rendre le contenu en fonction du type d'appareil
  return renderContent();
};

export default PDFPreview;
