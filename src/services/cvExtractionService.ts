import { geminiService } from './gemini';

/**
 * Interface pour les données extraites d'un CV
 * IMPORTANT: Doit correspondre EXACTEMENT au format du CV Builder
 */
export interface ExtractedCVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    summary: string;
    photo?: string;
  };
  targetJob: string;
  experiences: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: string[];
}

/**
 * Service d'extraction de CV depuis PDF/Word avec IA
 */
class CVExtractionService {
  /**
   * Extrait les données d'un CV depuis un fichier PDF ou Word
   * @param file - Fichier CV (PDF ou Word)
   * @returns Données extraites au format CVData
   */
  async extractFromFile(file: File): Promise<ExtractedCVData> {
    try {
      console.log('📄 Extraction CV depuis fichier:', file.name);
      console.log('📄 Type:', file.type);
      console.log('📄 Taille:', (file.size / 1024).toFixed(2), 'KB');

      // 1. Convertir le fichier en texte
      const cvText = await this.fileToText(file);
      
      if (!cvText || cvText.trim().length < 50) {
        throw new Error('Le fichier ne contient pas assez de texte exploitable');
      }

      console.log('✅ Texte extrait:', cvText.substring(0, 200) + '...');

      // 2. Extraire les données structurées avec Gemini
      const extractedData = await this.extractDataWithAI(cvText);

      console.log('✅ Données extraites avec succès');
      return extractedData;

    } catch (error) {
      console.error('❌ Erreur extraction CV:', error);
      throw error;
    }
  }

