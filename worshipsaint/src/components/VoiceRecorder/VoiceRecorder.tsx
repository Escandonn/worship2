import { useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import { transcriptionService } from '../../services/transcriptionService';

/* ------------------------------------------------------------------ */
/* VoiceRecorder                                                       */
/* Componente de grabación de audio desde el front.                   */
/* FASE 1: graba audio → lo envía a Groq (Whisper) → muestra el      */
/* texto transcrito en consola y en el estado local para depuración. */
/* ------------------------------------------------------------------ */

interface VoiceRecorderProps {
  /** Se llama cuando la transcripción finaliza con el texto reconocido. */
  onTranscription?: (text: string) => void;
  /** Tamaño del botón en píxeles. */
  size?: number;
}

type RecorderStatus = 'idle' | 'recording' | 'processing';

const VoiceRecorder: FC<VoiceRecorderProps> = ({ onTranscription, size = 44 }) => {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      stopTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const startRecording = useCallback(async () => {
    setError('');
    setTranscript('');

    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = 'Tu navegador no soporta grabación de audio.';
      console.error('[VoiceRecorder]', msg);
      setError(msg);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Elegir el mejor formato soportado
      const mimeOptions = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/mp4'
      ];
      const mimeType = mimeOptions.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: audioType });

        console.log('[VoiceRecorder] Audio grabado:', {
          sizeBytes: blob.size,
          mimeType: blob.type,
          durationChunks: chunksRef.current.length
        });

        stopTracks();
        setStatus('processing');

        try {
          const text = await transcriptionService.transcribe(blob, 'es');
          setTranscript(text);
          console.log('[VoiceRecorder] Transcripción completa:', text);
          onTranscription?.(text);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          console.error('[VoiceRecorder] Falló la transcripción:', err);
          setError(msg);
        } finally {
          setStatus('idle');
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setStatus('recording');
      console.log('[VoiceRecorder] Grabando...');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo acceder al micrófono.';
      console.error('[VoiceRecorder] Error al iniciar grabación:', err);
      setError(msg);
      stopTracks();
      setStatus('idle');
    }
  }, [onTranscription]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    console.log('[VoiceRecorder] Deteniendo grabación...');
  }, []);

  const handleClick = () => {
    if (status === 'idle') {
      void startRecording();
    } else if (status === 'recording') {
      stopRecording();
    }
    // Si está 'processing', ignorar
  };

  const isRecording = status === 'recording';
  const isProcessing = status === 'processing';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isProcessing}
        aria-label={isRecording ? 'Detener grabación' : 'Grabar audio'}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: 'none',
          background: isRecording
            ? 'linear-gradient(135deg, #e05252, #c0392b)'
            : isProcessing
              ? 'rgba(200,169,106,0.4)'
              : 'linear-gradient(135deg, #c8a96a, #d6c3a5)',
          color: '#fff',
          cursor: isProcessing ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.15s ease, background 0.2s ease',
          transform: isRecording ? 'scale(1.08)' : 'scale(1)',
          boxShadow: isRecording
            ? '0 0 0 4px rgba(224,82,82,0.25)'
            : '0 4px 14px rgba(200,169,106,0.3)'
        }}
      >
        {isProcessing ? (
          /* Spinner */
          <span
            style={{
              width: 18,
              height: 18,
              border: '2px solid rgba(255,255,255,0.35)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'ws-spin 0.7s linear infinite'
            }}
          />
        ) : isRecording ? (
          /* Icono stop (cuadrado) */
          <span style={{ width: 14, height: 14, borderRadius: 2, background: '#fff' }} />
        ) : (
          /* Icono micrófono (SVG) */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>

      {isRecording && (
        <span style={{ fontSize: '0.7rem', color: '#c0392b', fontWeight: 600, fontFamily: 'var(--ws-font)' }}>
          Grabando...
        </span>
      )}
      {isProcessing && (
        <span style={{ fontSize: '0.7rem', color: '#7a674d', fontFamily: 'var(--ws-font)' }}>
          Transcribiendo...
        </span>
      )}
      {error && (
        <span style={{ fontSize: '0.7rem', color: '#c0392b', fontFamily: 'var(--ws-font)', maxWidth: 180, textAlign: 'center' }}>
          {error}
        </span>
      )}
      {/* El texto transcrito se muestra en consola (fase 1).
          Aquí se renderiza solo para depuración visual temporal. */}
      {transcript && (
        <span style={{ fontSize: '0.72rem', color: '#2c2118', fontFamily: 'var(--ws-font)', maxWidth: 200, textAlign: 'center', opacity: 0.7 }}>
          “{transcript}”
        </span>
      )}
    </div>
  );
};

export default VoiceRecorder;
