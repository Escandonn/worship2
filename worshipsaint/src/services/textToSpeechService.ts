/* ------------------------------------------------------------------ */
/* Servicio de texto → voz (TTS)                                       */
/* Usa la API de FreeTTS (https://freetts.org/api) para generar       */
/* audio MP3 a partir de texto. No requiere autenticación.            */
/*                                                                    */
/* Flujo:                                                             */
/*   1. POST /tts  → devuelve { file_id }                             */
/*   2. GET  /audio/{file_id} → devuelve el MP3                       */
/* ------------------------------------------------------------------ */

interface TTSOptions {
  voice?: string;
  rate?: string;
  pitch?: string;
}

interface TextToSpeechService {
  /** Genera audio a partir de texto y devuelve una URL reproducible. */
  synthesize(text: string, options?: TTSOptions): Promise<string>;
  /** Descarga el MP3 como Blob a partir de un file_id. */
  downloadAudio(fileId: string): Promise<Blob>;
}

const BASE_URL = 'https://freetts.org/api';

class FreeTTSService implements TextToSpeechService {
  private readonly defaultVoice: string;

  constructor(defaultVoice = 'es-ES-ElviraNeural') {
    this.defaultVoice = defaultVoice;
  }

  /**
   * Sintetiza texto a voz.
   * @param text    Texto a convertir (máx 1000 caracteres en plan free).
   * @param options voice, rate, pitch opcionales.
   * @returns URL de objeto (blob:) lista para reproducir en un <audio>.
   */
  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    const voice = options?.voice ?? this.defaultVoice;
    const rate = options?.rate ?? '+0%';
    const pitch = options?.pitch ?? '+0Hz';

    if (!text.trim()) {
      console.warn('[TextToSpeechService] Texto vacío, no se sintetiza.');
      return '';
    }

    // Truncar a 1000 caracteres (límite del plan free)
    const safeText = text.slice(0, 1000);

    const body = JSON.stringify({ text: safeText, voice, rate, pitch });

    console.info('[TextToSpeechService] Enviando texto a FreeTTS...', {
      voice,
      rate,
      pitch,
      length: safeText.length
    });

    try {
      // 1. Generar audio → obtener file_id
      const ttsResponse = await fetch(`${BASE_URL}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!ttsResponse.ok) {
        const errText = await ttsResponse.text().catch(() => '');
        throw new Error(`POST /tts HTTP ${ttsResponse.status} — ${errText}`);
      }

      const data = (await ttsResponse.json()) as { file_id: string };
      const fileId = data.file_id;

      if (!fileId) {
        throw new Error('FreeTTS no devolvió un file_id válido.');
      }

      console.log('[TextToSpeechService] file_id recibido:', fileId);

      // 2. Descargar el MP3 como Blob y crear URL reproducible
      const audioBlob = await this.downloadAudio(fileId);
      const audioUrl = URL.createObjectURL(audioBlob);

      console.log('[TextToSpeechService] Audio listo para reproducir:', {
        sizeBytes: audioBlob.size,
        url: audioUrl
      });

      return audioUrl;
    } catch (error) {
      console.error('[TextToSpeechService] Error al sintetizar:', error);
      return '';
    }
  }

  /**
   * Descarga el MP3 generado a partir de un file_id.
   * El archivo está disponible 1 hora tras la generación.
   */
  async downloadAudio(fileId: string): Promise<Blob> {
    const response = await fetch(`${BASE_URL}/audio/${fileId}`);
    if (!response.ok) {
      throw new Error(`GET /audio HTTP ${response.status}`);
    }
    return response.blob();
  }
}

export const textToSpeechService: TextToSpeechService = new FreeTTSService();
export type { TTSOptions, TextToSpeechService };
