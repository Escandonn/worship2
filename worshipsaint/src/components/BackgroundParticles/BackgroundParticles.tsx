import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { FC, CSSProperties } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions, Container, Engine } from '@tsparticles/engine';

/* ------------------------------------------------------------------ */
/*  BackgroundParticles                                                */
/*  ------------------------------------------------------------------ */
/*  Motor de partículas oficial @tsparticles/react v4 (bundle slim).  */
/*  Desacoplado del Hero: se monta como capa de fondo absoluta.       */
/*  Pausa con IntersectionObserver y se detiene con la Page          */
/*  Visibility API. El motor se inicializa una sola vez vía          */
/*  ParticlesProvider (init callback estable con useCallback).        */
/* ------------------------------------------------------------------ */

export interface BackgroundParticlesProps {
  /** id único del canvas tsparticles (debe ser único en el DOM) */
  id?: string;
  /** Clase/estilo extra para el wrapper (opcional) */
  className?: string;
  /** Estilos inline extra para el wrapper (opcional) */
  style?: CSSProperties;
}

/** Paleta WorshipSaint (paridad visual con el sistema anterior) */
const PARTICLE_COLORS = ['#C8A96A', '#B8954E', '#D6C3A5', '#ECE5DA', '#A8843C'];
const LINK_COLOR = '#C8A96A';

const BackgroundParticles: FC<BackgroundParticlesProps> = memo(
  ({ id = 'ws-background-particles', className, style }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<Container | null>(null);

    /* ── 1. init callback estable para ParticlesProvider (v4 API) ── */
    // Debe ser referencialmente estable: ParticlesProvider lanza error si
    // cambia entre renders. useCallback con deps vacías lo garantiza.
    const initEngine = useCallback(async (engine: Engine) => {
      // Carga únicamente los módulos slim (mínimo bundle, sin presets pesados).
      await loadSlim(engine);
    }, []);

    /* ── 2. Opciones memoizadas (paridad visual con el canvas anterior) ── */
    const options = useMemo<ISourceOptions>(
      () => ({
        fullScreen: { enable: false },
        fpsLimit: 60,
        detectRetina: true,
        background: { color: 'transparent' },
        particles: {
          number: {
            // 50–80 partículas según densidad del viewport (móvil reducido).
            value: 70,
            density: { enable: true, width: 1920, height: 1080 }
          },
          color: { value: PARTICLE_COLORS },
          links: {
            enable: true,
            color: LINK_COLOR,
            distance: 140,
            opacity: 0.55,
            width: 1.1
          },
          move: {
            enable: true,
            speed: 0.45,
            direction: 'none',
            random: false,
            straight: false,
            outModes: { default: 'out' },
            drift: 0
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
            animation: {
              enable: true,
              speed: 0.6,
              sync: false,
              startValue: 'random'
            }
          },
          size: {
            value: { min: 0.9, max: 3.8 }
          },
          shadow: {
            enable: true,
            color: '#C8A96A',
            blur: 4
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'grab', parallax: { enable: false } },
            resize: { enable: true }
          },
          modes: {
            grab: {
              distance: 140,
              links: { opacity: 0.85 },
              lineLinked: { opacity: 0.85 }
            }
          }
        },
        detectResize: true,
        pauseOnBlur: true,
        pauseOnOutside: true
      }),
      []
    );

    /* ── 3. Referencia al contenedor tsparticles (para pausa manual) ── */
    const particlesLoaded = useCallback((container?: Container) => {
      containerRef.current = container ?? null;
    }, []);

    /* ── 4. Pause/Resume con IntersectionObserver (cuando sale del viewport) ── */
    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const container = containerRef.current;
          if (!container) return;
          if (entry.isIntersecting) {
            container.play();
          } else {
            container.pause();
          }
        },
        { threshold: 0.05 }
      );

      observer.observe(wrapper);
      return () => observer.disconnect();
    }, []);

    /* ── 5. Page Visibility API: detener animación cuando la pestaña está oculta ── */
    useEffect(() => {
      const handleVisibility = () => {
        const container = containerRef.current;
        if (!container) return;
        if (document.hidden) {
          container.pause();
        } else {
          // Solo reanuda si el wrapper está en el viewport.
          const wrapper = wrapperRef.current;
          if (!wrapper) return;
          const rect = wrapper.getBoundingClientRect();
          const inView =
            rect.bottom > 0 && rect.top < window.innerHeight;
          if (inView) container.play();
        }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    /* ── Render ── */
    const wrapperStyle = useMemo<CSSProperties>(
      () => ({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }),
      [style]
    );

    return (
      <div ref={wrapperRef} className={className} style={wrapperStyle} aria-hidden="true">
        <ParticlesProvider init={initEngine}>
          <Particles id={id} options={options} particlesLoaded={particlesLoaded} />
        </ParticlesProvider>
      </div>
    );
  }
);

BackgroundParticles.displayName = 'BackgroundParticles';

export default BackgroundParticles;
