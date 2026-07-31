import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import type { FC, ReactNode, CSSProperties } from 'react';
import { BackgroundParticles } from '../../components/BackgroundParticles';
import { SacredSymbol } from '../../components/SacredSymbol';
import HeroTypewriter from './HeroTypewriter';
import { useDevMonitor } from './useDevMonitor';

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

/* Array de palabras estable a nivel de módulo → referencia constante.
   Evita que el componente HeroTypewriter reciba un nuevo array en cada
   render del Hero (p. ej. cuando cambia `particlesReady`) y vuelva a
   renderizarse innecesariamente. */
const TYPEWRITER_WORDS: string[] = [...ROTATING_PHRASES, FINAL_TITLE_TEXT];

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
  // Monitor de desarrollo: detecta re-renders, timers/rafs/observers
  // duplicados y memory leaks. Solo actúa en NODE_ENV !== 'production'.
  useDevMonitor('Hero');
  const sectionRef = useRef<HTMLElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  // Diferir partículas: tsparticles inicializa ~64 partículas + red de
  // enlaces sincrónicamente, lo que bloquea el primer paint (INP alto).
  // Se monta tras el primer paint (requestIdleCallback) para no competir
  // con la hidratación del contenido crítico. Visualmente idéntico: las
  // partículas aparecen ~1 frame después, imperceptible.
  const [particlesReady, setParticlesReady] = useState(false);
  useEffect(() => {
    const ric = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout: number }) => number)
      | undefined;
    const start = () => setParticlesReady(true);
    if (ric) {
      const id = ric(start, { timeout: 1200 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const t = setTimeout(start, 200);
    return () => clearTimeout(t);
  }, []);

  // Direct DOM Refs para animaciones fuera de React
  const badgeRef = useRef<HTMLSpanElement | null>(null);

  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLButtonElement | null>(null);

  // 1. Animaciones de entrada escalonadas (Fuera del ciclo React)
  useEffect(() => {
    // El badge ya es visible desde SSR (opacity:1). Solo animamos el
    // transform de entrada para no interferir con la medición LCP.
    const tBadge = requestAnimationFrame(() => {
      if (badgeRef.current) {
        badgeRef.current.style.transform = 'translateY(0)';
      }
    });

    // El subtítulo y párrafo ya son visibles desde SSR (opacity fijado en
    // el estilo inline). Solo animamos el transform de entrada para no
    // interferir con la medición LCP.
    const tSubtitle = setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.style.transform = 'translateY(0)';
      }
    }, 380);

    const tParagraph = setTimeout(() => {
      if (paragraphRef.current) {
        paragraphRef.current.style.transform = 'translateY(0)';
      }
    }, 650);

    // El typewriter (HeroTypewriter + useHeroTypewriter) gestiona su propio motor con
    // requestAnimationFrame → animación totalmente fluida sin bloquear el
    // hilo principal. Al terminar (onLoopDone) revelamos botones/scroll.

    // Fallback de seguridad: si el typewriter tarda más de lo esperado,
    // forzamos la aparición de botones/scroll indicator.
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
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Revelar botones + scroll indicator al terminar el typewriter.
  // useCallback → referencia estable para que HeroTypewriter (memo) no se
  // re-renderice si el Hero re-renderiza por otros motivos.
  const handleTypewriterDone = useCallback(() => {
    if (buttonsRef.current) {
      buttonsRef.current.style.opacity = '1';
      buttonsRef.current.style.transform = 'scale(1) translateY(0)';
    }
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = '0.75';
      scrollIndicatorRef.current.style.transform = 'translateX(-50%) translateY(0)';
    }
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

  const handleScrollClick = useCallback(() => {
    const nextSection = document.querySelector('main > section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

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
        contain: 'layout style'
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

      {/* Motor de partículas oficial @tsparticles/react (componente independiente)
          Diferido tras el primer paint para no bloquear la hidratación (INP). */}
      {particlesReady && <BackgroundParticles />}

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

      {/* ✦ SÍMBOLO GEOMÉTRICO (capa de fondo): círculo + triángulo equilátero
          inscrito. Posicionado de forma absoluta y centrado respecto al Hero.
          NO ocupa espacio en el flujo, NO empuja ningún elemento. Vive detrás
          del contenido (zIndex 0) como marca de agua premium. */}
      <SacredSymbol />

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
            opacity: 1,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
            willChange: 'transform'
          }}
        >
          Código • Cancha • Conciencia
        </span>

        {/* ② TÍTULO PRINCIPAL: HeroTypewriter (Motion + rAF + IO)
            Componente aislado y memoizado → se renderiza UNA sola vez.
            Motor propio con requestAnimationFrame (sin setState por carácter).
            Pausa automática al salir del viewport. Cero re-renders del h1. */}
        <HeroTypewriter
          words={TYPEWRITER_WORDS}
          loop={1}
          typeSpeed={55}
          deleteSpeed={30}
          delaySpeed={900}
          onDone={handleTypewriterDone}
          viewportRef={sectionRef}
        />

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
            opacity: 0.9,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
            willChange: 'transform'
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
            opacity: 0.85,
            maxWidth: '680px',
            lineHeight: 1.6,
            transform: 'translateY(12px)',
            transition: 'opacity 500ms ease, transform 500ms ease',
            willChange: 'transform'
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
            transition: 'opacity 500ms ease, transform 500ms ease',
            willChange: 'opacity, transform'
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
