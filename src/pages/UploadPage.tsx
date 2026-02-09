import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { getWebPageSchema } from '@/utils/seo';
import { ArrowLeft, UploadCloud, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/i18nContext';
import { AnalysisAnimation } from '@/components/AnalysisAnimation';
import { useCVAnalysis } from '@/hooks/useCVAnalysis';
import { UpdateCVWithLimit } from '@/components/UpdateCVWithLimit';
import { ClientRateLimiter } from '@/utils/clientRateLimit';
import { RateLimitStatus } from '@/components/RateLimitStatus';

const UploadPage = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  
  useSEO({
    title: 'Améliorer mon CV existant - Studyia Career | Upload et optimisation de CV',
    description: 'Téléchargez votre CV existant (PDF, DOCX) et améliorez-le avec Studyia Career. Notre IA analyse votre CV et vous aide à le restructurer avec un design professionnel.',
    keywords: 'améliorer CV, optimiser CV, upload CV, télécharger CV, refaire CV, moderniser CV, CV PDF',
    canonical: 'https://career.studyia.net/upload',
    structuredData: getWebPageSchema({
      name: 'Améliorer votre CV existant',
      description: 'Téléchargez et améliorez votre CV avec notre outil d\'optimisation',
      url: 'https://career.studyia.net/upload'
    })
  });

  const handleUploadSuccess = (data: any) => {
    navigate('/builder', { state: { uploadedData: data } });
  };

  const handleUpdateFromPopup = async () => {
    // Cette fonction sera appelée depuis le popup
    // La logique est déjà gérée dans onDrop
    setShowLimitPopup(false);
  };

  const { analyzeCV, isLoading, error, clearError } = useCVAnalysis({
    onSuccess: handleUploadSuccess,
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Vérifier la limitation avant de continuer
    const rateLimitStatus = ClientRateLimiter.canUpdateCV();
    
    if (!rateLimitStatus.canUpdate) {
      setShowLimitPopup(true);
      return;
    }

    const languageInstruction = language === 'en'
      ? 'You MUST respond ONLY with valid JSON. No text, no explanations, no comments before or after the JSON object.'
      : 'Tu DOIS répondre UNIQUEMENT avec du JSON valide. Aucun texte, aucune explication, aucun commentaire avant ou après l\'objet JSON.';

    const systemPrompt = language === 'en'
      ? `You are an AI specialized in analyzing, extracting and structuring CVs for a career application called Studyia Career.

Your role is to transform RAW TEXT from a CV (from PDF, DOCX or copy-paste) into a structured, clean JSON object usable by a web application.

You act as an intelligent, rigorous and reliable parsing engine, adapted to the francophone market.

${languageInstruction}

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
From the raw text of a CV provided as input:
- Identify
- Extract
- Classify
- Hierarchize
the information of the CV
AND
- Return ONLY a valid JSON object
- Strictly respect the structure defined below

━━━━━━━━━━━━━━━━━━━━━━
📦 MANDATORY OUTPUT FORMAT (JSON ONLY)
━━━━━━━━━━━━━━━━━━━━━━

You must return EXACTLY this JSON structure:

{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "city": "",
    "country": "",
    "summary": ""
  },
  "targetJob": "",
  "experiences": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": []
}

━━━━━━━━━━━━━━━━━━━━━━
📌 STRICT RULES (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━

1. ⚠️ YOUR RESPONSE MUST BE ONLY JSON
   - No text
   - No explanations
   - No comments
   - No markdown

2. 🔍 MISSING DATA
   - If information is NOT found in the CV:
     - use an empty string "" for text fields
     - use an empty array [] for lists

3. 🧠 INTELLIGENT INTERPRETATION
   - You must recognize:
     - different languages (mainly French)
     - different CV structures
     - different section names:
       - “Professional Experience”, “Career”, “Work Experience”
       - “Education”, “Studies”
       - “Skills”, “Expertise”
   - You must logically group information even if the CV is poorly structured

4. 📅 DATES
   - Date formats are FLEXIBLE:
     - "2022"
     - "01/2021 - 06/2023"
     - "January 2020 – Present"
   - Do not aggressively reformat
   - Copy the value as it appears, in a clean and readable way

5. 🧾 EXPERIENCES & EDUCATION
   - Each experience or education must be a distinct object
   - The description must contain the missions, responsibilities or available details. Separate each mission or point with a line break (\n).
   - Do not merge multiple experiences into one

6. 🎯 TARGET JOB (targetJob)
   - If a target job is clearly mentioned (e.g. “Web Developer”, “Data Analyst”), fill it in
   - Otherwise, return an empty string ""

7. 🧼 CLEANING
   - Remove obvious duplicates
   - Clean unnecessary characters
   - Do not rewrite the content, do not perform advanced semantic analysis
   - Your role is STRUCTURING, not ADVISING

━━━━━━━━━━━━━━━━━━━━━━
🛑 ABSOLUTE PROHIBITIONS
━━━━━━━━━━━━━━━━━━━━━━
- Never invent information
- Never fill in a field with a guess
- Never add extra fields
- Never modify the JSON structure
- Never talk to the user

━━━━━━━━━━━━━━━━━━━━━━
✅ EXPECTED RESULT
━━━━━━━━━━━━━━━━━━━━━━
A clean, consistent JSON, ready to be injected directly into the Studyia Career CV editor for:
- display
- modification
- reformatting
- further AI analysis`
      : `Tu es une IA spécialisée dans l'analyse, l'extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

Ton rôle est de transformer le TEXTE BRUT d'un CV (issu d'un PDF, DOCX ou copier-coller) en un objet JSON structuré, propre et exploitable par une application web.

Tu agis comme un moteur de parsing intelligent, rigoureux et fiable, adapté au marché francophone.

${languageInstruction}

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
À partir du texte brut d’un CV fourni en entrée :
- Identifier
- Extraire
- Classer
- Hiérarchiser
les informations du CV
ET
- Retourner UNIQUEMENT un objet JSON valide
- Respecter STRICTEMENT la structure définie ci-dessous

━━━━━━━━━━━━━━━━━━━━━━
📦 FORMAT DE SORTIE OBLIGATOIRE (JSON UNIQUEMENT)
━━━━━━━━━━━━━━━━━━━━━━

Tu dois retourner EXACTEMENT cette structure JSON :

{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "city": "",
    "country": "",
    "summary": ""
  },
  "targetJob": "",
  "experiences": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": []
}

━━━━━━━━━━━━━━━━━━━━━━
📌 RÈGLES STRICTES (TRÈS IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━

1. ⚠️ TA RÉPONSE DOIT ÊTRE UNIQUEMENT DU JSON
   - Aucun texte
   - Aucune explication
   - Aucun commentaire
   - Aucun markdown

2. 🔍 DONNÉES MANQUANTES
   - Si une information n’est PAS trouvée dans le CV :
     - utiliser une chaîne vide "" pour les champs texte
     - utiliser un tableau vide [] pour les listes

3. 🧠 INTERPRÉTATION INTELLIGENTE
   - Tu dois reconnaître :
     - différentes langues (principalement français)
     - différentes structures de CV
     - différentes appellations de sections :
       - “Expérience professionnelle”, “Parcours”, “Work Experience”
       - “Formation”, “Éducation”, “Studies”
       - “Compétences”, “Skills”, “Expertise”
   - Tu dois regrouper logiquement les informations même si le CV est mal structuré

4. 📅 DATES
   - Les formats de dates sont FLEXIBLES :
     - "2022"
     - "01/2021 - 06/2023"
     - "Janvier 2020 – Présent"
   - Ne reformate pas agressivement
   - Recopie la valeur telle qu’elle apparaît, de manière propre et lisible

5. 🧾 EXPÉRIENCES & FORMATION
   - Chaque expérience ou formation doit être un objet distinct
   - La description doit contenir les missions, responsabilités ou détails disponibles. Sépare chaque mission ou point par un retour à la ligne (\n).
   - Ne fusionne pas plusieurs expériences en une seule

6. 🎯 POSTE CIBLÉ (targetJob)
   - Si un poste recherché est clairement mentionné (ex: “Développeur Web”, “Data Analyst”), renseigne-le
   - Sinon, retourne une chaîne vide ""

7. 🧼 NETTOYAGE
   - Supprime les doublons évidents
   - Nettoie les caractères inutiles
   - Ne réécris pas le contenu, ne fais pas d’analyse sémantique avancée
   - Ton rôle est STRUCTURANT, pas CONSEILLER

━━━━━━━━━━━━━━━━━━━━━━
🛑 INTERDICTIONS ABSOLUES
━━━━━━━━━━━━━━━━━━━━━━
- Ne jamais inventer une information
- Ne jamais remplir un champ avec une supposition
- Ne jamais ajouter de champs supplémentaires
- Ne jamais modifier la structure JSON
- Ne jamais parler à l’utilisateur

━━━━━━━━━━━━━━━━━━━━━━
✅ RÉSULTAT ATTENDU
━━━━━━━━━━━━━━━━━━━━━━
Un JSON propre, cohérent, prêt à être injecté directement dans l’éditeur de CV Studyia Career pour :
- affichage
- modification
- reformatage
- analyse IA ultérieure`;

    // Utiliser le hook pour analyser le CV
    await analyzeCV(file, systemPrompt);
    
    // Incrémenter le compteur de limitation
    ClientRateLimiter.incrementUsage();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('upload.backHome')}
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-lg">
        <div className="bg-background p-8 rounded-xl shadow-lg border border-border">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">{t('upload.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('upload.subtitle')}</p>
            
            {/* Indicateur de limitation */}
            <div className="mt-4 flex justify-center">
              <RateLimitStatus showDetails={false} />
            </div>
          </div>
          
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-primary">
                <AnalysisAnimation />
                <p className="font-semibold -mt-8">{t('upload.analyzing')}</p>
                <p className="text-sm text-muted-foreground">{t('upload.pleaseWait')}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <UploadCloud className="w-12 h-12 mb-4" />
                <p className="font-semibold">{t('upload.dragDrop')}</p>
                <p className="text-sm">{t('upload.orClick')}</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/50 text-destructive-foreground rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup de limitation */}
      <UpdateCVWithLimit
        isOpen={showLimitPopup}
        onClose={() => setShowLimitPopup(false)}
        onUpdateCV={handleUpdateFromPopup}
      />
    </div>
  );
};

export default UploadPage;
