# 🏗️ Architecture Studyia Career Pro - Flux Complet

## 📋 **FLUX UTILISATEUR COMPLET**

### **1. AUTHENTIFICATION**
```
┌─────────────┐
│   ADMIN     │
└──────┬──────┘
       │ Crée des comptes
       ▼
┌─────────────────┐
│   PARTENAIRE    │ (Entreprise)
│  Login/Logout   │
└─────────────────┘
```

**Endpoints Backend:**
- `POST /api/admin/partners` - Admin crée un partenaire
- `POST /api/auth/login` - Partenaire se connecte
- `GET /api/auth/me` - Récupère le profil

---

### **2. CRÉATION D'OFFRES D'EMPLOI**
```
┌──────────────────────┐
│  Partenaire Dashboard│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ "Créer nouveau poste"│ = "Créer JOB"
│   (même page)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Formulaire Multi-étapes         │
│  - Informations générales        │
│  - Compétences requises          │
│  - Profil candidat               │
│  - Localisation & contrat        │
│  - Contact                       │
│  - Récapitulatif                 │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────┐
│   JOB ACTIF créé     │
└──────────────────────┘
```

**Endpoints Backend:**
- `POST /api/job-posts` - Créer une offre
- `GET /api/job-posts` - Lister les offres
- `PUT /api/job-posts/:id` - Modifier une offre
- `POST /api/job-posts/:id/publish` - Publier l'offre (status = active)

---

### **3. RÉCEPTION DES CANDIDATURES (NOUVEAU)**
```
┌──────────────────────┐
│  Liste des JOBS      │
└──────────┬───────────┘
           │ Clic sur un JOB actif
           ▼
┌────────────────────────────────────────┐
│     Page Détail JOB                    │
│  ┌──────────────────────────────────┐  │
│  │  Titre: Senior Developer         │  │
│  │  Entreprise: Tech Solutions      │  │
│  │  Statut: Actif                   │  │
│  │  Candidatures: 12                │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  📤 UPLOAD MULTIPLE CV           │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │  Glisser-déposer ou cliquer│  │  │
│  │  │  PDF, Word (max 10MB/CV)   │  │  │
│  │  │  Plusieurs fichiers à la   │  │  │
│  │  │  fois                       │  │  │
│  │  └────────────────────────────┘  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [Analyser les CV] ← Bouton            │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  🤖 TRAITEMENT IA (pour chaque CV)     │
│                                        │
│  1. Extraction texte (PDF/Word)        │
│  2. IA extrait données structurées     │
│     → Format CV Builder                │
│  3. IA fait le matching avec JOB       │
│     → Calcul score 0-100               │
│  4. Stockage en base de données        │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  ✅ CANDIDATURES ENREGISTRÉES          │
│  - CV uniformisés                      │
│  - Scores calculés                     │
│  - Classement automatique              │
└────────────────────────────────────────┘
```

**Endpoints Backend:**
- `POST /api/job-posts/:jobId/upload-cvs` - Upload multiple CV
- `POST /api/job-posts/:jobId/analyze-cvs` - Analyser les CV uploadés
- `GET /api/job-posts/:jobId/candidates` - Lister les candidats

---

