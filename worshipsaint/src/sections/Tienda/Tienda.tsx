import type { FC, MouseEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Section from '../Section';
import gorra1 from '../../assets/gorra.jpg';
import gorra2 from '../../assets/gorra2.jpg';

const imgSrc1 = typeof gorra1 === 'string' ? gorra1 : (gorra1 as any).src;
const imgSrc2 = typeof gorra2 === 'string' ? gorra2 : (gorra2 as any).src;

const productos = [
  {
    id: 'left-cap',
    nombre: 'Gorra WorshipSaint — Black Edition',
    tag: 'Colección Exclusiva',
    precio: '$45',
    imagen: imgSrc1,
    flyAnimation: 'wsDescendHeroCapLeft'
  },
  {
    id: 'right-cap',
    nombre: 'Gorra WorshipSaint — Crown Edition',
    tag: 'Edición Limitada',
    precio: '$45',
    imagen: imgSrc2,
    flyAnimation: 'wsDescendHeroCapRight'
  }
];

interface CapCardProps {
  producto: typeof productos[0];
  index: number;
  animateCards: boolean;
  animateCaps: boolean;
  animateDetails: boolean;
  triggerSheen: boolean;
  triggerIdle: boolean;
}

const CapCard: FC<CapCardProps> = ({
  producto,
  index,
  animateCards,
  animateCaps,
  animateDetails,
  triggerSheen,
  triggerIdle
}) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const imgContainerRef = useRef<HTMLDivElement | null>(null);

  // Microinteracción: Inclinación 3D y elevación sutil al interactuar con el cursor
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current || !imgContainerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardRef.current.style.transform = `translate3d(0, -6px, 0) scale(1.02)`;
    cardRef.current.style.boxShadow = '0 24px 50px rgba(44, 33, 24, 0.16)';
    imgContainerRef.current.style.transform = `perspective(800px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(12px) scale(1.04)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imgContainerRef.current) return;
    cardRef.current.style.transform = `translate3d(0, 0, 0) scale(1)`;
    cardRef.current.style.boxShadow = 'var(--ws-shadow-card)';
    imgContainerRef.current.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)`;
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        padding: '1.75rem',
        borderRadius: 'var(--ws-radius-card)',
        border: '1px solid rgba(44,33,24,0.08)',
        background: 'var(--ws-gradient-card)',
        boxShadow: 'var(--ws-shadow-card)',
        textAlign: 'left',
        opacity: animateCards ? 1 : 0,
        transform: animateCards ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.95)',
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease',
        willChange: animateDetails ? 'auto' : 'transform, opacity'
      }}
    >
      {/* Contenedor visual de la gorra con descenso 3D desde el Hero */}
      <div
        ref={imgContainerRef}
        style={{
          position: 'relative',
          height: '240px',
          borderRadius: '24px',
          marginBottom: '1.5rem',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.75), rgba(214,195,165,0.35))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{
            maxWidth: '88%',
            maxHeight: '88%',
            objectFit: 'contain',
            borderRadius: '16px',
            opacity: animateCaps ? 1 : 0,
            animation: animateCaps
              ? `${producto.flyAnimation} 1.35s cubic-bezier(0.16, 1, 0.3, 1) forwards${triggerIdle ? ', wsCapIdleBreathing 4s ease-in-out infinite 1.45s' : ''}`
              : 'none',
            willChange: triggerIdle ? 'auto' : 'transform, opacity',
            boxShadow: '0 15px 25px rgba(44,33,24,0.22)'
          }}
        />

        {/* Reflexión / Brillo dinámico sobre la visera tras aterrizar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
            pointerEvents: 'none',
            animation: triggerSheen ? 'wsVisorSheen 1.2s ease-out forwards' : 'none',
            opacity: 0
          }}
        />
      </div>

      {/* Detalles del producto (Revelados tras el aterrizaje) */}
      <div
        style={{
          opacity: animateDetails ? 1 : 0,
          transform: animateDetails ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 500ms ease 100ms, transform 500ms ease 100ms'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ws-muted)',
            marginBottom: '0.35rem'
          }}
        >
          {producto.tag}
        </span>
        <h3
          style={{
            margin: '0 0 0.5rem',
            fontFamily: 'var(--ws-font)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--ws-text)',
            lineHeight: 1.25
          }}
        >
          {producto.nombre}
        </h3>
        <p
          style={{
            margin: '0 0 1.25rem',
            color: 'var(--ws-accent)',
            fontWeight: 800,
            fontSize: '1.25rem',
            fontFamily: 'var(--ws-font)'
          }}
        >
          {producto.precio}
        </p>

        <button
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--ws-radius-btn)',
            border: 'none',
            background: 'var(--ws-gradient-btn)',
            color: 'var(--ws-text)',
            fontFamily: 'var(--ws-font)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.02em',
            cursor: 'pointer',
            boxShadow: 'var(--ws-shadow-btn)',
            transition: 'transform 250ms ease, boxShadow 250ms ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.01)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-btn-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-btn)';
          }}
        >
          Adquirir Ahora
        </button>
      </div>
    </article>
  );
};

const TIENDA_REPLAY_EVENT = 'ws:replay-tienda';

