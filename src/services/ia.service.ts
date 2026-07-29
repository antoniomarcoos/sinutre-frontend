export async function sugerirRefeicao(descricao: string) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error('API Key do Gemini não configurada');
  }

  const prompt = `
    Você é um nutricionista especialista em alimentação saudável.
    
    O usuário pediu: "${descricao}"
    
    Sugira uma refeição completa usando alimentos que existem na tabela TACO brasileira.
    
    Retorne apenas um JSON com o seguinte formato exato, sem formatação markdown:
    {
      "nome": "Nome criativo para a refeição",
      "alimentos": [
        { "nome": "Nome do alimento", "quantidade": 100, "unidade": "g" }
      ],
      "dicas": ["Dica 1", "Dica 2"]
    }
    
    Seja específico com os nomes dos alimentos. Use apenas alimentos reais da tabela TACO.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        }
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Erro na API:', error);
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  try {
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Erro ao parsear resposta da IA:', error);
    return null;
  }
}