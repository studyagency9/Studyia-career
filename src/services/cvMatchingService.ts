import { z } from 'zod';
import { JobOffer } from './jobOfferService';
import { geminiService, CVParsedSchema } from './gemini';

// Types pour le résultat de matching
export interface CVMatchResult {
  matchScore: number; // 0-100
  missingSkills: string[];
  relevantExperiences: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  optimizedSummary: string;
  keyPoints: string[];
  experienceAlignment: {
    matched: string[];
    missing: string[];
  };
  skillsAlignment: {
    matched: string[];
    missing: string[];
    additional: string[];
  };
}

// Schéma de validation pour le résultat de matching
export const CVMatchResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
  relevantExperiences: z.array(z.string()),
  suggestions: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  optimizedSummary: z.string(),
  keyPoints: z.array(z.string()),
  experienceAlignment: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  skillsAlignment: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
    additional: z.array(z.string()),
  }),
});

export type CVMatchResultParsed = z.infer<typeof CVMatchResultSchema>;

class CVMatchingService {
  /**
   * Analyse le matching entre un CV et une offre d'emploi avec Gemini
   */
  async analyzeMatching(cvData: any, jobOffer: JobOffer): Promise<CVMatchResult> {
    try {
      console.log('🤖 DÉBUT ANALYSE MATCHING AVEC GEMINI');
      console.log('📊 Données CV:', cvData);
      console.log('💼 Données offre:', jobOffer);

      // Construire le prompt pour Gemini
      const matchingPrompt = `
Tu es un expert en recrutement et en analyse de CV. Analyse le matching entre le CV suivant et l'offre d'emploi.

RETOURNE UNIQUEMENT un objet JSON valide avec cette structure exacte :
{
  "matchScore": nombre entre 0 et 100,
  "missingSkills": ["compétence1", "compétence2"],
  "relevantExperiences": ["expérience1", "expérience2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["force1", "force2"],
  "weaknesses": ["faiblesse1", "faiblesse2"],
  "optimizedSummary": "résumé optimisé du candidat",
  "keyPoints": ["point clé 1", "point clé 2"],
  "experienceAlignment": {
    "matched": ["expériences correspondantes"],
    "missing": ["expériences manquantes"]
  },
  "skillsAlignment": {
    "matched": ["compétences correspondantes"],
    "missing": ["compétences manquantes"],
    "additional": ["compétences supplémentaires"]
  }
}

OFFRE D'EMPLOI:
- Titre: ${jobOffer.title}
- Entreprise: ${jobOffer.company}
- Localisation: ${jobOffer.location}
- Type: ${jobOffer.type}
- Salaire: ${jobOffer.salary}
- Description: ${jobOffer.description}
- Compétences requises: ${jobOffer.skills.join(', ')}
- Exigences: ${jobOffer.requirements.join(', ')}

CV DU CANDIDAT:
- Nom: ${cvData.personalInfo?.firstName} ${cvData.personalInfo?.lastName}
- Email: ${cvData.personalInfo?.email}
- Téléphone: ${cvData.personalInfo?.phone}
- Résumé: ${cvData.personalInfo?.summary}
- Compétences: ${(cvData.skills || []).join(', ')}
- Expériences: ${(cvData.experiences || []).map((exp: any) => `${exp.title} chez ${exp.company}`).join(', ')}

INSTRUCTIONS SPÉCIFIQUES POUR LES SUGGESTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- UTILISEZ "VOUS" et "VOTRE" au lieu de "le candidat" ou "le candidat devrait"
- Exemple: "Vous devriez mettre en avant..." au lieu de "Le candidat devrait..."
- Exemple: "Votre expérience en..." au lieu de "L'expérience du candidat..."
- Soyez direct et personnel dans vos suggestions
- Formulez les conseils comme si vous parliez directement au candidat

Analyse en détail et retourne le JSON exact.
`;

      console.log('📡 Appel à Gemini pour le matching...');
      
      // Utiliser la même méthode que jobOfferService
      const geminiResponse = await this.callGeminiDirectly(matchingPrompt);
      
      console.log('✅ Réponse Gemini reçue pour matching');
      console.log('📊 Réponse brute:', geminiResponse);

      // Extraire le JSON de la réponse
      let matchResult: CVMatchResult;
      
      try {
        // Si la réponse est déjà un objet JSON
        if (typeof geminiResponse === 'object') {
          const parsedResult = CVMatchResultSchema.parse(geminiResponse);
          matchResult = {
            matchScore: parsedResult.matchScore || 0,
            missingSkills: parsedResult.missingSkills || [],
            relevantExperiences: parsedResult.relevantExperiences || [],
            suggestions: parsedResult.suggestions || [],
            strengths: parsedResult.strengths || [],
            weaknesses: parsedResult.weaknesses || [],
            optimizedSummary: parsedResult.optimizedSummary || '',
            keyPoints: parsedResult.keyPoints || [],
            experienceAlignment: {
              matched: parsedResult.experienceAlignment?.matched || [],
              missing: parsedResult.experienceAlignment?.missing || []
            },
            skillsAlignment: {
              matched: parsedResult.skillsAlignment?.matched || [],
              missing: parsedResult.skillsAlignment?.missing || [],
              additional: parsedResult.skillsAlignment?.additional || []
            }
          };
        } else {
          // Si c'est une chaîne, parser le JSON
          const responseString = typeof geminiResponse === 'string' ? geminiResponse : JSON.stringify(geminiResponse);
          const jsonMatch = responseString.match(/```json\n([\s\S]*?)\n```/);
          const jsonString = jsonMatch ? jsonMatch[1] : responseString;
          const parsedResult = CVMatchResultSchema.parse(JSON.parse(jsonString));
          matchResult = {
            matchScore: parsedResult.matchScore || 0,
            missingSkills: parsedResult.missingSkills || [],
            relevantExperiences: parsedResult.relevantExperiences || [],
            suggestions: parsedResult.suggestions || [],
            strengths: parsedResult.strengths || [],
            weaknesses: parsedResult.weaknesses || [],
            optimizedSummary: parsedResult.optimizedSummary || '',
            keyPoints: parsedResult.keyPoints || [],
            experienceAlignment: {
              matched: parsedResult.experienceAlignment?.matched || [],
              missing: parsedResult.experienceAlignment?.missing || []
            },
            skillsAlignment: {
              matched: parsedResult.skillsAlignment?.matched || [],
              missing: parsedResult.skillsAlignment?.missing || [],
              additional: parsedResult.skillsAlignment?.additional || []
            }
          };
        }
        
        console.log('✅ Matching analysé avec succès par Gemini');
        console.log('📊 Score de matching:', matchResult.matchScore + '%');
        console.log('🎯 Compétences manquantes:', matchResult.missingSkills);
        console.log('💪 Forces:', matchResult.strengths);
        
        return matchResult;
        
      } catch (parseError) {
        console.error('❌ Erreur parsing réponse Gemini:', parseError);
        console.log('🔄 Fallback vers analyse locale...');
        return this.performBasicMatching(cvData, jobOffer);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse de matching avec Gemini:', error);
      console.log('🔄 Fallback vers analyse locale...');
      return this.performBasicMatching(cvData, jobOffer);
    }
  }

  /**
   * Appel direct à l'API Gemini (même méthode que jobOfferService)
   */
  private async callGeminiDirectly(prompt: string): Promise<any> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini API key not found, using fallback');
      throw new Error('Gemini API key not found');
    }

