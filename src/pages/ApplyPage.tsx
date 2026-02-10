import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Upload, FileText, Target, Sparkles, ArrowRight, 
  CheckCircle, AlertCircle, TrendingUp, Zap, Download, Eye,
  Copy, Clipboard, Loader2, Star, Award, Users, Building,
  XCircle, AlertTriangle, Search, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';
import { getWebPageSchema } from '@/utils/seo';
import { useTranslation } from '@/i18n/i18nContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { jobOfferService, JobOffer } from '@/services/jobOfferService';
import { cvMatchingService, CVMatchResult } from '@/services/cvMatchingService';
import { coverLetterService, CoverLetterData } from '@/services/coverLetterService';
import { downloadCoverLetter } from '@/utils/coverLetterPDF';
import { generatePDFBlob } from '@/utils/pdfGenerator';
import { useCVAnalysis } from '@/hooks/useCVAnalysis';
import { ClientRateLimiter } from '@/utils/clientRateLimit';
import geminiService, { CVParsed } from '@/services/gemini';
import { ProfessionalTemplate, ModernTemplate, CreativeTemplate, MinimalTemplate, ExecutiveTemplate } from '@/components/CVTemplates';

// Setup PDF.js worker
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Types
interface AnalysisResult {
  matchScore: number;
  missingSkills: string[];
  relevantExperiences: string[];
  suggestions: string[];
  optimizedCV: any;
  coverLetter: CoverLetterData;
  jobOffer: JobOffer;
}

