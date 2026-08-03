import { useState, useEffect, memo } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Heart, Trophy, BookOpen, Calendar, Sparkles } from 'lucide-react';
import familiaImg from '../../assets/familia.png';
import equipoImg from '../../assets/equipo.png';
import maestroImg from '../../assets/maestro.png';

const getImgSrc = (img: any): string => (typeof img === 'string' ? img : img?.src || String(img));

const easeCubic = [0.65, 0, 0.35, 1] as const;

/* ------------------------------------------------------------------ */
/* Integrantes / Línea de tiempo para Tarjeta 1 (Familia)             */
/* ------------------------------------------------------------------ */
interface MiembroFamilia {
  rol: string;
  evento: string;
  fecha: string;
}

const FAMILIA_TIMELINE: MiembroFamilia[] = [
  { rol: 'Hermana menor', evento: 'Nacimiento', fecha: '02/03/2011' },
  { rol: 'Alejandro Escandón', evento: 'Nacimiento', fecha: '02/04/2004' },
  { rol: 'Hermana mayor', evento: 'Nacimiento', fecha: '02/05/2002' }
];

/* ------------------------------------------------------------------ */
/* Valores / Tags para Tarjeta 2 (Santos FC)                          */
/* ------------------------------------------------------------------ */
const SANTOS_VALORES = [
  'Equipo de fútbol',
  'Disciplina',
  'Respeto',
  'Compañerismo',
  'Trabajo en equipo',
  'Liderazgo',
  'Perseverancia'
];

/* ------------------------------------------------------------------ */
/* Componente de Tarjeta Memoizada                                    */
/* ------------------------------------------------------------------ */
const CardFamilia = memo(({ isMobile }: { isMobile: boolean }) => (
  <Tilt
    tiltMaxAngleX={isMobile ? 3 : 8}
    tiltMaxAngleY={isMobile ? 3 : 8}
    perspective={1000}
    glareEnable={!isMobile}
    glareMaxOpacity={0.12}
    glareColor="#ffffff"
    glarePosition="all"
    glareBorderRadius="28px"
    scale={isMobile ? 1 : 1.02}
    transitionSpeed={1400}
    style={{ height: '100%' }}
  >
    <article
      aria-label="Tarjeta de agradecimiento a Mi Familia"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        background: 'linear-gradient(155deg, rgba(253, 250, 245, 0.95) 0%, rgba(244, 236, 222, 0.9) 100%)',
        border: '1px solid rgba(200, 169, 106, 0.45)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28), 0 0 25px rgba(200, 169, 106, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Glow de esquina */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(200,169,106,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      {/* Imagen completa */}
      <div
        style={{
          width: '100%',
          height: 'clamp(200px, 26vw, 240px)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '1.2rem',
          border: '1px solid rgba(200,169,106,0.4)',
          boxShadow: '0 8px 24px rgba(44, 33, 24, 0.12)',
          background: 'rgba(236, 229, 218, 0.4)',
          flexShrink: 0
        }}
      >
        <img
          src={getImgSrc(familiaImg)}
          alt="Fotografía familiar de Alejandro Escandón y su familia"
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      {/* Cabecera con Icono */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(200,169,106,0.2) 0%, rgba(200,169,106,0.05) 100%)',
            border: '1px solid rgba(200,169,106,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C8A96A',
            flexShrink: 0
          }}
        >
          <Heart size={18} fill="#C8A96A" opacity={0.85} aria-hidden />
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)',
            color: '#1C150F',
            letterSpacing: '-0.02em'
          }}
        >
          Mi Familia
        </h3>
      </div>

      {/* Subtítulo */}
      <p
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--ws-font)',
          fontWeight: 600,
          fontSize: 'clamp(0.88rem, 1.5vw, 0.98rem)',
          color: '#8a6d3b',
          lineHeight: 1.3
        }}
      >
        Mi mayor fuente de apoyo y fortaleza.
      </p>

      {/* Línea de tiempo de integrantes */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.2rem',
          padding: '0.75rem',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.65)',
          border: '1px solid rgba(200, 169, 106, 0.25)'
        }}
      >
        {FAMILIA_TIMELINE.map((m) => (
          <div
            key={m.rol}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.82rem',
              fontFamily: 'var(--ws-font)',
              padding: '0.2rem 0.3rem'
            }}
          >
            <span style={{ fontWeight: 700, color: '#1C150F' }}>{m.rol}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#5A4D41', fontSize: '0.78rem' }}>
              <Calendar size={13} style={{ color: '#C8A96A' }} aria-hidden />
              {m.fecha}
            </span>
          </div>
        ))}
      </div>

      {/* Cita de agradecimiento */}
      <p
        style={{
          margin: 'auto 0 0',
          fontFamily: 'var(--ws-font)',
          fontSize: 'clamp(0.84rem, 1.4vw, 0.92rem)',
          color: '#2C2118',
          lineHeight: 1.65,
          fontStyle: 'italic',
          opacity: 0.9
        }}
      >
        &ldquo;La familia representa el primer equipo de vida. Gracias por el apoyo, los valores y la motivación para seguir creciendo personal y profesionalmente.&rdquo;
      </p>
    </article>
  </Tilt>
));
CardFamilia.displayName = 'CardFamilia';

