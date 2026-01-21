import React, { useEffect } from 'react';
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
  // Injecter le CSS pour masquer les boutons de téléchargement et d'impression
  useEffect(() => {
    // Ajouter une feuille de style pour masquer les boutons
    const style = document.createElement('style');
    style.textContent = `
      /* Masquer les boutons de téléchargement et d'impression */
      .react-pdf__Toolbar button[data-pdfjs-action="download"],
      .react-pdf__Toolbar button[data-pdfjs-action="print"],
      .react-pdf__Toolbar button[data-action="download"],
      .react-pdf__Toolbar button[data-action="print"],
      #download, #print, #secondaryDownload, #secondaryPrint,
      .toolbarButton.download, .toolbarButton.print,
      button[data-l10n-id="download"],
      button[data-l10n-id="print"],
      [data-toolbar-id="download"],
      [data-toolbar-id="print"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Désactiver les raccourcis clavier
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'p' || e.key === 'S' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };
    
    // Ajouter l'écouteur d'événement
    document.addEventListener('keydown', handleKeyDown);
    
    // Nettoyer les ressources
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="custom-pdf-viewer-container" style={{ width, height, position: 'relative' }}>
      {/* Utiliser PDFViewer avec l'enfant */}
      <PDFViewer width={width} height={height} className={`${className} pdf-viewer-no-download`}>
        {children}
      </PDFViewer>
      
      {/* Overlay pour bloquer les boutons de téléchargement et d'impression */}
      <div 
        className="pdf-buttons-overlay"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
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
