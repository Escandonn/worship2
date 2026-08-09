/* ------------------------------------------------------------------ */
/* Servicio de texto → voz (TTS)                                       */
/*                                                                    */
/* Motor principal: Web Speech API (speechSynthesis)                   */
/*   - Funciona 100% en el navegador, sin API key ni CORS.            */
/*   - Disponible en todos los navegadores modernos.                   */
/*                                                                    */
/* Fallback opcional: proxy /api/tts → FreeTTS API                    */
/*   - Requiere API key (PUBLIC_TTS_API_KEY) para uso programático.   */
/*   - Se usa solo si Web Speech API no está disponible.              */
/*                                                                    */
/* Configuración por variables de entorno (opcional):                */
/*   PUBLIC_TTS_VOICE  → voz preferida (default: primera voz es-ES)  */
/*   PUBLIC_TTS_RATE   → velocidad 0.5–2.0 (default: 1.0)            */
/*   PUBLIC_TTS_PITCH  → tono 0–2 (default: 1.0)                     */
/* ------------------------------------------------------------------ */

/* ----------------------------- Tipos ------------------------------ */

interface TTSOptions {
  /** Nombre de la voz (ej: 'Google español', 'es-ES'). */
  voice?: string;
  /** Velocidad de habla. Rango: 0.5 (lento) a 2.0 (rápido). Default: 1.0. */
  rate?: number;
  /** Tono. Rango: 0 (grave) a 2 (agudo). Default: 1.0. */
  pitch?: number;
}

interface TTSVoice {
  /** Nombre de la voz para usar con SpeechSynthesisVoice. */
  ShortName: string;
  /** Género de la voz: 'Female' | 'Male' | 'Unknown'. */
  Gender: string;
  /** Locale, ej: es-ES, en-US. */
  Locale: string;
  /** Nombre legible del locale, ej: 'Spanish (Spain)'. */
  LocaleName: string;
}

interface TTSResult {
  /** URL reproducible (blob: para FreeTTS, o marcador 'speechsynthesis:' para Web Speech). */
  url: string;
  /** file_id (FreeTTS) o '' (Web Speech). */
  fileId: string;
  /** Tamaño del audio en bytes (0 para Web Speech). */
  sizeBytes: number;
}

interface TextToSpeechService {
  /** Genera audio a partir de texto y devuelve una URL reproducible. */
  synthesize(text: string, options?: TTSOptions): Promise<string>;
  /** Genera audio y devuelve información completa (url, fileId, size). */
  synthesizeDetailed(text: string, options?: TTSOptions): Promise<TTSResult>;
  /** Descarga el MP3 como Blob a partir de un file_id (solo FreeTTS). */
  downloadAudio(fileId: string): Promise<Blob>;
  /** Descarga los subtítulos SRT a partir de un file_id (solo FreeTTS). */
  downloadSubtitles(fileId: string): Promise<string>;
  /** Obtiene la lista de voces disponibles. */
  getVoices(): Promise<TTSVoice[]>;
  /** Filtra voces por locale (ej: 'es-ES', 'en-US'). */
  getVoicesByLocale(locale: string): Promise<TTSVoice[]>;
}

/* --------------------------- Constantes --------------------------- */

/**
 * URL base del endpoint FreeTTS (fallback opcional).
 * Se usa solo si la Web Speech API no está disponible.
 */
const FREE_TTS_BASE_URL =
  import.meta.env.PUBLIC_TTS_BASE_URL ?? 'https://freetts.org/api';

/** Límite de caracteres del plan free de FreeTTS. */
const FREE_TIER_CHAR_LIMIT = 1000;

/** Voces en español recomendadas para la marca WorshipSaint. */
const SPANISH_VOICES = [
  'es-ES-ElviraNeural',   // Femenina, España
  'es-ES-AlvaroNeural',   // Masculina, España
  'es-MX-DaliaNeural',    // Femenina, México
  'es-MX-JorgeNeural',    // Masculina, México
  'es-AR-ElenaNeural',    // Femenina, Argentina
  'es-AR-TomasNeural',    // Masculina, Argentina
  'es-CO-SalomeNeural',   // Femenina, Colombia
  'es-CO-GonzaloNeural',  // Masculino, Colombia
  'es-CL-CatalinaNeural', // Femenina, Chile
  'es-CL-LorenzoNeural'   // Masculino, Chile
] as const;

/* --------------------------- Utilidades --------------------------- */

/**
 * Valida y normaliza el parámetro rate (Web Speech API).
 * Rango válido: 0.5 a 2.0. Default: 1.0.
 */
