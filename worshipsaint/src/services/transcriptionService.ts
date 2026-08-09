/* ------------------------------------------------------------------ */
/* Servicio de transcripción de audio → texto                         */
/* Usa la API de Groq (Whisper) para convertir audio grabado desde    */
/* el front en texto. El texto transcrito se visualiza en consola     */
/* (fase 1) para depuración antes de integrarlo al flujo del chat.    */
/* ------------------------------------------------------------------ */

interface TranscriptionResult {
  text: string;
}

interface TranscriptionService {
  transcribe(audioBlob: Blob, language?: string): Promise<string>;
}

class GroqTranscriptionService implements TranscriptionService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(
    apiKey = import.meta.env.PUBLIC_CHATBOT_API_KEY || '',
    baseUrl = import.meta.env.PUBLIC_TRANSCRIPTION_BASE_URL || 'https://api.groq.com/openai/v1/audio/transcriptions',
    model = import.meta.env.PUBLIC_TRANSCRIPTION_MODEL || 'whisper-large-v3'
  ) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.model = model;
  }

  /**
   * Transcribe un Blob de audio a texto usando la API de Groq.
   * @param audioBlob  Blob de audio (webm/wav/mp3) grabado desde el front.
   * @param language   Código de idioma ISO-639-1 (por defecto 'es').
   * @returns          Texto transcrito.
   */
  async transcribe(audioBlob: Blob, language = 'es'): Promise<string> {
    if (!this.apiKey) {
      const msg = 'La API key aún no está configurada. Agrega PUBLIC_CHATBOT_API_KEY en el archivo .env.';
      console.warn('[TranscriptionService]', msg);
      return msg;
    }

    // Determinar extensión según el tipo MIME del Blob
    const ext = this.getExtension(audioBlob.type);
    const fileName = `grabacion.${ext}`;

    const formData = new FormData();
    formData.append('file', audioBlob, fileName);
    formData.append('model', this.model);
    formData.append('language', language);
    formData.append('response_format', 'json');
    formData.append('temperature', '0');

    try {
      console.info('[TranscriptionService] Enviando audio a Groq...', {
        model: this.model,
        language,
        sizeBytes: audioBlob.size,
        mimeType: audioBlob.type
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`
          // Nota: NO setear Content-Type con FormData; el navegador lo hace
          // automáticamente con el boundary correcto.
        },
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status} — ${errText}`);
      }

      const data = (await response.json()) as TranscriptionResult;
      const text = data.text ?? '';

      // ── FASE 1: visualizar el texto transcrito en consola ──
      console.log('%c[TranscriptionService] Texto transcrito:', 'color:#C8A96A;font-weight:700;');
      console.log(text);

      return text.trim();
    } catch (error) {
      console.error('[TranscriptionService] Error al transcribir:', error);
      return 'Lo siento, no pude transcribir el audio en este momento.';
    }
  }

  /** Mapea el MIME type del Blob a una extensión válida para la API. */
  private getExtension(mimeType: string): string {
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('wav')) return 'wav';
    if (mimeType.includes('mp3')) return 'mp3';
    if (mimeType.includes('ogg')) return 'ogg';
    if (mimeType.includes('m4a')) return 'm4a';
    // Por defecto webm (formato nativo de MediaRecorder en Chrome)
    return 'webm';
  }
}

export const transcriptionService: TranscriptionService = new GroqTranscriptionService();
