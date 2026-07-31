import React, { memo, useCallback, useEffect, useRef } from 'react';
import type { FC, CSSProperties } from 'react';
import { motion, useAnimate, useMotionValue, animate } from 'motion/react';
import { useHeroTypewriter } from './useHeroTypewriter';

/* ------------------------------------------------------------------ */
/*  HeroTypewriter                                                      */
/*  ------------------------------------------------------------------ */
/*  Componente independiente responsable del H1 del Hero.               */
/*                                                                      */
/*  Arquitectura:                                                       */
/*  • useHeroTypewriter → motor rAF, IntersectionObserver, sin setState */
/*    por carácter (cero re-renders del Virtual DOM).                   */
/*  • Motion → animación de entrada del h1 (opacity + transform).       */
/*  • Cursor parpadeante vía Motion (sin CSS keyframes manuales).       */
/*  • Texto SSR oculto como fallback LCP.                               */
/* ------------------------------------------------------------------ */

export interface HeroTypewriterProps {
  /** Frases a escribir. */
  words: string[];
  /** Velocidad de escritura (ms/carácter). */
  typeSpeed?: number;
  /** Velocidad de borrado (ms/carácter). */
  deleteSpeed?: number;
  /** Pausa entre frase y borrado (ms). */
  delaySpeed?: number;
  /** Pausa inicial (ms). */
  startDelay?: number;
  /** Ciclos (0 = infinito). */
  loop?: number;
  /** Callback al finalizar. */
  onDone?: () => void;
  /** Ref al contenedor del viewport (Hero section) para IO. */
  viewportRef: React.RefObject<HTMLElement | null>;
}

const HeroTypewriter: FC<HeroTypewriterProps> = memo(
  ({
    words,
    typeSpeed = 55,
    deleteSpeed = 30,
    delaySpeed = 900,
    startDelay = 0,
    loop = 1,
    onDone,
    viewportRef
  }) => {
    const onDoneRef = useRef(onDone);
    onDoneRef.current = onDone;

    const stableOnDone = useCallback(() => {
      onDoneRef.current?.();
    }, []);

    const { textRef, cursorRef } = useHeroTypewriter({
      words,
      typeSpeed,
      deleteSpeed,
      delaySpeed,
      startDelay,
      loop,
      onDone: stableOnDone,
      viewportRef
    });

    /* ------------------------------------------------------------ */
    /*  Animación de entrada del h1 con Motion                      */
    /* ------------------------------------------------------------ */
    const [h1Ref, animate] = useAnimate<HTMLHeadingElement>();

    useEffect(() => {
      const controls = animate(
        h1Ref.current,
        { opacity: [0, 1], y: [12, 0] },
        { duration: 0.5, ease: 'easeOut' }
      );
      return () => controls.stop();
    }, [animate, h1Ref]);

    /* ------------------------------------------------------------ */
    /*  Cursor parpadeante con Motion (rAF, sin setTimeout/await)   */
    /* ------------------------------------------------------------ */
    const cursorOpacity = useMotionValue(1);
    useEffect(() => {
      // animate() usa rAF internamente → no bloquea el main thread
      // durante interacciones de puntero (a diferencia de setTimeout +
      // async/await que encola microtasks en cada blink).
      const controls = animate(cursorOpacity, [1, 1, 0, 0], {
        times: [0, 0.5, 0.5, 1],
        duration: 1.06, // 530ms visible + 530ms oculto
        repeat: Infinity,
        ease: 'linear'
      });
      return () => controls.stop();
    }, [cursorOpacity]);

    const cursorStyle: CSSProperties = {
      display: 'inline-block',
      marginLeft: '0.04em',
      color: 'var(--ws-accent)',
      fontWeight: 300,
      willChange: 'opacity'
    };

    return (
      <motion.h1
        ref={h1Ref}
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
          // willChange omitido deliberadamente: mantener layers de
          // compositor de forma persistente aumenta el coste de
          // style/layout durante interacciones de puntero (LoAF).
        } as CSSProperties}
      >
        {/* Texto SSR: primera frase como fallback para LCP. El motor
            rAF lo reemplaza al hidratar con animación fluida. */}
        <span style={{ display: 'none' }}>{words[0]}</span>
        {/* willChange omitido: 'contents' no es valor válido y mutar
            textContent cada frame ya es barato sin forzar layers. */}
        <span ref={textRef} aria-live="polite" />
        <motion.span ref={cursorRef} style={{ ...cursorStyle, opacity: cursorOpacity }}>
          |
        </motion.span>
      </motion.h1>
    );
  }
);

HeroTypewriter.displayName = 'HeroTypewriter';

export default HeroTypewriter;
