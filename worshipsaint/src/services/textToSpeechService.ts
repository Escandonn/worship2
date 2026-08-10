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

class ApiTTSService implements TextToSpeechService {
  private defaultVoice = 'Kore';
  private queue: Promise<TTSResult> | null = null;

  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    const result = await this.synthesizeDetailed(text, options);
    return result.url;
  }

  async synthesizeDetailed(text: string, options?: TTSOptions): Promise<TTSResult> {
    const voice = options?.voice ?? this.defaultVoice;

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

    this.queue = this.doRequest(text, voice);
    return this.queue;
  }

  private async doRequest(text: string, voice: string): Promise<TTSResult> {
    const maxAttempts = 2;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxAttempts) {
      attempt++;
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice })
        });

        if (response.status === 429) {
          const retryAfter = 2;
          console.warn(`[TTS] Rate limit alcanzado. Reintentando en ${retryAfter}s...`);
          await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Error desconocido' }));
          throw new Error(err.error || `HTTP ${response.status}`);
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
    throw new Error('downloadAudio no es compatible con la API de Gemini TTS.');
  }

  async downloadSubtitles(_fileId: string): Promise<string> {
    throw new Error('downloadSubtitles no es compatible con la API de Gemini TTS.');
  }

  async getVoices(): Promise<any[]> {
    return [
      { ShortName: 'Zephyr', Gender: 'Male', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Puck', Gender: 'Male', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Kore', Gender: 'Female', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Charon', Gender: 'Male', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Fenrir', Gender: 'Male', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Aoede', Gender: 'Female', Locale: 'es-CO', LocaleName: 'Español (Colombia)' },
      { ShortName: 'Leda', Gender: 'Female', Locale: 'es-CO', LocaleName: 'Español (Colombia)' }
    ];
  }

  async getVoicesByLocale(_locale: string): Promise<any[]> {
    return this.getVoices();
  }
}

export const textToSpeechService: TextToSpeechService = new ApiTTSService();
export type { TTSOptions, TTSResult, TextToSpeechService };