const CardSantosFC = memo(({ isMobile }: { isMobile: boolean }) => (
  <Tilt
    tiltMaxAngleX={isMobile ? 3 : 8}
    tiltMaxAngleY={isMobile ? 3 : 8}
    perspective={1000}
    glareEnable={!isMobile}
    glareMaxOpacity={0.12}
    glareColor="#ffffff"
    glarePosition="all"
    glareBorderRadius="28px"
    scale={isMobile ? 1 : 1.02}
    transitionSpeed={1400}
    style={{ height: '100%' }}
  >
    <article
      aria-label="Tarjeta de agradecimiento al Equipo Santos FC"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        background: 'linear-gradient(155deg, rgba(253, 250, 245, 0.95) 0%, rgba(244, 236, 222, 0.9) 100%)',
        border: '1px solid rgba(200, 169, 106, 0.45)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28), 0 0 25px rgba(200, 169, 106, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Glow de esquina */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(200,169,106,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      {/* Imagen completa */}
      <div
        style={{
          width: '100%',
          height: 'clamp(200px, 26vw, 240px)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '1.2rem',
          border: '1px solid rgba(200,169,106,0.4)',
          boxShadow: '0 8px 24px rgba(44, 33, 24, 0.12)',
          background: 'rgba(236, 229, 218, 0.4)',
          flexShrink: 0
        }}
      >
        <img
          src={getImgSrc(equipoImg)}
          alt="Fotografía del equipo de fútbol Santos FC"
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>

      {/* Cabecera con Icono */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(200,169,106,0.2) 0%, rgba(200,169,106,0.05) 100%)',
            border: '1px solid rgba(200,169,106,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C8A96A',
            flexShrink: 0
          }}
        >
          <Trophy size={18} aria-hidden />
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            fontSize: 'clamp(1.3rem, 2.2vw, 1.6rem)',
            color: '#1C150F',
            letterSpacing: '-0.02em'
          }}
        >
          Santos FC
        </h3>
      </div>

      {/* Subtítulo */}
      <p
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--ws-font)',
          fontWeight: 600,
          fontSize: 'clamp(0.88rem, 1.5vw, 0.98rem)',
          color: '#8a6d3b',
          lineHeight: 1.3
        }}
      >
        Más que un equipo, una familia deportiva.
      </p>

      {/* Tags de valores */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          marginBottom: '1.2rem'
        }}
      >
        {SANTOS_VALORES.map((val) => (
          <span
            key={val}
            style={{
              padding: '0.28rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid rgba(200, 169, 106, 0.4)',
              background: 'rgba(200, 169, 106, 0.08)',
              color: '#2C2118',
              fontFamily: 'var(--ws-font)',
              fontSize: '0.76rem',
              fontWeight: 600
            }}
          >
            {val}
          </span>
        ))}
      </div>

      {/* Cita de agradecimiento */}
      <p
        style={{
          margin: 'auto 0 0',
          fontFamily: 'var(--ws-font)',
          fontSize: 'clamp(0.84rem, 1.4vw, 0.92rem)',
          color: '#2C2118',
          lineHeight: 1.65,
          fontStyle: 'italic',
          opacity: 0.9
        }}
      >
        &ldquo;Cada entrenamiento y cada partido han sido una oportunidad para crecer como persona, aprender a trabajar en equipo y desarrollar disciplina dentro y fuera del campo.&rdquo;
      </p>
    </article>
  </Tilt>
));
CardSantosFC.displayName = 'CardSantosFC';