### **4. GESTION DES CANDIDATS**
```
┌────────────────────────────────────────┐
│  Page Candidats (Pipeline)             │
│                                        │
│  Filtres: Score | Compétences | Ville  │
│  Tri: Par score ▼                      │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🥇 Jean Dupont        Score: 95  │  │
│  │    Senior Developer               │  │
│  │    📍 Dakar  📧 jean@email.com   │  │
│  │    [Voir CV] [Comparer] [Contact]│  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🥈 Marie Sow          Score: 88  │  │
│  │    Full Stack Developer           │  │
│  │    📍 Abidjan  📧 marie@email.com│  │
│  │    [Voir CV] [Comparer] [Contact]│  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ 🥉 Amadou Diallo      Score: 82  │  │
│  │    Developer                      │  │
│  │    📍 Dakar  📧 amadou@email.com │  │
│  │    [Voir CV] [Comparer] [Contact]│  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

**Clic sur "Voir CV" →**
```
┌────────────────────────────────────────┐
│  CV UNIFORMISÉ (Template Application)  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  JEAN DUPONT                     │  │
│  │  Senior Developer                │  │
│  │  📧 jean@email.com               │  │
│  │  📱 +221 77 123 45 67            │  │
│  │  📍 Dakar, Sénégal               │  │
│  └──────────────────────────────────┘  │
│                                        │
│  RÉSUMÉ PROFESSIONNEL                  │
│  Développeur Full Stack avec 5 ans...  │
│                                        │
│  EXPÉRIENCE                            │
│  • Senior Developer - Tech Solutions   │
│    2021 - Présent                      │
│    - Développement React/TypeScript    │
│                                        │
│  FORMATION                             │
│  • Master Informatique - UCAD          │
│    2017 - 2019                         │
│                                        │
│  COMPÉTENCES                           │
│  React • TypeScript • Node.js • AWS    │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  📊 ANALYSE MATCHING              │  │
│  │  Score global: 95/100             │  │
│  │  ✅ Compétences: 18/20 matchées  │  │
│  │  ✅ Expérience: Parfait           │  │
│  │  ⚠️  Manque: Docker, Kubernetes   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [📥 Télécharger PDF] [✉️ Contacter]  │
└────────────────────────────────────────┘
```

**Endpoints Backend:**
- `GET /api/candidates/:id` - Détails candidat
- `GET /api/candidates/:id/cv-data` - Données CV structurées
- `GET /api/candidates/:id/matching-analysis` - Analyse matching
- `POST /api/candidates/:id/contact` - Envoyer email au candidat

---

## 🔧 **ARCHITECTURE TECHNIQUE**

### **Frontend (React + TypeScript)**

```
src/
├── pages/pro/
│   ├── DashboardPage.tsx          # Dashboard partenaire
│   ├── CreateJobPostPage.tsx      # Créer/Modifier offre (EXISTE)
│   ├── JobPostsPage.tsx           # Liste des offres (EXISTE)
│   ├── JobDetailPage.tsx          # ⭐ NOUVEAU - Détail job + Upload CV
│   ├── PipelinePage.tsx           # Liste candidats (EXISTE - à améliorer)
│   └── CandidateDetailPage.tsx    # ⭐ NOUVEAU - CV uniformisé + Matching
│
├── services/
│   ├── api.ts                     # Client Axios (EXISTE)
│   ├── gemini.ts                  # Service Gemini (EXISTE)
│   ├── jobOfferParsingService.ts  # Parse offres (EXISTE)
│   ├── cvMatchingService.ts       # Matching CV/Job (EXISTE)
│   ├── cvExtractionService.ts     # ⭐ NOUVEAU - Extraction CV PDF/Word
│   └── candidateService.ts        # ⭐ NOUVEAU - CRUD candidats
│
├── components/pro/
│   ├── CVUploadZone.tsx           # ⭐ NOUVEAU - Zone upload multiple
│   ├── CVAnalysisProgress.tsx     # ⭐ NOUVEAU - Progression analyse IA
│   ├── CandidateCard.tsx          # ⭐ NOUVEAU - Card candidat avec score
│   ├── UniformCVDisplay.tsx       # ⭐ NOUVEAU - Affichage CV uniformisé
│   └── MatchingAnalysis.tsx       # ⭐ NOUVEAU - Détails matching
│
└── types/
    ├── jobPost.ts                 # Types offres (EXISTE)
    ├── candidate.ts               # ⭐ NOUVEAU - Types candidats
    └── cvData.ts                  # ⭐ NOUVEAU - Types données CV
```

### **Backend (Node.js + Express + MongoDB)**

```
backend/
├── routes/
│   ├── auth.routes.js             # Auth admin/partenaire
│   ├── jobPosts.routes.js         # CRUD offres
│   ├── candidates.routes.js       # ⭐ NOUVEAU - CRUD candidats
│   └── upload.routes.js           # ⭐ NOUVEAU - Upload fichiers
│
├── controllers/
│   ├── auth.controller.js
│   ├── jobPosts.controller.js
│   ├── candidates.controller.js   # ⭐ NOUVEAU
│   └── upload.controller.js       # ⭐ NOUVEAU
│
├── services/
│   ├── gemini.service.js          # ⭐ NOUVEAU - Appels Gemini API
│   ├── cvExtraction.service.js    # ⭐ NOUVEAU - Extraction PDF/Word
│   ├── matching.service.js        # ⭐ NOUVEAU - Matching IA
│   └── storage.service.js         # ⭐ NOUVEAU - Stockage fichiers (S3/local)
│
├── models/
│   ├── Partner.model.js
│   ├── JobPost.model.js
│   ├── Candidate.model.js         # ⭐ NOUVEAU
│   └── CVData.model.js            # ⭐ NOUVEAU
│
└── middleware/
    ├── auth.middleware.js
    ├── upload.middleware.js       # ⭐ NOUVEAU - Multer config
    └── validation.middleware.js
