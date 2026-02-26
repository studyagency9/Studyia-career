# 📋 API Backend - Studyia Career Pro
## Liste complète des endpoints nécessaires

---

## 🔐 **1. AUTHENTIFICATION & GESTION UTILISATEURS**

### 1.1 Création de Partenaires (par Admin uniquement)
```
POST /api/admin/partners
Headers: Authorization: Bearer {admin_token}
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  company: string,
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
}
Response: {
  success: boolean,
  data: {
    partner: Partner
  }
}
```

### 1.2 Authentification Partenaire (Entreprises)
**Note:** Les partenaires ne s'inscrivent PAS eux-mêmes. Seuls les admins créent les comptes partenaires.

```
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  data: {
    partner: Partner,
    accessToken: string,
    refreshToken: string
  }
}
```

```
POST /api/auth/refresh
Body: {
  refreshToken: string
}
Response: {
  success: boolean,
  data: {
    accessToken: string,
    refreshToken: string
  }
}
```

```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: {
  success: boolean
}
```

```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    partner: Partner
  }
}
```

### 1.2 Gestion du Profil Partenaire
```
PUT /api/partners/:id
Headers: Authorization: Bearer {token}
Body: {
  firstName?: string,
  lastName?: string,
  company?: string,
  email?: string
}
Response: {
  success: boolean,
  data: {
    partner: Partner
  }
}
```

```
PUT /api/partners/:id/password
Headers: Authorization: Bearer {token}
Body: {
  currentPassword: string,
  newPassword: string
}
Response: {
  success: boolean
}
```

---

## 💼 **2. GESTION DES OFFRES D'EMPLOI**

### 2.1 CRUD Offres d'emploi
```
POST /api/job-posts
Headers: Authorization: Bearer {token}
Body: {
  title: string,
  description: string,
  company: string,
  city: string,
  country: string,
  remote: boolean,
  requiredSkills: string[],
  optionalSkills: string[],
  education: EducationLevel[],
  experience: ExperienceLevel,
  minYearsExperience: number,
  contractType: ContractType,
  salaryMin?: number,
  salaryMax?: number,
  currency: string,
  deadline: string,
  startDate?: string,
  isUrgent: boolean,
  languageRequirement: LanguageRequirement,
  gender: Gender,
  maritalStatus: MaritalStatus,
  minAge?: number,
  maxAge?: number,
  childrenAccepted: boolean,
  drivingLicense: DrivingLicense,
  contactEmail?: string,
  contactPhone?: string,
  contactWhatsApp?: string,
  contactAddress?: string,
  contactWebsite?: string
}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
GET /api/job-posts
Headers: Authorization: Bearer {token}
Query: {
  status?: 'draft' | 'active' | 'closed' | 'archived',
  page?: number,
  limit?: number,
  search?: string
}
Response: {
  success: boolean,
  data: {
    jobPosts: JobPost[],
    total: number,
    page: number,
    totalPages: number
  }
}
```

```
GET /api/job-posts/:id
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
PUT /api/job-posts/:id
Headers: Authorization: Bearer {token}
Body: Partial<CreateJobPostData> & {
  status?: JobStatus
}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
DELETE /api/job-posts/:id
Headers: Authorization: Bearer {token}
Response: {
  success: boolean
}
```

