import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.PUBLIC_CHATBOT_API_KEY;
  const baseUrl = import.meta.env.PUBLIC_CHATBOT_BASE_URL || 'https://api.groq.com/openai/v1/chat/completions';
  const systemPrompt = import.meta.env.PUBLIC_CHATBOT_SYSTEM_PROMPT || 'Eres asistente de WorshipSaint. Responde en español. Máximo 2 frases cortas. Completa siempre la última frase. Sin listas, sin explicaciones largas.';

  console.log('[API Chatbot] API key cargada:', apiKey ? 'Sí' : 'No');
  console.log('[API Chatbot] Base URL:', baseUrl);

  if (!apiKey) {
    return new Response(JSON.stringify({ reply: 'La API key del chatbot no está configurada en el servidor.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ reply: 'Solicitud inválida.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(body.history || []).map((entry) => ({ role: entry.role === 'assistant' ? 'assistant' : 'user', content: entry.content })),
    { role: 'user', content: body.message }
  ];

  const requestBody = { messages, temperature: 0.8, max_completion_tokens: 220, top_p: 1, stream: false };

  const tryModels = async (models: string[]) => {
    for (const model of models) {
      console.log('[API Chatbot] Intentando modelo:', model);
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ ...requestBody, model })
      });

      const text = await response.text();
      console.log('[API Chatbot] Modelo', model, 'status:', response.status);

      if (response.ok) {
        const data = JSON.parse(text);
        const raw = data.choices?.[0]?.message?.content ?? '';
        const cleaned = raw.replace(/\s+/g, ' ').trim();
        return { reply: cleaned || 'Gracias por tu mensaje.', status: 200 };
      }

      let errorMessage = text;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error?.message || text;
      } catch {
        errorMessage = text || errorMessage;
      }
      console.log('[API Chatbot] Modelo', model, 'falló:', errorMessage);

      if (response.status !== 404 && response.status !== 400) {
        return { reply: errorMessage || `Error del servicio (${response.status}).`, status: response.status };
      }
    }

    return { reply: 'No pude encontrar un modelo disponible en este momento. Revisa tu API key o disponibilidad en Groq.', status: 502 };
  };

  const configuredModel = (import.meta.env.PUBLIC_CHATBOT_MODEL || '').trim();

  try {
    let modelsToTry = [...(configuredModel ? [configuredModel] : [])];

    if (!configuredModel) {
      const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` }
      });

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json();
        const availableModels = (modelsData.data || []).map((m: { id: string }) => m.id);
        const preferred = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama3-8b-8192', 'llama3-70b-8192', 'gemma2-9b-it'];
        const filtered = preferred.filter((m) => availableModels.includes(m));
        modelsToTry = [...modelsToTry, ...(filtered.length ? filtered : availableModels.slice(0, 5))];
      }
    }

    if (!modelsToTry.length) {
      modelsToTry = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'llama3-8b-8192', 'llama3-70b-8192', 'gemma2-9b-it'];
    }

    const result = await tryModels(modelsToTry);
    return new Response(JSON.stringify({ reply: result.reply }), { status: result.status, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[API Chatbot] Error de red:', error);
    return new Response(JSON.stringify({ reply: 'No pude conectar con el servicio en este momento.' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
};
