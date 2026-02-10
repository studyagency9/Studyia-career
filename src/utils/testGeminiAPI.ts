// Utilitaire pour tester l'API Gemini directement
export const testGeminiAPI = async () => {
  console.log('🧪 TEST DE L\'API GEMINI');
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('🔑 API Key présente:', !!apiKey);
  console.log('🔑 API Key length:', apiKey?.length || 0);
  
  if (!apiKey) {
    console.error('❌ Pas de API Key Gemini trouvée');
    return false;
  }

  const testPrompt = `
Réponds uniquement avec ce JSON:
{
  "test": "API Gemini fonctionne",
  "timestamp": "2025-01-01T00:00:00Z",
  "success": true
}
`;

  const baseUrl = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent';
  
  const request = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: testPrompt
          }
        ]
      }
    ]
  };

  try {
    console.log('📡 Envoi requête de test à Gemini...');
    
    const response = await fetch(`${baseUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Gemini API Error:', errorData);
      return false;
    }

    const result = await response.json();
    console.log('📡 Response JSON reçu:', result);
    
    const responses = Array.isArray(result) ? result : [result];
    console.log('📡 Nombre de réponses:', responses.length);
    
    if (responses.length === 0) {
      console.error('❌ Empty response from Gemini API');
      return false;
    }

    // Combiner toutes les réponses
    const combinedContent = responses
      .map(response => {
        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          const content = response.candidates[0].content.parts[0].text;
          console.log('📡 Contenu trouvé:', content);
          return content;
        }
        return '';
      })
      .join('')
      .trim();

    console.log('📡 Contenu combiné final:', combinedContent);

    if (!combinedContent) {
      console.error('❌ No content found in response');
      return false;
    }

    // Parser le JSON
    try {
      const parsed = JSON.parse(combinedContent);
      console.log('✅ Test Gemini API réussi:', parsed);
      return true;
    } catch (parseError) {
      console.error('❌ Error parsing JSON:', parseError);
      console.error('❌ Raw content:', combinedContent);
      return false;
    }

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    return false;
  }
};

// Fonction pour ajouter un bouton de test dans la page
export const addTestButtonToPage = () => {
  const button = document.createElement('button');
  button.textContent = 'Tester API Gemini';
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #3b82f6;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `;
  
  button.onclick = async () => {
    button.textContent = 'Test en cours...';
    button.style.background = '#f59e0b';
    
    const success = await testGeminiAPI();
    
    if (success) {
      button.textContent = '✅ API OK';
      button.style.background = '#10b981';
    } else {
      button.textContent = '❌ API KO';
      button.style.background = '#ef4444';
    }
    
    setTimeout(() => {
      button.textContent = 'Tester API Gemini';
      button.style.background = '#3b82f6';
    }, 3000);
  };
  
  document.body.appendChild(button);
};