### 2.2 Actions sur les offres
```
POST /api/job-posts/:id/publish
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
POST /api/job-posts/:id/close
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
POST /api/job-posts/:id/archive
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

```
POST /api/job-posts/:id/duplicate
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    jobPost: JobPost
  }
}
```

---

## 👥 **3. GESTION DES CANDIDATURES**

### 3.1 Upload Multiple CV (PDF/Word)
```
POST /api/job-posts/:jobId/upload-cvs
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData {
  files: File[] (PDF ou Word, max 10MB chacun)
}
Response: {
  success: boolean,
  data: {
    uploadedFiles: {
      filename: string,
      size: number,
      url: string,
      candidateId: string
    }[],
    totalUploaded: number
  }
}
```

### 3.2 Analyse et Extraction IA des CV
**Important:** Cette route extrait les données de chaque CV avec Gemini et fait le matching automatique.

```
POST /api/job-posts/:jobId/analyze-cvs
Headers: Authorization: Bearer {token}
Body: {
  candidateIds: string[] (IDs des candidats à analyser)
}
Response: {
  success: boolean,
  data: {
    analyzed: number,
    failed: number,
    results: {
      candidateId: string,
      status: 'success' | 'failed',
      score?: number,
      error?: string
    }[]
  }
}
```

**Processus interne de cette route:**
1. Pour chaque CV uploadé:
   - Extraire le texte (PDF: pdf-parse, Word: mammoth.js)
   - Envoyer à Gemini pour extraction données structurées (format CV Builder)
   - Envoyer cvData + JobPost à Gemini pour matching
   - Calculer score global (0-100)
   - Stocker dans Candidate avec status 'new'

### 3.3 Listing des Candidats (classés par score)
```
GET /api/job-posts/:jobId/candidates
Headers: Authorization: Bearer {token}
Query: {
  status?: 'new' | 'reviewed' | 'shortlisted' | 'rejected',
  page?: number,
  limit?: number,
  minScore?: number,
  maxScore?: number,
  sortBy?: 'score' | 'date' | 'name',
  skills?: string[] (filtrer par compétences)
}
Response: {
  success: boolean,
  data: {
    candidates: Candidate[],
    total: number,
    page: number,
    totalPages: number,
    averageScore: number
  }
}
```

### 3.4 Détails d'un Candidat
```
GET /api/candidates/:id
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    candidate: {
      id: string,
      jobPostId: string,
      originalFileName: string,
      originalFileUrl: string,
      cvData: CVData,  // Format CV Builder
      matchingAnalysis: {
        globalScore: number,
        skillsScore: number,
        experienceScore: number,
        educationScore: number,
        matchedSkills: string[],
        missingSkills: string[],
        strengths: string[],
        weaknesses: string[],
        recommendation: string
      },
      status: string,
      notes: string[],
      createdAt: string,
      updatedAt: string
    }
  }
}
```

### 3.5 Actions sur les Candidats
```
PUT /api/candidates/:id/status
Headers: Authorization: Bearer {token}
Body: {
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected',
  notes?: string
}
Response: {
  success: boolean,
  data: {
    candidate: Candidate
  }
}
```

```
POST /api/candidates/:id/notes
Headers: Authorization: Bearer {token}
Body: {
  note: string
}
Response: {
  success: boolean,
  data: {
    candidate: Candidate
  }
}
```

```
DELETE /api/candidates/:id
Headers: Authorization: Bearer {token}
Response: {
  success: boolean
}
```

### 3.6 Télécharger le CV Original
```
GET /api/candidates/:id/download-cv
Headers: Authorization: Bearer {token}
Response: File (PDF ou Word)
```

### 3.7 Générer CV Uniformisé (PDF)
```
GET /api/candidates/:id/generate-uniform-cv
Headers: Authorization: Bearer {token}
Response: File (PDF avec template application)
```

---

## 📊 **4. STATISTIQUES & ANALYTICS**

### 4.1 Dashboard général
```
GET /api/analytics/dashboard
Headers: Authorization: Bearer {token}
Query: {
  period?: 'week' | 'month' | 'year'
}
Response: {
  success: boolean,
  data: {
    totalJobPosts: number,
    activeJobPosts: number,
    totalApplications: number,
    newApplications: number,
    shortlistedCandidates: number,
    averageScore: number,
    topPerformingJobs: JobPost[],
    applicationTrend: {
      date: string,
      count: number
    }[]
  }
}
```

### 4.2 Statistiques par offre
```
GET /api/job-posts/:id/stats
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    totalCandidates: number,
    newCandidates: number,
    reviewedCandidates: number,
    shortlistedCandidates: number,
    rejectedCandidates: number,
    averageScore: number,
    topScore: number,
    viewCount: number,
    applicationsByDay: {
      date: string,
      count: number
    }[],
    scoreDistribution: {
      range: string,
      count: number
    }[]
  }
}
```

### 4.3 Analytics avancées
```
GET /api/analytics/skills
Headers: Authorization: Bearer {token}
Query: {
  period?: 'week' | 'month' | 'year'
}
Response: {
  success: boolean,
  data: {
    mostDemandedSkills: {
      skill: string,
      count: number
    }[],
    hardestToFindSkills: {
      skill: string,
      matchRate: number
    }[]
  }
}
```

```
GET /api/analytics/candidates
Headers: Authorization: Bearer {token}
Query: {
  period?: 'week' | 'month' | 'year'
}
Response: {
  success: boolean,
  data: {
    totalCandidates: number,
    candidatesByExperience: {
      level: string,
      count: number
    }[],
    candidatesByEducation: {
      level: string,
      count: number
    }[],
    averageApplicationTime: number
  }
}
```

---

## 🔔 **5. NOTIFICATIONS**

### 5.1 Gestion des notifications
```
GET /api/notifications
Headers: Authorization: Bearer {token}
Query: {
  read?: boolean,
  page?: number,
  limit?: number
}
Response: {
  success: boolean,
  data: {
    notifications: Notification[],
    total: number,
    unreadCount: number
  }
}
```

```
PUT /api/notifications/:id/read
Headers: Authorization: Bearer {token}
Response: {
  success: boolean
}
```

```
PUT /api/notifications/mark-all-read
Headers: Authorization: Bearer {token}
Response: {
  success: boolean
}
```

### 5.2 Préférences de notification
```
GET /api/partners/:id/notification-settings
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    emailNotifications: boolean,
    newApplications: boolean,
    highScoreCandidates: boolean,
    deadlineReminders: boolean
  }
}
```

```
PUT /api/partners/:id/notification-settings
Headers: Authorization: Bearer {token}
Body: {
  emailNotifications?: boolean,
  newApplications?: boolean,
  highScoreCandidates?: boolean,
  deadlineReminders?: boolean
}
Response: {
  success: boolean
}
```

---

## 💳 **6. ABONNEMENTS & FACTURATION**

### 6.1 Gestion des plans
```
GET /api/plans
Response: {
  success: boolean,
  data: {
    plans: Plan[]
  }
}
```

```
POST /api/partners/:id/change-plan
Headers: Authorization: Bearer {token}
Body: {
  planType: 'free' | 'starter' | 'professional' | 'enterprise'
}
Response: {
  success: boolean,
  data: {
    partner: Partner,
    subscription: Subscription
  }
}
```

### 6.2 Facturation
```
GET /api/partners/:id/invoices
Headers: Authorization: Bearer {token}
Query: {
  page?: number,
  limit?: number
}
Response: {
  success: boolean,
  data: {
    invoices: Invoice[],
    total: number
  }
}
```

```
GET /api/invoices/:id/download
Headers: Authorization: Bearer {token}
Response: PDF file
```

---

## 📁 **7. GESTION DES FICHIERS**

### 7.1 Upload de CV
```
POST /api/upload/cv
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData {
  file: File (PDF)
}
Response: {
  success: boolean,
  data: {
    url: string,
    filename: string,
    size: number
  }
}
```

### 7.2 Upload de logo entreprise
```
POST /api/upload/logo
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData {
  file: File (image)
}
Response: {
  success: boolean,
  data: {
    url: string,
    filename: string
  }
}
```

---

## 🔍 **8. RECHERCHE & FILTRES**

### 8.1 Recherche globale
```
GET /api/search
Headers: Authorization: Bearer {token}
Query: {
  q: string,
  type?: 'jobs' | 'candidates' | 'all',
  page?: number,
  limit?: number
}
Response: {
  success: boolean,
  data: {
    jobs: JobPost[],
    candidates: Application[],
    total: number
  }
}
```

### 8.2 Filtres avancés candidats
```
POST /api/applications/filter
Headers: Authorization: Bearer {token}
Body: {
  jobIds?: string[],
  minScore?: number,
  maxScore?: number,
  skills?: string[],
  experience?: ExperienceLevel[],
  education?: EducationLevel[],
  languages?: LanguageRequirement[],
  dateFrom?: string,
  dateTo?: string
}
Response: {
  success: boolean,
  data: {
    applications: Application[],
    total: number
  }
}
```

---

## 📧 **9. COMMUNICATION**

### 9.1 Envoi d'emails aux candidats
```
POST /api/applications/:id/send-email
Headers: Authorization: Bearer {token}
Body: {
  subject: string,
  message: string,
  template?: 'rejection' | 'interview' | 'offer' | 'custom'
}
Response: {
  success: boolean
}
```

### 9.2 Templates d'emails
```
GET /api/email-templates
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    templates: EmailTemplate[]
  }
}
```

```
POST /api/email-templates
Headers: Authorization: Bearer {token}
Body: {
  name: string,
  subject: string,
  body: string,
  type: 'rejection' | 'interview' | 'offer' | 'custom'
}
Response: {
  success: boolean,
  data: {
    template: EmailTemplate
  }
}
```

---

## 🎯 **10. PIPELINE DE RECRUTEMENT**

### 10.1 Gestion des étapes
```
GET /api/job-posts/:jobId/pipeline
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  data: {
    stages: {
      name: string,
      candidates: Application[],
      count: number
    }[]
  }
}
```

```
PUT /api/applications/:id/move-stage
Headers: Authorization: Bearer {token}
Body: {
  stage: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
}
Response: {
  success: boolean,
  data: {
    application: Application
  }
}
```

---

## 📱 **11. WEBHOOKS (Optionnel)**

### 11.1 Configuration webhooks
```
POST /api/webhooks
Headers: Authorization: Bearer {token}
Body: {
  url: string,
  events: ('application.created' | 'application.updated' | 'job.published')[],
  secret: string
}
Response: {
  success: boolean,
  data: {
    webhook: Webhook
  }
}
```

---

## 📊 **TYPES DE DONNÉES**

### Partner
```typescript
interface Partner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  cvUsedThisMonth: number;
  planRenewalDate: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}