const CardMaestro = memo(({ isMobile }: { isMobile: boolean }) => (
  <Tilt
    tiltMaxAngleX={isMobile ? 3 : 8}
    tiltMaxAngleY={isMobile ? 3 : 8}
    perspective={1000}
    glareEnable={!isMobile}
    glareMaxOpacity={0.12}
    glareColor="#ffffff"
    glarePosition="all"
    glareBorderRadius="28px"
    scale={isMobile ? 1 : 1.02}
    transitionSpeed={1400}
    style={{ height: '100%' }}
  >
    <article
      aria-label="Tarjeta de reconocimiento al Maestro Samael Aun Weor"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '28px',
        background: 'linear-gradient(155deg, rgba(253, 250, 245, 0.95) 0%, rgba(244, 236, 222, 0.9) 100%)',
        border: '1px solid rgba(200, 169, 106, 0.45)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.28), 0 0 25px rgba(200, 169, 106, 0.15)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Glow de esquina */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(200,169,106,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(20px)'
        }}
      />

      {/* Imagen completa */}
      <div
        style={{
          width: '100%',
          height: 'clamp(200px, 26vw, 240px)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '1.2rem',
          border: '1px solid rgba(200,169,106,0.4)',
          boxShadow: '0 8px 24px rgba(44, 33, 24, 0.12)',
          background: 'rgba(236, 229, 218, 0.4)',
          flexShrink: 0
        }}
      >
        <img
          src={getImgSrc(maestroImg)}
          alt="Fotografía del Maestro Samael Aun Weor"
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            display: 'block'
          }}
        />
      </div>

      {/* Cabecera con Icono */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(200,169,106,0.2) 0%, rgba(200,169,106,0.05) 100%)',
            border: '1px solid rgba(200,169,106,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C8A96A',
            flexShrink: 0
          }}
        >
          <BookOpen size={18} aria-hidden />
        </div>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
            color: '#1C150F',
            letterSpacing: '-0.02em'
          }}
        >
          Maestro Samael Aun Weor
        </h3>
      </div>

      {/* Subtítulo */}
      <p
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--ws-font)',
          fontWeight: 600,
          fontSize: 'clamp(0.88rem, 1.5vw, 0.98rem)',
          color: '#8a6d3b',
          lineHeight: 1.3
        }}
      >
        Inspiración filosófica y crecimiento interior.
      </p>

      {/* Insignia / Filosofía */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          background: 'rgba(200, 169, 106, 0.12)',
          border: '1px solid rgba(200, 169, 106, 0.35)',
          color: '#2C2118',
          fontFamily: 'var(--ws-font)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '1.2rem',
          alignSelf: 'flex-start'
        }}
      >
        <Sparkles size={14} style={{ color: '#C8A96A' }} aria-hidden />
        <span>Filosofía & Autoconocimiento</span>
      </div>

      {/* Cita de agradecimiento */}
      <p
        style={{
          margin: 'auto 0 0',
          fontFamily: 'var(--ws-font)',
          fontSize: 'clamp(0.84rem, 1.4vw, 0.92rem)',
          color: '#2C2118',
          lineHeight: 1.65,
          fontStyle: 'italic',
          opacity: 0.9
        }}
      >
        &ldquo;Un reconocimiento a las enseñanzas que han inspirado la búsqueda del conocimiento, la disciplina interior, la reflexión y el crecimiento personal.&rdquo;
      </p>
    </article>
  </Tilt>
));
CardMaestro.displayName = 'CardMaestro';

/* ------------------------------------------------------------------ */
/* Componente Principal Agradecimientos                               */
/* ------------------------------------------------------------------ */
const Agradecimientos: FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <footer
      id="agradecimientos"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        background: 'linear-gradient(180deg, #1C150F 0%, #2C2118 50%, #16100B 100%)',
        color: '#ECE5DA',
        overflow: 'hidden'
      }}
    >
      {/* Glow de fondo central */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 90vw)',
          height: '400px',
          background: 'radial-gradient(circle, rgba(200,169,106,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      {/* Encabezado de la sección */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: easeCubic }}
        style={{
          textAlign: 'center',
          maxWidth: '720px',
          margin: '0 auto 3.5rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.35rem 1.1rem',
            borderRadius: '999px',
            border: '1px solid rgba(200, 169, 106, 0.45)',
            background: 'rgba(200, 169, 106, 0.1)',
            color: '#C8A96A',
            fontFamily: 'var(--ws-font)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}
        >
          Reconocimiento & Propósito
        </span>

        <h2
          style={{
            margin: '0 0 1rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
            color: '#ECE5DA'
          }}
        >
          Agradecimientos
        </h2>

        <p
          style={{
            margin: 0,
            fontFamily: 'var(--ws-font)',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#C8A96A',
            fontWeight: 500,
            lineHeight: 1.5
          }}
        >
          A las personas y el equipo que han marcado e inspirado el camino de WorshipSaint.
        </p>
      </motion.div>

      {/* Grid de Tarjetas Premium con 3D Tilt */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.4rem)',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto 4rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Tarjeta 1: Familia */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeCubic }}
          style={{ height: '100%' }}
        >
          <CardFamilia isMobile={isMobile} />
        </motion.div>

        {/* Tarjeta 2: Santos FC */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeCubic }}
          style={{ height: '100%' }}
        >
          <CardSantosFC isMobile={isMobile} />
        </motion.div>

        {/* Tarjeta 3: Maestro Samael Aun Weor */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.4, ease: easeCubic }}
          style={{ height: '100%' }}
        >
          <CardMaestro isMobile={isMobile} />
        </motion.div>
      </div>

      {/* Pie de página con copyright */}
      <p
        style={{
          marginTop: 'auto',
          color: 'rgba(236,229,218,0.5)',
          fontFamily: 'var(--ws-font)',
          fontSize: '0.9rem',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center'
        }}
      >
        © {new Date().getFullYear()} WorshipSaint. Hecho con propósito.
      </p>
    </footer>
  );
};

export default Agradecimientos;
