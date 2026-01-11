# STUDYIA CAREER - SPÉCIFICATION TECHNIQUE BACKEND

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble de l'application](#vue-densemble)
2. [Architecture Frontend](#architecture-frontend)
3. [Routes et Navigation](#routes-et-navigation)
4. [Modèles de données](#modèles-de-données)
5. [Fonctionnalités principales](#fonctionnalités-principales)
6. [APIs externes utilisées](#apis-externes)
7. [Spécifications Backend requises](#spécifications-backend)
8. [Endpoints API à implémenter](#endpoints-api)
9. [Authentification et Sécurité](#authentification)
10. [Stockage et Base de données](#stockage)

---

## 🎯 VUE D'ENSEMBLE

**Studyia Career** est une plateforme de création de CV professionnels avec deux interfaces distinctes :

### **1. Interface Publique (Grand Public)**
- Création de CV gratuite et instantanée
- Pas d'authentification requise
- Upload de CV existant avec analyse IA
- Téléchargement PDF immédiat
- Support multilingue (FR/EN)

### **2. Interface Partenaire (SaaS B2B)**
- Espace dédié aux professionnels du recrutement
- Authentification obligatoire
- Gestion de clients et historique de CV
- Système de forfaits avec quotas mensuels
- Fonctionnalités avancées (upload, historique, multi-CV)

---

## 🏗️ ARCHITECTURE FRONTEND

### **Stack Technique**
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Internationalisation**: Custom i18n context
- **PDF Generation**: jsPDF + html2canvas
- **File Upload**: react-dropzone
- **PDF Parsing**: pdfjs-dist
- **IA**: OpenRouter API (LLaMA 3.3 70B)

### **Structure des dossiers**
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI (shadcn)
│   ├── partner/        # Composants spécifiques SaaS
│   └── CVTemplates/    # Templates de CV
├── pages/              # Pages publiques
│   └── partner/        # Pages SaaS
├── contexts/           # Contexts React (Auth, i18n)
├── hooks/              # Custom hooks
├── i18n/               # Traductions FR/EN
├── data/               # Données statiques (suggestions)
└── utils/              # Utilitaires (PDF generator)
```

---

## 🗺️ ROUTES ET NAVIGATION

### **Routes Publiques**

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Page d'accueil avec présentation |
| `/builder` | BuilderPage | Créateur de CV (7 étapes) |
| `/upload` | UploadPage | Upload + analyse IA de CV |
| `/partner-info` | PartnerInfoPage | Informations espace partenaire |

### **Routes Partenaire (Authentification requise)**

| Route | Page | Description |
|-------|------|-------------|
| `/partner/login` | LoginPage | Connexion partenaire |
| `/partner/signup` | SignupPage | Inscription partenaire |
| `/partner/dashboard` | DashboardPage | Tableau de bord |
| `/partner/cvs` | CVsPage | Liste des CV créés |
| `/partner/create` | CreateCVPage | Sélection langue CV |
| `/partner/upload` | UploadCVPage | Upload CV avec IA |
| `/partner/builder/:id` | PartnerBuilderPage | Éditeur CV (nouveau/existant) |
| `/partner/pricing` | PricingPage | Gestion forfaits |

### **Protection des routes**
- Composant `ProtectedRoute` vérifie `isAuthenticated`
- Redirection vers `/partner/login` si non authentifié
- Utilise le contexte `AuthContext`

---

## 📊 MODÈLES DE DONNÉES

### **1. Partner (Utilisateur SaaS)**

```typescript
interface Partner {
  id: string;                    // UUID unique
  email: string;                 // Email de connexion
  firstName: string;             // Prénom
  lastName: string;              // Nom
  company: string;               // Nom de l'entreprise
  plan: 'starter' | 'pro' | 'business';  // Type de forfait
  cvUsedThisMonth: number;       // Nombre de CV créés ce mois
  planRenewalDate: string;       // Date de renouvellement (ISO)
  createdAt: string;             // Date de création (ISO)
}
```

**Champs sensibles (non stockés frontend):**
- `password`: Hash du mot de passe (bcrypt recommandé)

### **2. Plan (Forfait)**

```typescript
interface Plan {
  type: 'starter' | 'pro' | 'business';
  name: string;                  // Nom du forfait
  monthlyQuota: number;          // Quota mensuel de CV
  price: number;                 // Prix en FCFA
  pricePerDay: number;           // Prix par jour
  features: string[];            // Liste des fonctionnalités
  badge?: string;                // Badge optionnel
  recommended?: boolean;         // Forfait recommandé
}
```

**Forfaits disponibles:**

| Type | Quota | Prix (FCFA) | Prix/jour |
|------|-------|-------------|-----------|
| Starter | 30 CV/mois | 15,000 | 500 |
| Pro | 100 CV/mois | 30,000 | 1,000 |
| Business | 300 CV/mois | 60,000 | 2,000 |

### **3. SavedCV (CV sauvegardé)**

```typescript
interface SavedCV {
  id: string;                    // UUID unique
  partnerId: string;             // ID du partenaire propriétaire
  name: string;                  // Nom du CV (ex: "CV Développeur 2024")
  language: 'fr' | 'en';         // Langue du CV
  data: CVData;                  // Données complètes du CV
  createdAt: string;             // Date de création (ISO)
  updatedAt: string;             // Dernière modification (ISO)
}
```

### **4. CVData (Données du CV)**

```typescript
interface CVData {
  personalInfo: PersonalInfo;
  targetJob: string;             // Poste visé
  experiences: Experience[];
  education: Education[];
  skills: string[];
  template: string;              // ID du template utilisé
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  summary: string;               // Résumé professionnel
  photo: string;                 // Base64 de la photo (optionnel)
}

interface Experience {
  id: string;
  title: string;                 // Titre du poste
  company: string;               // Nom de l'entreprise
  location: string;              // Ville
  startDate: string;             // Format: "MM/YYYY"
  endDate: string;               // Format: "MM/YYYY" ou "Présent"
  current: boolean;              // Poste actuel
  description: string;           // Description des missions
}

interface Education {
  id: string;
  degree: string;                // Type de diplôme
  school: string;                // Établissement
  location: string;              // Ville
  startDate: string;             // Année: "YYYY"
  endDate: string;               // Année: "YYYY"
  description: string;           // Description (optionnel)
}
```

---

## 🎨 FONCTIONNALITÉS PRINCIPALES

### **1. Création de CV (Builder)**

**Processus en 7 étapes:**

1. **Informations personnelles**
   - Nom, prénom, email, téléphone, ville, pays
   - Photo (upload + preview + base64)
   - Résumé professionnel avec suggestions IA

2. **Poste visé**
   - Autocomplétion avec 600+ suggestions de postes
   - Support FR/EN

3. **Expériences professionnelles**
   - Ajout multiple d'expériences
   - Drag & drop pour réorganiser
   - Sélecteur de dates (mois/année)
   - Checkbox "Poste actuel"

4. **Diplômes et formations**
   - Ajout multiple de diplômes
   - Autocomplétion avec 150+ diplômes
   - Sélecteur d'années

5. **Compétences**
   - Ajout par autocomplétion
   - Suggestions par catégories (8 catégories)
   - Support FR/EN pour les catégories

6. **Sélection du template**
   - 7 templates disponibles
   - Aperçu en temps réel

7. **Aperçu final**
   - Preview du CV
   - Téléchargement PDF haute qualité
   - Analyse et optimisation IA (optionnel)

**Aperçu en temps réel:**
- Mise à jour automatique du preview
- Affichage côte à côte (desktop)
- Responsive mobile

### **2. Upload et Analyse IA**

**Fonctionnalité:**
- Upload de CV PDF (DOCX non supporté actuellement)
- Extraction du texte avec pdfjs-dist
- Analyse par IA (OpenRouter API - LLaMA 3.3 70B)
- Pré-remplissage automatique du formulaire

**Prompt IA utilisé:**
```
Analyse un CV et extrait les informations structurées en JSON:
- personalInfo (firstName, lastName, email, phone, city, country, summary)
- targetJob (string)
- experiences (array)
- education (array)
- skills (array)
```

**API utilisée:**
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Modèle: `meta-llama/llama-3.3-70b-instruct:free`
- Clé API: `VITE_OPENROUTER_API_KEY` (variable d'environnement)

### **3. Génération PDF**

**Bibliothèques:**
- `jsPDF` pour la création PDF
- `html2canvas` pour la conversion HTML → Canvas

**Process:**
1. Render du template avec les données
2. Conversion HTML → Canvas
3. Canvas → Image
4. Image → PDF
5. Téléchargement automatique

**Qualité:**
- Haute résolution (scale: 2)
- Format A4
- Compression optimisée

### **4. Système d'authentification Partenaire**

**Actuellement (Frontend only):**
- Stockage dans `localStorage`
- Clé: `studyia_partner` (partenaire connecté)
- Clé: `studyia_partners` (liste de tous les partenaires)
- Clé: `studyia_partner_cvs` (tous les CV)

**Fonctionnalités:**
- Inscription (signup)
- Connexion (login)
- Déconnexion (logout)
- Session persistante

### **5. Gestion des CV (SaaS)**

**Fonctionnalités:**
- Création de CV
- Liste des CV avec recherche
- Modification de CV existants
- Suppression de CV
- Téléchargement PDF
- Historique complet

**Quota management:**
- Vérification du quota avant création
- Incrémentation automatique du compteur
- Affichage du quota restant
- Alerte si quota épuisé

### **6. Système de forfaits**

**Fonctionnalités:**
- Affichage des 3 forfaits
- Calcul du potentiel de revenus
- Demande de changement de forfait (email)
- Renouvellement automatique mensuel

---

## 🔌 APIS EXTERNES UTILISÉES

### **1. OpenRouter API**

**Usage:** Analyse de CV et optimisation

**Configuration:**
```javascript
URL: https://openrouter.ai/api/v1/chat/completions
Method: POST
Headers:
  - Authorization: Bearer {API_KEY}
  - Content-Type: application/json
  - HTTP-Referer: {APP_URL}
  - X-Title: Studyia Career CV Builder

Body:
{
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "messages": [
    { "role": "system", "content": "{SYSTEM_PROMPT}" },
    { "role": "user", "content": "{CV_TEXT}" }
  ]
}
```

**Coût:** Gratuit (tier free)

**Limites:**
- Rate limiting selon le tier
- Timeout: 60 secondes recommandé

---

## 🔧 SPÉCIFICATIONS BACKEND REQUISES

### **1. Architecture recommandée**

**Stack suggéré:**
- **Backend**: Node.js + Express / NestJS / Fastify
- **Base de données**: PostgreSQL / MongoDB
- **ORM**: Prisma / TypeORM / Mongoose
- **Authentification**: JWT + bcrypt
- **Storage**: AWS S3 / Cloudinary (pour les photos)
- **Cache**: Redis (optionnel)
- **Queue**: Bull / BullMQ (pour les jobs IA)

### **2. Sécurité**

**Authentification:**
- JWT avec refresh tokens
- Expiration: 1h (access) / 7j (refresh)
- HttpOnly cookies recommandés

**Validation:**
- Validation des inputs (Joi / Zod)
- Sanitization des données
- Rate limiting (express-rate-limit)
- CORS configuré

**Mots de passe:**
- Hashing avec bcrypt (salt rounds: 10)
- Politique de mot de passe forte
- Pas de stockage en clair

### **3. Base de données**

**Tables principales:**

```sql
-- Partners (Utilisateurs SaaS)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(255) NOT NULL,
  plan VARCHAR(20) DEFAULT 'pro',
  cv_used_this_month INTEGER DEFAULT 0,
  plan_renewal_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CVs (CV sauvegardés)
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(2) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plans (Forfaits)
CREATE TABLE plans (
  type VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  monthly_quota INTEGER NOT NULL,
  price INTEGER NOT NULL,
  price_per_day INTEGER NOT NULL,
  features JSONB NOT NULL,
  badge VARCHAR(100),
  recommended BOOLEAN DEFAULT FALSE
);

-- Sessions (Optionnel - pour refresh tokens)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys (Pour OpenRouter)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(50) NOT NULL,
  key_value VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes recommandés:**
```sql
CREATE INDEX idx_cvs_partner_id ON cvs(partner_id);
CREATE INDEX idx_cvs_created_at ON cvs(created_at DESC);
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_sessions_partner_id ON sessions(partner_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

---

## 🌐 ENDPOINTS API À IMPLÉMENTER

### **Authentification**

#### **POST /api/auth/signup**
Inscription d'un nouveau partenaire

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "company": "ABC Corp"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "partner": {
      "id": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "company": "ABC Corp",
      "plan": "pro",
      "cvUsedThisMonth": 0,
      "planRenewalDate": "2024-02-10T00:00:00Z"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Errors:**
- 400: Email déjà utilisé
- 422: Validation échouée

---

#### **POST /api/auth/login**
Connexion d'un partenaire

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "partner": { /* Partner object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

**Errors:**
- 401: Identifiants invalides
- 422: Validation échouée

---

#### **POST /api/auth/refresh**
Renouvellement du token d'accès

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token"
  }
}
```

---

#### **POST /api/auth/logout**
Déconnexion (invalidation du refresh token)

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **Gestion des CV**

#### **GET /api/cvs**
Liste des CV du partenaire connecté

**Headers:** `Authorization: Bearer {token}`

**Query params:**
- `search` (optional): Recherche par nom
- `page` (optional): Numéro de page (default: 1)
- `limit` (optional): Résultats par page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "cvs": [
      {
        "id": "uuid",
        "name": "CV Développeur 2024",
        "language": "fr",
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-10T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

#### **GET /api/cvs/:id**
Récupérer un CV spécifique

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "partnerId": "uuid",
    "name": "CV Développeur 2024",
    "language": "fr",
    "data": { /* CVData object */ },
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Errors:**
- 404: CV non trouvé
- 403: Accès non autorisé

---

#### **POST /api/cvs**
Créer un nouveau CV

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "CV Développeur 2024",
  "language": "fr",
  "data": { /* CVData object */ }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "CV Développeur 2024",
    "language": "fr",
    "data": { /* CVData object */ },
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Errors:**
- 403: Quota épuisé
- 422: Validation échouée

**Business Logic:**
- Vérifier le quota disponible
- Incrémenter `cvUsedThisMonth`
- Vérifier la date de renouvellement

---

#### **PUT /api/cvs/:id**
Mettre à jour un CV existant

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "CV Développeur Senior 2024",
  "data": { /* CVData object */ }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* Updated CV object */ }
}
```

**Errors:**
- 404: CV non trouvé
- 403: Accès non autorisé

---

#### **DELETE /api/cvs/:id**
Supprimer un CV

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "message": "CV deleted successfully"
}
```

**Errors:**
- 404: CV non trouvé
- 403: Accès non autorisé

---

### **Gestion du profil**

#### **GET /api/profile**
Récupérer le profil du partenaire connecté

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "partner": { /* Partner object */ },
    "currentPlan": { /* Plan object */ },
    "remainingQuota": 85,
    "quotaPercentage": 15
  }
}
```

---

#### **PUT /api/profile**
Mettre à jour le profil

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "company": "New Company"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* Updated Partner object */ }
}
```

---

#### **PUT /api/profile/password**
Changer le mot de passe

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Errors:**
- 401: Mot de passe actuel incorrect

---

### **Gestion des forfaits**

#### **GET /api/plans**
Liste de tous les forfaits disponibles

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "type": "starter",
      "name": "Starter",
      "monthlyQuota": 30,
      "price": 15000,
      "pricePerDay": 500,
      "features": ["30 CV par mois", "..."],
      "badge": null,
      "recommended": false
    },
    { /* Pro plan */ },
    { /* Business plan */ }
  ]
}
```

---

#### **POST /api/plans/change**
Demander un changement de forfait

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "newPlan": "business",
  "message": "Je souhaite passer au forfait Business"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Plan change request sent successfully"
}
```

**Business Logic:**
- Envoyer un email à l'admin
- Créer une notification
- Logger la demande

---

### **Analyse IA**

#### **POST /api/ai/analyze-cv**
Analyser un CV uploadé

**Headers:** `Authorization: Bearer {token}`

**Request (multipart/form-data):**
```
file: [PDF file]
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "personalInfo": { /* PersonalInfo object */ },
    "targetJob": "Développeur Full-Stack",
    "experiences": [ /* Experience array */ ],
    "education": [ /* Education array */ ],
    "skills": ["JavaScript", "React", "..."]
  }
}
```

**Errors:**
- 400: Format de fichier non supporté
- 413: Fichier trop volumineux (max: 5MB)
- 503: Service IA indisponible

**Business Logic:**
- Extraire le texte du PDF
- Appeler OpenRouter API
- Parser la réponse JSON
- Retourner les données structurées

---

#### **POST /api/ai/optimize-cv**
Optimiser un CV existant

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "cvData": { /* CVData object */ }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "optimizedCvData": { /* Optimized CVData object */ },
    "improvements": [
      "Résumé enrichi",
      "Descriptions d'expériences améliorées",
      "Compétences optimisées"
    ]
  }
}
```

---

### **Statistiques (Admin)**

#### **GET /api/admin/stats**
Statistiques globales de la plateforme

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalPartners": 150,
    "totalCVs": 2500,
    "cvsThisMonth": 450,
    "planDistribution": {
      "starter": 50,
      "pro": 80,
      "business": 20
    },
    "revenue": {
      "monthly": 3750000,
      "yearly": 45000000
    }
  }
}
```

---

## 🔐 AUTHENTIFICATION ET SÉCURITÉ

### **JWT Structure**

**Access Token (1h):**
```json
{
  "sub": "partner_uuid",
  "email": "john@example.com",
  "role": "partner",
  "iat": 1704902400,
  "exp": 1704906000
}
```

**Refresh Token (7j):**
```json
{
  "sub": "partner_uuid",
  "type": "refresh",
  "iat": 1704902400,
  "exp": 1705507200
}
```

### **Middleware d'authentification**

```javascript
// Pseudo-code
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.partner = await Partner.findById(decoded.sub);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### **Rate Limiting**

**Recommandations:**
- Auth endpoints: 5 requêtes / 15 min / IP
- API endpoints: 100 requêtes / 15 min / utilisateur
- Upload endpoints: 10 requêtes / heure / utilisateur
- IA endpoints: 5 requêtes / heure / utilisateur

---

## 💾 STOCKAGE ET FICHIERS

### **Photos de profil**

**Options:**
1. **Base64 dans la DB** (actuel frontend)
   - Simple mais lourd
   - Limite de taille recommandée: 500KB

2. **Storage externe** (recommandé)
   - AWS S3 / Cloudinary / Azure Blob
   - Stockage URL dans la DB
   - CDN pour performance
   - Compression automatique

**Endpoint suggéré:**
```
POST /api/upload/photo
Response: { "url": "https://cdn.example.com/photos/uuid.jpg" }
```

### **PDFs générés**

**Options:**
1. **Génération côté client** (actuel)
   - Pas de stockage serveur
   - Téléchargement immédiat

2. **Génération côté serveur** (futur)
   - Meilleure qualité
   - Historique des PDFs
   - Partage par lien

---

## 📧 EMAILS ET NOTIFICATIONS

### **Emails à implémenter**

1. **Bienvenue** (signup)
2. **Confirmation d'email** (optionnel)
3. **Réinitialisation mot de passe**
4. **Alerte quota** (80%, 100%)
5. **Renouvellement forfait**
6. **Demande changement forfait** (à l'admin)

**Service recommandé:**
- SendGrid / Mailgun / AWS SES
- Templates HTML responsive

---

## 🔄 JOBS ET TÂCHES PLANIFIÉES

### **Cron Jobs nécessaires**

1. **Réinitialisation quotas mensuels**
   - Fréquence: Quotidien (00:00 UTC)
   - Action: Reset `cvUsedThisMonth` si `planRenewalDate` dépassée

2. **Nettoyage sessions expirées**
   - Fréquence: Quotidien
   - Action: Supprimer les refresh tokens expirés

3. **Alertes quota**
   - Fréquence: Quotidien
   - Action: Envoyer emails si quota > 80%

4. **Backup base de données**
   - Fréquence: Quotidien
   - Action: Backup automatique

---

## 📊 MONITORING ET LOGS

### **Métriques à suivre**

- Nombre de requêtes par endpoint
- Temps de réponse moyen
- Taux d'erreur
- Utilisation CPU/RAM
- Taux de conversion (signup → création CV)
- Quota moyen utilisé par forfait

### **Logs importants**

- Authentification (login/logout/échecs)
- Création/modification/suppression CV
- Changements de forfait
- Erreurs API
- Appels IA (coût/durée)

**Outils recommandés:**
- Sentry (erreurs)
- DataDog / New Relic (performance)
- CloudWatch / Grafana (métriques)

---

## 🚀 DÉPLOIEMENT

### **Variables d'environnement**

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/studyia

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# OpenRouter API
OPENROUTER_API_KEY=your_api_key_here

# Storage (if using external)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Email
SENDGRID_API_KEY=
FROM_EMAIL=noreply@studyia.net

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://studyia.net
```

### **Infrastructure recommandée**

**Option 1: Monolithe**
- 1 serveur Node.js
- 1 instance PostgreSQL
- 1 Redis (cache/sessions)
- Load balancer (Nginx)

**Option 2: Microservices**
- Auth service
- CV service
- AI service
- Storage service
- API Gateway

**Hébergement suggéré:**
- AWS / Google Cloud / Azure
- DigitalOcean / Heroku (plus simple)
- Vercel / Railway (déploiement rapide)

---

## 📝 MIGRATION DEPUIS FRONTEND

### **Étapes de migration**

1. **Phase 1: Backend Setup**
   - Créer la base de données
   - Implémenter les endpoints auth
   - Tester l'authentification

2. **Phase 2: Migration données**
   - Script de migration localStorage → DB
   - Endpoint d'import pour les partenaires existants

3. **Phase 3: Intégration frontend**
   - Remplacer AuthContext par appels API
   - Gérer les tokens JWT
   - Mettre à jour les appels de données

4. **Phase 4: Features avancées**
   - Analyse IA côté serveur
   - Génération PDF serveur
   - Emails automatiques

---

## 🎯 PRIORITÉS DE DÉVELOPPEMENT

### **MVP (Minimum Viable Product)**

1. ✅ Authentification (signup/login/logout)
2. ✅ CRUD CV
3. ✅ Gestion quota
4. ✅ Profil partenaire
5. ⚠️ Sécurité basique

### **Phase 2**

6. Analyse IA serveur
7. Upload photos externe
8. Emails automatiques
9. Statistiques dashboard

### **Phase 3**

10. Génération PDF serveur
11. Partage de CV par lien
12. Multi-utilisateurs (Business plan)
13. API publique pour partenaires

---

## 📞 CONTACT ET SUPPORT

Pour toute question sur cette spécification:
- Email: contact@studyia.net
- Documentation frontend: `/docs`
- Repository: [GitHub URL]

---

**Version:** 1.0.0  
**Date:** Janvier 2024  
**Auteur:** Équipe Studyia Career

---

## 🔗 ANNEXES

### **Ressources utiles**

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [React Router v6](https://reactrouter.com/)
- [Prisma ORM](https://www.prisma.io/)
- [JWT Best Practices](https://jwt.io/introduction)

### **Exemples de code**

Voir les fichiers frontend pour référence:
- `src/contexts/AuthContext.tsx` - Logique auth actuelle
- `src/pages/BuilderPage.tsx` - Structure CVData
- `src/pages/partner/UploadCVPage.tsx` - Analyse IA
- `src/utils/pdfGenerator.ts` - Génération PDF

---

**FIN DU DOCUMENT**
