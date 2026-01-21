import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { pdfTemplateComponents } from '@/components/PDFTemplates';

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

const monthMap: { [key: string]: number } = {
  'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
  'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
};

const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);
  const parts = dateString.split(' ');
  const month = parts[0];
  const year = parseInt(parts[1], 10);
  const monthIndex = monthMap[month];

  if (isNaN(year) || monthIndex === undefined) {
    return new Date(0); // Retourne une date invalide si le format est incorrect
  }
  return new Date(year, monthIndex);
};

export const generatePDF = async (cvData: CVData, translations?: any): Promise<void> => {
  try {
    // Créer une copie des données pour éviter de modifier l'original
    const processedData = { ...cvData };
    
    // Vérifier si la photo est au format base64 et la traiter si nécessaire
    if (processedData.personalInfo && processedData.personalInfo.photo) {
      // S'assurer que la photo est bien au format base64
      if (!processedData.personalInfo.photo.startsWith('data:image')) {
        console.warn('Format de photo non supporté, la photo sera omise dans le PDF');
        processedData.personalInfo.photo = '';
      }
    }

    // Trier les expériences de la plus récente à la plus ancienne
    processedData.experiences = [...processedData.experiences].sort((a, b) => {
      const dateA = a.current ? new Date() : parseDate(a.endDate);
      const dateB = b.current ? new Date() : parseDate(b.endDate);
      
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      
      // Si les dates de fin sont identiques, trier par date de début
      const startDateA = parseDate(a.startDate);
      const startDateB = parseDate(b.startDate);
      return startDateB.getTime() - startDateA.getTime();
    });
    
    // Ajouter les traductions aux données
    if (translations) {
      processedData.translations = translations;
    }
    
    // Sélectionner le template PDF approprié
    const PDFTemplate = pdfTemplateComponents[processedData.template as keyof typeof pdfTemplateComponents] || pdfTemplateComponents.professional;
    
    // Générer le blob PDF directement sans filigrane (version payante)
    const asPdf = pdf(<PDFTemplate data={processedData} showWatermark={false} />);
    const blob = await asPdf.toBlob();
    
    // Créer le lien de téléchargement
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${processedData.personalInfo.firstName}_${processedData.personalInfo.lastName}.pdf`;
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Nettoyer l'URL
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
  }
};
