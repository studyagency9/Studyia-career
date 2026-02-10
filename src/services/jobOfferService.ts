import { z } from 'zod';

// Types pour l'offre d'emploi
export interface JobOffer {
  title: string;
  company: string;
  location: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Freelance' | 'Temps partiel';
  salary?: string;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  contact?: {
    email?: string;
    phone?: string;
    person?: string;
  };
  deadline?: string;
  remotePolicy?: 'Présentiel' | 'Télétravail' | 'Hybride';
}

// Schéma de validation pour l'offre d'emploi
export const JobOfferSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  location: z.string().min(1, "La localisation est requise"),
  type: z.enum(['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Temps partiel']),
  salary: z.string().optional(),
  description: z.string().min(1, "La description est requise"),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  benefits: z.array(z.string()),
  contact: z.object({
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    person: z.string().optional().nullable(),
  }).optional(),
  deadline: z.string().optional(),
  remotePolicy: z.enum(['Présentiel', 'Télétravail', 'Hybride']).optional(),
});

export type JobOfferParsed = z.infer<typeof JobOfferSchema>;

class JobOfferService {
  /**
   * Analyse une offre d'emploi avec Gemini API
   */
  async analyzeJobOffer(jobOfferText: string): Promise<JobOffer> {
    const systemPrompt = `Tu es un expert en analyse d'offres d'emploi, spécialisé dans le marché francophone. Ton rôle est d'analyser le texte brut d'une offre d'emploi et d'en extraire les informations structurées de manière précise et complète.

RÈGLES D'ANALYSE :
━━━━━━━━━━━━━━━━━━━━━━
1.  **Précision** : Extrais uniquement les informations présentes dans le texte
2.  **Structure** : Respecte scrupuleusement le format JSON demandé
3.  **Langue** : Conserve les termes en français tels quels
4.  **Complétude** : Ne laisse aucun champ vide si l'information est présente
5.  **Qualité** : Nettoie le texte des artefacts de mise en forme

FORMAT DE SORTIE OBLIGATOIRE :
━━━━━━━━━━━━━━━━━━━━━━
Tu dois retourner UNIQUEMENT un objet JSON valide, sans aucun texte avant ou après.

{
  "title": "Titre exact du poste",
  "company": "Nom de l'entreprise",
  "location": "Ville, Pays ou Région",
  "type": "CDI|CDD|Stage|Alternance|Freelance|Temps partiel",
  "salary": "Salaire ou fourchette telle qu'indiquée",
  "description": "Description complète et détaillée du poste",
  "requirements": [
    "Exigence 1",
    "Exigence 2"
  ],
  "skills": [
    "Compétence technique 1",
    "Compétence technique 2"
  ],
  "benefits": [
    "Avantage 1",
    "Avantage 2"
  ],
  "contact": {
    "email": "email@example.com",
    "phone": "01 23 45 67 89",
    "person": "Nom du contact"
  },
  "deadline": "Date limite de candidature",
  "remotePolicy": "Présentiel|Télétravail|Hybride"
}

INSTRUCTIONS SPÉCIFIQUES :
━━━━━━━━━━━━━━━━━━━━━━
- **title** : Titre principal du poste, pas de liste
- **company** : Nom exact de l'entreprise
- **location** : Sois précis (ville + pays si possible)
- **type** : Choisis le type le plus approprié (UNE SEULE VALEUR)
- **salary** : Conserve le format original (ex: "45K€-60K€")
- **description** : Résume les missions et responsabilités
- **requirements** : Liste des exigences (diplômes, expérience, etc.)
- **skills** : Liste des compétences techniques et humaines
- **benefits** : Avantages sociaux, perks, etc.
- **contact** : Informations de contact si disponibles
- **deadline** : Date limite si mentionnée
- **remotePolicy** : Politique de télétravail si précisée

Offre d'emploi à analyser :
━━━━━━━━━━━━━━━━━━━━━━
${jobOfferText}`;

    try {
      // Appel direct à l'API Gemini
      const response = await this.callGeminiDirectly(jobOfferText, systemPrompt);
      
      // Nettoyer et valider les données
      const cleanedResponse = this.cleanAndValidateOfferData(response);
      
      // Créer l'objet JobOffer à partir de la réponse nettoyée
      const jobOffer: JobOffer = {
        title: cleanedResponse.title || 'Poste non spécifié',
        company: cleanedResponse.company || 'Entreprise non spécifiée',
        location: cleanedResponse.location || 'Localisation non spécifiée',
        type: cleanedResponse.type || 'CDI',
        salary: cleanedResponse.salary || undefined,
        description: cleanedResponse.description || 'Description non disponible',
        requirements: cleanedResponse.requirements || [],
        skills: cleanedResponse.skills || [],
        benefits: cleanedResponse.benefits || [],
        contact: cleanedResponse.contact || undefined,
        deadline: cleanedResponse.deadline || undefined,
        remotePolicy: cleanedResponse.remotePolicy || undefined
      };

      // Validation avec le schéma et conversion vers JobOffer
      const validatedOffer = JobOfferSchema.parse(jobOffer);
      
      // S'assurer que tous les champs requis sont présents
      const finalOffer: JobOffer = {
        title: validatedOffer.title,
        company: validatedOffer.company,
        location: validatedOffer.location,
        type: validatedOffer.type,
        salary: validatedOffer.salary,
        description: validatedOffer.description,
        requirements: validatedOffer.requirements,
        skills: validatedOffer.skills,
        benefits: validatedOffer.benefits,
        contact: validatedOffer.contact,
        deadline: validatedOffer.deadline,
        remotePolicy: validatedOffer.remotePolicy
      };
      
      return finalOffer;
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'offre:', error);
      throw new Error('Impossible d\'analyser l\'offre d\'emploi');
    }
  }

  /**
   * Nettoie et valide les données de l'offre avant validation Zod
   */
  private cleanAndValidateOfferData(data: any): any {
    const cleaned = { ...data };

    // Nettoyer le champ type pour s'assurer qu'il n'y a qu'une seule valeur
    if (cleaned.type && typeof cleaned.type === 'string') {
      // Enlever les pipes et autres séparateurs
      const types = cleaned.type.split(/[,|;]/).map(t => t.trim());
      
      // Prendre la première valeur valide
      const validTypes = ['CDI', 'CDD', 'Stage', 'Alternance', 'Freelance', 'Temps partiel'];
      const firstValidType = types.find(t => validTypes.includes(t));
      
      if (firstValidType) {
        cleaned.type = firstValidType;
      } else {
        cleaned.type = 'CDI'; // Valeur par défaut
      }
    }

    // Nettoyer le remotePolicy si présent
    if (cleaned.remotePolicy && typeof cleaned.remotePolicy === 'string') {
      const validPolicies = ['Présentiel', 'Télétravail', 'Hybride'];
      if (!validPolicies.includes(cleaned.remotePolicy)) {
        cleaned.remotePolicy = undefined;
      }
    }

    // Nettoyer les tableaux pour s'assurer qu'ils sont bien des tableaux de chaînes
    ['requirements', 'skills', 'benefits'].forEach(field => {
      if (cleaned[field]) {
        if (typeof cleaned[field] === 'string') {
          // Si c'est une chaîne, la diviser
          cleaned[field] = cleaned[field].split(/[,;]/).map(item => item.trim()).filter(item => item.length > 0);
        } else if (Array.isArray(cleaned[field])) {
          // Si c'est déjà un tableau, s'assurer que tous les éléments sont des chaînes
          cleaned[field] = cleaned[field].map(item => String(item).trim()).filter(item => item.length > 0);
        } else {
          cleaned[field] = [];
        }
      } else {
        cleaned[field] = [];
      }
    });

    // Nettoyer le contact pour gérer les valeurs nulles
    if (cleaned.contact && typeof cleaned.contact === 'object') {
      const contact: any = {};
      
      // Ne garder que les champs non nuls et non vides
      if (cleaned.contact.email && typeof cleaned.contact.email === 'string' && cleaned.contact.email.trim().length > 0) {
        contact.email = cleaned.contact.email.trim();
      }
      
      if (cleaned.contact.phone && typeof cleaned.contact.phone === 'string' && cleaned.contact.phone.trim().length > 0) {
        contact.phone = cleaned.contact.phone.trim();
      }
      
      if (cleaned.contact.person && typeof cleaned.contact.person === 'string' && cleaned.contact.person.trim().length > 0) {
        contact.person = cleaned.contact.person.trim();
      }
      
      // Ne garder le contact que s'il y a au moins un champ valide
      if (Object.keys(contact).length === 0) {
        cleaned.contact = undefined;
      } else {
        cleaned.contact = contact;
      }
    } else {
      cleaned.contact = undefined;
    }

    return cleaned;
  }

  /**
   * Appel direct à l'API Gemini pour les offres d'emploi
   */
  private async callGeminiDirectly(text: string, systemPrompt: string): Promise<any> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback si pas de clé API
      console.warn('Gemini API key not found, using fallback');
      return this.generateFallbackOffer(text);
    }

    const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';
    
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\n${text}`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${baseUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        throw new Error(`Gemini API Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      const responses = Array.isArray(result) ? result : [result];
      
      if (responses.length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      // Combiner toutes les réponses
      const combinedContent = responses
        .map(response => {
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            return response.candidates[0].content.parts[0].text;
          }
          return '';
        })
        .join('')
        .trim();

      if (!combinedContent) {
        throw new Error('No content found in response');
      }

      // Extraire le JSON
      const jsonStart = combinedContent.indexOf('{');
      const jsonEnd = combinedContent.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('No valid JSON found in response');
        throw new Error('No valid JSON found in response');
      }

      let jsonString = combinedContent.substring(jsonStart, jsonEnd);
      jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      // Parsing du JSON
      const parsedData = JSON.parse(jsonString);
      return parsedData;

    } catch (error) {
      console.error('Gemini service error:', error);
      // Fallback vers la génération locale
      return this.generateFallbackOffer(text);
    }
  }

  /**
   * Génération de fallback locale si Gemini n'est pas disponible
   */
  private generateFallbackOffer(text: string): any {
    // Extraction basique avec regex pour le fallback
    const result: any = {
      title: 'Poste non spécifié',
      company: 'Entreprise non spécifiée',
      location: 'Localisation non spécifiée',
      type: 'CDI',
      salary: undefined,
      description: 'Description non disponible',
      requirements: [],
      skills: [],
      benefits: [],
      contact: undefined,
      deadline: undefined,
      remotePolicy: undefined
    };

    // Extraction basique du titre
    const titleMatch = text.match(/(?:poste|emploi|job|position)\s*:?\s*([^\n]+)/i);
    if (titleMatch) {
      result.title = titleMatch[1].trim();
    }

    // Extraction basique de l'entreprise
    const companyMatch = text.match(/(?:entreprise|company|société)\s*:?\s*([^\n]+)/i);
    if (companyMatch) {
      result.company = companyMatch[1].trim();
    }

    // Extraction basique de la localisation
    const locationMatch = text.match(/(?:localisation|lieu|location|ville)\s*:?\s*([^\n]+)/i);
    if (locationMatch) {
      result.location = locationMatch[1].trim();
    }

    // Extraction basique des compétences
    const skillsMatch = text.match(/(?:compétences|skills)\s*:?\s*([^\n]+)/i);
    if (skillsMatch) {
      result.skills = skillsMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
    }

    return result;
  }

  /**
   * Extrait les mots-clés d'une offre pour le matching
   */
  extractKeywords(jobOffer: JobOffer): string[] {
    const keywords = new Set<string>();
    
    // Ajouter les compétences
    jobOffer.skills.forEach(skill => keywords.add(skill.toLowerCase()));
    
    // Ajouter les exigences
    jobOffer.requirements.forEach(req => keywords.add(req.toLowerCase()));
    
    // Ajouter les mots du titre
    jobOffer.title.toLowerCase().split(' ').forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Ajouter les technologies courantes
    const techKeywords = [
      'javascript', 'typescript', 'react', 'vue', 'angular', 'nodejs',
      'python', 'java', 'c#', 'php', 'sql', 'mongodb', 'postgresql',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'agile',
      'scrum', 'rest', 'api', 'html', 'css', 'sass', 'webpack'
    ];
    
    techKeywords.forEach(tech => {
      if (jobOffer.description.toLowerCase().includes(tech)) {
        keywords.add(tech);
      }
    });
    
    return Array.from(keywords);
  }

  /**
   * Calcule le score de matching entre une offre et un CV
   */
  calculateMatchScore(jobOffer: JobOffer, cvData: any): number {
    const offerKeywords = this.extractKeywords(jobOffer);
    const cvText = JSON.stringify(cvData).toLowerCase();
    
    let matchCount = 0;
    let totalKeywords = offerKeywords.length;
    
    if (totalKeywords === 0) return 50; // Score moyen si pas de mots-clés
    
    offerKeywords.forEach(keyword => {
      if (cvText.includes(keyword)) {
        matchCount++;
      }
    });
    
    const baseScore = (matchCount / totalKeywords) * 100;
    
    // Bonus pour les correspondances exactes
    let bonus = 0;
    
    // Vérifier le titre du poste
    if (cvData.targetJob && jobOffer.title.toLowerCase().includes(cvData.targetJob.toLowerCase())) {
      bonus += 10;
    }
    
    // Vérifier les compétences principales
    const mainSkills = jobOffer.skills.slice(0, 5);
    const cvSkills = cvData.skills || [];
    
    mainSkills.forEach(skill => {
      if (cvSkills.some((cvSkill: string) => cvSkill.toLowerCase() === skill.toLowerCase())) {
        bonus += 5;
      }
    });
    
    return Math.min(100, Math.round(baseScore + bonus));
  }

  /**
   * Génère des suggestions d'optimisation pour le CV
   */
  generateOptimizationSuggestions(jobOffer: JobOffer, cvData: any): string[] {
    const suggestions = [];
    const offerSkills = jobOffer.skills.map(s => s.toLowerCase());
    const cvSkills = (cvData.skills || []).map((s: string) => s.toLowerCase());
    
    // Compétences manquantes
    const missingSkills = offerSkills.filter(skill => !cvSkills.includes(skill));
    if (missingSkills.length > 0) {
      suggestions.push(`Ajoutez ces compétences : ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    // Expérience pertinente
    if (cvData.experiences && cvData.experiences.length > 0) {
      suggestions.push('Mettez en avant vos expériences les plus pertinentes');
    }
    
    // Formation
    if (cvData.education && cvData.education.length > 0) {
      suggestions.push('Adaptez votre résumé pour mettre en avant votre formation pertinente');
    }
    
    // Personnalisation
    suggestions.push(`Personnalisez votre lettre pour ${jobOffer.company}`);
    suggestions.push(`Utilisez les mots-clés de l'offre : ${jobOffer.skills.slice(0, 3).join(', ')}`);
    
    return suggestions;
  }
}

// Export du singleton
export const jobOfferService = new JobOfferService();
export default jobOfferService;
