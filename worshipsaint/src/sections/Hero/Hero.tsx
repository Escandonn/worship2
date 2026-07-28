import React, { useEffect, useRef, memo } from 'react';
import type { FC, ReactNode, CSSProperties } from 'react';
import { BackgroundParticles } from '../../components/BackgroundParticles';

/* ------------------------------------------------------------------ */
/*  Frases Rotativas + Título Definitivo (Maquetación Previa Fija)     */
/* ------------------------------------------------------------------ */
const ROTATING_PHRASES = [
  'Pasión en cada proyecto.',
  'Tecnología con propósito.',
  'Diseño que trasciende.',
  'Comunidad que inspira.'
];

const FINAL_TITLE_TEXT = 'Diseño en código. Pasión en cancha. Conciencia en el ser. El ecosistema WorshipSaint.';
const FINAL_TITLE_WORDS = FINAL_TITLE_TEXT.split(' ');

/* ------------------------------------------------------------------ */
/*  Componente: Botón Magnético Premium (Zero React Re-render)          */
/* ------------------------------------------------------------------ */
interface MagneticButtonProps {
  href: string;
  variant: 'primary' | 'secondary';
  children: ReactNode;
  style?: CSSProperties;
}

const MagneticButton: FC<MagneticButtonProps> = memo(({ href, variant, children, style }) => {
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const isPrimary = variant === 'primary';

  const handleMouseEnter = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translateY(-2px) scale(1.02)';
    btnRef.current.style.boxShadow = isPrimary
      ? 'var(--ws-shadow-btn-hover)'
      : '0 15px 35px rgba(44, 33, 24, 0.12)';
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translateY(0) scale(1)';
    btnRef.current.style.boxShadow = isPrimary
      ? 'var(--ws-shadow-btn)'
      : 'var(--ws-shadow-card)';
  };

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.95rem 2.2rem',
        borderRadius: 'var(--ws-radius-btn)',
        background: isPrimary ? 'var(--ws-gradient-btn)' : 'var(--ws-gradient-btn-secondary)',
        color: 'var(--ws-text)',
        border: isPrimary ? 'none' : '1px solid rgba(44,33,24,0.12)',
        fontFamily: 'var(--ws-font)',
        fontWeight: 600,
        fontSize: '1rem',
        textDecoration: 'none',
        boxShadow: isPrimary ? 'var(--ws-shadow-btn)' : 'var(--ws-shadow-card)',
        transform: 'translateY(0) scale(1)',
        transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease',
        ...style
      }}
    >
      {children}
    </a>
  );
});

MagneticButton.displayName = 'MagneticButton';

/* ------------------------------------------------------------------ */
/*  Componente: Indicador de Scroll Elegante                            */
/* ------------------------------------------------------------------ */
interface ScrollIndicatorProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}

const ScrollIndicator: FC<ScrollIndicatorProps> = memo(({ buttonRef, onClick }) => {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-label="Desplazarse hacia abajo"
      style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(16px)',
        opacity: 0,
        transition: 'opacity 600ms ease, transform 600ms ease',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.4rem'
      }}
    >
      <span
        style={{
          fontFamily: 'var(--ws-font)',
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ws-text)',
          opacity: 0.75
        }}
      >
        Scroll
      </span>
      <div
        style={{
          width: '20px',
          height: '32px',
          borderRadius: '999px',
          border: '1.5px solid var(--ws-text)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '6px'
        }}
      >
        <div
          style={{
            width: '3px',
            height: '6px',
            borderRadius: '999px',
            background: 'var(--ws-accent)',
            animation: 'wsMouseWheel 2s infinite cubic-bezier(0.4, 0, 0.6, 1)'
          }}
        />
      </div>
    </button>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';

