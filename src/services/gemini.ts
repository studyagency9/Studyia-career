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
    // Utiliser la même URL que le matching qui fonctionne
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

      console.log('✅ Réponse Gemini reçue pour parsing CV');
      console.log('📊 Type de réponse:', typeof result);
      console.log('📊 Réponse brute:', result);

      // Gemini streaming retourne un tableau de réponses
      const responses = Array.isArray(result) ? result : [result];
      console.log('📡 Nombre de réponses:', responses.length);
      
      if (responses.length === 0) {
        console.error('Empty response from Gemini API');
        throw new Error('Empty response from API');
      }

      // Combiner toutes les réponses pour reconstruire le JSON complet
      const combinedContent = responses
        .map(response => {
          console.log('📡 Traitement réponse:', response);
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            const content = response.candidates[0].content.parts[0].text;
            console.log('📡 Contenu trouvé:', content.substring(0, 100) + '...');
            return content;
          }
          console.log('⚠️ Pas de contenu trouvé dans cette réponse');
          return '';
        })
        .join('')
        .trim();

      console.log('📡 Contenu combiné final:', combinedContent.substring(0, 200) + '...');

      if (!combinedContent) {
        console.error('No content found in any response');
        throw new Error('No content found in response');
      }

      // Parser le JSON de la réponse combinée
      const jsonMatch = combinedContent.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : combinedContent;
      
      console.log('📡 JSON extrait:', jsonString.substring(0, 200) + '...');
      
      try {
        const parsed = JSON.parse(jsonString);
        console.log('✅ JSON parsé avec succès:', parsed);
        return parsed;
      } catch (parseError) {
        console.error('❌ Error parsing JSON from Gemini response:', parseError);
        console.error('❌ Raw content:', combinedContent);
        throw new Error('Failed to parse JSON from Gemini response');
      }

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

  /**
   * Génère une réponse brute sans validation Zod (pour matching, optimisation, etc.)
   */
  async generateRawResponse(prompt: string): Promise<string> {
    console.log('🔑 Vérification configuration Gemini...');
    console.log('🔑 API Key présente:', !!this.apiKey);
    console.log('🔑 Base URL:', this.baseUrl);
    
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const request: GeminiRequest = {
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

    console.log('📤 Prompt envoyé à Gemini (premiers 200 chars):', prompt.substring(0, 200) + '...');
    console.log('📤 Taille du prompt:', prompt.length, 'caractères');

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
      
      // Debug: log la structure complète de la réponse
      console.log('🔍 Structure réponse Gemini API:', {
        isArray: Array.isArray(result),
        length: Array.isArray(result) ? result.length : 'N/A',
        firstElement: Array.isArray(result) ? result[0] : result
      });
      
      // Gérer le format streaming: la réponse est un tableau de chunks
      let combinedText = '';
      
      if (Array.isArray(result)) {
        // Format streaming: concaténer tous les chunks
        console.log('📦 Format streaming détecté, concaténation de', result.length, 'chunks');
        
        for (const chunk of result) {
          if (chunk.candidates && chunk.candidates.length > 0) {
            const candidate = chunk.candidates[0];
            if (candidate.content && candidate.content.parts) {
              for (const part of candidate.content.parts) {
                if (part.text) {
                  combinedText += part.text;
                }
              }
            }
          }
        }
      } else {
        // Format non-streaming: extraction directe
        if (!result.candidates || result.candidates.length === 0) {
          console.error('❌ Aucun candidat dans la réponse Gemini');
          console.error('❌ Réponse complète:', JSON.stringify(result, null, 2));
          throw new Error('Gemini API: No candidates in response');
        }
        
        const firstCandidate = result.candidates[0];
        if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
          throw new Error('Gemini API: No content in candidate');
        }
        
        combinedText = firstCandidate.content.parts[0].text || '';
      }
      
      if (!combinedText) {
        console.error('❌ Texte vide dans la réponse');
        throw new Error('Gemini API: Empty text in response');
      }
      
      console.log('✅ Contenu Gemini extrait avec succès (', combinedText.length, 'caractères)');
      return combinedText;

    } catch (error) {
      console.error('Gemini service error:', error);
      throw error;
    }
  }
}

// Export du singleton
export const geminiService = new GeminiService();
export default geminiService;