```

### JobPost
```typescript
interface JobPost {
  id: string;
  title: string;
  description: string;
  company: string;
  city: string;
  country: string;
  remote: boolean;
  requiredSkills: string[];
  optionalSkills: string[];
  education: EducationLevel[];
  experience: ExperienceLevel;
  minYearsExperience: number;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  deadline: string;
  startDate?: string;
  status: 'draft' | 'active' | 'closed' | 'archived';
  isUrgent: boolean;
  languageRequirement: LanguageRequirement;
  gender: Gender;
  maritalStatus: MaritalStatus;
  minAge?: number;
  maxAge?: number;
  childrenAccepted: boolean;
  drivingLicense: DrivingLicense;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddress?: string;
  contactWebsite?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  stats: JobPostStats;
}
```

### Application
```typescript
interface Application {
  id: string;
  jobPostId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  cvUrl: string;
  coverLetter?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  score?: number;
  matchingAnalysis?: MatchingResult;
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}
```

### Enums
```typescript
type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
type EducationLevel = 'high_school' | 'bachelor' | 'master' | 'phd';
type ContractType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
type LanguageRequirement = 'bilingual' | 'french' | 'english' | 'none';
type Gender = 'male' | 'female' | 'any';
type MaritalStatus = 'single' | 'married' | 'any';
type DrivingLicense = 'required' | 'preferred' | 'not_required';
```

---

## 🔒 **SÉCURITÉ**

### Headers requis
- `Authorization: Bearer {token}` - Pour toutes les routes protégées
- `Content-Type: application/json` - Pour les requêtes JSON
- `X-Requested-With: XMLHttpRequest` - Pour la sécurité CSRF

### Codes de statut HTTP
- `200` - Succès
- `201` - Créé
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Non trouvé
- `422` - Validation échouée
- `429` - Trop de requêtes (rate limiting)
- `500` - Erreur serveur

### Rate Limiting
- Authentification: 5 requêtes/minute
- API générale: 100 requêtes/minute
- Upload fichiers: 10 requêtes/minute

---

## 🚀 **PRIORITÉS D'IMPLÉMENTATION**

### Phase 1 - MVP (Minimum Viable Product)
1. ✅ Authentification (login, register, logout)
2. ✅ CRUD Offres d'emploi
3. ✅ Réception candidatures
4. ✅ Listing candidatures
5. ✅ Statistiques basiques

### Phase 2 - Fonctionnalités essentielles
6. ⏳ Matching IA (analyse CV)
7. ⏳ Filtres avancés
8. ⏳ Upload fichiers
9. ⏳ Gestion statuts candidatures
10. ⏳ Dashboard analytics

### Phase 3 - Fonctionnalités avancées
11. ⏳ Pipeline de recrutement
12. ⏳ Notifications
13. ⏳ Templates emails
14. ⏳ Gestion abonnements
15. ⏳ Webhooks

---

## 📝 **NOTES TECHNIQUES**

- **Base URL**: `https://studyiacareer-backend-qpmpz.ondigitalocean.app/api`
- **Format de réponse**: Toujours JSON
- **Authentification**: JWT (Access Token + Refresh Token)
- **Upload max**: 10MB pour les CV, 2MB pour les logos
- **Formats acceptés CV**: PDF uniquement
- **Formats acceptés images**: JPG, PNG, WebP
- **Pagination**: Par défaut 20 items par page, max 100
- **Timezone**: UTC pour toutes les dates

---

**Document créé le**: 26 février 2026  
**Version**: 1.0  
**Auteur**: Studyia Career Team
