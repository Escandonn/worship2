/* ------------------------------------------------------------------ */
/* Endpoint proxy para FreeTTS API.                                   */
/* Evita problemas de CORS al hacer la petición desde el servidor.    */
/*                                                                    */
/* Uso:                                                               */
/*   POST /api/tts  → body: { text, voice?, rate?, pitch? }          */
/*   Devuelve el MP3 directamente (Content-Type: audio/mpeg)         */
/* ------------------------------------------------------------------ */

import type { APIRoute } from 'astro';

// Necesario para que el endpoint acepte POST (server-rendered en modo static)
export const prerender = false;

const TTS_BASE_URL = import.meta.env.PUBLIC_TTS_BASE_URL ?? 'https://freetts.org/api';
const FREE_TIER_CHAR_LIMIT = 1000;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const text: string = body?.text ?? '';
    const voice: string = body?.voice ?? 'es-ES-ElviraNeural';
    const rate: string = body?.rate ?? '+0%';
    const pitch: string = body?.pitch ?? '+0Hz';

    if (!text.trim()) {
      return new Response(JSON.stringify({ error: 'Texto vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Truncar al límite del plan free
    const safeText = text.slice(0, FREE_TIER_CHAR_LIMIT);

    // 1. Generar audio → obtener file_id
    const ttsResponse = await fetch(`${TTS_BASE_URL}/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: safeText, voice, rate, pitch })
    });

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text().catch(() => '');
      return new Response(
        JSON.stringify({ error: `FreeTTS POST /tts HTTP ${ttsResponse.status}`, detail: errText }),
        { status: ttsResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = (await ttsResponse.json()) as { file_id: string };
    const fileId = data.file_id;

    if (!fileId) {
      return new Response(JSON.stringify({ error: 'FreeTTS no devolvió file_id' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Descargar el MP3 y devolverlo al cliente
    const audioResponse = await fetch(`${TTS_BASE_URL}/audio/${fileId}`);
    if (!audioResponse.ok) {
      return new Response(
        JSON.stringify({ error: `FreeTTS GET /audio HTTP ${audioResponse.status}` }),
        { status: audioResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const audioBuffer = await audioResponse.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('[/api/tts] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor', detail: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
