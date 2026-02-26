import { geminiService } from './gemini';
import type { 
  ExperienceLevel, 
  EducationLevel, 
  ContractType,
  LanguageRequirement,
  Gender,
  MaritalStatus,
  DrivingLicense
} from '@/types/jobPost';

export interface ParsedJobOffer {
  title: string;
  company: string;
  description: string;
  city: string;
  country: string;
  remote: boolean;
  requiredSkills: string[];
  optionalSkills: string[];
  education: EducationLevel[];
  experience: ExperienceLevel;
  minYearsExperience: number;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  deadline?: string;
  isUrgent: boolean;
  languageRequirement: LanguageRequirement;
  gender: Gender;
  maritalStatus: MaritalStatus;
  minAge?: number;
  maxAge?: number;
  childrenAccepted: boolean;
  drivingLicense: DrivingLicense;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddress?: string;
  contactWebsite?: string;
}

class JobOfferParsingService {
  /**
   * Parse une offre d'emploi collée par l'utilisateur avec l'IA Gemini
   */
  async parseJobOffer(jobOfferText: string): Promise<ParsedJobOffer> {
    const prompt = `Tu es un expert en analyse d'offres d'emploi. Ton rôle est d'extraire TOUTES les informations structurées d'une offre d'emploi.

INSTRUCTIONS CRITIQUES:
1. Analyse le texte de l'offre d'emploi ci-dessous
2. Extrais TOUTES les informations disponibles
3. Pour les informations manquantes, utilise des valeurs par défaut intelligentes
4. Retourne UNIQUEMENT un objet JSON valide, sans texte avant ou après
5. Ne mets PAS le JSON dans des balises markdown (pas de \`\`\`json)

STRUCTURE JSON ATTENDUE (RESPECTE EXACTEMENT CES CHAMPS):
{
  "title": "string - Titre du poste (OBLIGATOIRE)",
  "company": "string - Nom de l'entreprise (OBLIGATOIRE)",
  "description": "string - Description complète du poste extraite du texte",
  "city": "string - Ville (ex: Dakar, Abidjan)",
  "country": "string - Pays (ex: Sénégal, Côte d'Ivoire, Cameroun)",
  "remote": boolean - true si télétravail mentionné, sinon false,
  "requiredSkills": ["array de strings - Compétences requises"],
  "optionalSkills": ["array de strings - Compétences optionnelles/souhaitées"],
  "education": ["array - Niveaux d'éducation requis parmi: 'high_school', 'bachelor', 'master', 'phd'"],
  "experience": "string - Niveau d'expérience parmi: 'entry' (0-1 an), 'junior' (1-3 ans), 'mid' (3-5 ans), 'senior' (5-10 ans), 'expert' (10+ ans)",
  "minYearsExperience": number - Nombre minimum d'années d'expérience (0 si débutant),
  "contractType": "string - Type de contrat parmi: 'full_time', 'part_time', 'contract', 'internship', 'freelance'",
  "salaryMin": number ou null - Salaire minimum si mentionné,
  "salaryMax": number ou null - Salaire maximum si mentionné,
  "currency": "string - Devise (XOF, EUR, USD, etc.) - par défaut XOF",
  "deadline": "string ou null - Date limite au format YYYY-MM-DD si mentionnée",
  "isUrgent": boolean - true si l'offre est marquée comme urgente,
  "languageRequirement": "string - Exigence linguistique parmi: 'none', 'french', 'english', 'bilingual'",
  "gender": "string - Genre requis parmi: 'any', 'male', 'female'",
  "maritalStatus": "string - Statut marital parmi: 'any', 'single', 'married'",
  "minAge": number ou null - Âge minimum si mentionné,
  "maxAge": number ou null - Âge maximum si mentionné,
  "childrenAccepted": boolean - true par défaut sauf si explicitement refusé,
  "drivingLicense": "string - Permis de conduire parmi: 'not_required', 'preferred', 'required'",
  "contactEmail": "string ou null - Email de contact",
  "contactPhone": "string ou null - Téléphone de contact",
  "contactWhatsApp": "string ou null - WhatsApp de contact",
  "contactAddress": "string ou null - Adresse physique",
  "contactWebsite": "string ou null - Site web de l'entreprise ou URL de candidature"
}

RÈGLES D'EXTRACTION:
- Si le titre n'est pas clair, déduis-le du contexte
- Si l'entreprise n'est pas mentionnée, mets "Entreprise confidentielle"
- Pour les compétences, extrais TOUTES les compétences techniques et soft skills mentionnées
- Pour l'éducation, mappe les diplômes vers les valeurs: Bac → 'high_school', Licence/Bachelor → 'bachelor', Master/Maîtrise → 'master', Doctorat/PhD → 'phd'
- Pour l'expérience, analyse les années mentionnées et choisis le niveau approprié
- Si "bilingue" ou "français et anglais" est mentionné → 'bilingual'
- Si seul le français est requis → 'french'
- Si seul l'anglais est requis → 'english'
- Si aucune langue n'est spécifiée → 'none'
- Pour le genre, cherche des termes comme "homme", "femme", "H/F", etc.
- Pour le permis, cherche "permis obligatoire" → 'required', "permis souhaité" → 'preferred', sinon → 'not_required'
- Extrais TOUS les contacts (email, téléphone, WhatsApp, adresse, site web)
- Pour le site web, cherche les URLs (http://, https://, www.) ou mentions de "site web", "site internet", "postuler sur"

TEXTE DE L'OFFRE D'EMPLOI À ANALYSER:
${jobOfferText}

RETOURNE UNIQUEMENT LE JSON, RIEN D'AUTRE.`;

    try {
      console.log('🤖 Envoi de l\'offre à Gemini pour parsing...');
      const rawResponse = await geminiService.generateRawResponse(prompt);
      
      console.log('📥 Réponse brute de Gemini:', rawResponse.substring(0, 200) + '...');
      
      // Nettoyer la réponse pour extraire le JSON
      let jsonString = rawResponse.trim();
      
      // Retirer les balises markdown si présentes
      const jsonMatch = jsonString.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else {
        // Retirer les balises ``` simples
        jsonString = jsonString.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      console.log('🧹 JSON nettoyé:', jsonString.substring(0, 200) + '...');
      
      // Parser le JSON
      const parsed = JSON.parse(jsonString) as ParsedJobOffer;
      
      console.log('✅ Offre d\'emploi parsée avec succès:', parsed);
      
      // Validation et valeurs par défaut
      return {
        title: parsed.title || 'Poste à définir',
        company: parsed.company || 'Entreprise confidentielle',
        description: parsed.description || '',
        city: parsed.city || '',
        country: parsed.country || '',
        remote: parsed.remote || false,
        requiredSkills: parsed.requiredSkills || [],
        optionalSkills: parsed.optionalSkills || [],
        education: parsed.education || [],
        experience: parsed.experience || 'mid',
        minYearsExperience: parsed.minYearsExperience || 0,
        contractType: parsed.contractType || 'full_time',
        salaryMin: parsed.salaryMin || undefined,
        salaryMax: parsed.salaryMax || undefined,
        currency: parsed.currency || 'XOF',
        deadline: parsed.deadline || undefined,
        isUrgent: parsed.isUrgent || false,
        languageRequirement: parsed.languageRequirement || 'none',
        gender: parsed.gender || 'any',
        maritalStatus: parsed.maritalStatus || 'any',
        minAge: parsed.minAge || undefined,
        maxAge: parsed.maxAge || undefined,
        childrenAccepted: parsed.childrenAccepted !== false,
        drivingLicense: parsed.drivingLicense || 'not_required',
        contactEmail: parsed.contactEmail || undefined,
        contactPhone: parsed.contactPhone || undefined,
        contactWhatsApp: parsed.contactWhatsApp || undefined,
        contactAddress: parsed.contactAddress || undefined,
      };
      
    } catch (error) {
      console.error('❌ Erreur lors du parsing de l\'offre:', error);
      throw new Error('Impossible d\'analyser l\'offre d\'emploi. Veuillez vérifier le format.');
    }
  }
}

export const jobOfferParsingService = new JobOfferParsingService();
export default jobOfferParsingService;
