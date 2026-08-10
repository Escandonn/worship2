interface ChatbotService {
  sendMessage(message: string, history?: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string>;
}

interface ChatMessagePayload {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class NgrokChatbotService implements ChatbotService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly systemPrompt: string;

  constructor(
    apiKey = import.meta.env.PUBLIC_CHATBOT_API_KEY || import.meta.env.PUBLIC_CHATBOT_URL || '',
    baseUrl = import.meta.env.PUBLIC_CHATBOT_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions',
    model = import.meta.env.PUBLIC_CHATBOT_MODEL || 'llama-3.3-70b-versatile',
    systemPrompt = import.meta.env.PUBLIC_CHATBOT_SYSTEM_PROMPT || 'Eres asistente de WorshipSaint. Responde en español. Muy breve: 1-3 frases cortas. NUNCA cortes la respuesta a la mitad. Completa siempre la última frase. Sin explicaciones largas.'
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
    this.systemPrompt = systemPrompt;
  }

  async sendMessage(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }> = []): Promise<string> {
    if (!this.apiKey) {
      return 'La API key aún no está configurada. Agrega PUBLIC_CHATBOT_API_KEY en el archivo .env.';
    }

    try {
      const messages: ChatMessagePayload[] = [
        { role: 'system', content: this.systemPrompt },
        ...history.map((entry): ChatMessagePayload => ({
          role: entry.role === 'assistant' ? 'assistant' : 'user',
          content: entry.content
        })),
        { role: 'user', content: message }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.8,
          max_completion_tokens: 150,
          top_p: 1,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? data.reply ?? data.message ?? data.output ?? 'Gracias por tu mensaje.';
    } catch (error) {
      console.error('Chatbot service error:', error);
      return 'Lo siento, no pude conectar con el servicio en este momento.';
    }
  }
}

export const chatbotService: ChatbotService = new NgrokChatbotService();
