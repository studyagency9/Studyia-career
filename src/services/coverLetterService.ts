import { z } from 'zod';
import geminiService from './gemini';
import { JobOffer } from './jobOfferService';

// Types pour la lettre de motivation
export interface CoverLetterData {
  candidateName: string;
  candidateAddress: string;
  candidatePhone: string;
  candidateEmail: string;
  companyName: string;
  companyAddress: string;
  recipientName?: string;
  recipientTitle?: string;
  jobTitle: string;
  reference?: string;
  date: string;
  subject: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
}

// Schéma de validation pour la lettre de motivation
export const CoverLetterSchema = z.object({
  candidateName: z.string().min(1, "Le nom du candidat est requis"),
  candidateAddress: z.string().min(1, "L'adresse du candidat est requise"),
  candidatePhone: z.string().min(1, "Le téléphone du candidat est requis"),
  candidateEmail: z.string().email("L'email du candidat est invalide"),
  companyName: z.string().min(1, "Le nom de l'entreprise est requis"),
  companyAddress: z.string().min(1, "L'adresse de l'entreprise est requise"),
  recipientName: z.string().optional(),
  recipientTitle: z.string().optional(),
  jobTitle: z.string().min(1, "Le titre du poste est requis"),
  reference: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  subject: z.string().min(1, "L'objet est requis"),
  introduction: z.string().min(1, "L'introduction est requise"),
  body: z.string().min(1, "Le corps de la lettre est requis"),
  conclusion: z.string().min(1, "La conclusion est requise"),
  signature: z.string().min(1, "La signature est requise"),
});

export type CoverLetterParsed = z.infer<typeof CoverLetterSchema>;

class CoverLetterService {
  /**
   * Génère une lettre de motivation personnalisée avec Gemini
   */
  async generateCoverLetter(
    cvData: any,
    jobOffer: JobOffer,
    customizations?: {
      tone?: 'professionnel' | 'enthousiaste' | 'direct' | 'créatif';
      length?: 'courte' | 'moyenne' | 'longue';
      focus?: 'compétences' | 'expérience' | 'motivation' | 'équilibré';
    }
  ): Promise<CoverLetterData> {
    const tone = customizations?.tone || 'professionnel';
    const length = customizations?.length || 'moyenne';
    const focus = customizations?.focus || 'équilibré';

    const systemPrompt = `Tu es un expert en rédaction de lettres de motivation, spécialisé dans le marché de l'emploi francophone. Ton rôle est de rédiger une lettre de motivation percutante et personnalisée qui maximise les chances de décrocher un entretien.

CONTEXTE :
━━━━━━━━━━━━━━━━━━━━━━
Candidat : ${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}
Poste visé : ${jobOffer.title}
Entreprise : ${jobOffer.company}
Type de contrat : ${jobOffer.type}

TON DE RÉDACTION : ${tone}
LONGUEUR : ${length}
FOCUS : ${focus}

FORMAT DE SORTIE OBLIGATOIRE :
━━━━━━━━━━━━━━━━━━━━━━
Tu dois retourner UNIQUEMENT un objet JSON valide, sans aucun texte avant ou après.

{
  "candidateName": "Nom complet du candidat",
  "candidateAddress": "Adresse complète du candidat",
  "candidatePhone": "Téléphone du candidat",
  "candidateEmail": "Email du candidat",
  "companyName": "Nom de l'entreprise",
  "companyAddress": "Adresse de l'entreprise",
  "recipientName": "Nom du destinataire (si connu)",
  "recipientTitle": "Titre du destinataire (si connu)",
  "jobTitle": "Titre exact du poste",
  "reference": "Référence de l'offre (si disponible)",
  "date": "Date du jour au format JJ/MM/AAAA",
  "subject": "Objet de la lettre",
  "introduction": "Paragraphe d'introduction (accroche)",
  "body": "Corps de la lettre (2-3 paragraphes développant les arguments)",
  "conclusion": "Paragraphe de conclusion (appel à l'action)",
  "signature": "Formule de politesse finale"
}

DONNÉES DU CANDIDAT :
━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(cvData, null, 2)}

DONNÉES DE L'OFFRE :
━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(jobOffer, null, 2)}`;

    try {
      // Appel direct à l'API Gemini
      const response = await this.callGeminiDirectly(cvData, jobOffer, systemPrompt);
      
      // Créer la lettre de motivation à partir de la réponse
      const coverLetter: CoverLetterData = {
        candidateName: response.candidateName || `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim() || 'Candidat',
        candidateAddress: response.candidateAddress || `${cvData.personalInfo?.city || ''}, ${cvData.personalInfo?.country || ''}`.trim() || 'Adresse non spécifiée',
        candidatePhone: response.candidatePhone || cvData.personalInfo?.phone || 'Téléphone non spécifié',
        candidateEmail: response.candidateEmail || cvData.personalInfo?.email || 'Email non spécifié',
        companyName: response.companyName || jobOffer.company,
        companyAddress: response.companyAddress || jobOffer.location,
        recipientName: response.recipientName || jobOffer.contact?.person,
        recipientTitle: response.recipientTitle || (jobOffer.contact?.person ? 'Responsable Recrutement' : undefined),
        jobTitle: response.jobTitle || jobOffer.title,
        reference: response.reference || jobOffer.deadline,
        date: response.date || new Date().toLocaleDateString('fr-FR'),
        subject: response.subject || `Candidature au poste de ${jobOffer.title}`,
        introduction: response.introduction || this.generateIntroduction(cvData, jobOffer),
        body: response.body || this.generateBody(cvData, jobOffer),
        conclusion: response.conclusion || this.generateConclusion(cvData, jobOffer),
        signature: response.signature || `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim() || 'Candidat'
      };

      // Validation avec le schéma et conversion vers CoverLetterData
      const validatedLetter = CoverLetterSchema.parse(coverLetter);
      
      // S'assurer que tous les champs requis sont présents
      const finalLetter: CoverLetterData = {
        candidateName: validatedLetter.candidateName,
        candidateAddress: validatedLetter.candidateAddress,
        candidatePhone: validatedLetter.candidatePhone,
        candidateEmail: validatedLetter.candidateEmail,
        companyName: validatedLetter.companyName,
        companyAddress: validatedLetter.companyAddress,
        recipientName: validatedLetter.recipientName,
        recipientTitle: validatedLetter.recipientTitle,
        jobTitle: validatedLetter.jobTitle,
        reference: validatedLetter.reference,
        date: validatedLetter.date,
        subject: validatedLetter.subject,
        introduction: validatedLetter.introduction,
        body: validatedLetter.body,
        conclusion: validatedLetter.conclusion,
        signature: validatedLetter.signature
      };
      
      return finalLetter;
    } catch (error) {
      console.error('Erreur lors de la génération de la lettre:', error);
      throw new Error('Impossible de générer la lettre de motivation');
    }
  }

