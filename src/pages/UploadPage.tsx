import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, AlertTriangle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { AnalysisAnimation } from '@/components/AnalysisAnimation';
import * as pdfjsLib from 'pdfjs-dist';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
  }
  return textContent;
};

const UploadPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (data: any) => {
    navigate('/builder', { state: { uploadedData: data } });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const systemPrompt = `Tu es une IA spécialisée dans l’analyse, l’extraction et la structuration de CV pour une application de carrière appelée Studyia Career.

Ton rôle est de transformer le TEXTE BRUT d’un CV (issu d’un PDF, DOCX ou copier-coller) en un objet JSON structuré, propre et exploitable par une application web.

Tu agis comme un moteur de parsing intelligent, rigoureux et fiable, adapté au marché francophone.

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

    try {
      let cvText = '';
      if (file.type === 'application/pdf') {
        cvText = await extractTextFromPDF(file);
      } else {
        // Placeholder for DOCX processing if needed in the future
        throw new Error('DOCX files are not supported in this version. Please upload a PDF.');
      }

      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenRouter API key is not configured.');
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8080/", // Required by OpenRouter for free-tier users
          "X-Title": "Studyia Career CV Builder"      // Required by OpenRouter for free-tier users
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free", // Or any other suitable model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Here is the CV text to analyze:\n\n${cvText}` }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze CV via API.');
      }

      const result = await response.json();
      const rawContent = result.choices[0].message.content;
      
      // Find the start and end of the JSON object
      const jsonStart = rawContent.indexOf('{');
      const jsonEnd = rawContent.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON object found in the AI response.');
      }

      const jsonString = rawContent.substring(jsonStart, jsonEnd);
      const data = JSON.parse(jsonString);

      toast({
        title: 'CV Analysé !',
        description: 'Les informations ont été extraites avec succès.',
      });
      handleUploadSuccess(data);
    } catch (err) {
      console.error("Upload and analysis error:", err);
      const userMessage = "Une erreur est survenue lors de l'analyse du CV. Veuillez réessayer.";
      setError(userMessage);
      toast({
        title: 'Erreur d\'analyse',
        description: userMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-lg">
        <div className="bg-background p-8 rounded-xl shadow-lg border border-border">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Mettez à jour votre CV</h1>
            <p className="text-muted-foreground mt-2">Importez votre CV actuel (PDF ou DOCX) et notre IA pré-remplira le formulaire pour vous.</p>
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
                <p className="font-semibold -mt-8">Analyse de votre CV en cours...</p>
                <p className="text-sm text-muted-foreground">Veuillez patienter, cela peut prendre un instant.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <UploadCloud className="w-12 h-12 mb-4" />
                <p className="font-semibold">Glissez-déposez votre CV ici</p>
                <p className="text-sm">ou cliquez pour sélectionner un fichier</p>
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
    </div>
  );
};

export default UploadPage;
