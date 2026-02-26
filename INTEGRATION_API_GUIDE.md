# 🔌 Guide d'intégration API - Studyia Career Pro

## 📚 Vue d'ensemble

Ce guide explique comment utiliser les services API et les hooks React pour intégrer le backend dans votre application frontend.

---

## 🗂️ Structure des services

```
src/
├── services/
│   ├── api.ts                      # Client Axios configuré
│   ├── jobPostsService.ts          # Gestion des offres d'emploi
│   ├── candidatesService.ts        # Gestion des candidatures
│   ├── analyticsService.ts         # Statistiques et analytics
│   └── notificationsService.ts     # Notifications
│
└── hooks/
    ├── useJobPosts.ts              # Hook pour les offres
    └── useCandidates.ts            # Hook pour les candidats
```

---

## 🚀 Utilisation des Hooks React

### 1. **useJobPosts** - Gérer les offres d'emploi

#### Lister toutes les offres
```tsx
import { useJobPosts } from '@/hooks/useJobPosts';

function JobPostsPage() {
  const { jobPosts, loading, error, fetchJobPosts } = useJobPosts();

  useEffect(() => {
    fetchJobPosts({ status: 'active', page: 1, limit: 20 });
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {jobPosts.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
```

#### Créer une offre
```tsx
const { createJobPost, loading } = useJobPosts();

const handleSubmit = async (data: CreateJobPostData) => {
  try {
    const newJob = await createJobPost(data);
    navigate(`/pro/jobs/${newJob._id}`);
  } catch (error) {
    // Erreur gérée automatiquement avec toast
  }
};
```

#### Publier/Fermer/Dupliquer une offre
```tsx
const { publishJobPost, closeJobPost, duplicateJobPost } = useJobPosts();

// Publier
await publishJobPost(jobId);

// Fermer
await closeJobPost(jobId);

// Dupliquer
const duplicated = await duplicateJobPost(jobId);
```

---

### 2. **useJobPost** - Gérer une offre spécifique

```tsx
import { useJobPost } from '@/hooks/useJobPosts';

function JobDetailPage() {
  const { id } = useParams();
  const { jobPost, loading, error, updateJobPost } = useJobPost(id);

  const handleUpdate = async (data: Partial<CreateJobPostData>) => {
    await updateJobPost(data);
  };

  if (loading) return <Loader />;
  if (!jobPost) return <NotFound />;

  return (
    <div>
      <h1>{jobPost.title}</h1>
      <p>{jobPost.description}</p>
    </div>
  );
}
```

---

### 3. **useCandidates** - Gérer les candidatures

#### Lister les candidats d'une offre
```tsx
import { useCandidates } from '@/hooks/useCandidates';

function JobDetailPage() {
  const { id } = useParams();
  const {
    candidates,
    loading,
    averageScore,
    fetchCandidates,
    uploadCVs,
    analyzeCVs,
  } = useCandidates(id);

  // Les candidats sont chargés automatiquement
  // et triés par score décroissant

  return (
    <div>
      <p>Score moyen: {averageScore}/100</p>
      {candidates.map(candidate => (
        <CandidateCard key={candidate._id} candidate={candidate} />
      ))}
    </div>
  );
}
```

#### Upload et analyse de CV
```tsx
const { uploadCVs, analyzeCVs } = useCandidates(jobId);

const handleFilesSelected = async (files: File[]) => {
  try {
    // 1. Upload des CV
    const result = await uploadCVs(files);
    
    // 2. Récupérer les IDs des candidats créés
    const candidateIds = result.uploadedFiles.map(f => f.candidateId);
    
    // 3. Analyser avec l'IA
    await analyzeCVs(candidateIds);
    
    // Les candidats sont automatiquement rafraîchis
  } catch (error) {
    // Erreur gérée automatiquement
  }
};
```