    const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';
    
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt
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

      // Parser le JSON de la réponse combinée
      const jsonMatch = combinedContent.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : combinedContent;
      
      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing JSON from Gemini response:', parseError);
        console.error('Raw content:', combinedContent);
        throw new Error('Failed to parse JSON from Gemini response');
      }

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  /**
   * Effectue une analyse de matching basique (fallback)
   */
  private performBasicMatching(cvData: any, jobOffer: JobOffer): CVMatchResult {
    const cvSkills = (cvData.skills || []).map((s: string) => s.toLowerCase());
    const offerSkills = jobOffer.skills.map(s => s.toLowerCase());
    
    // Calcul des compétences correspondantes
    const matchedSkills = cvSkills.filter(skill => 
      offerSkills.some(offerSkill => 
        skill.includes(offerSkill) || offerSkill.includes(skill)
      )
    );
    
    const missingSkills = offerSkills.filter(skill => 
      !cvSkills.some(cvSkill => 
        cvSkill.includes(skill) || skill.includes(cvSkill)
      )
    );
    
    const additionalSkills = cvSkills.filter(skill => 
      !offerSkills.some(offerSkill => 
        skill.includes(offerSkill) || offerSkill.includes(skill)
      )
    );
    
    // Analyse des expériences
    const cvExperiences = cvData.experiences || [];
    const relevantExperiences = cvExperiences
      .filter((exp: any) => 
        exp.title.toLowerCase().includes(jobOffer.title.toLowerCase()) ||
        exp.description.toLowerCase().includes(jobOffer.title.toLowerCase())
      )
      .map((exp: any) => `${exp.title} chez ${exp.company}`);
    
    // Calcul du score de matching
    const skillScore = (matchedSkills.length / offerSkills.length) * 50;
    const experienceScore = relevantExperiences.length > 0 ? 30 : 10;
    const bonusScore = additionalSkills.length > 2 ? 10 : 0;
    const matchScore = Math.min(100, Math.round(skillScore + experienceScore + bonusScore));
    
    // Génération des suggestions
    const suggestions = [
      missingSkills.length > 0 && `Ajoutez ces compétences : ${missingSkills.slice(0, 3).join(', ')}`,
      relevantExperiences.length > 0 && 'Mettez en avant vos expériences pertinentes',
      'Personnalisez votre résumé pour ce poste',
      'Utilisez les mots-clés de l\'offre'
    ].filter(Boolean) as string[];
    
    // Forces et faiblesses
    const strengths = [
      matchedSkills.length > 3 && 'Solide alignement technique',
      relevantExperiences.length > 0 && 'Expérience pertinente',
      additionalSkills.length > 2 && 'Compétences complémentaires variées'
    ].filter(Boolean) as string[];
    
    const weaknesses = [
      missingSkills.length > 2 && 'Compétences clés manquantes',
      relevantExperiences.length === 0 && 'Expérience peu alignée',
      cvSkills.length < 3 && 'Portfolio de compétences limité'
    ].filter(Boolean) as string[];
    
    // Résumé optimisé
    const optimizedSummary = this.generateOptimizedSummary(cvData, jobOffer);
    
    // Points clés
    const keyPoints = [
      `${matchedSkills.length} compétences sur ${offerSkills.length} correspondent`,
      relevantExperiences.length > 0 ? `${relevantExperiences.length} expériences pertinentes` : 'Expérience à mieux valoriser',
      missingSkills.length === 0 ? 'Toutes les compétences requises' : `${missingSkills.length} compétences à développer`
    ];
    
    return {
      matchScore,
      missingSkills,
      relevantExperiences,
      suggestions,
      strengths,
      weaknesses,
      optimizedSummary,
      keyPoints,
      experienceAlignment: {
        matched: relevantExperiences,
        missing: ['Expérience dans le secteur', 'Projet similaire']
      },
      skillsAlignment: {
        matched: matchedSkills,
        missing: missingSkills,
        additional: additionalSkills
      }
    };
  }

  /**
   * Génère un résumé optimisé pour le poste
   */
  private generateOptimizedSummary(cvData: any, jobOffer: JobOffer): string {
    const currentSummary = cvData.personalInfo?.summary || '';
    const mainSkills = jobOffer.skills.slice(0, 3);
    const yearsOfExperience = this.calculateExperience(cvData.experiences || []);
    
    return `Professionnel passionné avec ${yearsOfExperience} d'expérience dans le développement web. Spécialisé en ${mainSkills.join(', ')}, je combine expertise technique et sens de l'innovation pour delivering des solutions de haute qualité. Mon approche orientée résultat et ma capacité à m'adapter rapidement font de moi le candidat idéal pour le poste de ${jobOffer.title} chez ${jobOffer.company}.`;
  }

  /**
   * Calcule le nombre d'années d'expérience
   */
  private calculateExperience(experiences: any[]): number {
    if (experiences.length === 0) return 0;
    
    let totalYears = 0;
    const now = new Date();
    
    experiences.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : now;
        const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        totalYears += Math.max(0, years);
      }
    });
    
    return Math.round(totalYears);
  }

  /**
   * Génère des suggestions d'optimisation pour le CV
   */
  generateOptimizationSuggestions(matchResult: CVMatchResult): string[] {
    const suggestions = [...matchResult.suggestions];
    
    // Ajouter des suggestions basées sur le score
    if (matchResult.matchScore < 60) {
      suggestions.unshift('Le matching est faible - envisagez une formation pour les compétences manquantes');
    } else if (matchResult.matchScore > 80) {
      suggestions.push('Excellent matching - mettez en avant vos points forts');
    }
    
    // Suggestions basées sur les compétences manquantes
    if (matchResult.missingSkills.length > 0) {
      suggestions.push(`Formez-vous sur : ${matchResult.missingSkills.slice(0, 2).join(' et ')}`);
    }
    
    // Suggestions basées sur les forces
    if (matchResult.strengths.length > 0) {
      suggestions.push(`Mettez en avant : ${matchResult.strengths.slice(0, 2).join(' et ')}`);
    }
    
    return suggestions.slice(0, 6); // Limiter à 6 suggestions maximum
  }

  /**
   * Optimise les données du CV pour l'offre avec Gemini
   */
  async optimizeCVForJob(cvData: any, jobOffer: JobOffer, matchResult: CVMatchResult): Promise<any> {
    try {
      console.log('🤖 DÉBUT OPTIMISATION CV AVEC GEMINI');
      console.log('📊 CV à optimiser:', cvData);
      console.log('💼 Offre cible:', jobOffer);
      console.log('🎯 Résultat matching:', matchResult);

      // Construire le prompt pour Gemini
      const optimizationPrompt = `
Tu es un expert en optimisation de CV. Analyse et optimise le CV suivant pour le rendre parfait pour l'offre d'emploi cible.

RETOURNE UNIQUEMENT un objet JSON valide avec la structure exacte du CV d'entrée mais optimisé :
{
  "personalInfo": {
    "firstName": "prénom",
    "lastName": "nom", 
    "email": "email",
    "phone": "téléphone",
    "city": "ville",
    "country": "pays",
    "summary": "résumé optimisé et percutant"
  },
  "targetJob": "titre de poste optimisé",
  "experiences": [
    {
      "title": "titre optimisé",
      "company": "entreprise",
      "location": "localisation",
      "startDate": "date début",
      "endDate": "date fin",
      "description": "description optimisée avec mots-clés de l'offre"
    }
  ],
  "education": [
    {
      "degree": "diplôme",
      "school": "école",
      "location": "localisation",
      "startDate": "date début",
      "endDate": "date fin",
      "description": "description"
    }
  ],
  "skills": ["compétence1", "compétence2", "compétence3"]
}

OFFRE D'EMPLOI CIBLE:
- Titre: ${jobOffer.title}
- Entreprise: ${jobOffer.company}
- Localisation: ${jobOffer.location}
- Description: ${jobOffer.description}
- Compétences requises: ${jobOffer.skills.join(', ')}
- Exigences: ${jobOffer.requirements.join(', ')}

RÉSULTAT DU MATCHING:
- Score: ${matchResult.matchScore}%
- Compétences manquantes: ${matchResult.missingSkills.join(', ')}
- Forces: ${matchResult.strengths.join(', ')}
- Suggestions: ${matchResult.suggestions.join(', ')}

CV ACTUEL À OPTIMISER:
${JSON.stringify(cvData, null, 2)}

INSTRUCTIONS D'OPTIMISATION:
1. Réécris le résumé pour qu'il soit percutant et aligné avec l'offre
2. Optimise les descriptions d'expériences avec les mots-clés de l'offre
3. Réorganise les compétences pour mettre en premier celles requises
4. Ajoute les compétences manquantes si pertinent (marque-les comme acquises si possible)
5. Utilise un langage professionnel et impactant
6. Garde la même structure JSON mais avec du contenu optimisé
`;

      console.log('📡 Appel à Gemini pour l\'optimisation CV...');
      
      // Utiliser la même méthode que jobOfferService
      const geminiResponse = await this.callGeminiDirectly(optimizationPrompt);
      
      console.log('✅ Réponse Gemini reçue pour optimisation CV');
      console.log('📊 Réponse brute:', geminiResponse);

      // Extraire et valider le CV optimisé
      let optimizedCV: any;
      
      try {
        if (typeof geminiResponse === 'object') {
          optimizedCV = geminiResponse;
        } else {
          const responseString = typeof geminiResponse === 'string' ? geminiResponse : JSON.stringify(geminiResponse);
          const jsonMatch = responseString.match(/```json\n([\s\S]*?)\n```/);
          const jsonString = jsonMatch ? jsonMatch[1] : responseString;
          optimizedCV = JSON.parse(jsonString);
        }
        
        console.log('✅ CV optimisé avec succès par Gemini');
        console.log('📝 Nouveau résumé:', optimizedCV.personalInfo?.summary);
        console.log('🛠️ Nouvelles compétences:', optimizedCV.skills);
        
        return optimizedCV;
        
      } catch (parseError) {
        console.error('❌ Erreur parsing réponse Gemini pour optimisation:', parseError);
        console.log('🔄 Fallback vers optimisation locale...');
        return this.performBasicOptimization(cvData, jobOffer, matchResult);
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation CV avec Gemini:', error);
      console.log('🔄 Fallback vers optimisation locale...');
      return this.performBasicOptimization(cvData, jobOffer, matchResult);
    }
  }

  /**
   * Effectue une optimisation basique (fallback)
   */
  private performBasicOptimization(cvData: any, jobOffer: JobOffer, matchResult: CVMatchResult): any {
    const optimizedCV = JSON.parse(JSON.stringify(cvData)); // Deep clone
    
    // Optimiser le résumé
    if (optimizedCV.personalInfo) {
      optimizedCV.personalInfo.summary = matchResult.optimizedSummary;
    }
    
    // Réorganiser les expériences pour mettre les plus pertinentes en premier
    if (optimizedCV.experiences) {
      optimizedCV.experiences.sort((a: any, b: any) => {
        const aRelevant = matchResult.relevantExperiences.some(exp => 
          exp.includes(a.company) || exp.includes(a.title)
        );
        const bRelevant = matchResult.relevantExperiences.some(exp => 
          exp.includes(b.company) || exp.includes(b.title)
        );
        
        if (aRelevant && !bRelevant) return -1;
        if (!aRelevant && bRelevant) return 1;
        return 0;
      });
    }
    
    // Mettre en avant les compétences pertinentes
    if (optimizedCV.skills) {
      const prioritizedSkills = [
        ...matchResult.skillsAlignment.matched,
        ...matchResult.skillsAlignment.additional.filter((skill: string) => 
          !matchResult.skillsAlignment.matched.includes(skill)
        )
      ];
      optimizedCV.skills = prioritizedSkills;
    }
    
    return optimizedCV;
  }
}

// Export du singleton
export const cvMatchingService = new CVMatchingService();
export default cvMatchingService;
