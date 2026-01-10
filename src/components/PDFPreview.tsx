import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { pdfTemplateComponents } from './PDFTemplates';

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

  const PDFTemplate = 
    (pdfTemplateComponents[templateKey as keyof typeof pdfTemplateComponents] as React.FC<{ data: CVData }>) || 
    pdfTemplateComponents.professional;

  // Ajouter les traductions aux données si elles sont fournies
  const dataWithTranslations = translations ? { ...data, translations } : data;

  return (
    <div className={className} style={{ width: '100%', height: '600px' }}>
      <PDFViewer width="100%" height="100%">
        <PDFTemplate data={dataWithTranslations} />
      </PDFViewer>
    </div>
  );
};

export default PDFPreview;
