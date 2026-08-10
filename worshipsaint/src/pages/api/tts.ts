import type { APIRoute } from 'astro';

export const prerender = false;

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
const GEMINI_TTS_MODEL = 'gemini-3.1-flash-tts-preview';
const GEMINI_TTS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const text = body?.text?.trim();
    const voice = body?.voice || 'Kore';

    if (!text) {
      return new Response(JSON.stringify({ error: 'El texto es obligatorio.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key de Gemini no configurada en el servidor.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch(`${GEMINI_TTS_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GEMINI_TTS_MODEL,
        input: `Lee en español colombiano, natural, claro, profesional. Texto: ${text}`,
        response_format: {
          type: 'audio'
        },
        generation_config: {
          speech_config: [
            {
              voice: voice
            }
          ]
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido');
      return new Response(
        JSON.stringify({ error: `HTTP ${response.status}: ${errorText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    const audioContent = data.steps?.[0]?.content?.find(
      (item: { mime_type?: string; data?: string }) => item.mime_type === 'audio/l16'
    );

    if (!audioContent?.data) {
      return new Response(
        JSON.stringify({ error: 'Gemini respondió correctamente, pero no se encontró el audio.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pcmData = base64ToUint8Array(audioContent.data);
    const wavBlob = buildWavBlob(pcmData);

    return new Response(wavBlob, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'inline; filename="gemini-tts.wav"',
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

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function buildWavBlob(pcmData: Uint8Array): Blob {
  const sampleRate = 24000;
  const channels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmData.length;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  new Uint8Array(buffer, 44).set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}
