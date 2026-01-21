import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { pdfTemplateComponents } from './PDFTemplates';
import { useIsMobile } from '@/hooks/use-mobile';
import { Download, FileText } from 'lucide-react';
import { Button } from './ui/button';

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

  const fileName = `CV_${data.personalInfo.firstName}_${data.personalInfo.lastName}.pdf`.replace(/\s+/g, '_');

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

  // Sur desktop, afficher le viewer normal
  return (
    <div className={className} style={{ width: '100%', height: '600px' }}>
      <PDFViewer width="100%" height="100%">
        <PDFTemplate data={dataWithTranslations} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;
