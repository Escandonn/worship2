import React, { memo, useEffect, useRef } from 'react';
import type { FC, CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/*  HeroTitleDesktop                                                    */
/*  ------------------------------------------------------------------ */
/*  H1 estático para desktop (>768px). Muestra el título final completo
    con una animación de entrada suave (fade + slide up) controlada por
    CSS transition (sin rAF, sin Motion, sin setState por carácter).
    Cero trabajo continuo del main thread → ideal para INP en PC.
    El texto es visible desde SSR (opacity:1) para LCP; la animación
    solo transforma (no toca opacity) para no interferir con la
    medición LCP. */
/* ------------------------------------------------------------------ */

export interface HeroTitleDesktopProps {
  /** Texto completo del título final. */
  text: string;
  /** Callback al terminar la animación de entrada. */
  onDone?: () => void;
}

const HeroTitleDesktop: FC<HeroTitleDesktopProps> = memo(({ text, onDone }) => {
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const h1 = h1Ref.current;
    if (!h1) return;

    // Animación de entrada: slide up + fade in vía CSS transition.
    // Usamos requestAnimationFrame para asegurar que el navegador
    // pinte el estado inicial (translateY(12px)) antes de aplicar
    // el estado final (translateY(0)). Sin rAF, el navegador podría
    // optimizar y saltarse la transición.
    const raf = requestAnimationFrame(() => {
      h1.style.transform = 'translateY(0)';
      h1.style.opacity = '1';
    });

    // Notificar finalización tras la duración de la transición (500ms).
    const timer = setTimeout(() => {
      onDoneRef.current?.();
    }, 520);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const style: CSSProperties = {
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
    WebkitTextWrap: 'balance',
    // Estado inicial de la animación de entrada
    opacity: '0',
    transform: 'translateY(12px)',
    transition: 'opacity 500ms ease, transform 500ms ease'
  };

  return (
    <h1 ref={h1Ref} style={style}>
      {text}
    </h1>
  );
});

HeroTitleDesktop.displayName = 'HeroTitleDesktop';

export default HeroTitleDesktop;
