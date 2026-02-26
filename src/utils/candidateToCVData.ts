import { Candidate } from '@/services/candidatesService';

/**
 * Formate une date ISO en format "Mois Année" (ex: "Mars 2023")
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${year}`;
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return '';
  }
};

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
}

/**
 * Convertit les données d'un candidat au format CVData pour la génération PDF
 */
export const convertCandidateToCVData = (candidate: Candidate, templateId: string): CVData => {
  return {
    personalInfo: {
      firstName: candidate.cvData?.personalInfo?.firstName || '',
      lastName: candidate.cvData?.personalInfo?.lastName || '',
      email: candidate.cvData?.personalInfo?.email || '',
      phone: candidate.cvData?.personalInfo?.phone || '',
      city: candidate.cvData?.personalInfo?.city || '',
      country: candidate.cvData?.personalInfo?.country || '',
      summary: candidate.cvData?.professionalSummary || '',
      photo: '', // Pas de photo pour les candidats
    },
    targetJob: candidate.cvData?.experiences?.[0]?.position || '',
    experiences: (candidate.cvData?.experiences || []).map((exp, index) => ({
      id: exp._id || `exp-${index}`,
      title: exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: formatDate(exp.startDate),
      endDate: formatDate(exp.endDate),
      current: exp.current || false,
      description: exp.description || exp.responsibilities || '',
    })),
    education: (candidate.cvData?.education || []).map((edu, index) => ({
      id: edu._id || `edu-${index}`,
      degree: edu.degree || '',
      school: edu.institution || '',
      location: '',
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
      description: edu.description || edu.field || '',
    })),
    skills: (candidate.cvData?.skills || []).map(skill => 
      typeof skill === 'string' ? skill : skill.name
    ),
    template: templateId,
  };
};