  /**
   * Extrait les données de plusieurs CV en batch
   * @param files - Liste de fichiers CV
   * @returns Liste des données extraites avec statut
   */
  async extractMultiple(files: File[]): Promise<{
    success: ExtractedCVData[];
    failed: { file: string; error: string }[];
  }> {
    console.log(`📦 Extraction batch de ${files.length} CV...`);

    const results = await Promise.allSettled(
      files.map(file => this.extractFromFile(file))
    );

    const success: ExtractedCVData[] = [];
    const failed: { file: string; error: string }[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        success.push(result.value);
      } else {
        failed.push({
          file: files[index].name,
          error: result.reason?.message || 'Erreur inconnue'
        });
      }
    });

    console.log(`✅ Extraction terminée: ${success.length} succès, ${failed.length} échecs`);

    return { success, failed };
  }

  /**
   * Convertit un fichier (PDF ou Word) en texte
   */
  private async fileToText(file: File): Promise<string> {
    // Pour l'instant, on simule l'extraction de texte
    // TODO: Implémenter l'extraction réelle avec pdf.js ou mammoth.js
    
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword'
    ) {
      return this.extractTextFromWord(file);
    } else {
      throw new Error('Format de fichier non supporté. Utilisez PDF ou Word.');
    }
  }

  /**
   * Extrait le texte d'un PDF
   */
  private async extractTextFromPDF(file: File): Promise<string> {
    // TODO: Utiliser pdf.js pour extraire le texte
    // Pour l'instant, on retourne un placeholder
    console.warn('⚠️ Extraction PDF non implémentée, utilisation de données de test');
    
    return `
      CURRICULUM VITAE
      
      Prénom Nom: Jean Dupont
      Email: jean.dupont@email.com
      Téléphone: +221 77 123 45 67
      Ville: Dakar
      Pays: Sénégal
      
      RÉSUMÉ PROFESSIONNEL
      Développeur Full Stack avec 5 ans d'expérience en React, Node.js et TypeScript.
      Passionné par la création d'applications web performantes et scalables.
      
      EXPÉRIENCE PROFESSIONNELLE
      
      Senior Developer - Tech Solutions SARL
      Dakar, Sénégal
      Janvier 2021 - Présent
      - Développement d'applications web avec React et TypeScript
      - Architecture de solutions backend avec Node.js
      - Mentorat de développeurs juniors
      
      Developer - StartupXYZ
      Dakar, Sénégal
      Mars 2019 - Décembre 2020
      - Création de features frontend avec React
      - Intégration d'APIs REST
      
      FORMATION
      
      Master en Informatique
      Université Cheikh Anta Diop
      Dakar, Sénégal
      2017 - 2019
      Spécialisation en développement web et mobile
      
      COMPÉTENCES
      React, TypeScript, Node.js, MongoDB, PostgreSQL, Git, Docker, AWS
    `;
  }

  /**
   * Extrait le texte d'un document Word
   */
  private async extractTextFromWord(file: File): Promise<string> {
    // TODO: Utiliser mammoth.js pour extraire le texte
    console.warn('⚠️ Extraction Word non implémentée, utilisation de données de test');
    return this.extractTextFromPDF(file); // Placeholder
  }

  /**
   * Extrait les données structurées depuis le texte brut avec Gemini
   */
  private async extractDataWithAI(cvText: string): Promise<ExtractedCVData> {
    const prompt = `
Tu es un expert en analyse de CV. Extrais TOUTES les informations du CV suivant et retourne un JSON structuré.

IMPORTANT: Le JSON doit correspondre EXACTEMENT à cette structure:

{
  "personalInfo": {
    "firstName": "string - Prénom",
    "lastName": "string - Nom de famille",
    "email": "string - Email",
    "phone": "string - Téléphone avec indicatif pays",
    "city": "string - Ville",
    "country": "string - Pays",
    "summary": "string - Résumé professionnel (2-3 phrases)"
  },
  "targetJob": "string - Poste recherché ou titre professionnel principal",
  "experiences": [
    {
      "title": "string - Titre du poste",
      "company": "string - Nom de l'entreprise",
      "location": "string - Ville, Pays",
      "startDate": "string - Date début (format: Mois AAAA)",
      "endDate": "string - Date fin (format: Mois AAAA ou 'Présent')",
      "description": "string - Description des responsabilités et réalisations"
    }
  ],
  "education": [
    {
      "degree": "string - Diplôme obtenu",
      "school": "string - Nom de l'établissement",
      "location": "string - Ville, Pays",
      "startDate": "string - Date début (format: AAAA)",
      "endDate": "string - Date fin (format: AAAA)",
      "description": "string - Spécialisation ou détails"
    }
  ],
  "skills": ["string - Compétence 1", "string - Compétence 2", ...]
}

RÈGLES D'EXTRACTION:
- Extrais TOUTES les informations disponibles
- Pour les dates, utilise le format "Mois AAAA" (ex: "Janvier 2021")
- Si une information manque, utilise une chaîne vide ""
- Pour le résumé, crée un résumé professionnel de 2-3 phrases si absent
- Pour targetJob, déduis le poste principal depuis l'expérience la plus récente
- Extrais TOUTES les compétences techniques et soft skills
- Trie les expériences de la plus récente à la plus ancienne
- Trie les formations de la plus récente à la plus ancienne

TEXTE DU CV:
${cvText}

RETOURNE UNIQUEMENT LE JSON, SANS TEXTE AVANT OU APRÈS.
`;

    try {
      const response = await geminiService.generateRawResponse(prompt);
      
      // Nettoyer et parser le JSON
      let jsonString = response.trim();
      
      // Retirer les balises markdown si présentes
      const jsonMatch = jsonString.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else {
        jsonString = jsonString.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      const extractedData = JSON.parse(jsonString) as ExtractedCVData;
      
      // Validation basique
      if (!extractedData.personalInfo?.firstName || !extractedData.personalInfo?.lastName) {
        throw new Error('Données personnelles incomplètes');
      }
      
      return extractedData;
      
    } catch (error) {
      console.error('❌ Erreur extraction IA:', error);
      throw new Error('Impossible d\'extraire les données du CV avec l\'IA');
    }
  }
}

export const cvExtractionService = new CVExtractionService();
