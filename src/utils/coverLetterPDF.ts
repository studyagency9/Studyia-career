import { pdf } from '@react-pdf/renderer';
import { CoverLetterData } from '@/services/coverLetterService';

// Template PDF pour la lettre de motivation
const CoverLetterPDF = ({ data }: { data: CoverLetterData }) => {
  // Ce sera implémenté avec @react-pdf/renderer
  // Pour l'instant, retournons une chaîne de caractères formatée
  return `
${data.candidateName}
${data.candidateAddress}
${data.candidatePhone}
${data.candidateEmail}

${data.companyName}
${data.companyAddress}
${data.recipientName || ''}
${data.recipientTitle || ''}

${data.date}

Objet : ${data.subject}

Madame, Monsieur,

${data.introduction}

${data.body}

${data.conclusion}

${data.signature}
  `.trim();
};

/**
 * Génère un PDF pour la lettre de motivation
 */
export const generateCoverLetterPDF = async (data: CoverLetterData): Promise<Blob> => {
  try {
    // Pour l'instant, créons un blob texte simple
    // Dans une implémentation complète, utilisez @react-pdf/renderer
    const letterText = CoverLetterPDF({ data });
    
    return new Blob([letterText], { type: 'text/plain' });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF de la lettre:', error);
    throw new Error('Impossible de générer le PDF de la lettre de motivation');
  }
};

/**
 * Télécharge la lettre de motivation
 */
export const downloadCoverLetter = async (data: CoverLetterData, fileName?: string) => {
  try {
    const blob = await generateCoverLetterPDF(data);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `lettre-motivation-${data.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    throw error;
  }
};

/**
 * Génère un aperçu HTML de la lettre
 */
export const generateCoverLetterPreview = (data: CoverLetterData): string => {
  return `
    <div style="font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
      <div style="margin-bottom: 30px;">
        <div style="font-weight: bold; margin-bottom: 5px;">${data.candidateName}</div>
        <div>${data.candidateAddress}</div>
        <div>${data.candidatePhone}</div>
        <div>${data.candidateEmail}</div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <div style="font-weight: bold; margin-bottom: 5px;">${data.companyName}</div>
        <div>${data.companyAddress}</div>
        ${data.recipientName ? `<div>${data.recipientName}</div>` : ''}
        ${data.recipientTitle ? `<div>${data.recipientTitle}</div>` : ''}
      </div>
      
      <div style="margin-bottom: 20px;">
        <div><strong>${data.date}</strong></div>
        <div><strong>Objet : ${data.subject}</strong></div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div>Madame, Monsieur,</div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <div>${data.introduction}</div>
      </div>
      
      <div style="margin-bottom: 20px; white-space: pre-wrap;">
        ${data.body}
      </div>
      
      <div style="margin-bottom: 30px; white-space: pre-wrap;">
        ${data.conclusion}
      </div>
      
      <div>
        <div>${data.signature}</div>
      </div>
    </div>
  `;
};