const ApplyPage = () => {
  const [step, setStep] = useState<'offer' | 'cv' | 'analysis' | 'results' | 'optimization'>('offer');
  const [jobOfferText, setJobOfferText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [parsedJobOffer, setParsedJobOffer] = useState<JobOffer | null>(null);
  const [parsedCV, setParsedCV] = useState<CVParsed | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook pour l'analyse de CV robuste
  const { analyzeCV: analyzeCVWithGemini, isLoading: isCVAnalysisLoading, error: cvAnalysisError } = useCVAnalysis({
    onSuccess: (cvData) => {
      console.log('✅ CV analysé avec succès via useCVAnalysis');
      console.log('📊 Données CV reçues:', cvData);
      setParsedCV(cvData);
    },
    onError: (error) => {
      console.error('❌ Erreur analyse CV:', error);
      toast({
        title: 'Erreur lors de l\'analyse du CV',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Log au montage du composant
  useEffect(() => {
    console.log('🎯 COMPOSANT ApplyPage MONTÉ');
    console.log('🎯 État initial:');
    console.log('  - step:', step);
    console.log('  - cvFile:', cvFile ? 'OK' : 'NULL');
    console.log('  - parsedJobOffer:', parsedJobOffer ? 'OK' : 'NULL');
    console.log('  - isAnalyzing:', isAnalyzing);
  }, []);

  useSEO({
    title: 'Postuler à une offre d\'emploi - IA CV & Lettre | Studyia Career',
    description: 'Postulez intelligemment à n\'importe quelle offre d\'emploi. Notre IA analyse l\'offre, optimise votre CV et génère une lettre de motivation personnalisée. Augmentez vos chances de recrutement.',
    keywords: 'postuler offre emploi, CV optimisé IA, lettre de motivation automatique, matching CV emploi, candidature intelligente, IA recrutement, optimisation CV, génération lettre motivation',
    canonical: 'https://career.studyia.net/apply',
    openGraph: {
      title: 'Postuler aux offres avec IA - Studyia Career',
      description: 'Optimisez votre candidature avec notre IA : analyse d\'offre, CV personnalisé et lettre de motivation générée automatiquement.',
      type: 'website',
      url: 'https://career.studyia.net/apply',
      images: [
        {
          url: 'https://career.studyia.net/og-image-apply.jpg',
          width: 1200,
          height: 630,
          alt: 'Postuler aux offres d\'emploi avec IA - Studyia Career'
        }
      ],
      siteName: 'Studyia Career',
      locale: 'fr_FR'
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Postuler aux offres avec IA - Studyia Career',
      description: 'Optimisez votre candidature avec notre IA : CV personnalisé et lettre de motivation générée.',
      images: ['https://career.studyia.net/og-image-apply.jpg'],
      creator: '@studyia_career',
      site: '@studyia_career'
    },
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'Studyia Career',
    publisher: 'Studyia Career',
    language: 'fr-FR',
    revisitAfter: '7 days',
    category: 'Emploi et Carrière',
    structuredData: [
      getWebPageSchema({
        name: 'Postuler à une offre d\'emploi avec IA',
        description: 'Outil intelligent pour postuler aux offres avec CV optimisé et lettre de motivation générée par IA',
        url: 'https://career.studyia.net/apply'
      }),
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Studyia Career - Postuler aux offres',
        description: 'Application IA pour optimiser les candidatures et générer des lettres de motivation personnalisées',
        url: 'https://career.studyia.net/apply',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1247',
          bestRating: '5',
          worstRating: '1'
        },
        featureList: [
          'Analyse IA des offres d\'emploi',
          'Optimisation automatique du CV',
          'Génération de lettre de motivation',
          'Matching compétences-offre',
          'Templates CV professionnels',
          'Export PDF et ZIP'
        ]
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Service de candidature intelligente',
        description: 'Service d\'IA pour optimiser les candidatures d\'emploi avec CV personnalisé et lettre de motivation générée',
        provider: {
          '@type': 'Organization',
          name: 'Studyia Career',
          url: 'https://career.studyia.net'
        },
        serviceType: 'Employment Service',
        areaServed: 'FR',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services de candidature',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Analyse d\'offre d\'emploi par IA'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Optimisation de CV par IA'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Génération de lettre de motivation'
              }
            }
          ]
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Comment fonctionne l\'analyse d\'offre d\'emploi ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Notre IA analyse le texte de l\'offre pour identifier les compétences requises, les qualifications et les responsabilités. Elle compare ensuite votre profil avec ces exigences.'
            }
          },
          {
            '@type': 'Question',
            name: 'L\'IA peut-elle vraiment améliorer mon CV ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Oui, notre IA adapte votre CV en mettant en avant les compétences pertinentes pour l\'offre, en optimisant les descriptions et en suggérant des améliorations basées sur les meilleures pratiques.'
            }
          },
          {
            '@type': 'Question',
            name: 'La lettre de motivation est-elle vraiment personnalisée ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolument. Chaque lettre est générée spécifiquement pour l\'offre et votre profil, en analysant les exigences et en créant un contenu unique et pertinent.'
            }
          }
        ]
      }
    ]
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log('📁 FICHIERS REÇUS DANS DROPZONE');
      console.log('📁 acceptedFiles:', acceptedFiles);
      console.log('📁 Nombre de fichiers:', acceptedFiles.length);
      
      if (acceptedFiles[0]) {
        console.log('📁 Fichier CV reçu:', acceptedFiles[0].name);
        console.log('📁 Taille:', acceptedFiles[0].size, 'bytes');
        console.log('📁 Type:', acceptedFiles[0].type);
        
        setCvFile(acceptedFiles[0]);
        console.log('✅ cvFile défini, step reste sur cv');
        // NE PAS lancer l'analyse automatiquement, laisser l'utilisateur cliquer
        // setStep('analysis'); 
      } else {
        console.log('❌ Aucun fichier reçu');
      }
    },
  });

  const parseJobOffer = async () => {
    console.log('🔍 DÉBUT ANALYSE OFFRE');
    console.log('📝 Texte reçu:', jobOfferText.length, 'caractères');
    console.log('📝 Aperçu du texte:', jobOfferText.substring(0, 200) + '...');
    
    if (!jobOfferText.trim()) {
      console.log('❌ Texte vide');
      toast({
        title: 'Veuillez coller une offre d\'emploi',
        description: 'Le texte de l\'offre est requis pour continuer',
        variant: 'destructive',
      });
      return;
    }

    console.log('✅ Texte valide, début analyse...');
    setIsAnalyzing(true);
    
    try {
      console.log('📡 Appel à jobOfferService.analyzeJobOffer...');
      
      // Utiliser le vrai service d'analyse d'offre
      const analyzedOffer = await jobOfferService.analyzeJobOffer(jobOfferText);
      
      console.log('✅ Offre analysée avec succès !');
      console.log('📊 Résultat reçu:');
      console.log('  - Titre:', analyzedOffer.title);
      console.log('  - Entreprise:', analyzedOffer.company);
      console.log('  - Compétences:', analyzedOffer.skills);
      console.log('  - Type:', analyzedOffer.type);
      console.log('  - Localisation:', analyzedOffer.location);
      
      setParsedJobOffer(analyzedOffer);
      setStep('cv');
      
      toast({
        title: 'Offre analysée avec succès !',
        description: `${analyzedOffer.skills.length} compétences identifiées`,
      });
    } catch (error) {
      console.error('❌ Erreur analyse offre:', error);
      console.error('❌ Type d\'erreur:', error.constructor.name);
      console.error('❌ Message:', error.message);
      toast({
        title: 'Erreur lors de l\'analyse',
        description: 'Impossible de parser l\'offre d\'emploi',
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 Fin analyse offre');
      setIsAnalyzing(false);
    }
  };

  const analyzeCVAndMatch = async () => {
    console.log('🚀 FONCTION ANALYZE CV APPELÉE !');
    console.log('📋 État actuel :');
    console.log('  - cvFile:', cvFile ? cvFile.name : 'NULL');
    console.log('  - cvFile type:', cvFile ? cvFile.type : 'NULL');
    console.log('  - parsedJobOffer:', parsedJobOffer ? parsedJobOffer.title : 'NULL');
    console.log('  - isAnalyzing:', isAnalyzing);
    console.log('  - step:', step);
    
    if (!cvFile || !parsedJobOffer) {
      console.log('❌ Conditions non remplies');
      return;
    }

    setIsAnalyzing(true);
    setStep('analysis');
    
    try {
      console.log('🚀 Début de l\'analyse CV');
      console.log('📄 Fichier CV:', cvFile.name, cvFile.type, cvFile.size, 'bytes');
      console.log('💼 Offre parsée:', parsedJobOffer.title, 'chez', parsedJobOffer.company);
      
      console.log('✅ Test: Nous sommes dans le try block');

      // 1. Extraire le texte du PDF
      console.log('📖 Début extraction texte...');
      console.log('📄 Type de fichier détecté:', cvFile.type);
      
      if (cvFile.type !== 'application/pdf') {
        throw new Error('Type de fichier non supporté. Veuillez uploader un fichier PDF.');
      }
      
      console.log('📄 Traitement PDF avec pdfjs-dist');
      
      // Créer une URL pour le fichier
      console.log('🔗 Création URL objet pour le PDF...');
      const fileUrl = URL.createObjectURL(cvFile);
      console.log('🔗 URL créée:', fileUrl.substring(0, 50) + '...');
      
      // Charger le PDF
      console.log('📄 Chargement du document PDF...');
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      console.log('📄 PDF chargé avec succès !');
      console.log('📄 Nombre de pages:', pdf.numPages);
      
      // Extraire le texte de chaque page
      let fullText = '';
      console.log('📄 Début extraction texte des pages...');
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📄 Traitement page ${pageNum}/${pdf.numPages}...`);
        const page = await pdf.getPage(pageNum);
        console.log('📄 Page obtenue');
        
        const textContent = await page.getTextContent();
        console.log('📄 Contenu texte obtenu pour page', pageNum, textContent.items.length, 'items');
        
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        
        console.log('📄 Texte extrait page', pageNum, ':', pageText.substring(0, 100) + '...');
        fullText += pageText + '\n';
      }
      
      // Nettoyer l'URL
      console.log('📄 Nettoyage URL objet...');
      URL.revokeObjectURL(fileUrl);
      
      const cvText = fullText.trim();
      console.log('📝 Texte extrait, longueur:', cvText.length);
      console.log('📝 Aperçu du texte extrait:');
      console.log('--- DÉBUT TEXTE ---');
      console.log(cvText.substring(0, 500));
      console.log('--- FIN TEXTE ---');
      
      if (!cvText || cvText.trim().length === 0) {
        console.error('❌ Texte vide ou non extrait');
        throw new Error('Impossible d\'extraire le texte du CV');
      }
      
      console.log('✅ Extraction texte réussie !');

      // 2. Utiliser le parsing robuste avec fallback
      console.log('🔧 Début parsing robuste du CV...');
      
      let parsedCVData: CVParsed | null = null;
      
      try {
        // Créer le prompt système pour le parsing (comme dans UploadPage)
        const languageInstruction = 'Tu DOIS répondre UNIQUEMENT avec du JSON valide. Aucun texte, aucune explication, aucun commentaire avant ou après l\'objet JSON.';
        
        const systemPrompt = `Tu es une IA spécialisée dans l'analyse, l'extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

Ton rôle est de transformer le TEXTE BRUT d'un CV (de PDF, DOCX ou copier-coller) en un objet JSON structuré, propre et utilisable par une application web.

Tu agis comme un moteur de parsing intelligent, rigoureux et fiable, adapté au marché francophone.

${languageInstruction}

━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJECTIF PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━
À partir du texte brut d'un CV fourni en entrée :
- Identifier
- Extraire
- Classer
- Hiérarchiser
les informations du CV
ET
- Retourner UNIQUEMENT un objet JSON valide
- Respecter scrupuleusement la structure définie ci-dessous

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
   - Pas de texte
   - Pas d'explications
   - Pas de commentaires
   - Pas de markdown

2. 🔍 DONNÉES MANQUANTES
   - Si l'information n'est PAS trouvée dans le CV :
     - utilise une chaîne vide "" pour les champs texte
     - utilise un tableau vide [] pour les listes

3. 🧠 INTERPRÉTATION INTELLIGENTE
   - Tu dois reconnaître :
     - différentes langues (principalement français)
     - différentes structures de CV
     - différents noms de sections :
       - "Expérience Professionnelle", "Carrière", "Work Experience"
       - "Formation", "Études", "Education"
       - "Compétences", "Expertise", "Skills"
   - Tu dois regrouper logiquement les informations même si le CV est mal structuré

4. 🎯 PRÉCISION
   - Extrais uniquement les informations présentes dans le texte
   - Ne invente aucune information
   - Respecte la mise en forme des dates et numéros

CV à analyser :
━━━━━━━━━━━━━━━━━━━━━━
${cvText}`;

        // Utiliser directement geminiService pour le parsing
        console.log('📡 Appel direct à Gemini pour parsing...');
        parsedCVData = await geminiService.analyzeCV(cvText, systemPrompt);
        
        console.log('✅ Parsing robuste terminé !');
        console.log('📊 CV parsé:', parsedCVData);
        
        // Mettre à jour l'état pour les autres fonctions
        setParsedCV(parsedCVData);
        
      } catch (geminiError) {
        console.warn('⚠️ Erreur parsing Gemini, fallback au parsing basique:', geminiError);
        console.log('🔄 Utilisation du parsing basique en fallback...');
        
        // Fallback au parsing basique
        const basicCV = parseCVFromText(cvText);
        
        // Convertir en format CVParsed
        parsedCVData = {
          personalInfo: {
            firstName: basicCV.personalInfo?.firstName || '',
            lastName: basicCV.personalInfo?.lastName || '',
            email: basicCV.personalInfo?.email || '',
            phone: basicCV.personalInfo?.phone || '',
            city: basicCV.personalInfo?.city || '',
            country: basicCV.personalInfo?.country || '',
            summary: basicCV.personalInfo?.summary || ''
          },
          targetJob: basicCV.targetJob || '',
          experiences: basicCV.experiences || [],
          education: basicCV.education || [],
          skills: basicCV.skills || []
        };
        
        setParsedCV(parsedCVData);
        console.log('✅ Fallback basique terminé !');
        console.log('📊 CV parsé (fallback):', parsedCVData);
      }

      // 3. Effectuer le matching avec l'offre (utiliser parsedCVData)
      console.log('🎯 Début matching...');
      
      // S'assurer que parsedCVData est défini (soit par Gemini, soit par fallback)
      if (!parsedCVData) {
        throw new Error('CV non parsé - impossible de continuer');
      }
      
      console.log('📊 Données pour le matching:');
      console.log('  - CV skills:', parsedCVData.skills?.length || 0, 'compétences');
      console.log('  - CV experiences:', parsedCVData.experiences?.length || 0, 'expériences');
      console.log('  - Offer skills:', parsedJobOffer.skills?.length || 0, 'compétences requises');
      
      const matchResult = await cvMatchingService.analyzeMatching(parsedCVData, parsedJobOffer);
      console.log('✅ Matching effectué:');
      console.log('--- DÉBUT RÉSULTAT MATCHING ---');
      console.log(JSON.stringify(matchResult, null, 2));
      console.log('--- FIN RÉSULTAT MATCHING ---');

      // 4. Créer le résultat avec seulement le matching (pas de lettre/CV pour l'instant)
      const analysisResult: AnalysisResult = {
        matchScore: matchResult.matchScore,
        missingSkills: matchResult.missingSkills,
        relevantExperiences: matchResult.relevantExperiences,
        suggestions: matchResult.suggestions,
        optimizedCV: null,
        coverLetter: null,
        jobOffer: parsedJobOffer
      };
      
      console.log('🎉 Matching terminé, passage à results pour optimisation');
      console.log('--- DÉBUT RÉSULTAT MATCHING ---');
      console.log(JSON.stringify(analysisResult, null, 2));
      console.log('--- FIN RÉSULTAT MATCHING ---');
      
      setAnalysisResult(analysisResult);
      setStep('results'); // Aller aux résultats pour l'optimisation
      
      toast({
        title: 'Analyse terminée !',
        description: `Matching de ${matchResult.matchScore}% avec l'offre`,
      });
    } catch (error) {
      console.error('❌ Erreur analyse complète:', error);
      console.error('❌ Type d\'erreur:', error.constructor.name);
      console.error('❌ Message d\'erreur:', error.message);
      console.error('❌ Stack trace:', error.stack);
      
      toast({
        title: 'Erreur lors de l\'analyse',
        description: error instanceof Error ? error.message : 'Impossible d\'analyser votre CV',
        variant: 'destructive',
      });
    } finally {
      console.log('🏁 Fin de l\'analyse');
      setIsAnalyzing(false);
    }
  };

  // Wrapper pour tester si le bouton est cliqué
  const handleAnalyzeClick = () => {
    console.log('🔘 BOUTON ANALYSER CLIQUÉ !');
    console.log('🔘 cvFile:', cvFile ? cvFile.name : 'NULL');
    console.log('🔘 parsedJobOffer:', parsedJobOffer ? 'OK' : 'NULL');
    console.log('🔘 isAnalyzing:', isAnalyzing);
    console.log('🔘 step:', step);
    
    // Test direct sans wrapper
    if (!cvFile || !parsedJobOffer) {
      console.log('❌ Conditions non remplies dans handleAnalyzeClick');
      return;
    }
    
    console.log('✅ Conditions OK, appel de analyzeCVAndMatch');
    analyzeCVAndMatch();
  };

  /**
   * Parse un CV à partir du texte brut (fallback simple)
   */
  const parseCVFromText = (text: string): any => {
    console.log('🔧 DÉBUT PARSE CV FROM TEXT');
    console.log('📝 Texte reçu:', text.length, 'caractères');
    console.log('📝 Aperçu du texte à parser:');
    console.log('--- DÉBUT TEXTE À PARSER ---');
    console.log(text.substring(0, 300));
    console.log('--- FIN TEXTE À PARSER ---');
    
    const lines = text.split('\n');
    console.log('📄 Nombre de lignes:', lines.length);
    console.log('📄 10 premières lignes:', lines.slice(0, 10));
    
    const cvData: any = {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        summary: ''
      },
      targetJob: '',
      experiences: [],
      education: [],
      skills: []
    };

    console.log('🔍 Début extraction des informations...');

    // Extraction basique des informations
    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      console.log(`📄 Ligne ${index + 1}: "${line.substring(0, 50)}..."`);
      
      // Email
      const emailMatch = lowerLine.match(/\b[\w.-]+@[\w.-]+\.[a-z]{2,}/);
      if (emailMatch && !cvData.personalInfo.email) {
        console.log('📧 Email trouvé:', emailMatch[0]);
        cvData.personalInfo.email = emailMatch[0];
      }
      
      // Téléphone
      const phoneMatch = lowerLine.match(/\b(?:0[1-9](?:[ -]?\d{2,4})[ -]?\d{2,4}(?:\d{2,4})?)\b/);
      if (phoneMatch && !cvData.personalInfo.phone) {
        console.log('📞 Téléphone trouvé:', phoneMatch[0]);
        cvData.personalInfo.phone = phoneMatch[0];
      }
      
      // Nom (premier mot de la première ligne)
      if (!cvData.personalInfo.firstName && !cvData.personalInfo.lastName) {
        const firstLine = lines[0];
        const words = firstLine.trim().split(' ');
        if (words.length >= 2) {
          console.log('👤 Nom trouvé:', words[0], words.slice(1).join(' '));
          cvData.personalInfo.firstName = words[0];
          cvData.personalInfo.lastName = words.slice(1).join(' ');
        }
      }
      
      // Compétences (lignes contenant des mots-clés techniques)
      if (lowerLine.includes('compétences') || lowerLine.includes('skills')) {
        console.log('🔍 Ligne compétences détectée:', line);
        const skillsMatch = line.match(/(?:compétences|skills)\s*:?\s*(.+)/i);
        if (skillsMatch) {
          const skills = skillsMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
          console.log('🛠️ Compétences extraites:', skills);
          cvData.skills.push(...skills);
        }
      }
      
      // Expériences (lignes contenant des mots-clés)
      if (lowerLine.includes('expérience') || lowerLine.includes('experience')) {
        console.log('💼 Ligne expérience détectée:', line);
        const expMatch = line.match(/(\d{4}|\d{2})\s*[-–]\s*(.+)/);
        if (expMatch) {
          const parts = expMatch[1].split('[-–]');
          if (parts.length >= 2) {
            const title = parts[0].trim();
            const company = parts[1].trim();
            console.log('💼 Expérience trouvée:', title, 'chez', company);
            const exp = {
              title,
              company,
              location: '',
              startDate: '',
              endDate: '',
              description: line
            };
            cvData.experiences.push(exp);
          }
        }
      }
    });

    console.log('📝 Résultat du parsing:');
    console.log('--- DÉBUT RÉSULTAT PARSING ---');
    console.log(JSON.stringify(cvData, null, 2));
    console.log('--- FIN RÉSULTAT PARSING ---');
    console.log('🔧 FIN PARSE CV FROM TEXT');

    return cvData;
  };

  /**
   * Lance l'optimisation du CV et la génération de lettre
   */
  const handleOptimization = async () => {
    if (!parsedCV || !analysisResult || !parsedJobOffer) {
      toast({
        title: 'Erreur',
        description: 'Données manquantes pour l\'optimisation',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('🚀 Début optimisation CV et génération lettre...');
      
      // 1. Optimiser le CV avec l'IA
      console.log('⚡ Début optimisation CV avec Gemini...');
      const optimizedCV = await cvMatchingService.optimizeCVForJob(parsedCV, parsedJobOffer, {
        matchScore: analysisResult.matchScore,
        missingSkills: analysisResult.missingSkills,
        relevantExperiences: analysisResult.relevantExperiences,
        suggestions: analysisResult.suggestions,
        strengths: [], // Ces propriétés seront ajoutées par le service
        weaknesses: [],
        optimizedSummary: '',
        keyPoints: [],
        experienceAlignment: {
          matched: [],
          missing: []
        },
        skillsAlignment: {
          matched: [],
          missing: [],
          additional: []
        }
      });
      console.log('✅ CV optimisé par Gemini:');
      console.log('--- DÉBUT CV OPTIMISÉ ---');
      console.log(JSON.stringify(optimizedCV, null, 2));
      console.log('--- FIN CV OPTIMISÉ ---');

      // 2. Générer la lettre de motivation avec l'IA
      console.log('📝 Début génération lettre avec Gemini...');
      const coverLetter = await coverLetterService.generateCoverLetter(parsedCV, parsedJobOffer);
      console.log('✅ Lettre générée par Gemini:');
      console.log('--- DÉBUT LETTRE ---');
      console.log(JSON.stringify(coverLetter, null, 2));
      console.log('--- FIN LETTRE ---');

      // 3. Mettre à jour le résultat
      const updatedResult: AnalysisResult = {
        ...analysisResult,
        optimizedCV,
        coverLetter
      };
      
      setAnalysisResult(updatedResult);
      setStep('optimization');
      
      toast({
        title: 'Optimisation terminée !',
        description: 'Votre CV et votre lettre sont prêts',
      });
    } catch (error) {
      console.error('❌ Erreur optimisation:', error);
      toast({
        title: 'Erreur lors de l\'optimisation',
        description: error instanceof Error ? error.message : 'Impossible d\'optimiser vos documents',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToTemplateFormat = (optimizedCV: any): any => {
    return {
      personalInfo: {
        firstName: optimizedCV.personalInfo?.firstName || '',
        lastName: optimizedCV.personalInfo?.lastName || '',
        email: optimizedCV.personalInfo?.email || '',
        phone: optimizedCV.personalInfo?.phone || '',
        city: optimizedCV.personalInfo?.city || '',
        country: optimizedCV.personalInfo?.country || '',
        summary: optimizedCV.personalInfo?.summary || '',
        photo: '' // Pas de photo dans l'optimisation
      },
      targetJob: optimizedCV.targetJob || optimizedCV.personalInfo?.targetJob || '',
      experiences: (optimizedCV.experiences || []).map((exp: any, index: number) => ({
        id: exp.id || `exp-${index}`,
        title: exp.title || '',
        company: exp.company || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || ''
      })),
      education: (optimizedCV.education || []).map((edu: any, index: number) => ({
        id: edu.id || `edu-${index}`,
        degree: edu.degree || '',
        school: edu.school || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        description: edu.description || ''
      })),
      skills: optimizedCV.skills || [],
      template: selectedTemplate
    };
  };

  /**
   * Télécharge le CV optimisé avec le template choisi
   */
  const handleDownloadCV = async () => {
    if (!analysisResult?.optimizedCV) {
      toast({
        title: 'CV non disponible',
        description: 'Veuillez d\'abord optimiser votre CV',
        variant: 'destructive'
      });
      return;
    }

    try {
      toast({
        title: 'Génération PDF',
        description: 'Votre CV optimisé est en cours de génération...',
      });

      // Convertir les données au format template
      const templateData = convertToTemplateFormat(analysisResult.optimizedCV);
      
      // Générer le PDF avec le template choisi
      const pdfBlob = await generatePDFBlob(templateData);
      
      // Valider que nous avons bien un Blob
      if (!(pdfBlob instanceof Blob)) {
        console.error('❌ generatePDF n\'a pas retourné un Blob:', typeof pdfBlob);
        throw new Error('La génération du PDF a échoué');
      }
      
      console.log('✅ PDF Blob généré:', pdfBlob.size, 'bytes');
      
      // Télécharger le PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_Optimise_${templateData.personalInfo.firstName}_${templateData.personalInfo.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: '✅ CV téléchargé !',
        description: 'Votre CV optimisé a été téléchargé avec succès',
      });

    } catch (error) {
      console.error('❌ Erreur téléchargement CV:', error);
      toast({
        title: 'Erreur de téléchargement',
        description: 'Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Télécharge la lettre de motivation en PDF
   */
  const handleDownloadLetter = async () => {
    if (!analysisResult?.coverLetter) {
      toast({
        title: 'Lettre non disponible',
        description: 'Veuillez d\'abord générer votre lettre de motivation',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await downloadCoverLetter(analysisResult.coverLetter);
      toast({
        title: 'Lettre téléchargée',
        description: 'Votre lettre de motivation a été téléchargée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur de téléchargement',
        description: 'Impossible de télécharger la lettre de motivation',
        variant: 'destructive',
      });
    }
  };

  /**
   * Télécharge le dossier complet
   */
  const handleDownloadAll = async () => {
    if (!analysisResult?.optimizedCV || !analysisResult?.coverLetter) {
      toast({
        title: 'Documents incomplets',
        description: 'Veuillez d\'abord optimiser votre CV et générer votre lettre',
        variant: 'destructive'
      });
      return;
    }

    try {
      toast({
        title: 'Téléchargement complet',
        description: 'Votre dossier de candidature est en cours de préparation...',
      });

      // Générer le PDF du CV optimisé
      const templateData = convertToTemplateFormat(analysisResult.optimizedCV);
      const pdfBlob = await generatePDFBlob(templateData);
      
      // Créer le fichier de lettre de motivation
      const letterContent = analysisResult.coverLetter;
      const letterBlob = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
      
      // Créer un ZIP avec les deux fichiers
      const JSZip = await import('jszip');
      const zip = new JSZip.default();
      
      // Ajouter les fichiers au ZIP
      zip.file(`CV_${parsedCV?.personalInfo.firstName}_${parsedCV?.personalInfo.lastName}.pdf`, pdfBlob);
      zip.file(`Lettre_Motivation_${parsedCV?.personalInfo.firstName}_${parsedCV?.personalInfo.lastName}.txt`, letterBlob);
      
      // Générer le ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Télécharger le ZIP
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dossier_Candidature_${parsedCV?.personalInfo.firstName}_${parsedCV?.personalInfo.lastName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: '✅ Téléchargement réussi !',
        description: 'Votre dossier complet (CV + lettre) a été téléchargé',
      });

    } catch (error) {
      console.error('❌ Erreur téléchargement dossier:', error);
      toast({
        title: 'Erreur de téléchargement',
        description: 'Une erreur est survenue lors de la préparation du dossier',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-[#0a1628] to-navy-deep relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-bright/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-4"
          >
            <LanguageSwitcher />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 via-blue-bright/15 to-primary/20 border-2 border-primary/30 mb-6 shadow-xl shadow-primary/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Target className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm font-bold text-primary tracking-wide">Postuler Intelligemment</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-primary to-blue-bright bg-clip-text text-transparent mb-4 leading-tight"
          >
            Postulez à n'importe quelle<br />
            <span className="text-gradient">offre d'emploi</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Notre IA analyse l'offre, optimise votre CV et génère une lettre de motivation parfaite<br />
            pour maximiser vos chances de recrutement.
          </motion.p>
        </div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center mb-8 sm:mb-12 px-2 sm:px-4"
        >
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 overflow-x-auto">
            {[
              { id: 'offer', label: 'Offre', icon: Briefcase },
              { id: 'cv', label: 'CV', icon: FileText },
              { id: 'analysis', label: 'Analyse', icon: Sparkles },
              { id: 'results', label: 'Résultats', icon: Award },
              { id: 'optimization', label: 'Optimisation', icon: Sparkles },
            ].map((item, index) => (
              <div key={item.id} className="flex items-center flex-shrink-0">
                <motion.div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 md:w-12 rounded-full border-2 transition-all duration-300 ${
                    step === item.id 
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50' 
                      : (step === 'optimization' && index < 4) || (step === 'results' && index < 3)
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-background/50 border-border text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-3 h-3 sm:w-4 md:w-5" />
                </motion.div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                  step === item.id ? 'text-primary' : 
                  (step === 'optimization' && index < 4) || (step === 'results' && index < 3) ? 'text-green-500' : 'text-muted-foreground'
                } hidden md:inline`}>
                  {item.label}
                </span>
                {index < 4 && (
                  <div className={`w-1 sm:w-2 md:w-8 h-0.5 mx-0.5 sm:mx-1 md:mx-4 ${
                    (step === 'optimization' && index < 4) || (step === 'results' && index < 3) ? 'bg-green-500' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          {/* Step 1: Job Offer */}
          <AnimatePresence mode="wait">
            {step === 'offer' && (
              <motion.div
                key="offer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6 mx-2 sm:mx-0"
              >
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-bright to-primary flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
                      Collez l'offre d'emploi
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg">
                      Copiez-collez le texte complet de l'offre pour laquelle vous voulez postuler
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                    <div className="relative">
                      <Textarea
                        id="job-offer-text"
                        name="jobOfferText"
                        placeholder="Collez ici le texte complet de l'offre d'emploi...

Exemple :
Nous recherchons un Développeur Full Stack Senior pour rejoindre notre équipe TechCorp. Vous serez responsable du développement de nos applications web modernes...

Compétences requises :
- React, Node.js, MongoDB
- 5+ ans d'expérience
- Anglais courant"
                        value={jobOfferText}
                        onChange={(e) => setJobOfferText(e.target.value)}
                        className="min-h-[300px] resize-none border-border/50 bg-background/50 focus:border-primary transition-all duration-200"
                      />
                      
                      {jobOfferText && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {jobOfferText.length} caractères
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={parseJobOffer}
                        disabled={!jobOfferText.trim() || isAnalyzing}
                        className="flex-1 h-14 bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyse en cours...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analyser l'offre
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.readText().then(text => {
                            setJobOfferText(text);
                            toast({
                              title: 'Texte collé',
                              description: 'L\'offre a été collée depuis votre presse-papiers',
                            });
                          });
                        }}
                        className="h-14 border-border/50 hover:border-primary/50"
                      >
                        <Clipboard className="w-5 h-5 mr-2" />
                        Coller depuis presse-papiers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2: CV Upload */}
          <AnimatePresence mode="wait">
            {step === 'cv' && (
              <motion.div
                key="cv"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6 mx-2 sm:mx-0"
              >
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardHeader className="text-center pb-6 sm:pb-8 px-4 sm:px-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
                      Téléchargez votre CV
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg">
                      Uploadez votre CV actuel pour l'optimiser selon l'offre
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Job Offer Summary */}
                  {parsedJobOffer && (
                    <div className="px-4 sm:px-6 sm:px-8 pb-4 sm:pb-6">
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                          <span className="font-semibold text-blue-500 text-sm sm:text-base">{parsedJobOffer.company}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold mb-2">{parsedJobOffer.title}</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {parsedJobOffer.skills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {parsedJobOffer.skills.length > 5 && (
                            <Badge variant="secondary" className="text-xs">+{parsedJobOffer.skills.length - 5}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-200 ${
                        isDragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      <input {...getInputProps()} />
                      
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-bright/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                      </div>
                      
                      <div className="space-y-1 sm:space-y-2">
                        <p className="text-base sm:text-lg font-medium">
                          {isDragActive ? 'Lâchez votre CV ici...' : 'Glissez-déposez votre CV ici'}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          ou cliquez pour sélectionner un fichier
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          PDF uniquement • Maximum 10MB
                        </p>
                      </div>
                      
                      <Button variant="outline" className="mt-3 sm:mt-4 text-sm sm:text-base">
                        <FileText className="w-4 h-4 mr-2" />
                        Choisir un fichier
                      </Button>
                    </div>

                    {cvFile && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium">{cvFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCvFile(null)}
                          >
                            Changer
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAnalyzeClick}
                      disabled={!cvFile || isAnalyzing}
                      className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyse et matching en cours...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Analyser et optimiser
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Analysis */}
          <AnimatePresence mode="wait">
            {step === 'analysis' && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl max-w-md mx-auto">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center space-y-6">
                      {/* Animation moderne */}
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Target className="w-10 h-10 text-white" />
                          </motion.div>
                        </div>
                        
                        {/* Cercles d'animation */}
                        <motion.div
                          className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-blue-500/30"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 w-20 h-20 rounded-2xl border-2 border-purple-500/30"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        />
                      </div>
                      
                      {/* Texte principal */}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">
                          Analyse en cours...
                        </h3>
                        <p className="text-muted-foreground max-w-xs">
                          Notre IA analyse votre CV et l'offre pour créer le matching parfait
                        </p>
                      </div>
                      
                      {/* Barres de progression */}
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Analyse de l'offre</span>
                          <motion.div
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-16 h-2 bg-blue-500 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Parsing du CV</span>
                          <motion.div
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                            className="w-16 h-2 bg-purple-500 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Matching IA</span>
                          <motion.div
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 2.5, ease: "easeOut", delay: 1 }}
                            className="w-16 h-2 bg-green-500 rounded-full"
                          />
                        </div>
                      </div>
                      
                      {/* Points d'animation */}
                      <div className="flex justify-center space-x-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              ease: "easeInOut",
                              delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-primary rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 4: Results */}
          <AnimatePresence mode="wait">
            {step === 'results' && analysisResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Match Score */}
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      {/* Couleur et icône selon le score */}
                      {analysisResult.matchScore >= 70 ? (
                        <>
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Award className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-3xl font-bold mb-2 text-green-600">
                            Matching de {analysisResult.matchScore}%
                          </h3>
                          <p className="text-muted-foreground">
                            Votre profil correspond très bien à cette offre !
                          </p>
                        </>
                      ) : analysisResult.matchScore >= 40 ? (
                        <>
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <TrendingUp className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-3xl font-bold mb-2 text-yellow-600">
                            Matching de {analysisResult.matchScore}%
                          </h3>
                          <p className="text-muted-foreground">
                            Votre profil correspond partiellement à cette offre.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <XCircle className="w-12 h-12 text-white" />
                          </div>
                          <h3 className="text-3xl font-bold mb-2 text-red-600">
                            Matching de {analysisResult.matchScore}%
                          </h3>
                          <p className="text-muted-foreground">
                            Votre profil ne correspond pas à cette offre.
                          </p>
                        </>
                      )}
                      
                      {/* Barre de progression avec couleur selon score */}
                      <div className="w-full bg-background/50 rounded-full h-3 mt-6 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            analysisResult.matchScore >= 70 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : analysisResult.matchScore >= 40
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisResult.matchScore}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Message spécial pour les profils incompatibles */}
                {(() => {
                  console.log('🔍 Debug score:', analysisResult.matchScore);
                  console.log('🔍 Condition < 30:', analysisResult.matchScore < 30);
                  console.log('🔍 Condition >= 30:', analysisResult.matchScore >= 30);
                  return analysisResult.matchScore < 30;
                })() && (
                  <Card className="bg-background/95 backdrop-blur-xl border-red-500/50 shadow-2xl mx-2 sm:mx-0">
                    <CardContent className="p-6 sm:p-8">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-red-600">
                            Cette offre ne vous correspond pas
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground mb-4">
                            Les compétences requises pour ce poste sont très différentes de celles que vous possédez. 
                            Il ne serait pas pertinent de postuler pour cette offre.
                          </p>
                          
                          {/* Compétences manquantes critiques */}
                          {analysisResult.missingSkills && analysisResult.missingSkills.length > 0 && (
                            <div className="text-left bg-red-50 dark:bg-red-950/20 rounded-lg p-4 mb-4">
                              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                                Compétences manquantes critiques :
                              </h4>
                              <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                                {analysisResult.missingSkills.map((skill, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    <span>{skill}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                                <p className="text-xs text-red-500 italic">
                                  {analysisResult.matchScore < 30 
                                    ? "Aucune compétence correspondante trouvée"
                                    : `${analysisResult.skillsAlignment?.matched?.length || 0} compétences sur ${analysisResult.missingSkills.length + (analysisResult.skillsAlignment?.matched?.length || 0)} correspondent`
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Explications des faiblesses */}
                          {analysisResult.weaknesses && analysisResult.weaknesses.length > 0 && (
                            <div className="text-left bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 mb-4">
                              <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">
                                Pourquoi ça ne correspond pas :
                              </h4>
                              <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                                {analysisResult.weaknesses.map((weakness, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Suggestions réalistes */}
                          <div className="text-left bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                              Que faire maintenant ?
                            </h4>
                            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">🔍</span>
                                <span>Cherchez des offres plus alignées avec vos compétences en {analysisResult.skillsAlignment?.matched?.[0] || 'développement'}</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">📚</span>
                                <span>Formez-vous sur les compétences manquantes si ce poste vous intéresse vraiment</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">💼</span>
                                <span>Mettez en avant vos forces dans des offres qui correspondent à votre profil</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setStep('offer');
                            setJobOfferText('');
                            setAnalysisResult(null);
                          }}
                          className="mt-4"
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Trouver une autre offre
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Suggestions et optimisations seulement si score >= 30 */}
                {(() => {
                  console.log('🔍 Debug optimisation - score:', analysisResult.matchScore);
                  console.log('🔍 Debug optimisation - condition >= 30:', analysisResult.matchScore >= 30);
                  return analysisResult.matchScore >= 30;
                })() && (
                  <>
                    {/* Suggestions */}
                    <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl mx-2 sm:mx-0">
                      <CardHeader className="px-4 sm:px-6 md:px-8">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                          Suggestions pour améliorer votre candidature
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 px-4 sm:px-6 md:px-8">
                        {analysisResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{suggestion}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Bouton d'optimisation */}
                    <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl mx-2 sm:mx-0">
                      <CardContent className="p-6 sm:p-8">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold mb-2">
                            Prêt à optimiser votre candidature ?
                          </h3>
                          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                            Notre IA va optimiser votre CV et générer une lettre de motivation personnalisée pour cette offre.
                          </p>
                          <Button
                            onClick={handleOptimization}
                            disabled={isAnalyzing}
                            className="h-12 sm:h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-sm sm:text-base"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                                Optimisation en cours...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Optimiser mon CV & Lettre
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Download Options - seulement si profil compatible ET optimisation terminée */}
                    {false && analysisResult.matchScore >= 30 && (
                      <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-primary" />
                            Téléchargez vos documents
                          </CardTitle>
                          <CardDescription>
                            Votre CV optimisé et votre lettre de motivation sont prêts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button
                              onClick={handleDownloadCV}
                              className="h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                            >
                              <FileText className="w-5 h-5 mr-2" />
                              Télécharger le CV optimisé
                            </Button>
                            
                            <Button
                              onClick={handleDownloadLetter}
                              className="h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50"
                            >
                              <FileText className="w-5 h-5 mr-2" />
                              Lettre de Motivation
                            </Button>
                            
                            <Button
                              onClick={handleDownloadAll}
                              className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50"
                            >
                              <Download className="w-5 h-5 mr-2" />
                              Dossier Complet
                            </Button>
                          </div>

                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              onClick={() => setShowPreview(!showPreview)}
                              className="border-border/50 hover:border-primary/50"
                            >
                              <Eye className="w-5 h-5 mr-2" />
                              {showPreview ? 'Masquer' : 'Voir'} l'aperçu
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Preview */}
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                        <CardHeader>
                          <CardTitle>Aperçu des documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">CV Optimisé</h4>
                              <div className="bg-background/50 border border-border/30 rounded-lg p-4 h-64 flex items-center justify-center text-muted-foreground">
                                Aperçu du CV...
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Lettre de Motivation</h4>
                              <div className="bg-background/50 border border-border/30 rounded-lg p-4 h-64 overflow-y-auto">
                                <p className="text-sm whitespace-pre-wrap">
                                  {typeof analysisResult.coverLetter === 'object' 
                                    ? analysisResult.coverLetter.body || 'Lettre de motivation générée...'
                                    : analysisResult.coverLetter
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 5: Optimization */}
          <AnimatePresence mode="wait">
            {step === 'optimization' && analysisResult && (
              <motion.div
                key="optimization"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Success Message */}
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold mb-2 text-green-600">
                        Optimisation terminée !
                      </h3>
                      <p className="text-muted-foreground">
                        Votre CV et votre lettre de motivation sont prêts pour être téléchargés.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Template Selection */}
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <FileText className="w-5 h-5 text-primary" />
                      Choisissez votre template de CV
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Sélectionnez le design qui correspond le mieux à votre style
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    {/* Mobile: Horizontal scroll */}
                    <div className="sm:hidden">
                      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
                        {[
                          { id: 'professional', name: 'Professionnel', description: 'Classique et élégant' },
                          { id: 'modern', name: 'Moderne', description: 'Design contemporain' },
                          { id: 'creative', name: 'Créatif', description: 'Original et dynamique' },
                        ].map((template) => (
                          <div
                            key={template.id}
                            className={`flex-shrink-0 w-64 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 snap-center ${
                              selectedTemplate === template.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="font-semibold text-center">{template.name}</h4>
                            <p className="text-sm text-muted-foreground text-center">{template.description}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center gap-2 mt-2">
                        {[
                          { id: 'professional', name: 'Professionnel', description: 'Classique et élégant' },
                          { id: 'modern', name: 'Moderne', description: 'Design contemporain' },
                          { id: 'creative', name: 'Créatif', description: 'Original et dynamique' },
                        ].map((template, index) => (
                          <button
                            key={template.id}
                            className={`w-2 h-2 rounded-full transition-all ${
                              selectedTemplate === template.id
                                ? 'bg-primary w-6'
                                : 'bg-border'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Desktop: Grid normal */}
                    <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: 'professional', name: 'Professionnel', description: 'Classique et élégant' },
                        { id: 'modern', name: 'Moderne', description: 'Design contemporain' },
                        { id: 'creative', name: 'Créatif', description: 'Original et dynamique' },
                      ].map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedTemplate === template.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="font-semibold text-center">{template.name}</h4>
                          <p className="text-sm text-muted-foreground text-center">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Download Options */}
                <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-primary" />
                      Téléchargez vos documents
                    </CardTitle>
                    <CardDescription>
                      Votre CV optimisé et votre lettre de motivation sont prêts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        onClick={handleDownloadCV}
                        className="h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Télécharger le CV optimisé
                      </Button>
                      
                      <Button
                        onClick={handleDownloadLetter}
                        className="h-14 bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Lettre de Motivation
                      </Button>
                      
                      <Button
                        onClick={handleDownloadAll}
                        className="h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Dossier Complet
                      </Button>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowPreview(!showPreview)}
                        className="border-border/50 hover:border-primary/50"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        {showPreview ? 'Masquer' : 'Voir'} l'aperçu
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview - seulement à l'étape optimization */}
                {step === 'optimization' && (
                  <AnimatePresence>
                    {showPreview && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
                          <CardHeader>
                            <CardTitle>Aperçu des documents</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-2">CV Optimisé ({selectedTemplate})</h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
                                  {analysisResult.optimizedCV ? (
                                    <div className="scale-[0.3] origin-top-left w-[200%] h-[200%] relative">
                                      {selectedTemplate === 'professional' && (
                                        <ProfessionalTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                      {selectedTemplate === 'modern' && (
                                        <ModernTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                      {selectedTemplate === 'creative' && (
                                        <CreativeTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                      {selectedTemplate === 'minimal' && (
                                        <MinimalTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                      {selectedTemplate === 'executive' && (
                                        <ExecutiveTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                      {!['professional', 'modern', 'creative', 'minimal', 'executive'].includes(selectedTemplate) && (
                                        <ProfessionalTemplate data={convertToTemplateFormat(analysisResult.optimizedCV)} />
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      CV non optimisé
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Lettre de Motivation</h4>
                                <div className="bg-white border border-gray-200 rounded-lg p-4 h-64 overflow-y-auto">
                                  {analysisResult.coverLetter && typeof analysisResult.coverLetter === 'object' ? (
                                    <div className="text-xs">
                                      <div className="text-center mb-3">
                                        <div className="font-bold">{analysisResult.coverLetter.candidateName}</div>
                                        <div className="text-gray-600">{analysisResult.coverLetter.candidateAddress}</div>
                                        <div className="text-gray-600">{analysisResult.coverLetter.candidatePhone}</div>
                                        <div className="text-gray-600">{analysisResult.coverLetter.candidateEmail}</div>
                                      </div>
                                      
                                      <div className="text-center mb-3">
                                        <div className="font-bold">{analysisResult.coverLetter.companyName}</div>
                                        <div className="text-gray-600">{analysisResult.coverLetter.companyAddress}</div>
                                      </div>
                                      
                                      <div className="mb-3 text-center">
                                        <div className="text-sm">{analysisResult.coverLetter.date}</div>
                                        <div className="font-semibold text-sm">{analysisResult.coverLetter.subject}</div>
                                      </div>
                                      
                                      <div className="mb-3">
                                        <div className="mb-2">Madame, Monsieur,</div>
                                        <div className="mb-2">{analysisResult.coverLetter.introduction}</div>
                                        <div className="mb-2 whitespace-pre-wrap">{analysisResult.coverLetter.body}</div>
                                        <div className="mb-2">{analysisResult.coverLetter.conclusion}</div>
                                        <div>{analysisResult.coverLetter.signature}</div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      Lettre non générée
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// softt
export default ApplyPage;
