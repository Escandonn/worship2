import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { chatbotService } from '../../services/chatbotService';
import { textToSpeechService } from '../../services/textToSpeechService';
import VoiceRecorder from '../VoiceRecorder';
import logo from '../../assets/logo.png';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hola, soy WorshipBot. Puedes escribirme o hablarme. También puedes escuchar mis respuestas.'
  }
];

type MessageAction = 'none' | 'voice' | 'text' | 'both';

const Chatbot: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMode, setResponseMode] = useState<'text' | 'voice'>('text');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fromVoiceRef = useRef(false);
  const responseModeRef = useRef<'text' | 'voice'>('text');
  useEffect(() => {
    responseModeRef.current = responseMode;
  }, [responseMode]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, [isOpen, isMinimized, isFullscreen]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }, []);

  const playText = useCallback(async (text: string, messageId: number) => {
    if (!text.trim()) return;
    stopSpeaking();
    setSpeakingMessageId(messageId);
    setIsSpeaking(true);
    try {
      console.log('[Chatbot] Solicitando síntesis de voz...');
      const audioUrl = await textToSpeechService.synthesize(text);
      if (!audioUrl) {
        console.error('[Chatbot] synthesize() devolvió URL vacía.');
        stopSpeaking();
        return;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        console.log('[Chatbot] Reproducción finalizada.');
        stopSpeaking();
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = (e) => {
        console.error('[Chatbot] Error en elemento <audio>:', e, audio.error);
        stopSpeaking();
        URL.revokeObjectURL(audioUrl);
      };
      audio.load();
      try {
        await audio.play();
        console.log('[Chatbot] Reproducción iniciada correctamente.');
      } catch (playErr) {
        console.warn('[Chatbot] play() rechazado por el navegador:', playErr);
        stopSpeaking();
      }
    } catch (err) {
      console.error('[Chatbot] Error al reproducir voz:', err);
      stopSpeaking();
    }
  }, [stopSpeaking]);

  const handleAction = useCallback((action: MessageAction, messageId: number, text: string) => {
    if (action === 'voice' || action === 'both') {
      void playText(text, messageId);
    }
    if (action === 'text' || action === 'both') {
      setResponseMode('text');
    }
    if (action === 'voice') {
      setResponseMode('voice');
    }
  }, [playText]);

  const handleSend = async (overrideText?: string) => {
    const trimmed = (overrideText ?? draft).trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setIsLoading(true);

    try {
      const history = messages
        .slice(-4)
        .map((message) => ({ role: message.role, content: message.content }));

      const answer = await chatbotService.sendMessage(trimmed, history);
      const cleanAnswer = answer.replace(/\s+/g, ' ').trim();
      const assistantMessageId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: cleanAnswer
        }
      ]);

      if (responseModeRef.current === 'voice') {
        void playText(cleanAnswer, assistantMessageId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'assistant',
          content: 'Lo siento, no pude conectar con el servicio ahora mismo. Inténtalo más tarde.'
        }
      ]);
    } finally {
      setIsLoading(false);
      fromVoiceRef.current = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleTranscription = useCallback((text: string) => {
    console.log('%c[Chatbot] Audio transcrito:', 'color:#C8A96A;font-weight:700;', text);
    fromVoiceRef.current = true;
    void handleSend(text);
  }, [handleSend]);

  const panelStyle = isMobile
    ? {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 200,
        background: 'linear-gradient(135deg, rgba(248,246,242,0.98), rgba(236,229,218,0.98))',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden'
      }
    : {
        position: 'fixed' as const,
        right: '1.25rem',
        bottom: '1.25rem',
        width: 'min(92vw, 400px)',
        height: 'min(78vh, 720px)',
        zIndex: 200,
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(44,33,24,0.18)',
        border: '1px solid rgba(200,169,106,0.25)',
        background: 'rgba(248,246,242,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column' as const
      };

  return (
    <>
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: '1.5rem',
            zIndex: 210,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--ws-font)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#2c2118',
              background: 'rgba(248,246,242,0.92)',
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid rgba(200,169,106,0.35)',
              boxShadow: '0 8px 24px rgba(44,33,24,0.12)',
              whiteSpace: 'nowrap'
            }}
          >
            Habla conmigo
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '999px',
              border: '2px solid rgba(200,169,106,0.45)',
              background: 'linear-gradient(135deg, #c8a96a, #d6c3a5)',
              cursor: 'pointer',
              boxShadow: '0 16px 40px rgba(200,169,106,0.4)',
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease'
            }}
            aria-label="Abrir chat"
          >
            <img
              src={logo.src}
              alt="WorshipSaint"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '999px'
              }}
            />
          </button>
        </div>
      )}

      {isOpen && (
        <div style={panelStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '0.9rem 1rem' : '0.9rem 1rem',
              background: 'linear-gradient(135deg, #2c2118, #4a3424)',
              color: '#f8f6f2',
              fontFamily: 'var(--ws-font)',
              flexShrink: 0
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.05rem' }}>WorshipBot</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Asistente de soporte
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: responseMode === 'voice' ? '#c8a96a' : '#6b7280',
                    boxShadow: responseMode === 'voice' ? '0 0 8px rgba(200,169,106,0.6)' : 'none'
                  }}
                />
                {responseMode === 'voice' ? 'Voz activa' : 'Texto activo'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setResponseMode((prev) => (prev === 'text' ? 'voice' : 'text'));
                }}
                style={{
                  ...buttonStyle,
                  width: 'auto',
                  padding: '0 0.7rem',
                  height: '32px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  gap: '0.3rem',
                  background:
                    responseMode === 'voice'
                      ? 'linear-gradient(135deg, #c8a96a, #d6c3a5)'
                      : 'rgba(255,255,255,0.12)',
                  color: responseMode === 'voice' ? '#2c2118' : '#fff',
                  border:
                    responseMode === 'voice'
                      ? '1px solid rgba(200,169,106,0.6)'
                      : '1px solid rgba(255,255,255,0.18)'
                }}
                aria-label={
                  responseMode === 'voice'
                    ? 'Modo voz activado. Cambiar a texto'
                    : 'Modo texto activado. Cambiar a voz'
                }
                title={
                  responseMode === 'voice'
                    ? 'Respuestas en voz (clic para cambiar a texto)'
                    : 'Respuestas en texto (clic para cambiar a voz)'
                }
              >
                {responseMode === 'voice' ? '🔊 Voz' : '💬 Texto'}
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                style={buttonStyle}
                aria-label={isMinimized ? 'Maximizar chat' : 'Minimizar chat'}
              >
                {isMinimized ? '▢' : '—'}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                style={buttonStyle}
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? '⇲' : '⇱'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                  setIsFullscreen(false);
                }}
                style={buttonStyle}
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  padding: isMobile ? '0.9rem 0.9rem 1.2rem' : '1rem 1rem 1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(236,229,218,0.28))'
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: message.role === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
                      background: message.role === 'user' ? 'linear-gradient(135deg, #c8a96a, #d6c3a5)' : '#fff',
                      color: '#2c2118',
                      boxShadow: '0 8px 24px rgba(44,33,24,0.08)',
                      fontFamily: 'var(--ws-font)',
                      lineHeight: 1.45,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.content}
                    {message.role === 'assistant' && (
                      <>
                        <div
                          style={{
                            marginTop: '0.6rem',
                            paddingTop: '0.55rem',
                            borderTop: '1px solid rgba(44,33,24,0.08)',
                            display: 'flex',
                            gap: '0.4rem',
                            flexWrap: 'wrap'
                          }}
                        >
                          <ActionButton
                            label="Voz"
                            icon="🔊"
                            active={speakingMessageId === message.id}
                            title={speakingMessageId === message.id ? 'Reproduciendo...' : 'Escuchar respuesta'}
                            onClick={() => handleAction('voice', message.id, message.content)}
                            compact={isMobile}
                          />
                          <ActionButton
                            label="Texto"
                            icon="Aa"
                            active={responseMode === 'text'}
                            title="Mostrar como texto"
                            onClick={() => handleAction('text', message.id, message.content)}
                            compact={isMobile}
                          />
                          <ActionButton
                            label="Ambos"
                            icon="🔊Aa"
                            active={false}
                            title="Escuchar y ver respuesta"
                            onClick={() => handleAction('both', message.id, message.content)}
                            compact={isMobile}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '16px 16px 16px 6px',
                      background: '#fff',
                      color: '#7a674d',
                      fontStyle: 'italic',
                      fontFamily: 'var(--ws-font)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        border: '2px solid rgba(200,169,106,0.6)',
                        borderTopColor: '#c8a96a',
                        borderRadius: '50%',
                        animation: 'ws-spin 0.7s linear infinite'
                      }}
                    />
                    {responseMode === 'voice' ? 'Preparando audio…' : 'Escribiendo…'}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div
                style={{
                  padding: isMobile ? '0.8rem 0.9rem 1rem' : '0.9rem 1rem',
                  borderTop: '1px solid rgba(44,33,24,0.08)',
                  background: 'rgba(248,246,242,0.95)',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#fff',
                    border: '1px solid rgba(44,33,24,0.12)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.5rem',
                    boxShadow: '0 2px 8px rgba(44,33,24,0.04)'
                  }}
                >
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={responseMode === 'voice' ? 'Escribe o mantén presionado el micrófono…' : 'Escribe tu mensaje…'}
                    disabled={isLoading || isSpeaking}
                    style={{
                      flex: 1,
                      border: 'none',
                      borderRadius: '999px',
                      padding: '0.7rem 0.9rem',
                      outline: 'none',
                      fontFamily: 'var(--ws-font)',
                      background: 'transparent',
                      color: '#2c2118',
                      opacity: (isLoading || isSpeaking) ? 0.7 : 1
                    }}
                  />

                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <VoiceRecorder size={36} onTranscription={handleTranscription} />

                    <button
                      type="button"
                      onClick={() => {
                        void handleSend();
                      }}
                      disabled={isLoading || isSpeaking}
                      style={{
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.65rem 1rem',
                        background: 'linear-gradient(135deg, #c8a96a, #d6c3a5)',
                        color: '#2c2118',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'var(--ws-font)',
                        opacity: (isLoading || isSpeaking) ? 0.6 : 1
                      }}
                    >
                      {isLoading ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              width: '12px',
                              height: '12px',
                              border: '2px solid rgba(44,33,24,0.25)',
                              borderTopColor: '#2c2118',
                              borderRadius: '50%',
                              animation: 'ws-spin 0.7s linear infinite'
                            }}
                          />
                          {responseMode === 'voice' ? 'Grabando audio…' : 'Enviando…'}
                        </span>
                      ) : (
                        'Enviar'
                      )}
                    </button>
                  </div>
                </div>

                {(isLoading || isSpeaking) && (
                  <div
                    style={{
                      marginTop: '0.55rem',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '999px',
                      background: 'rgba(200,169,106,0.12)',
                      border: '1px solid rgba(200,169,106,0.25)',
                      fontFamily: 'var(--ws-font)',
                      fontSize: '0.78rem',
                      color: '#2c2118',
                      textAlign: 'center'
                    }}
                  >
                    {isLoading
                      ? responseMode === 'voice'
                        ? 'WorshipBot está preparando la respuesta…'
                        : 'WorshipBot está escribiendo…'
                      : 'Escucha la respuesta de WorshipBot…'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

const ActionButton: FC<{
  label: string;
  icon: string;
  active: boolean;
  title: string;
  onClick: () => void;
  compact?: boolean;
}> = ({ label, icon, active, title, onClick, compact }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      aria-label={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: compact ? '0.2rem 0.4rem' : '0.25rem 0.55rem',
        borderRadius: '999px',
        border: active
          ? '1px solid rgba(200,169,106,0.6)'
          : '1px solid rgba(44,33,24,0.1)',
        background: active
          ? 'linear-gradient(135deg, rgba(200,169,106,0.18), rgba(214,195,165,0.18))'
          : hovered
            ? 'rgba(44,33,24,0.04)'
            : 'transparent',
        color: active ? '#2c2118' : '#7a674d',
        fontSize: compact ? '0.7rem' : '0.78rem',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        fontFamily: 'var(--ws-font)',
        transition: 'all 0.15s ease',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: active ? '0 2px 8px rgba(200,169,106,0.15)' : 'none'
      }}
    >
      <span style={{ fontSize: compact ? '0.75rem' : '0.85rem' }}>{icon}</span>
      {!compact && <span>{label}</span>}
    </button>
  );
};

const buttonStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.12)',
  color: '#fff',
  width: '32px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
};

export default Chatbot;