const Tienda: FC = () => {
  const [animateCards, setAnimateCards] = useState(false);
  const [animateCaps, setAnimateCaps] = useState(false);
  const [animateDetails, setAnimateDetails] = useState(false);
  const [triggerSheen, setTriggerSheen] = useState(false);
  const [triggerIdle, setTriggerIdle] = useState(false);

  // Refs para la máquina de estados IDLE/PLAYING/FINISHED
  const isPlayingRef = useRef(false);
  const hasLeftViewportRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  // Secuencia cinematográfica completa (reutilizable)
  const runCinematicSequence = useCallback(() => {
    // Evita reinicios duplicados si ya está reproduciéndose
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    // Limpia timers previos (por si acaso)
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Reset completo: vuelve a estado inicial para reproducir desde cero
    setAnimateCards(false);
    setAnimateCaps(false);
    setAnimateDetails(false);
    setTriggerSheen(false);
    setTriggerIdle(false);

    // Forzar reflow para que el navegador reinicie las animaciones CSS
    void document.getElementById('tienda')?.offsetWidth;

    // 1. Cards vacías (150ms)
    timersRef.current.push(window.setTimeout(() => setAnimateCards(true), 150));

    // 2. Descenso Cinematográfico 3D de las Gorras desde arriba del Hero (300ms)
    timersRef.current.push(window.setTimeout(() => setAnimateCaps(true), 300));

    // 3. Detalles del producto y botones (1400ms)
    timersRef.current.push(window.setTimeout(() => setAnimateDetails(true), 1400));

    // 4. Brillo sobre la visera (1600ms)
    timersRef.current.push(window.setTimeout(() => setTriggerSheen(true), 1600));

    // 5. Animación de respiración continua/idle (1800ms)
    timersRef.current.push(window.setTimeout(() => setTriggerIdle(true), 1800));

    // Liberar el lock tras finalizar la secuencia (2s)
    timersRef.current.push(
      window.setTimeout(() => {
        isPlayingRef.current = false;
      }, 2000)
    );
  }, []);

  useEffect(() => {
    const el = document.getElementById('tienda');
    if (!el) return;

    // Observer que detecta entrada Y salida completa del viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Solo reproducir si la sección había salido completamente antes
          // (evita replay en la primera carga controlada por el flag inicial)
          if (hasLeftViewportRef.current) {
            hasLeftViewportRef.current = false;
            runCinematicSequence();
          } else if (!isPlayingRef.current && !animateCaps) {
            // Primera vez que entra al viewport (carga inicial)
            runCinematicSequence();
          }
        } else {
          // Marca que la sección salió completamente del viewport
          // (solo cuando NO es parcial — intersectionRatio === 0)
          if (entry.intersectionRatio === 0) {
            hasLeftViewportRef.current = true;
          }
        }
      },
      { threshold: [0, 0.30] }
    );

    observer.observe(el);

    // Listener para replay forzado desde el Navbar (clic en "Tienda")
    const handleReplay = () => {
      // Si ya está visible y no reproduciéndose, fuerza el replay
      runCinematicSequence();
    };
    window.addEventListener(TIENDA_REPLAY_EVENT, handleReplay);

    return () => {
      observer.disconnect();
      window.removeEventListener(TIENDA_REPLAY_EVENT, handleReplay);
      timersRef.current.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section
      id="tienda"
      title="Tienda"
      subtitle="Lleva contigo el símbolo. Gorras de edición limitada, materiales premium y acabados de autor."
    >
      {/* Keyframes CSS Inline optimizados para GPU sin blur en vivo */}
      <style>{`
        @keyframes wsDescendHeroCapLeft {
          0% {
            opacity: 0;
            transform: translate3d(-34vw, -130vh, 0) scale(0.70) rotateX(35deg) rotateY(28deg) rotateZ(-24deg);
          }
          35% {
            opacity: 1;
            transform: translate3d(-30vw, -70vh, 0) scale(1.02) rotateX(15deg) rotateY(18deg) rotateZ(-12deg);
          }
          65% {
            opacity: 1;
            transform: translate3d(-15vw, -25vh, 0) scale(1.10) rotateX(-12deg) rotateY(-10deg) rotateZ(8deg);
          }
          85% {
            transform: translate3d(2px, 3px, 0) scale(0.98) rotateX(2deg) rotateY(1deg) rotateZ(-1deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }

        @keyframes wsDescendHeroCapRight {
          0% {
            opacity: 0;
            transform: translate3d(34vw, -130vh, 0) scale(0.70) rotateX(35deg) rotateY(-28deg) rotateZ(24deg);
          }
          35% {
            opacity: 1;
            transform: translate3d(30vw, -70vh, 0) scale(1.02) rotateX(15deg) rotateY(-18deg) rotateZ(12deg);
          }
          65% {
            opacity: 1;
            transform: translate3d(15vw, -25vh, 0) scale(1.10) rotateX(-12deg) rotateY(10deg) rotateZ(-8deg);
          }
          85% {
            transform: translate3d(-2px, 3px, 0) scale(0.98) rotateX(2deg) rotateY(-1deg) rotateZ(1deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }

        @keyframes wsCapIdleBreathing {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes wsVisorSheen {
          0% {
            transform: translateX(-100%) rotate(25deg);
            opacity: 0;
          }
          35% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(200%) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '860px',
          margin: '0 auto'
        }}
      >
        {productos.map((producto, index) => (
          <CapCard
            key={producto.id}
            producto={producto}
            index={index}
            animateCards={animateCards}
            animateCaps={animateCaps}
            animateDetails={animateDetails}
            triggerSheen={triggerSheen}
            triggerIdle={triggerIdle}
          />
        ))}
      </div>
    </Section>
  );
};

export default Tienda;
