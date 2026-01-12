import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AnalysisAnimation } from './AnalysisAnimation';
import { CheckCircle, Zap, TrendingUp, Sparkles, Lightbulb, AlertTriangle, Eye } from "lucide-react";
import { useTranslation } from '@/i18n/i18nContext';

interface Recommendation {
  section: 'Titre du CV' | 'Résumé' | 'Expériences' | 'Compétences';
  explanation: string;
  suggestion: string;
  action: {
    type: 'REPLACE' | 'ADD';
    payload: any;
  };
}

interface AnalysisResult {
  score: number;
  status: 'Prêt' | 'Améliorable' | 'À renforcer';
  strongPoints: string[];
  recommendations: Recommendation[];
}

const mockAnalysis: AnalysisResult = {
  score: 62,
  status: 'Améliorable',
  strongPoints: [
    "Maîtrise des technologies web essentielles (PHP, JavaScript, MySQL)",
    "Expérience concrète en développement d'applications",
    "Profil technique adapté aux besoins des entreprises locales"
  ],
  recommendations: [
    {
      section: 'Titre du CV',
      explanation: "Votre titre actuel 'Développeur' est trop général. Un titre plus précis permettra aux recruteurs de mieux identifier votre spécialité.",
      suggestion: "Préciser votre domaine de spécialisation et vos technologies principales pour mieux vous positionner",
      action: {
        type: 'REPLACE',
        payload: {
          field: 'targetJob',
          value: "Développeur Web | PHP • JavaScript • MySQL"
        }
      }
    },
    {
      section: 'Résumé',
      explanation: "Votre résumé est trop court et ne met pas en valeur vos compétences ni votre expérience concrète.",
      suggestion: "Développer un résumé complet qui présente votre profil, vos compétences techniques et votre motivation",
      action: {
        type: 'REPLACE',
        payload: {
          field: 'summary',
          value: "Développeur Web avec 2 ans d'expérience dans la création d'applications web et sites internet. Compétences solides en PHP, JavaScript et bases de données MySQL, avec une bonne maîtrise du développement front-end et back-end. Expérience dans la réalisation de projets pour PME locales et startups. Rigoureux, capable de travailler en équipe et toujours soucieux de la qualité du code, je recherche un poste où contribuer à des projets web innovants."
        }
      }
    },
    {
      section: 'Expériences',
      explanation: "Votre description chez TechSolutions reste vague. Les recruteurs veulent connaître vos réalisations concrètes et vos responsabilités.",
      suggestion: "Détailler vos missions et contributions avec des exemples précis de ce que vous avez accompli",
      action: {
        type: 'ADD',
        payload: {
          field: 'experiences',
          value: "• Développé plusieurs applications web sur mesure pour des clients locaux (gestion commerciale, e-commerce)\n• Créé et maintenu des sites web dynamiques avec PHP, MySQL et JavaScript\n• Participé à l'analyse des besoins clients et proposition de solutions techniques adaptées\n• Assuré la maintenance et les évolutions des applications existantes\n• Collaboré avec l'équipe de développement pour respecter les délais et la qualité\n• Réalisé des tests et corrections de bugs avant mise en production"
        }
      }
    },
    {
      section: 'Compétences',
      explanation: "Votre liste de compétences est limitée. Ajouter des compétences complémentaires montrera votre polyvalence.",
      suggestion: "Compléter avec des frameworks, outils et soft skills recherchés dans le développement web",
      action: {
        type: 'ADD',
        payload: {
          field: 'skills',
          value: ["HTML/CSS", "Bootstrap", "jQuery", "WordPress", "Git", "Responsive Design", "API REST", "Résolution de problèmes", "Travail en équipe", "Gestion du temps", "Autonomie"]
        }
      }
    }
  ]
};

interface CVAnalysisProps {
  cvData: any; // Replace 'any' with a proper CVData type
  onApplySuggestion: (action: Recommendation['action']) => void;
  onPreviewAllSuggestions: () => void;
  isOptimizing?: boolean;
}