#### Changer le statut d'un candidat
```tsx
const { updateCandidateStatus } = useCandidates(jobId);

const handleStatusChange = async (candidateId: string) => {
  await updateCandidateStatus(
    candidateId,
    'shortlisted',
    'Excellent profil technique'
  );
};
```

#### Ajouter une note
```tsx
const { addNote } = useCandidates(jobId);

await addNote(candidateId, 'Très bon feeling lors de l\'entretien');
```

#### Télécharger un CV
```tsx
const { downloadCV } = useCandidates(jobId);

await downloadCV(candidateId, 'cv-john-doe.pdf');
```

---

### 4. **useCandidate** - Gérer un candidat spécifique

```tsx
import { useCandidate } from '@/hooks/useCandidates';

function CandidateDetailPage() {
  const { id } = useParams();
  const { candidate, loading, error } = useCandidate(id);

  if (loading) return <Loader />;
  if (!candidate) return <NotFound />;

  return (
    <div>
      <h1>{candidate.cvData.personalInfo.firstName} {candidate.cvData.personalInfo.lastName}</h1>
      <p>Score: {candidate.matchingAnalysis.globalScore}/100</p>
      
      {/* Afficher le CV uniformisé */}
      <CVDisplay data={candidate.cvData} />
      
      {/* Afficher l'analyse de matching */}
      <MatchingAnalysis analysis={candidate.matchingAnalysis} />
    </div>
  );
}
```

---

## 🔧 Utilisation directe des services

Si vous préférez ne pas utiliser les hooks, vous pouvez appeler les services directement :

### JobPostsService
```tsx
import { jobPostsService } from '@/services/jobPostsService';

// Créer une offre
const job = await jobPostsService.createJobPost(data);

// Lister les offres
const { jobPosts, pagination } = await jobPostsService.getJobPosts({
  status: 'active',
  page: 1,
  limit: 20
});

// Publier une offre
await jobPostsService.publishJobPost(jobId);

// Statistiques
const stats = await jobPostsService.getJobPostStats(jobId);
```

### CandidatesService
```tsx
import { candidatesService } from '@/services/candidatesService';

// Upload CV
const result = await candidatesService.uploadCVs(jobId, files);

// Analyser avec IA
const analysis = await candidatesService.analyzeCVs(jobId, candidateIds);

// Lister les candidats
const { candidates, averageScore } = await candidatesService.getCandidates(jobId, {
  sortBy: 'matchingAnalysis.globalScore',
  sortOrder: 'desc',
  minScore: 70
});

// Détails d'un candidat
const candidate = await candidatesService.getCandidate(candidateId);

// Changer le statut
await candidatesService.updateCandidateStatus(candidateId, 'shortlisted');

// Télécharger le CV
const blob = await candidatesService.downloadCV(candidateId);
```

### AnalyticsService
```tsx
import { analyticsService } from '@/services/analyticsService';

// Dashboard
const dashboard = await analyticsService.getDashboard('month');

// Analytics compétences
const skills = await analyticsService.getSkillsAnalytics('month');

// Analytics candidats
const candidates = await analyticsService.getCandidatesAnalytics('month');
```

### NotificationsService
```tsx
import { notificationsService } from '@/services/notificationsService';

// Lister les notifications
const { notifications, unreadCount } = await notificationsService.getNotifications({
  read: false,
  page: 1,
  limit: 20
});

// Marquer comme lu
await notificationsService.markAsRead(notificationId);

// Tout marquer comme lu
await notificationsService.markAllAsRead();

// Paramètres
const settings = await notificationsService.getSettings();
await notificationsService.updateSettings({
  emailNotifications: true,
  highScoreCandidates: true
});
```

---

## 🎯 Exemple complet : JobDetailPage

```tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useJobPost } from '@/hooks/useJobPosts';
import { useCandidates } from '@/hooks/useCandidates';
import { CVUploadZone } from '@/components/pro/CVUploadZone';

function JobDetailPage() {
  const { id } = useParams();
  const { jobPost, loading: jobLoading } = useJobPost(id);
  const {
    candidates,
    loading: candidatesLoading,
    uploadCVs,
    analyzeCVs,
  } = useCandidates(id);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setAnalyzing(true);
    try {
      // 1. Upload
      const result = await uploadCVs(uploadedFiles);
      
      // 2. Analyse IA
      const candidateIds = result.uploadedFiles.map(f => f.candidateId);
      await analyzeCVs(candidateIds);
      
      // 3. Reset
      setUploadedFiles([]);
    } finally {
      setAnalyzing(false);
    }
  };

  if (jobLoading) return <Loader />;
  if (!jobPost) return <NotFound />;

  return (
    <div>
      <h1>{jobPost.title}</h1>
      
      {/* Upload CV */}
      <CVUploadZone onFilesSelected={handleFilesSelected} />
      
      {uploadedFiles.length > 0 && (
        <Button onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? 'Analyse en cours...' : 'Analyser les CV'}
        </Button>
      )}
      
      {/* Liste des candidats */}
      <div>
        <h2>Candidats ({candidates.length})</h2>
        {candidatesLoading ? (
          <Loader />
        ) : (
          candidates.map(candidate => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onClick={() => navigate(`/pro/candidates/${candidate._id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

---

## 🔐 Authentification

Tous les services utilisent automatiquement le token JWT stocké dans le contexte `AuthContext`.

Le client Axios (`api.ts`) ajoute automatiquement le header :
```
Authorization: Bearer {accessToken}
```

---

## ⚠️ Gestion des erreurs

Les hooks gèrent automatiquement les erreurs et affichent des toasts :

```tsx
const { createJobPost } = useJobPosts();

try {
  await createJobPost(data);
  // ✅ Toast de succès affiché automatiquement
} catch (error) {
  // ❌ Toast d'erreur affiché automatiquement
  // Vous pouvez ajouter une logique supplémentaire ici
}
```

---

## 📊 Types TypeScript

Tous les services et hooks sont entièrement typés :

```tsx
import type { JobPost, CreateJobPostData } from '@/types/jobPost';
import type { Candidate } from '@/services/candidatesService';

const job: JobPost = await jobPostsService.getJobPost(id);
const candidate: Candidate = await candidatesService.getCandidate(id);
```

---

## 🎨 Bonnes pratiques

### 1. Utiliser les hooks dans les composants
```tsx
// ✅ Bon
function MyComponent() {
  const { candidates, loading } = useCandidates(jobId);
  // ...
}

// ❌ Éviter
function MyComponent() {
  const [candidates, setCandidates] = useState([]);
  useEffect(() => {
    candidatesService.getCandidates(jobId).then(setCandidates);
  }, []);
}
```

### 2. Gérer les états de chargement
```tsx
const { candidates, loading, error } = useCandidates(jobId);

if (loading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
if (candidates.length === 0) return <EmptyState />;

return <CandidatesList candidates={candidates} />;
```

### 3. Rafraîchir les données après une action
```tsx
const { candidates, fetchCandidates, updateCandidateStatus } = useCandidates(jobId);

const handleStatusChange = async (id: string, status: string) => {
  await updateCandidateStatus(id, status);
  // Les données sont automatiquement mises à jour dans le state local
  // Pas besoin de rafraîchir manuellement
};
```

---

## 🔄 Workflow complet

```
1. Créer une offre
   → useJobPosts().createJobPost()

2. Publier l'offre
   → useJobPosts().publishJobPost()

3. Upload des CV
   → useCandidates().uploadCVs()

4. Analyser avec l'IA
   → useCandidates().analyzeCVs()

5. Consulter les candidats triés
   → useCandidates().candidates (auto-triés par score)

6. Changer le statut
   → useCandidates().updateCandidateStatus()

7. Télécharger un CV
   → useCandidates().downloadCV()
```

---

**Version** : 1.0.0  
**Dernière mise à jour** : 26 février 2026
