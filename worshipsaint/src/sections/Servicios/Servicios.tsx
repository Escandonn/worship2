import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { FC } from 'react';
import { motion, useInView } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Section from '../Section';
import ServiciosParticles from './ServiciosParticles';

const Servicios: FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const servicios = useMemo(
    () => [
      { titulo: 'Diseño de Marca', desc: 'Identidad visual completa y coherente.' },
      { titulo: 'Desarrollo Web', desc: 'Sitios rápidos, accesibles y escalables.' },
      { titulo: 'Merchandising', desc: 'Productos premium con acabados de lujo.' }
    ],
    []
  );

  return (
    <Section
      id="servicios"
      title="Servicios"
      subtitle="Soluciones integrales de diseño y desarrollo para marcas con ambición."
    >
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        {inView && <ServiciosParticles />}

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.18, delayChildren: 0.1 }
            }
          }}
        >
          {servicios.map((s) => (
            <motion.div
              key={s.titulo}
              style={{ height: '100%' }}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            >
              <Tilt
                tiltMaxAngleX={isMobile ? 3 : 12}
                tiltMaxAngleY={isMobile ? 3 : 12}
                perspective={1200}
                glareEnable={!isMobile}
                glareMaxOpacity={0.12}
                glareColor="#ffffff"
                glarePosition="all"
                glareBorderRadius="32px"
                scale={isMobile ? 1 : 1.04}
                transitionSpeed={1500}
                gyroscope={false}
                style={{ height: '100%' }}
              >
                <article
                  style={{
                    padding: 'clamp(2rem, 3vw, 3rem)',
                    borderRadius: 'var(--ws-radius-card)',
                    border: '1px solid rgba(200,169,106,0.25)',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.72), rgba(236,229,218,0.82))',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    boxShadow: '0 24px 60px rgba(44,33,24,0.10), 0 0 0 1px rgba(255,255,255,0.45) inset',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      right: '-25%',
                      width: '280px',
                      height: '280px',
                      background: 'radial-gradient(circle, rgba(200,169,106,0.22) 0%, transparent 70%)',
                      pointerEvents: 'none',
                      filter: 'blur(24px)'
                    }}
                  />

                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      bottom: '-25%',
                      left: '-20%',
                      width: '220px',
                      height: '220px',
                      background: 'radial-gradient(circle, rgba(214,195,165,0.18) 0%, transparent 70%)',
                      pointerEvents: 'none',
                      filter: 'blur(20px)'
                    }}
                  />

                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'var(--ws-font)',
                        fontWeight: 700,
                        fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
                        color: 'var(--ws-accent)',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {s.titulo}
                    </h3>
                    <p
                      style={{
                        margin: '1rem 0 0',
                        color: 'var(--ws-text)',
                        opacity: 0.85,
                        fontFamily: 'var(--ws-font)',
                        lineHeight: 1.65,
                        fontSize: 'clamp(1rem, 1.6vw, 1.2rem)'
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </article>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>

        <SnakeLine inView={inView} isMobile={isMobile} />
      </div>
    </Section>
  );
};

const SnakeLine: FC<{ inView: boolean; isMobile: boolean }> = ({ inView, isMobile }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ws-snake {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes ws-snake-glow {
        0%, 100% { opacity: 0.3; transform: translateX(-30%) scale(0.8); }
        50% { opacity: 0.9; transform: translateX(30%) scale(1.2); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: '50%',
        left: '8%',
        right: '8%',
        height: '3px',
        borderRadius: '2px',
        background: 'rgba(200,169,106,0.08)',
        transform: 'translateY(-50%)',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '2px',
          background: inView
            ? 'linear-gradient(90deg, transparent, rgba(200,169,106,0.6), rgba(214,195,165,0.8), rgba(200,169,106,0.6), transparent)'
            : 'transparent',
          backgroundSize: '35% 100%',
          animation: inView ? 'ws-snake 2.8s linear infinite' : 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60px',
          height: '60px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,106,0.35) 0%, transparent 70%)',
          filter: 'blur(8px)',
          animation: inView ? 'ws-snake-glow 2.8s ease-in-out infinite' : 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

export default memo(Servicios);