function normalizeRate(rate?: number): number {
  if (rate === undefined || rate === null || Number.isNaN(rate)) return 1.0;
  const clamped = Math.max(0.5, Math.min(2.0, rate));
  return clamped;
}

/**
 * Valida y normaliza el parámetro pitch (Web Speech API).
 * Rango válido: 0 a 2. Default: 1.0.
 */
function normalizePitch(pitch?: number): number {
  if (pitch === undefined || pitch === null || Number.isNaN(pitch)) return 1.0;
  const clamped = Math.max(0, Math.min(2, pitch));
  return clamped;
}

/**
 * Comprueba si la Web Speech API está disponible en el navegador.
 */
function hasWebSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/* --------------------------- Servicio ----------------------------- */

/**
 * Servicio de TTS basado en la Web Speech API del navegador.
 * No requiere API key ni servidor. FreeTTS se mantiene como fallback opcional.
 */
class WebSpeechTTS implements TextToSpeechService {
  private readonly defaultVoice: string;
  private readonly defaultRate: number;
  private readonly defaultPitch: number;
  /** Caché de voces de SpeechSynthesis. */
  private voicesCache: TTSVoice[] | null = null;
  /** Promesa de carga de voces (se resuelve tras 'voiceschanged'). */
  private voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  constructor(
    defaultVoice = import.meta.env.PUBLIC_TTS_VOICE ?? 'es-ES-ElviraNeural',
    defaultRate = import.meta.env.PUBLIC_TTS_RATE ?? '1.0',
    defaultPitch = import.meta.env.PUBLIC_TTS_PITCH ?? '1.0'
  ) {
    this.defaultVoice = defaultVoice;
    this.defaultRate = normalizeRate(Number(defaultRate));
    this.defaultPitch = normalizePitch(Number(defaultPitch));
  }

