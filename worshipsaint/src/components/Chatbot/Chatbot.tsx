import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { chatbotService } from '../../services/chatbotService';
import logo from '../../assets/logo.png';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'worship-chat-history';

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hola, soy WorshipBot. Soy tu asistente de WorshipSaint. Puedo hablarte sobre la marca, su propuesta, su filosofía y el mundo que queremos construir. ¿Qué te gustaría saber?'
  }
];

const Chatbot: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return initialMessages;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMessages;

    try {
      const parsed = JSON.parse(raw) as ChatMessage[];
      return parsed.length > 0 ? parsed : initialMessages;
    } catch {
      return initialMessages;
    }
  });
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, [isOpen, isMinimized, isFullscreen]);

  const handleSend = async () => {
    const trimmed = draft.trim();
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
        .slice(-8)
        .map((message) => ({ role: message.role, content: message.content }));

      const answer = await chatbotService.sendMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: answer
        }
      ]);
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
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleSend();
    }
  };

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
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>Asistente de soporte</div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
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
                      fontFamily: 'var(--ws-font)'
                    }}
                  >
                    Escribiendo...
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  padding: isMobile ? '0.8rem 0.9rem 1rem' : '0.9rem 1rem',
                  borderTop: '1px solid rgba(44,33,24,0.08)',
                  background: 'rgba(248,246,242,0.95)',
                  flexShrink: 0
                }}
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  style={{
                    flex: 1,
                    border: '1px solid rgba(44,33,24,0.12)',
                    borderRadius: '999px',
                    padding: '0.8rem 1rem',
                    outline: 'none',
                    fontFamily: 'var(--ws-font)',
                    background: '#fff'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    void handleSend();
                  }}
                  style={{
                    border: 'none',
                    borderRadius: '999px',
                    padding: '0.8rem 1rem',
                    background: 'linear-gradient(135deg, #c8a96a, #d6c3a5)',
                    color: '#2c2118',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--ws-font)'
                  }}
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
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
