interface ChatbotService {
  sendMessage(message: string, history?: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string>;
}

export const chatbotService: ChatbotService = {
  async sendMessage(message, history = []) {
    console.log('[ChatbotService] Enviando mensaje:', message);
    console.log('[ChatbotService] History length:', history.length);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, history })
      });

      console.log('[ChatbotService] Response status:', response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error('[ChatbotService] Error response:', data);
        throw new Error(data.reply || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('[ChatbotService] Success reply:', data.reply);
      return data.reply || 'Gracias por tu mensaje.';
    } catch (error) {
      console.error('Chatbot service error:', error);
      return 'Lo siento, no pude conectar con el servicio en este momento.';
    }
  }
};
