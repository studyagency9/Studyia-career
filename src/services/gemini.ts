import { z } from 'zod';

// Types pour la réponse Gemini
export interface GeminiRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Schéma de validation pour le CV parsé
export const CVParsedSchema = z.object({
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    city: z.string(),
    country: z.string(),
    summary: z.string(),
  }),
  targetJob: z.string(),
  experiences: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    school: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
  })),
  skills: z.array(z.string()),
});

export type CVParsed = z.infer<typeof CVParsedSchema>;

class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found in environment variables');
    }
  }

  /**
   * Analyse un CV avec Gemini API
   */
  async analyzeCV(cvText: string, systemPrompt: string): Promise<CVParsed> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const request: GeminiRequest = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nHere is the CV text to analyze:\n\n${cvText}`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
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

      // Debug: Log la structure de la réponse
      console.log('Gemini API response structure:', {
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : 'N/A',
        firstKeys: Array.isArray(result) && result.length > 0 ? Object.keys(result[0]) : Object.keys(result)
      });

      // Gemini streaming retourne un tableau de réponses
      const responses = Array.isArray(result) ? result : [result];
      
      if (responses.length === 0) {
        console.error('Empty response from Gemini API');
        throw new Error('Empty response from API');
      }

      // Combiner toutes les réponses pour reconstruire le JSON complet
      const combinedContent = responses
        .map(response => {
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            return response.candidates[0].content.parts[0].text;
          }
          return '';
        })
        .join('')
        .trim();

      console.log('Combined content from streaming:', {
        responseCount: responses.length,
        combinedLength: combinedContent.length,
        contentPreview: combinedContent.substring(0, 300) + (combinedContent.length > 300 ? '...' : ''),
        hasBraces: combinedContent.includes('{') && combinedContent.includes('}')
      });

      if (!combinedContent) {
        console.error('No content found in any response');
        throw new Error('No content found in response');
      }

      const rawContent = combinedContent;
      
      // Debug: Log le contenu brut
      console.log('Raw content from Gemini:', {
        contentLength: rawContent?.length || 0,
        contentPreview: rawContent?.substring(0, 200) + (rawContent?.length > 200 ? '...' : ''),
        hasBraces: rawContent?.includes('{') && rawContent?.includes('}'),
        firstChar: rawContent?.[0],
        lastChar: rawContent?.[rawContent?.length - 1]
      });
      
      // Extraction du JSON de la réponse
      const jsonStart = rawContent.indexOf('{');
      const jsonEnd = rawContent.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('No valid JSON found in API response');
        console.error('Full content for debugging:', rawContent);
        throw new Error('No valid JSON found in response');
      }

      let jsonString = rawContent.substring(jsonStart, jsonEnd);
      
      // Nettoyage des caractères de contrôle
      jsonString = jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      // Parsing et validation du JSON
      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Failed to parse JSON response');
      }

      // Validation avec Zod
      const validatedData = CVParsedSchema.parse(parsedData);
      
      return validatedData;

    } catch (error) {
      console.error('Gemini service error:', error);
      throw error;
    }
  }

  /**
   * Vérifie si le service est configuré
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export du singleton
export const geminiService = new GeminiService();
export default geminiService;