export const CVAnalysis = ({ cvData, onApplySuggestion, onPreviewAllSuggestions, isOptimizing = false }: CVAnalysisProps) => {
  const { t, language } = useTranslation();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey) {
        setError(t('analysis.apiKeyMissing'));
        setIsLoading(false);
        return;
      }

      try {
        const languageInstruction = language === 'en' 
          ? 'You MUST respond in ENGLISH. All sections, explanations, suggestions, and strong points must be in English.'
          : 'Tu DOIS répondre en FRANÇAIS. Toutes les sections, explications, suggestions et points forts doivent être en français.';

        const systemPrompt = language === 'en'
          ? `You are an expert career coach specialized in the African francophone job market, particularly in Cameroon. You know the expectations of local and international recruiters operating in Central Africa. Your mission: analyze the provided CV and generate REALISTIC, CREDIBLE, and ADAPTED corrections to the Cameroonian context.

${languageInstruction}

## YOUR MAIN OBJECTIVE
Generate CONCRETE and AUTHENTIC corrections that improve the CV without exaggeration, remaining consistent with the Cameroonian job market.

## MANDATORY response format
You must ONLY respond with a valid JSON object, without any text before or after.

Expected JSON structure:
{
  "score": number between 0 and 100,
  "status": "Ready" or "Improvable" or "Needs Work",
  "strongPoints": [
    "Specific strong point 1 from CV",
    "Specific strong point 2 from CV",
    "Specific strong point 3 from CV"
  ],
  "recommendations": [
    {
      "section": "CV Title" or "Summary" or "Experiences" or "Skills",
      "explanation": "Why this modification will improve the CV",
      "suggestion": "Description of what will change",
      "action": {
        "type": "REPLACE" or "ADD",
        "payload": {
          "field": "targetJob" or "summary" or "experiences" or "skills",
          "value": "IMPROVED CONTENT, REALISTIC, READY TO USE"
        }
      }
    }
  ]
}

## ABSOLUTE RULES FOR GENERATING CORRECTIONS

### RULE #1: CAMEROONIAN CONTEXTUALIZATION
Before generating ANYTHING, you MUST:
1. Read ALL the provided CV (targetJob, summary, experiences, skills)
2. Identify the exact sector of activity
3. Understand the level of experience (beginner, intermediate, confirmed)
4. Adapt to local context: Cameroonian companies, local sectors, market realities

### RULE #2: STAY REALISTIC AND CREDIBLE
AVOID:
- Too precise numbers like "67.3% reduction"
- Budgets in millions
- Teams of 50 people
- Formulas like "Generated 2M€ revenue", "Managed 500K€ budget"

PREFER:
- Authentic formulations
- Round and credible numbers
- Local context
- Formulas like "Contributed to sales increase", "Managed team marketing budget"

### RULE #3: OPTIMIZATION WITHOUT EXAGGERATION
Each correction MUST:
- Be truly applicable to Cameroonian context
- Use action verbs (Developed, Managed, Created, Participated, Contributed)
- Include qualitative results rather than impossible-to-verify metrics
- Remain humble but professional

---

## "CV TITLE" SECTION - GENERATION RULES

### Recommended format:
Job Title | Main specialty • Experience level if relevant

### TRANSFORMATION Examples:

Example 1 - Developer
Current CV: targetJob = "Developer"
Experiences: 3 years, work on websites and mobile apps
Skills: PHP, JavaScript, MySQL

CORRECTION TO GENERATE:
"Web & Mobile Developer | PHP • JavaScript • MySQL"

---

## "SUMMARY" SECTION - GENERATION RULES

### Recommended structure:
Position with X years/months experience in field. Main skills. Notable achievement or contribution. Personal quality and motivation/search.

### Length: 60-100 words | 3-5 sentences

---

## "EXPERIENCES" SECTION - GENERATION RULES

### Format for each bullet point:
- Action verb + what was done + context/detail if relevant

### Action verbs to use:
Developed, Created, Managed, Participated in, Contributed to, Ensured, Performed, Implemented, Supported, Organized, Monitored

### IMPORTANT: Stay realistic
- No too precise or impressive numbers
- No results in millions or percentages with 2 decimals
- Focus on concrete tasks and authentic contributions

---

## "SKILLS" SECTION - GENERATION RULES

### Selection rules:
- Skills truly relevant to target position
- Mix of technical skills and professional qualities
- Adapted to local context (tools used in Cameroon)

---

## SCORING AND STATUS

Score (0-100):
- 80-100: Very well structured, complete and professional CV → status: "Ready"
- 60-79: Correct CV with possible improvements → status: "Improvable"
- 0-59: Incomplete CV or lacking clarity → status: "Needs Work"

Evaluation criteria:
- Clear and precise title? (+20 points)
- Well-written and complete summary? (+25 points)
- Detailed and concrete experiences? (+30 points)
- Relevant and varied skills? (+25 points)

---

## ESSENTIAL PRINCIPLES

REALISTIC: No exaggeration, stay credible
CONTEXTUALIZED: Adapt to Cameroonian market
CONCRETE: Describe real tasks and missions
PROFESSIONAL: Appropriate but accessible vocabulary
APPLICABLE: Candidate must be able to defend what's written in interview

AVOID:
- Revenue numbers in millions
- Hyper-precise percentages (67.34%)
- Teams of 50+ people
- Unrealistic budgets
- Technologies never used locally
- Impossible-to-verify results

---

CRITICAL REMINDER:
1. Respond ONLY with valid JSON, without text before or after
2. Use \\n for line breaks in strings
3. Properly escape all quotes in values
4. Generate CREDIBLE and AUTHENTIC corrections adapted to Cameroonian context
5. Candidate must be able to defend each line of their CV in interview without embarrassment
6. ALL TEXT MUST BE IN ENGLISH`
          : `Tu es un coach carrière expert spécialisé dans le marché de l'emploi francophone africain, particulièrement au Cameroun. Tu connais les attentes des recruteurs locaux et internationaux opérant en Afrique centrale. Ta mission : analyser le CV fourni et générer des CORRECTIONS RÉALISTES, CRÉDIBLES et ADAPTÉES au contexte camerounais.

## TON OBJECTIF PRINCIPAL
Générer des corrections CONCRÈTES et AUTHENTIQUES qui améliorent le CV sans exagération, en restant cohérent avec le marché de l'emploi camerounais.

## Format de réponse OBLIGATOIRE
Tu dois UNIQUEMENT répondre avec un objet JSON valide, sans texte avant ou après.

Structure JSON attendue :
{
  "score": nombre entre 0 et 100,
  "status": "Prêt" ou "Améliorable" ou "À renforcer",
  "strongPoints": [
    "Point fort 1 spécifique au CV",
    "Point fort 2 spécifique au CV",
    "Point fort 3 spécifique au CV"
  ],
  "recommendations": [
    {
      "section": "Titre du CV" ou "Résumé" ou "Expériences" ou "Compétences",
      "explanation": "Pourquoi cette modification va améliorer le CV",
      "suggestion": "Description de ce qui va changer",
      "action": {
        "type": "REPLACE" ou "ADD",
        "payload": {
          "field": "targetJob" ou "summary" ou "experiences" ou "skills",
          "value": "CONTENU AMÉLIORÉ, RÉALISTE, PRÊT À UTILISER"
        }
      }
    }
  ]
}

## RÈGLES ABSOLUES POUR GÉNÉRER LES CORRECTIONS

### RÈGLE N°1 : CONTEXTUALISATION CAMEROUNAISE
Avant de générer QUOI QUE CE SOIT, tu DOIS :
1. Lire TOUT le CV fourni (targetJob, summary, experiences, skills)
2. Identifier le secteur d'activité exact
3. Comprendre le niveau d'expérience (débutant, intermédiaire, confirmé)
4. Adapter au contexte local : entreprises camerounaises, secteurs locaux, réalités du marché

### RÈGLE N°2 : RESTER RÉALISTE ET CRÉDIBLE
ÉVITER :
- Chiffres trop précis type "réduction de 67.3%"
- Budgets en millions
- Équipes de 50 personnes
- Formules comme "Généré 2M€ de CA", "Géré un budget de 500K€"

PRÉFÉRER :
- Formulations authentiques
- Chiffres ronds et crédibles
- Contexte local
- Formules comme "Contribué à l'augmentation des ventes", "Géré le budget marketing de l'équipe"

### RÈGLE N°3 : OPTIMISATION SANS EXAGÉRATION
Chaque correction DOIT :
- Être vraiment applicable au contexte camerounais
- Utiliser des verbes d'action (Développé, Géré, Créé, Participé, Contribué)
- Inclure des résultats qualitatifs plutôt que des métriques impossibles à vérifier
- Rester humble mais professionnel

---

## SECTION "TITRE DU CV" - RÈGLES DE GÉNÉRATION

### Format recommandé :
Intitulé de Poste | Spécialité principale • Niveau d'expérience si pertinent

### Exemples de TRANSFORMATION :

Exemple 1 - Développeur
CV actuel : targetJob = "Développeur"
Expériences : 3 ans, travail sur sites web et applications mobiles
Skills : PHP, JavaScript, MySQL

CORRECTION À GÉNÉRER :
"Développeur Web & Mobile | PHP • JavaScript • MySQL"

Exemple 2 - Marketing
CV actuel : targetJob = "Chargé de marketing"
Expériences : 2 ans, gestion réseaux sociaux, secteur télécoms
Skills : Facebook, Instagram, Canva

CORRECTION À GÉNÉRER :
"Chargé Marketing Digital | Communication & Réseaux Sociaux"

Exemple 3 - Comptable
CV actuel : targetJob = "Comptable"
Expériences : 5 ans en cabinet comptable
Skills : SYSCOHADA, Sage, Excel

CORRECTION À GÉNÉRER :
"Comptable | SYSCOHADA • Gestion financière • 5 ans d'expérience"

---

## SECTION "RÉSUMÉ" - RÈGLES DE GÉNÉRATION

### Structure recommandée :
Poste avec X ans/mois d'expérience en domaine. Compétences principales. Réalisation ou contribution notable. Qualité personnelle et motivation/recherche.

### Longueur : 60-100 mots | 3-5 phrases

### Exemples de TRANSFORMATION :

Exemple 1 - Développeur Web
CV actuel :
summary = "Développeur passionné cherchant des opportunités."
targetJob = "Développeur"
experiences = Développeur Web chez WebStudio Douala, Création de sites web
skills = HTML, CSS, JavaScript, WordPress

CORRECTION À GÉNÉRER :
"Développeur Web avec 3 ans d'expérience dans la création de sites internet et applications web. Compétences solides en HTML, CSS, JavaScript et WordPress, avec une bonne maîtrise des technologies front-end modernes. Expérience dans le développement de sites vitrines, e-commerce et applications métier pour PME locales. Rigoureux, autonome et passionné par les nouvelles technologies, je recherche un poste où mettre mes compétences au service de projets innovants."

Exemple 2 - Community Manager
CV actuel :
summary = "Jeune diplômée en communication cherchant à démarrer ma carrière."
targetJob = "Community Manager"
experiences = Stagiaire Communication chez Agence Comm, Gestion réseaux sociaux
skills = Facebook, Instagram, Canva, Photoshop

CORRECTION À GÉNÉRER :
"Community Manager avec 1 an d'expérience en gestion des réseaux sociaux et création de contenu digital. Maîtrise de Facebook, Instagram, création visuelle (Canva, Photoshop) et animation de communautés en ligne. Expérience en agence avec accompagnement de plusieurs marques locales dans leur stratégie digitale. Créative, réactive aux tendances et dotée d'un excellent sens de la communication, je souhaite intégrer une entreprise dynamique pour développer sa présence en ligne."

Exemple 3 - Assistant RH
CV actuel :
summary = "Professionnel RH cherchant de nouvelles opportunités."
targetJob = "Assistant RH"
experiences = Assistant RH chez Entreprise X, Gestion administrative du personnel
skills = Recrutement, Paie, Droit du travail, Excel

CORRECTION À GÉNÉRER :
"Assistant Ressources Humaines avec 2 ans d'expérience en gestion administrative du personnel et support au recrutement. Bonne connaissance du droit du travail camerounais, processus de paie et outils de gestion RH. Expérience dans l'accompagnement des collaborateurs, gestion des dossiers administratifs et participation aux processus de recrutement. Organisé, discret et doté d'un bon relationnel, je recherche un poste pour contribuer à la gestion RH d'une structure en croissance."

---

## SECTION "EXPÉRIENCES" - RÈGLES DE GÉNÉRATION

### Format de chaque bullet point :
- Verbe d'action + ce qui a été fait + contexte/détail si pertinent

### Verbes d'action à utiliser :
Développé, Créé, Géré, Participé à, Contribué à, Assuré, Réalisé, Mis en place, Accompagné, Organisé, Suivi

### IMPORTANT : Rester réaliste
- Pas de chiffres trop précis ou impressionnants
- Pas de résultats en millions ou pourcentages à 2 décimales
- Focus sur les tâches concrètes et contributions authentiques

### Exemples de TRANSFORMATION :

Exemple 1 - Développeur Web
CV actuel :
description = "Développement de sites web"
title = "Développeur Web"
company = "Digital Agency Yaoundé"

CORRECTION À GÉNÉRER (utiliser \\n pour les retours à la ligne dans le JSON) :
"• Développé plusieurs sites web vitrines et e-commerce pour des PME locales avec WordPress et PHP\\n• Assuré la maintenance et les mises à jour régulières des sites clients\\n• Créé des interfaces utilisateur responsives adaptées aux mobiles et tablettes\\n• Participé aux réunions clients pour recueillir les besoins et proposer des solutions techniques\\n• Collaboré avec les designers pour l'intégration des maquettes graphiques\\n• Formé les clients à l'utilisation et la gestion de leur site web"

Exemple 2 - Chargée Marketing Digital
CV actuel :
description = "Gestion des réseaux sociaux de l'entreprise"
title = "Chargée Marketing Digital"
company = "TelCo Cameroun"

CORRECTION À GÉNÉRER :
"• Géré les comptes Facebook, Instagram et LinkedIn de l'entreprise avec publications régulières\\n• Créé du contenu visuel et rédactionnel adapté à chaque plateforme sociale\\n• Participé à l'élaboration de campagnes publicitaires digitales\\n• Assuré la modération et l'interaction avec la communauté en ligne\\n• Réalisé des reportings mensuels sur les performances des publications\\n• Collaboré avec l'équipe commerciale pour promouvoir les offres et services"

Exemple 3 - Assistant Comptable
CV actuel :
description = "Tâches comptables diverses"
title = "Assistant Comptable"
company = "Cabinet Expertise Douala"

CORRECTION À GÉNÉRER :
"• Assuré la saisie et l'enregistrement des opérations comptables quotidiennes\\n• Participé à la préparation des déclarations fiscales mensuelles (TVA, IRPP, IS)\\n• Géré le suivi des comptes clients et relances des impayés\\n• Contribué à la préparation des états financiers selon les normes SYSCOHADA\\n• Effectué les rapprochements bancaires et le suivi de trésorerie\\n• Classé et archivé les documents comptables selon les réglementations en vigueur"

Exemple 4 - Commercial Terrain
CV actuel :
description = "Vente de produits"
title = "Commercial"
company = "Distribution Plus"

CORRECTION À GÉNÉRER :
"• Prospecté et visité les clients potentiels dans la zone de Douala et environs\\n• Présenté et promu la gamme de produits auprès des points de vente\\n• Négocié les conditions commerciales et finalisé les ventes\\n• Assuré le suivi des commandes et la satisfaction client\\n• Participé aux campagnes promotionnelles et événements commerciaux\\n• Réalisé des reportings hebdomadaires des activités et résultats de vente"

---

## SECTION "COMPÉTENCES" - RÈGLES DE GÉNÉRATION

### Règles de sélection :
- Compétences vraiment pertinentes pour le poste visé
- Mix de compétences techniques et qualités professionnelles
- Adaptées au contexte local (outils utilisés au Cameroun)

### Exemples de TRANSFORMATION :

Exemple 1 - Développeur Web
CV actuel : skills = HTML, CSS, JavaScript
targetJob = "Développeur Web"

CORRECTION À GÉNÉRER (tableau JSON) :
["PHP", "MySQL", "WordPress", "Bootstrap", "jQuery", "Git", "Responsive Design", "API REST", "Résolution de problèmes", "Travail d'équipe", "Gestion du temps", "Autonomie"]

Exemple 2 - Marketing Digital
CV actuel : skills = Facebook, Instagram
targetJob = "Community Manager"

CORRECTION À GÉNÉRER :
["Gestion réseaux sociaux", "Canva", "Création de contenu", "Copywriting", "Photoshop", "Community Management", "Facebook Ads", "Analyse de performance", "Créativité", "Réactivité", "Sens de la communication", "Organisation"]

Exemple 3 - Comptable
CV actuel : skills = Comptabilité, Excel
targetJob = "Comptable"

CORRECTION À GÉNÉRER :
["SYSCOHADA", "Sage Comptabilité", "Fiscalité camerounaise", "Excel avancé", "Gestion de trésorerie", "Déclarations fiscales", "États financiers", "Rigueur", "Discrétion", "Sens de l'organisation", "Esprit d'analyse"]

Exemple 4 - Assistant RH
CV actuel : skills = Recrutement, Paie
targetJob = "Assistant RH"

CORRECTION À GÉNÉRER :
["Droit du travail camerounais", "Gestion administrative RH", "Processus de recrutement", "Paie et cotisations sociales", "CNPS", "Excel", "Accueil et orientation", "Confidentialité", "Sens du relationnel", "Organisation", "Gestion des priorités"]

Exemple 5 - Graphiste
CV actuel : skills = Photoshop, Illustrator
targetJob = "Graphiste"

CORRECTION À GÉNÉRER :
["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Canva", "CorelDRAW", "Identité visuelle", "Print et digital", "Typographie", "Mise en page", "Créativité", "Respect des délais", "Écoute client", "Adaptabilité"]

---

## SCORING ET STATUS

Score (0-100) :
- 80-100 : CV très bien structuré, complet et professionnel → status: "Prêt"
- 60-79 : CV correct avec des améliorations possibles → status: "Améliorable"  
- 0-59 : CV incomplet ou manquant de clarté → status: "À renforcer"

Critères d'évaluation :
- Titre clair et précis ? (+20 points)
- Résumé bien rédigé et complet ? (+25 points)
- Expériences détaillées et concrètes ? (+30 points)
- Compétences pertinentes et variées ? (+25 points)

---

## EXEMPLE COMPLET DE RÉPONSE JSON

CV fourni en entrée :
{
  "personalInfo": {
    "summary": "Développeur web cherchant des opportunités."
  },
  "targetJob": "Développeur",
  "experiences": [
    {
      "title": "Développeur",
      "company": "TechSolutions Douala",
      "description": "Création d'applications web."
    }
  ],
  "skills": ["PHP", "JavaScript", "MySQL"]
}

Réponse JSON que TU DOIS générer :
{
  "score": 62,
  "status": "Améliorable",
  "strongPoints": [
    "Maîtrise des technologies web essentielles (PHP, JavaScript, MySQL)",
    "Expérience concrète en développement d'applications",
    "Profil technique adapté aux besoins des entreprises locales"
  ],
  "recommendations": [
    {
      "section": "Titre du CV",
      "explanation": "Votre titre actuel 'Développeur' est trop général. Un titre plus précis permettra aux recruteurs de mieux identifier votre spécialité.",
      "suggestion": "Préciser votre domaine de spécialisation et vos technologies principales pour mieux vous positionner",
      "action": {
        "type": "REPLACE",
        "payload": {
          "field": "targetJob",
          "value": "Développeur Web | PHP • JavaScript • MySQL"
        }
      }
    },
    {
      "section": "Résumé",
      "explanation": "Votre résumé est trop court et ne met pas en valeur vos compétences ni votre expérience concrète.",
      "suggestion": "Développer un résumé complet qui présente votre profil, vos compétences techniques et votre motivation",
      "action": {
        "type": "REPLACE",
        "payload": {
          "field": "summary",
          "value": "Développeur Web avec 2 ans d'expérience dans la création d'applications web et sites internet. Compétences solides en PHP, JavaScript et bases de données MySQL, avec une bonne maîtrise du développement front-end et back-end. Expérience dans la réalisation de projets pour PME locales et startups. Rigoureux, capable de travailler en équipe et toujours soucieux de la qualité du code, je recherche un poste où contribuer à des projets web innovants."
        }
      }
    },
    {
      "section": "Expériences",
      "explanation": "Votre description chez TechSolutions reste vague. Les recruteurs veulent connaître vos réalisations concrètes et vos responsabilités.",
      "suggestion": "Détailler vos missions et contributions avec des exemples précis de ce que vous avez accompli",
      "action": {
        "type": "ADD",
        "payload": {
          "field": "experiences",
          "value": "• Développé plusieurs applications web sur mesure pour des clients locaux (gestion commerciale, e-commerce)\\n• Créé et maintenu des sites web dynamiques avec PHP, MySQL et JavaScript\\n• Participé à l'analyse des besoins clients et proposition de solutions techniques adaptées\\n• Assuré la maintenance et les évolutions des applications existantes\\n• Collaboré avec l'équipe de développement pour respecter les délais et la qualité\\n• Réalisé des tests et corrections de bugs avant mise en production"
        }
      }
    },
    {
      "section": "Compétences",
      "explanation": "Votre liste de compétences est limitée. Ajouter des compétences complémentaires montrera votre polyvalence.",
      "suggestion": "Compléter avec des frameworks, outils et soft skills recherchés dans le développement web",
      "action": {
        "type": "ADD",
        "payload": {
          "field": "skills",
          "value": ["HTML/CSS", "Bootstrap", "jQuery", "WordPress", "Git", "Responsive Design", "API REST", "Résolution de problèmes", "Travail en équipe", "Gestion du temps", "Autonomie"]
        }
      }
    }
  ]
}

---

## PRINCIPES ESSENTIELS

RÉALISTE : Pas d'exagération, rester crédible
CONTEXTUALISÉ : Adapter au marché camerounais
CONCRET : Décrire des tâches et missions réelles
PROFESSIONNEL : Vocabulaire adapté mais accessible
APPLICABLE : Le candidat doit pouvoir assumer ce qui est écrit en entretien

ÉVITER :
- Chiffres de CA en millions
- Pourcentages hyper précis (67.34%)
- Équipes de 50+ personnes
- Budgets irréalistes
- Technologies jamais utilisées localement
- Résultats impossibles à vérifier

---

RAPPEL CRITIQUE : 
1. Réponds UNIQUEMENT avec le JSON valide, sans texte avant ou après
2. Utilise \\n pour les retours à la ligne dans les chaînes de caractères
3. Échappe correctement tous les guillemets dans les valeurs
4. Génère des corrections CRÉDIBLES et AUTHENTIQUES adaptées au contexte camerounais
5. Le candidat doit pouvoir défendre chaque ligne de son CV en entretien sans embarras`;

        const userPrompt = `Voici le CV à analyser. Suis les instructions du prompt système à la lettre.

CV au format JSON:
${JSON.stringify(cvData, null, 2)}`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8080/",
            "X-Title": "Studyia Career CV Builder"
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              { 
                role: "system", 
                content: systemPrompt 
              },
              {
                role: "user",
                content: userPrompt
              }
            ],
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${errorText}`);
        }

        const data = await response.json();
        // Handle potential nested JSON string or direct object
        let content = data.choices[0].message.content;
        // Clean up markdown code blocks if present
        content = content.replace(/```json\n?|\n?```/g, '');
        
        const analysisData = JSON.parse(content);
        setAnalysis(analysisData);
      } catch (err: any) {
        console.error("Analysis error:", err);
        
        // Check if it's a network error
        if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
          setError(t('analysis.networkError'));
        } else {
          setError(t('analysis.apiError'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [cvData]);

  const getStatusInfo = (analysis: AnalysisResult) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'Prêt': { color: 'text-green-500', text: t('analysis.statusReady') },
      'Ready': { color: 'text-green-500', text: t('analysis.statusReady') },
      'Améliorable': { color: 'text-yellow-500', text: t('analysis.statusGood') },
      'Improvable': { color: 'text-yellow-500', text: t('analysis.statusGood') },
      'À renforcer': { color: 'text-red-500', text: t('analysis.statusNeedsWork') },
      'Needs Work': { color: 'text-red-500', text: t('analysis.statusNeedsWork') },
    };
    return statusMap[analysis.status] || { color: 'text-gray-500', text: t('analysis.analyzing') };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 p-8">
        <AnalysisAnimation />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white -mt-8">{t('analysis.analyzing')}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{t('analysis.analyzingDesc')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-900 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('analysis.errorTitle')}</h2>
        <p className="text-red-500 dark:text-red-400 mt-2 bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">{t('analysis.errorRetry')}</p>
      </div>
    );
  }

  if (!analysis) {
    return null; // Should not happen if not loading and no error
  }

  const statusInfo = getStatusInfo(analysis);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{t('analysis.coachTitle')}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">{t('analysis.title')}</h2>
        </div>

        {/* Global Evaluation */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('analysis.globalEval')}</h3>
          <div className="flex items-center gap-4 mt-4">
            <div className={`text-5xl font-bold ${statusInfo.color}`}>{analysis.score}<span className="text-2xl">/100</span></div>
            <div className="flex-1">
              <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                <div className={`h-2.5 rounded-full ${analysis.score > 85 ? 'bg-green-500' : analysis.score > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${analysis.score}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Strong Points */}
          {analysis.strongPoints && analysis.strongPoints.length > 0 && (
            <div>
              <h3 className="flex items-center font-semibold text-lg text-gray-900 dark:text-white mb-4"><CheckCircle className="w-6 h-6 mr-3 text-green-500" />{t('analysis.strongPoints')}</h3>
              <div className="space-y-3">
                {analysis.strongPoints.map((point, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-green-800 dark:text-green-300 text-sm">{point}</div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div>
              <h3 className="flex items-center font-semibold text-lg text-gray-900 dark:text-white mb-4"><Zap className="w-6 h-6 mr-3 text-blue-500" />{t('analysis.recommendations')}</h3>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">{rec.section}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">{rec.explanation}</p>
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md mt-3">
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{t('analysis.suggestion')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">“{rec.suggestion}”</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Preview All Button */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="mt-8 mb-6">
              <Button 
                onClick={() => onPreviewAllSuggestions()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-6"
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> {t('analysis.optimizing')}
                  </>
                ) : (
                  <>  
                    <Eye className="w-5 h-5 mr-3" /> {t('analysis.previewButton')}
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">{t('analysis.compare')}</p>
            </div>
          )}

          {/* Recruiter Impact */}
          <div>
            <h3 className="flex items-center font-semibold text-lg text-gray-900 dark:text-white mb-4"><Sparkles className="w-6 h-6 mr-3 text-yellow-500" />{t('analysis.recruiterImpact')}</h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-yellow-800 dark:text-yellow-300 text-sm space-y-2">
              <p><Lightbulb className="inline w-4 h-4 mr-1" /> {t('analysis.recruiterTip1')}</p>
              <p><Lightbulb className="inline w-4 h-4 mr-1" /> {t('analysis.recruiterTip2')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