```

---

## 📊 **MODÈLES DE DONNÉES**

### **Candidate (MongoDB)**
```javascript
{
  _id: ObjectId,
  jobPostId: ObjectId,              // Référence au job
  partnerId: ObjectId,              // Référence au partenaire
  
  // Fichier original
  originalFileName: String,
  originalFileUrl: String,          // S3 ou local
  fileType: String,                 // 'pdf' ou 'docx'
  
  // Données extraites (format CV Builder)
  cvData: {
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      city: String,
      country: String,
      summary: String,
      photo: String
    },
    targetJob: String,
    experiences: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    skills: [String]
  },
  
  // Analyse matching
  matchingAnalysis: {
    globalScore: Number,            // 0-100
    skillsScore: Number,
    experienceScore: Number,
    educationScore: Number,
    matchedSkills: [String],
    missingSkills: [String],
    strengths: [String],
    weaknesses: [String],
    recommendation: String
  },
  
  // Statut
  status: String,                   // 'new', 'reviewed', 'shortlisted', 'rejected'
  notes: [String],
  
  // Métadonnées
  createdAt: Date,
  updatedAt: Date,
  reviewedAt: Date
}
```

---

## 🔄 **FLUX DE TRAITEMENT IA**

### **Upload et Analyse de CV**

```
1. UPLOAD
   ├─ Frontend: Utilisateur sélectionne plusieurs CV (PDF/Word)
   ├─ Frontend: Validation (taille, format)
   └─ Frontend: Upload vers backend
   
2. STOCKAGE
   ├─ Backend: Reçoit les fichiers
   ├─ Backend: Stocke sur S3 ou disque local
   └─ Backend: Crée entrées Candidate (status: 'processing')
   
3. EXTRACTION (pour chaque CV)
   ├─ Backend: Lit le fichier PDF/Word
   ├─ Backend: Extrait le texte brut
   │   ├─ PDF: pdf-parse ou pdfjs-dist
   │   └─ Word: mammoth.js
   ├─ Backend: Envoie texte à Gemini API
   ├─ Gemini: Extrait données structurées (format CV Builder)
   └─ Backend: Stocke cvData dans Candidate
   
4. MATCHING (pour chaque CV)
   ├─ Backend: Récupère JobPost
   ├─ Backend: Envoie cvData + JobPost à Gemini API
   ├─ Gemini: Analyse matching et calcule scores
   └─ Backend: Stocke matchingAnalysis dans Candidate
   
5. CLASSEMENT
   ├─ Backend: Trie candidats par globalScore DESC
   ├─ Backend: Met à jour status: 'new'
   └─ Backend: Notifie frontend (WebSocket ou polling)
   
6. AFFICHAGE
   ├─ Frontend: Reçoit liste candidats classés
   ├─ Frontend: Affiche avec scores et badges
   └─ Frontend: Permet visualisation CV uniformisé
```

---

## 🎨 **TEMPLATES CV UNIFORMISÉS**

**Important:** Les CV uploadés doivent être affichés dans le **même template** que le CV Builder de l'application.

```typescript
// Utiliser le template existant
import { BasicPDFTemplate } from '@/components/BasicPDFTemplate';

// Les données extraites par l'IA sont au format CVData
const candidateCVData: CVData = candidate.cvData;

// Affichage uniformisé
<BasicPDFTemplate data={candidateCVData} />
```

---

## 📦 **LIBRAIRIES NÉCESSAIRES**

### **Frontend**
```json
{
  "dependencies": {
    "react-dropzone": "^14.2.3",        // Upload zone drag & drop
    "pdfjs-dist": "^3.11.174",          // Lecture PDF côté client (optionnel)
    "framer-motion": "^10.16.16"        // Animations (EXISTE)
  }
}
```

### **Backend**
```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",           // Upload fichiers
    "pdf-parse": "^1.1.1",              // Extraction texte PDF
    "mammoth": "^1.6.0",                // Extraction texte Word
    "@google/generative-ai": "^0.1.3",  // Gemini API
    "aws-sdk": "^2.1498.0"              // S3 storage (optionnel)
  }
}
```

---

## 🚀 **PRIORITÉS D'IMPLÉMENTATION**

### **Phase 1 - MVP (Urgent)**
1. ✅ Service extraction CV (`cvExtractionService.ts`)
2. ⏳ Page détail job avec upload (`JobDetailPage.tsx`)
3. ⏳ Backend upload et stockage
4. ⏳ Backend extraction texte PDF/Word
5. ⏳ Backend extraction données avec Gemini
6. ⏳ Backend matching avec Gemini
7. ⏳ Affichage liste candidats classés

### **Phase 2 - Améliorations**
8. ⏳ CV uniformisé avec template
9. ⏳ Détails matching visuel
10. ⏳ Filtres et recherche candidats
11. ⏳ Comparaison de candidats
12. ⏳ Contact candidats par email

### **Phase 3 - Avancé**
13. ⏳ Pipeline Kanban (drag & drop)
14. ⏳ Notes et commentaires
15. ⏳ Export rapports
16. ⏳ Statistiques avancées

---

## 🔐 **SÉCURITÉ**

- ✅ Authentification JWT pour toutes les routes
- ✅ Validation des fichiers (type, taille)
- ✅ Scan antivirus des uploads (optionnel)
- ✅ Rate limiting sur upload (max 10 CV/minute)
- ✅ Stockage sécurisé (S3 avec encryption)
- ✅ Accès candidats limité au partenaire propriétaire

---

**Document créé le**: 26 février 2026  
**Version**: 2.0  
**Auteur**: Studyia Career Team
