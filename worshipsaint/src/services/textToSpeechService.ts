interface TTSOptions {
  voice?: string;
}

interface TTSResult {
  url: string;
  fileId: string;
  sizeBytes: number;
}

interface TextToSpeechService {
  synthesize(text: string, options?: TTSOptions): Promise<string>;
  synthesizeDetailed(text: string, options?: TTSOptions): Promise<TTSResult>;
  downloadAudio(fileId: string): Promise<Blob>;
  downloadSubtitles(fileId: string): Promise<string>;
  getVoices(): Promise<any[]>;
  getVoicesByLocale(locale: string): Promise<any[]>;
}

class ExternalTTSService implements TextToSpeechService {
  private defaultVoice = 'Kore';
  private queue: Promise<TTSResult> | null = null;

  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    const result = await this.synthesizeDetailed(text, options);
    return result.url;
  }

  async synthesizeDetailed(text: string, _options?: TTSOptions): Promise<TTSResult> {
    if (!text.trim()) {
      return { url: '', fileId: '', sizeBytes: 0 };
    }

    if (this.queue) {
      try {
        await this.queue;
      } catch {
        this.queue = null;
      }
    }

    this.queue = this.doRequest(text);
    return this.queue;
  }

  private async doRequest(text: string): Promise<TTSResult> {
    const maxAttempts = 2;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const response = await fetch('https://api-voz-python-vercel.vercel.app/api/tts/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });

        if (response.status === 429) {
          const retryAfter = 2;
          console.warn(`[TTS] Rate limit alcanzado. Reintentando en ${retryAfter}s...`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        if (!response.ok) {
          const err = await response.text().catch(() => 'Error desconocido');
          throw new Error(`HTTP ${response.status}: ${err}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        return {
          url,
          fileId: '',
          sizeBytes: blob.size
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[TTS] Error intento ${attempt}:`, lastError.message);
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }

    throw lastError ?? new Error('Error desconocido en TTS');
  }

  async downloadAudio(_fileId: string): Promise<Blob> {
    throw new Error('downloadAudio no es compatible con la API de TTS externa.');
  }

  async downloadSubtitles(_fileId: string): Promise<string> {
    throw new Error('downloadSubtitles no es compatible con la API de TTS externa.');
  }

  async getVoices(): Promise<any[]> {
    return [
      { ShortName: 'Kore', Gender: 'Female', Locale: 'es-CO', LocaleName: 'Español (Colombia)' }
    ];
  }

  async getVoicesByLocale(_locale: string): Promise<any[]> {
    return this.getVoices();
  }
}

export const textToSpeechService: TextToSpeechService = new ExternalTTSService();
export type { TTSOptions, TTSResult, TextToSpeechService };
