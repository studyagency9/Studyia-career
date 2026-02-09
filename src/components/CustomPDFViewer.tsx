import React, { useEffect, useRef } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import './pdf-viewer-styles.css';

// Définir les props du composant
interface CustomPDFViewerProps {
  children: React.ReactElement;
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Composant personnalisé qui enveloppe PDFViewer et désactive les boutons de téléchargement et d'impression
 */
const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({ 
  children, 
  width = '100%', 
  height = '100%',
  className = ''
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  // Effet pour masquer les boutons de téléchargement et d'impression
  useEffect(() => {
    const hideButtons = () => {
      // Chercher les iframes dans le conteneur
      const iframes = viewerRef.current?.querySelectorAll('iframe');
      
      iframes?.forEach(iframe => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Masquer les boutons de téléchargement et d'impression
            const buttons = iframeDoc.querySelectorAll(
              '#download, #print, .toolbarButton.download, .toolbarButton.print, ' +
              'button[data-pdfjs-action="download"], button[data-pdfjs-action="print"]'
            );
            
            buttons.forEach(button => {
              const element = button as HTMLElement;
              element.style.display = 'none';
              element.style.visibility = 'hidden';
              element.style.opacity = '0';
              element.style.pointerEvents = 'none';
            });
          }
        } catch (error) {
          // Ignorer les erreurs de cross-origin
        }
      });
    };

    // Observer les changements dans le DOM
    const observer = new MutationObserver(() => {
      setTimeout(hideButtons, 100);
    });

    // Désactiver les raccourcis clavier
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Commencer l'observation
    if (viewerRef.current) {
      observer.observe(viewerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    // Essayer immédiatement
    setTimeout(hideButtons, 500);
    
    // Nettoyer
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={viewerRef}
      className="custom-pdf-viewer-container" 
      style={{ 
        width, 
        height, 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <PDFViewer 
        width={width} 
        height={height} 
        className={`${className} pdf-viewer-no-download`}
        showToolbar={true}
      >
        {children}
      </PDFViewer>
      
      {/* Overlay pour bloquer les clics sur la toolbar */}
      <div 
        className="pdf-toolbar-overlay"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '50px',
          zIndex: 9999,
          pointerEvents: 'auto',
          cursor: 'default',
          backgroundColor: 'transparent',
        }}
        onClick={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default CustomPDFViewer;
