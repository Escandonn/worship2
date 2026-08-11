import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import type { FC, CSSProperties } from 'react';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions, Container, Engine } from '@tsparticles/engine';

export interface ServiciosParticlesProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
}

const PARTICLE_COLORS = ['#C8A96A', '#B8954E', '#D6C3A5', '#ECE5DA'];

const ServiciosParticles: FC<ServiciosParticlesProps> = memo(
  ({ id = 'ws-servicios-particles', className, style }) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<Container | null>(null);

    const initEngine = useCallback(async (engine: Engine) => {
      await loadSlim(engine);
    }, []);

    const options = useMemo<ISourceOptions>(
      () => ({
        fullScreen: { enable: false },
        fpsLimit: 60,
        background: { color: 'transparent' },
        particles: {
          number: {
            value: 28,
            density: { enable: true, width: 1920, height: 1080 }
          },
          color: { value: PARTICLE_COLORS },
          links: {
            enable: true,
            color: '#C8A96A',
            distance: 100,
            opacity: 0.25,
            width: 0.8
          },
          move: {
            enable: true,
            speed: 0.32,
            direction: 'none',
            random: true,
            straight: false,
            outModes: { default: 'bounce' },
            drift: 0
          },
          opacity: {
            value: 0.35
          },
          size: {
            value: { min: 0.6, max: 2.2 }
          }
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            resize: { enable: true }
          }
        },
        detectRetina: false,
        detectResize: true,
        pauseOnBlur: true,
        pauseOnOutside: true
      }),
      []
    );

    const particlesLoaded = useCallback((container?: Container) => {
      containerRef.current = container ?? null;
    }, []);

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

    useEffect(() => {
      const handleVisibility = () => {
        const container = containerRef.current;
        if (!container) return;
        if (document.hidden) {
          container.pause();
        } else {
          const wrapper = wrapperRef.current;
          if (!wrapper) return;
          const rect = wrapper.getBoundingClientRect();
          const inView = rect.bottom > 0 && rect.top < window.innerHeight;
          if (inView) container.play();
        }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

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

ServiciosParticles.displayName = 'ServiciosParticles';

export default ServiciosParticles;