  /**
   * Carga las voces de SpeechSynthesis de forma asíncrona.
   * En algunos navegadores las voces llegan tras el evento 'voiceschanged'.
   */
  private loadVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesPromise) return this.voicesPromise;

    this.voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
      if (!hasWebSpeech()) {
        resolve([]);
        return;
      }

      const synth = window.speechSynthesis;
      let resolved = false;
      const finish = (voices: SpeechSynthesisVoice[]) => {
        if (resolved) return;
        resolved = true;
        synth.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(voices);
      };

      const onVoicesChanged = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) finish(voices);
      };

      // Intento inmediato
      const immediate = synth.getVoices();
      if (immediate.length > 0) {
        finish(immediate);
        return;
      }

      // Esperar el evento
      synth.addEventListener('voiceschanged', onVoicesChanged);

      // Timeout de seguridad (2s)
      window.setTimeout(() => finish(synth.getVoices()), 2000);
    });

    return this.voicesPromise;
  }

  /**
   * Selecciona la mejor voz disponible según el nombre solicitado.
   * Orden de prioridad: nombre exacto → locale → base del idioma → default.
   */
  private pickVoice(
    voices: SpeechSynthesisVoice[],
    requested: string
  ): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    // 1. Coincidencia exacta por nombre
    const byName = voices.find((v) => v.name === requested);
    if (byName) return byName;

    // 2. Coincidencia por locale (ej: 'es-ES')
    const byLocale = voices.find((v) => v.lang === requested);
    if (byLocale) return byLocale;

    // 3. Coincidencia por base del idioma (ej: 'es')
    const langBase = requested.split('-')[0].toLowerCase();
    const byLangBase = voices.find((v) =>
      v.lang.toLowerCase().startsWith(langBase)
    );
    if (byLangBase) return byLangBase;

    // 4. Voz por defecto del navegador
    const defaultVoice = voices.find((v) => v.default);
    if (defaultVoice) return defaultVoice;

    // 5. Primera voz disponible
    return voices[0] ?? null;
  }

  /**
   * Sintetiza texto a voz usando la Web Speech API.
   * @returns URL con marcador 'speechsynthesis:playing' (el audio se reproduce
   *          directamente vía speechSynthesis, no mediante un <audio>).
   */
  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    const result = await this.synthesizeDetailed(text, options);
    return result.url;
  }

  /**
   * Sintetiza texto a voz y devuelve información completa.
   * Usa Web Speech API si está disponible; si no, recurre al proxy FreeTTS.
   */
  async synthesizeDetailed(text: string, options?: TTSOptions): Promise<TTSResult> {
    const voiceName = options?.voice ?? this.defaultVoice;
    const rate = normalizeRate(options?.rate ?? this.defaultRate);
    const pitch = normalizePitch(options?.pitch ?? this.defaultPitch);

    if (!text.trim()) {
      console.warn('[TextToSpeechService] Texto vacío, no se sintetiza.');
      return { url: '', fileId: '', sizeBytes: 0 };
    }

    // Web Speech API disponible → usarla
    if (hasWebSpeech()) {
      const voices = await this.loadVoices();
      const picked = this.pickVoice(voices, voiceName);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      if (picked) {
        utterance.voice = picked;
        utterance.lang = picked.lang;
      }

      // Cancelar cualquier reproducción previa
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      console.info('[TextToSpeechService] Reproduciendo vía Web Speech API:', {
        voice: picked?.name ?? 'default',
        lang: picked?.lang ?? 'default',
        rate,
        pitch,
        length: text.length
      });

      return { url: 'speechsynthesis:playing', fileId: '', sizeBytes: 0 };
    }

    // Fallback: proxy FreeTTS (requiere API key para uso programático)
    return this.synthesizeViaFreeTTS(text, voiceName, rate, pitch);
  }

  /**
   * Fallback opcional vía proxy /api/tts (FreeTTS).
   * Actualmente devuelve 403 sin API key; se mantiene para uso futuro.
   */
  private async synthesizeViaFreeTTS(
    text: string,
    voice: string,
    rate: number,
    pitch: number
  ): Promise<TTSResult> {
    if (text.length > FREE_TIER_CHAR_LIMIT) {
      console.warn(
        `[TextToSpeechService] Texto de ${text.length} caracteres truncado a ${FREE_TIER_CHAR_LIMIT}.`
      );
    }
    const safeText = text.slice(0, FREE_TIER_CHAR_LIMIT);

    const body = JSON.stringify({ text: safeText, voice, rate, pitch });

    console.info('[TextToSpeechService] Fallback FreeTTS → proxy /api/tts...', {
      voice,
      rate,
      pitch,
      length: safeText.length
    });

    try {
      const proxyResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });

      if (!proxyResponse.ok) {
        const errText = await proxyResponse.text().catch(() => '');
        throw new Error(`POST /api/tts HTTP ${proxyResponse.status} — ${errText}`);
      }

      const audioBlob = await proxyResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return { url: audioUrl, fileId: '', sizeBytes: audioBlob.size };
    } catch (error) {
      console.error('[TextToSpeechService] Error en fallback FreeTTS:', error);
      return { url: '', fileId: '', sizeBytes: 0 };
    }
  }

  /**
   * Descarga el MP3 generado a partir de un file_id (FreeTTS).
   * El archivo está disponible 1 hora tras la generación.
   */
  async downloadAudio(fileId: string): Promise<Blob> {
    const response = await fetch(`${FREE_TTS_BASE_URL}/audio/${fileId}`);
    if (!response.ok) {
      throw new Error(`GET /audio HTTP ${response.status}`);
    }
    return response.blob();
  }

  /**
   * Descarga los subtítulos SRT generados a partir de un file_id (FreeTTS).
   */
  async downloadSubtitles(fileId: string): Promise<string> {
    const response = await fetch(`${FREE_TTS_BASE_URL}/srt/${fileId}`);
    if (!response.ok) {
      throw new Error(`GET /srt HTTP ${response.status}`);
    }
    return response.text();
  }

  /**
   * Obtiene la lista de voces disponibles.
   * Prioriza las voces de SpeechSynthesis; si no, recurre a FreeTTS /voices.
   */
  async getVoices(): Promise<TTSVoice[]> {
    if (this.voicesCache) return this.voicesCache;

    if (hasWebSpeech()) {
      const synthVoices = await this.loadVoices();
      if (synthVoices.length > 0) {
        this.voicesCache = synthVoices.map((v) => ({
          ShortName: v.name,
          Gender: '',
          Locale: v.lang,
          LocaleName: v.lang
        }));
        return this.voicesCache;
      }
    }

    // Fallback FreeTTS
    const response = await fetch(`${FREE_TTS_BASE_URL}/voices`);
    if (!response.ok) {
      throw new Error(`GET /voices HTTP ${response.status}`);
    }
    const voices = (await response.json()) as TTSVoice[];
    this.voicesCache = voices;
    return voices;
  }

  /**
   * Filtra voces por locale (ej: 'es-ES', 'en-US').
   */
  async getVoicesByLocale(locale: string): Promise<TTSVoice[]> {
    const voices = await this.getVoices();
    return voices.filter((v) => v.Locale === locale);
  }
}

/* ----------------------------- Export ------------------------------ */

export const textToSpeechService: TextToSpeechService = new WebSpeechTTS();
export { SPANISH_VOICES, normalizeRate, normalizePitch, hasWebSpeech };
export type { TTSOptions, TTSVoice, TTSResult, TextToSpeechService };
