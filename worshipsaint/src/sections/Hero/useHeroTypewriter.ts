import { useCallback, useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  useHeroTypewriter                                                   */
/*  ------------------------------------------------------------------ */
/*  Hook personalizado que encapsula toda la lógica de la máquina de   */
/*  escribir del H1 del Hero.                                           */
/*                                                                      */
/*  Características:                                                    */
/*  • Motor basado en requestAnimationFrame (sin setTimeout/setInterval) */
/*  • Sin setState por carácter → cero re-renders del Virtual DOM        */
/*  • Pausa automática cuando el Hero sale del viewport (Intersection-  */
/*    Observer) y reanuda desde el mismo punto al volver.               */
/*  • Cancelación correcta de rAF al desmontar.                         */
/*  • Velocidad y repetición configurables.                             */
/*  • Callback onDone al finalizar todas las frases.                    */
/* ------------------------------------------------------------------ */

export interface UseHeroTypewriterOptions {
  /** Frases a escribir secuencialmente. */
  words: string[];
  /** Velocidad de escritura (ms por carácter). */
  typeSpeed?: number;
  /** Velucidad de borrado (ms por carácter). */
  deleteSpeed?: number;
  /** Pausa entre frase escrita y borrado (ms). */
  delaySpeed?: number;
  /** Pausa inicial antes de empezar (ms). */
  startDelay?: number;
  /** Número de ciclos completos. 0 = infinito. */
  loop?: number;
  /** Callback al completar todos los ciclos. */
  onDone?: () => void;
  /** Ref al contenedor del viewport para IntersectionObserver. */
  viewportRef: React.RefObject<HTMLElement | null>;
}

export interface UseHeroTypewriterReturn {
  /** Ref a adjuntar al nodo de texto donde se escribe el contenido. */
  textRef: React.RefObject<HTMLSpanElement | null>;
  /** Ref a adjuntar al nodo del cursor. */
  cursorRef: React.RefObject<HTMLSpanElement | null>;
  /** Si la animación ha finalizado. */
  isDone: boolean;
}

export function useHeroTypewriter({
  words,
  typeSpeed = 55,
  deleteSpeed = 30,
  delaySpeed = 900,
  startDelay = 0,
  loop = 1,
  onDone,
  viewportRef
}: UseHeroTypewriterOptions): UseHeroTypewriterReturn {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  const [isDone, setIsDone] = useState(false);

  // Estado mutable persistido en refs (no provoca re-render)
  const stateRef = useRef({
    wordIndex: 0,        // índice de la frase actual
    charIndex: 0,        // índice del carácter actual dentro de la frase
    phase: 'idle' as 'idle' | 'typing' | 'pausing' | 'deleting' | 'done',
    loopCount: 0,        // ciclos completados
    rafId: 0,            // id del requestAnimationFrame activo
    lastTime: 0,         // timestamp del último frame
    accumulator: 0,      // acumulador de ms para controlar la velocidad
    isVisible: false,    // visibilidad del viewport (IntersectionObserver)
    started: false      // si la animación ya arrancó alguna vez
  });

  // Refs estables para callbacks y datos (evitan reiniciar el efecto)
  const wordsRef = useRef(words);
  wordsRef.current = words;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const optsRef = useRef({ typeSpeed, deleteSpeed, delaySpeed, startDelay, loop });
  optsRef.current = { typeSpeed, deleteSpeed, delaySpeed, startDelay, loop };

  /* ------------------------------------------------------------ */
  /*  Escritura del texto en el DOM (sin React)                   */
  /* ------------------------------------------------------------ */
  const renderText = useCallback((text: string) => {
    if (textRef.current) {
      textRef.current.textContent = text;
    }
  }, []);

  /* ------------------------------------------------------------ */
  /*  Bucle principal de animación (requestAnimationFrame)        */
  /* ------------------------------------------------------------ */
  const tick = useCallback((now: number) => {
    const s = stateRef.current;
    const { typeSpeed: ts, deleteSpeed: ds, delaySpeed: del, loop: lp } = optsRef.current;
    const w = wordsRef.current;

    // Si no es visible, pausamos el bucle (se reanuda al volver)
    if (!s.isVisible) {
      s.rafId = 0;
      return;
    }

    // Inicializar lastTime en el primer frame
    if (s.lastTime === 0) s.lastTime = now;
    const delta = now - s.lastTime;
    s.lastTime = now;
    s.accumulator += delta;

    let proceed = true;

    while (proceed) {
      const currentWord = w[s.wordIndex] ?? '';

      switch (s.phase) {
        case 'idle': {
          // Pausa inicial (startDelay)
          if (s.accumulator >= optsRef.current.startDelay) {
            s.accumulator = 0;
            s.phase = 'typing';
          } else {
            proceed = false;
          }
          break;
        }
        case 'typing': {
          if (s.accumulator >= ts) {
            s.accumulator -= ts;
            s.charIndex += 1;
            renderText(currentWord.slice(0, s.charIndex));
            if (s.charIndex >= currentWord.length) {
              // ¿Es la última frase y no hay loop infinito?
              const isLastWord = s.wordIndex === w.length - 1;
              if (isLastWord && (lp === 1 || s.loopCount >= lp - 1)) {
                s.phase = 'done';
              } else {
                s.phase = 'pausing';
                s.accumulator = 0;
              }
            }
          } else {
            proceed = false;
          }
          break;
        }
        case 'pausing': {
          if (s.accumulator >= del) {
            s.accumulator = 0;
            s.phase = 'deleting';
          } else {
            proceed = false;
          }
          break;
        }
        case 'deleting': {
          if (s.accumulator >= ds) {
            s.accumulator -= ds;
            s.charIndex -= 1;
            renderText(currentWord.slice(0, Math.max(0, s.charIndex)));
            if (s.charIndex <= 0) {
              s.wordIndex += 1;
              if (s.wordIndex >= w.length) {
                s.wordIndex = 0;
                s.loopCount += 1;
                if (lp !== 0 && s.loopCount >= lp) {
                  s.phase = 'done';
                  break;
                }
              }
              s.phase = 'typing';
              s.accumulator = 0;
            }
          } else {
            proceed = false;
          }
          break;
        }
        case 'done': {
          // Aseguramos la última frase completa
          renderText(currentWord);
          proceed = false;
          s.rafId = 0;
          setIsDone(true);
          onDoneRef.current?.();
          return;
        }
      }
    }

    s.rafId = requestAnimationFrame(tick);
  }, [renderText]);

  /* ------------------------------------------------------------ */
  /*  Arrancar / reanudar el bucle                                 */
  /* ------------------------------------------------------------ */
  const startLoop = useCallback(() => {
    const s = stateRef.current;
    if (s.rafId !== 0) return; // ya está corriendo
    s.lastTime = 0;
    s.rafId = requestAnimationFrame(tick);
  }, [tick]);

  /* ------------------------------------------------------------ */
  /*  IntersectionObserver: lazy init + pausa automática          */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // Sin IO: arrancamos directamente
      stateRef.current.isVisible = true;
      startLoop();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const s = stateRef.current;
        const wasVisible = s.isVisible;
        s.isVisible = entry.isIntersecting;

        if (s.isVisible && !wasVisible) {
          // Volvió a ser visible → reanudar (sin reiniciar)
          startLoop();
        } else if (!s.isVisible && wasVisible) {
          // Salió del viewport → detener frames
          if (s.rafId !== 0) {
            cancelAnimationFrame(s.rafId);
            s.rafId = 0;
          }
        }
      },
      { threshold: 0.01 }
    );

    io.observe(el);

    return () => {
      io.disconnect();
    };
  }, [viewportRef, startLoop]);

  /* ------------------------------------------------------------ */
  /*  Limpieza al desmontar                                        */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    return () => {
      const s = stateRef.current;
      if (s.rafId !== 0) {
        cancelAnimationFrame(s.rafId);
        s.rafId = 0;
      }
    };
  }, []);

  return { textRef, cursorRef, isDone };
}
