export type JobStatus = 'draft' | 'active' | 'closed' | 'archived';
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
export type EducationLevel = 'high_school' | 'bachelor' | 'master' | 'phd' | 'other';
export type ContractType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
export type LanguageRequirement = 'bilingual' | 'french' | 'english' | 'none';
export type Gender = 'male' | 'female' | 'any';
export type MaritalStatus = 'single' | 'married' | 'any';
export type DrivingLicense = 'required' | 'preferred' | 'not_required';

export interface JobPost {
  id: string;
  title: string;
  description: string;
  descriptionTemplateId?: number;
  company: string;
  
  // Location
  city: string;
  country: string;
  remote: boolean;
  
  // Requirements
  requiredSkills: string[];
  optionalSkills: string[];
  education: EducationLevel[];
  experience: ExperienceLevel;
  minYearsExperience: number;
  
  // Advanced Profile Requirements
  languageRequirement: LanguageRequirement;
  gender: Gender;
  maritalStatus: MaritalStatus;
  minAge?: number;
  maxAge?: number;
  childrenAccepted: boolean;
  drivingLicense: DrivingLicense;
  
  // Contract details
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  
  // Dates
  deadline: string;
  startDate?: string;
  
  // Status
  status: JobStatus;
  isUrgent: boolean;
  
  // Contact Information
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddress?: string;
  contactWebsite?: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  
  // Statistics
  stats: JobPostStats;
}

export interface JobPostStats {
  totalCandidates: number;
  newCandidates: number;
  reviewedCandidates: number;
  shortlistedCandidates: number;
  rejectedCandidates: number;
  averageScore: number;
  topScore: number;
  viewCount: number;
}

export interface CreateJobPostData {
  title: string;
  description: string;
  company: string;
  city: string;
  country: string;
  remote: boolean;
  requiredSkills: string[];
  optionalSkills?: string[];
  education: EducationLevel[];
  experience: ExperienceLevel;
  minYearsExperience: number;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  deadline: string;
  startDate?: string;
  isUrgent?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddress?: string;
  contactWebsite?: string;
}

export interface UpdateJobPostData extends Partial<CreateJobPostData> {
  status?: JobStatus;
}

export const experienceLevelLabels: Record<ExperienceLevel, { fr: string; en: string }> = {
  entry: { fr: 'Débutant', en: 'Entry Level' },
  junior: { fr: 'Junior (1-3 ans)', en: 'Junior (1-3 years)' },
  mid: { fr: 'Confirmé (3-5 ans)', en: 'Mid-Level (3-5 years)' },
  senior: { fr: 'Senior (5-10 ans)', en: 'Senior (5-10 years)' },
  expert: { fr: 'Expert (10+ ans)', en: 'Expert (10+ years)' },
};

export const educationLevelLabels: Record<EducationLevel, { fr: string; en: string }> = {
  high_school: { fr: 'Baccalauréat', en: 'High School' },
  bachelor: { fr: 'Licence/Bachelor', en: 'Bachelor\'s Degree' },
  master: { fr: 'Master', en: 'Master\'s Degree' },
  phd: { fr: 'Doctorat', en: 'PhD' },
  other: { fr: 'Autre', en: 'Other' },
};

export const contractTypeLabels: Record<ContractType, { fr: string; en: string }> = {
  full_time: { fr: 'Temps plein (CDI)', en: 'Full-time' },
  part_time: { fr: 'Temps partiel', en: 'Part-time' },
  contract: { fr: 'CDD', en: 'Contract' },
  internship: { fr: 'Stage', en: 'Internship' },
  freelance: { fr: 'Freelance', en: 'Freelance' },
};

export const jobStatusLabels: Record<JobStatus, { fr: string; en: string; color: string }> = {
  draft: { fr: 'Brouillon', en: 'Draft', color: 'gray' },
  active: { fr: 'Actif', en: 'Active', color: 'green' },
  closed: { fr: 'Fermé', en: 'Closed', color: 'red' },
  archived: { fr: 'Archivé', en: 'Archived', color: 'orange' },
};