  /**
   * Appel direct à l'API Gemini pour les lettres de motivation
   */
  private async callGeminiDirectly(cvData: any, jobOffer: JobOffer, systemPrompt: string): Promise<any> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback vers la génération locale si pas de clé API
      return this.generateFallbackLetter(cvData, jobOffer);
    }

    const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';
    
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: systemPrompt
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
      return this.generateFallbackLetter(cvData, jobOffer);
    }
  }

  /**
   * Génération de fallback locale si Gemini n'est pas disponible
   */
  private generateFallbackLetter(cvData: any, jobOffer: JobOffer): any {
    return {
      candidateName: `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim() || 'Candidat',
      candidateAddress: `${cvData.personalInfo?.city || ''}, ${cvData.personalInfo?.country || ''}`.trim() || 'Adresse non spécifiée',
      candidatePhone: cvData.personalInfo?.phone || 'Téléphone non spécifié',
      candidateEmail: cvData.personalInfo?.email || 'Email non spécifié',
      companyName: jobOffer.company,
      companyAddress: jobOffer.location,
      recipientName: jobOffer.contact?.person,
      recipientTitle: jobOffer.contact?.person ? 'Responsable Recrutement' : undefined,
      jobTitle: jobOffer.title,
      reference: jobOffer.deadline,
      date: new Date().toLocaleDateString('fr-FR'),
      subject: `Candidature au poste de ${jobOffer.title}`,
      introduction: this.generateIntroduction(cvData, jobOffer),
      body: this.generateBody(cvData, jobOffer),
      conclusion: this.generateConclusion(cvData, jobOffer),
      signature: `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`.trim() || 'Candidat'
    };
  }

  /**
   * Génère l'introduction de la lettre
   */
  private generateIntroduction(cvData: any, jobOffer: JobOffer): string {
    const candidateName = `${cvData.personalInfo?.firstName || ''} ${cvData.personalInfo?.lastName || ''}`;
    const currentJob = cvData.experiences?.[0]?.title || 'professionnel';
    
    return `Je vous adresse ma candidature pour le poste de ${jobOffer.title} au sein de ${jobOffer.company}. En tant que ${currentJob} avec une forte expertise dans les technologies que vous recherchez, je suis convaincu que mon profil correspond parfaitement à vos attentes et que je pourrais contribuer activement au succès de vos projets.`;
  }

  /**
   * Génère le corps de la lettre
   */
  private generateBody(cvData: any, jobOffer: JobOffer): string {
    const relevantExperience = cvData.experiences?.slice(0, 2) || [];
    const relevantSkills = cvData.skills?.slice(0, 3) || [];
    
    let body = '';
    
    // Premier paragraphe : expérience pertinente
    if (relevantExperience.length > 0) {
      const exp = relevantExperience[0];
      body += `Mon expérience chez ${exp.company} en tant que ${exp.title} m'a permis de développer des compétences solides qui correspondent parfaitement à vos besoins. `;
      body += `${exp.description} Cette expérience m'a appris à travailler efficacement en équipe et à livrer des projets de haute qualité dans des délais serrés.\n\n`;
    }
    
    // Deuxième paragraphe : compétences techniques
    if (relevantSkills.length > 0) {
      body += `Je maîtrise parfaitement les technologies que vous recherchez, notamment ${relevantSkills.slice(0, 2).join(' et ')}. `;
      body += `Ma capacité à m'adapter rapidement aux nouveaux outils et ma veille technologique constante me permettent de rester à la pointe des meilleures pratiques du secteur.\n\n`;
    }
    
    // Troisième paragraphe : motivation et adéquation
    body += `Le secteur d'activité de ${jobOffer.company} m'intéresse particulièrement et je suis enthousiaste à l'idée de pouvoir contribuer à vos projets innovants. `;
    body += `Ma rigueur, ma créativité et mon sens des responsabilités sont des qualités qui, je pense, feront la différence dans l'exercice de cette fonction.`;
    
    return body;
  }

  /**
   * Génère la conclusion de la lettre
   */
  private generateConclusion(cvData: any, jobOffer: JobOffer): string {
    return `Je serais ravi de pouvoir vous exposer plus en détail ma motivation et mes compétences lors d'un entretien. Je reste à votre entière disposition pour tout complément d'information et vous remercie de l'attention que vous porterez à ma candidature.\n\nDans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`;
  }

  /**
   * Formate la lettre pour l'affichage HTML
   */
  formatForHTML(coverLetter: CoverLetterData): string {
    return `
<div class="cover-letter">
  <div class="header">
    <div class="candidate-info">
      <p><strong>${coverLetter.candidateName}</strong></p>
      <p>${coverLetter.candidateAddress}</p>
      <p>${coverLetter.candidatePhone}</p>
      <p>${coverLetter.candidateEmail}</p>
    </div>
    <div class="company-info">
      <p><strong>${coverLetter.companyName}</strong></p>
      <p>${coverLetter.companyAddress}</p>
      ${coverLetter.recipientName ? `<p>${coverLetter.recipientName}</p>` : ''}
      ${coverLetter.recipientTitle ? `<p>${coverLetter.recipientTitle}</p>` : ''}
    </div>
  </div>
  
  <div class="meta">
    <p><strong>${coverLetter.date}</strong></p>
    <p><strong>Objet : ${coverLetter.subject}</strong></p>
  </div>
  
  <div class="content">
    <p>${coverLetter.introduction}</p>
    <br>
    <p>${coverLetter.body.replace(/\n\n/g, '</p><br><p>')}</p>
    <br>
    <p>${coverLetter.conclusion}</p>
  </div>
  
  <div class="signature">
    <p>${coverLetter.signature}</p>
  </div>
</div>`;
  }

  /**
   * Formate la lettre pour le PDF
   */
  formatForPDF(coverLetter: CoverLetterData): string {
    return `
${coverLetter.candidateName}
${coverLetter.candidateAddress}
${coverLetter.candidatePhone}
${coverLetter.candidateEmail}

${coverLetter.companyName}
${coverLetter.companyAddress}
${coverLetter.recipientName || ''}
${coverLetter.recipientTitle || ''}

${coverLetter.date}

Objet : ${coverLetter.subject}

Madame, Monsieur,

${coverLetter.introduction}

${coverLetter.body}

${coverLetter.conclusion}

${coverLetter.signature}`;
  }
}

// Export du singleton
export const coverLetterService = new CoverLetterService();
export default coverLetterService;