/* ------------------------------------------------------------------ */
/*  Componente Hero Principal (Optimizado para INP y Presentation Delay)*/
/* ------------------------------------------------------------------ */
const Hero: FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  // Direct DOM Refs para animaciones fuera de React
  const badgeRef = useRef<HTMLSpanElement | null>(null);
  const rotatingContainerRef = useRef<HTMLSpanElement | null>(null);
  const rotatingTextRef = useRef<HTMLSpanElement | null>(null);
  const finalContainerRef = useRef<HTMLSpanElement | null>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement | null>(null);

  // 1. Animaciones de entrada escalonadas y Typewriter (Fuera del ciclo React)
  useEffect(() => {
    const tBadge = requestAnimationFrame(() => {
      if (badgeRef.current) {
        badgeRef.current.style.opacity = '1';
        badgeRef.current.style.transform = 'translateY(0)';
      }
    });

    const tSubtitle = setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '0.9';
        subtitleRef.current.style.transform = 'translateY(0)';
      }
    }, 380);

    const tParagraph = setTimeout(() => {
      if (paragraphRef.current) {
        paragraphRef.current.style.opacity = '0.85';
        paragraphRef.current.style.transform = 'translateY(0)';
      }
    }, 650);

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let typeTimer: ReturnType<typeof setTimeout>;

    const TYPE_MS = 55;
    const DELETE_MS = 30;
    const HOLD_AFTER_TYPE = 900;
    const HOLD_AFTER_DELETE = 160;

    const showFinalPhase = () => {
      if (rotatingContainerRef.current) {
        rotatingContainerRef.current.style.display = 'none';
      }
      if (finalContainerRef.current) {
        finalContainerRef.current.style.display = 'inline';
      }

      let wordIdx = 0;
      const WORD_SPEED_MS = 90;

      const wordInterval = setInterval(() => {
        if (wordsRef.current[wordIdx]) {
          wordsRef.current[wordIdx]!.style.opacity = '1';
          wordsRef.current[wordIdx]!.style.transform = 'translateY(0)';
        }
        wordIdx += 1;

        if (wordIdx >= FINAL_TITLE_WORDS.length) {
          clearInterval(wordInterval);

          if (buttonsRef.current) {
            buttonsRef.current.style.opacity = '1';
            buttonsRef.current.style.transform = 'scale(1) translateY(0)';
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = '0.75';
            scrollIndicatorRef.current.style.transform = 'translateX(-50%) translateY(0)';
          }

          // Desvanecer el cursor 800ms después
          setTimeout(() => {
            if (cursorRef.current) {
              cursorRef.current.style.opacity = '0';
            }
            // Liberar will-change del contenedor principal
            if (heroContentRef.current) {
              heroContentRef.current.style.willChange = 'auto';
            }
          }, 800);
        }
      }, WORD_SPEED_MS);
    };

    const tickRotating = () => {
      const current = ROTATING_PHRASES[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        if (rotatingTextRef.current) {
          rotatingTextRef.current.textContent = current.slice(0, charIndex);
        }
        if (charIndex >= current.length) {
          if (phraseIndex === ROTATING_PHRASES.length - 1) {
            typeTimer = setTimeout(showFinalPhase, HOLD_AFTER_TYPE);
            return;
          }
          deleting = true;
          typeTimer = setTimeout(tickRotating, HOLD_AFTER_TYPE);
          return;
        }
        typeTimer = setTimeout(tickRotating, TYPE_MS);
      } else {
        charIndex -= 1;
        if (rotatingTextRef.current) {
          rotatingTextRef.current.textContent = current.slice(0, charIndex);
        }
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex += 1;
          typeTimer = setTimeout(tickRotating, HOLD_AFTER_DELETE);
          return;
        }
        typeTimer = setTimeout(tickRotating, DELETE_MS);
      }
    };

    typeTimer = setTimeout(tickRotating, 100);

    const fallbackTimer = setTimeout(() => {
      if (buttonsRef.current) {
        buttonsRef.current.style.opacity = '1';
        buttonsRef.current.style.transform = 'scale(1) translateY(0)';
      }
      if (scrollIndicatorRef.current) {
        scrollIndicatorRef.current.style.opacity = '0.75';
        scrollIndicatorRef.current.style.transform = 'translateX(-50%) translateY(0)';
      }
    }, 4200);

    return () => {
      cancelAnimationFrame(tBadge);
      clearTimeout(tSubtitle);
      clearTimeout(tParagraph);
      clearTimeout(typeTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // 2. Parpadeo del cursor (Se limpia al desvanecerse)
  useEffect(() => {
    let blinkState = true;
    const interval = setInterval(() => {
      if (cursorRef.current) {
        if (cursorRef.current.style.opacity === '0') {
          clearInterval(interval);
          return;
        }
        blinkState = !blinkState;
        cursorRef.current.style.opacity = blinkState ? '1' : '0';
      }
    }, 480);
    return () => clearInterval(interval);
  }, []);

  // 3. Listener de Scroll pasivo rAF
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (heroContentRef.current && y <= 700) {
            const op = Math.max(0, 1 - y / 550);
            const tr = y * 0.25;
            heroContentRef.current.style.opacity = String(op);
            heroContentRef.current.style.transform = `translate3d(0, ${tr}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. Partículas: delegadas al componente independiente BackgroundParticles (@tsparticles/react)
  //    — motor slim, IntersectionObserver + Page Visibility API gestionados internamente.

  const handleScrollClick = () => {
    const nextSection = document.querySelector('main > section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F8F6F2 0%, #ECE5DA 45%, #D6C3A5 100%)',
        contain: 'layout style paint'
      }}
    >
      <style>{`
        @keyframes wsMouseWheel {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(9px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }

        /* ───────────────────────────────────────────────────────────────
           CORRECCIÓN MOBILE-ONLY: Estabilidad del título durante el typing.
           Aplica únicamente en móviles (<= 768px). No afecta desktop/tablet.
           Objetivo: reservar desde el inicio la altura del título final y
           evitar que las palabras salten de línea mientras se escriben.
        ─────────────────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          #hero h1 {
            /* Margen lateral adecuado para que las palabras no rocen el borde
               y tengan espacio para crecer sin reorganizarse bruscamente. */
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            /* Reducción mínima del tamaño del título solo en móviles para
               garantizar que las frases rotativas (que se escriben letra a
               letra en una sola línea) quepan sin desbordar. */
            font-size: clamp(1.7rem, 6vw, 2.1rem) !important;
            /* Reserva desde el inicio la altura del bloque del título final
               (varias líneas en móvil) para que el contenedor no crezca
               durante la animación y las palabras no salten de línea. */
            min-height: 6.4em !important;
            /* text-wrap: balance recalcula el reparto de líneas en cada
               carácter añadido, provocando saltos. En móvil, durante la
               escritura, usamos el flujo natural (wrap) que es estable. */
            text-wrap: wrap !important;
            -webkit-text-wrap: wrap !important;
          }
          /* Las frases rotativas se escriben letra por letra. En móvil,
             forzamos una sola línea (nowrap) para que el texto no salte
             de línea mientras crece; son frases cortas que caben en una
             línea con el tamaño reducido del título. */
          #hero h1 > span:first-child {
            white-space: nowrap !important;
          }
        }
      `}</style>

      {/* Glows de fondo con degradados suaves estáticos (Sin filtros de blur en vivo) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(200,169,106,0.30) 0%, rgba(200,169,106,0.12) 45%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(214,195,165,0.40) 0%, rgba(214,195,165,0.15) 50%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Motor de partículas oficial @tsparticles/react (componente independiente) */}
      <BackgroundParticles />

      {/* Glow central estático */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Contenedor principal (Zero React Re-render en Scroll/Typewriter) */}
      <div
        ref={heroContentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '860px',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform, opacity'
        }}
      >
        {/* ① BADGE */}
        <span
          ref={badgeRef}
          style={{
            display: 'inline-block',
            padding: '0.45rem 1.1rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(200,169,106,0.35)',
            fontFamily: 'var(--ws-font)',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ws-text)',
            marginBottom: '1.5rem',
            opacity: 0,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease'
          }}
        >
          Código • Cancha • Conciencia
        </span>

        {/* ② TÍTULO PRINCIPAL: Direct DOM Mutation (Zero Layout Shift) */}
        <h1
          style={{
            margin: '0 auto 1.4rem',
            maxWidth: '820px',
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            fontSize: 'clamp(2.2rem, 5.2vw, 3.4rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.18,
            color: 'var(--ws-text)',
            minHeight: '1.15em',
            textAlign: 'center',
            textWrap: 'balance',
            WebkitTextWrap: 'balance'
          } as CSSProperties}
        >
          {/* Contenedor de Frases Rotativas */}
          <span ref={rotatingContainerRef} style={{ display: 'inline' }}>
            <span ref={rotatingTextRef} />
          </span>

          {/* Contenedor del Título Final Pre-maquetado Balanceado (Zero Reflow) */}
          <span ref={finalContainerRef} style={{ display: 'none' }}>
            {FINAL_TITLE_WORDS.map((word, idx) => (
              <span
                key={idx}
                ref={(el) => {
                  wordsRef.current[idx] = el;
                }}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: 0,
                  transform: 'translateY(4px)',
                  transition: 'opacity 220ms ease, transform 220ms ease'
                }}
              >
                {word}{idx < FINAL_TITLE_WORDS.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>

          {/* Cursor parpadeante */}
          <span
            ref={cursorRef}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '0.04em',
              marginLeft: '0.04em',
              opacity: 1,
              color: 'var(--ws-accent)',
              transition: 'opacity 500ms ease'
            }}
          >
            |
          </span>
        </h1>

        {/* ③ SUBTÍTULO */}
        <h2
          ref={subtitleRef}
          style={{
            margin: '0 0 1.25rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 500,
            fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
            letterSpacing: '-0.01em',
            color: 'var(--ws-text)',
            opacity: 0,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease'
          }}
        >
          Una franquicia creada para elevar el potencial humano.
        </h2>

        {/* ④ PÁRRAFO PRINCIPAL (LCP Target) */}
        <p
          ref={paragraphRef}
          style={{
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--ws-font)',
            fontSize: 'clamp(1.02rem, 1.8vw, 1.18rem)',
            color: 'var(--ws-text)',
            opacity: 0,
            maxWidth: '680px',
            lineHeight: 1.6,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease'
          }}
        >
          Reunimos desarrollo web de estándar global, una tienda e-commerce atemporal y la mística de nuestro club de fútbol en torno a la filosofía de la Gnosis.
        </p>

        {/* ⑤ BOTONES */}
        <div
          ref={buttonsRef}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
            transform: 'scale(0.96) translateY(10px)',
            transition: 'opacity 500ms ease, transform 500ms ease'
          }}
        >
          <MagneticButton href="#franquicia" variant="primary">
            Explorar WorshipSaint
          </MagneticButton>

          <MagneticButton href="#servicios" variant="secondary">
            Iniciar Proyecto Web
          </MagneticButton>
        </div>
      </div>

      {/* ⑥ SCROLL INDICATOR */}
      <ScrollIndicator buttonRef={scrollIndicatorRef} onClick={handleScrollClick} />
    </section>
  );
};

export default memo(Hero);
