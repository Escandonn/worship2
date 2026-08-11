import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import type { FC, CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGesture } from '@use-gesture/react';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import Section from '../Section';
import cofunder1 from '../../assets/cofunder1.jpg';
import cofunder2 from '../../assets/cofunder2.jpg';
import cofunder3 from '../../assets/cofunder3.png';

/* ------------------------------------------------------------------ */
/* Datos del equipo — Integrantes reales de WorshipSaint             */
/* Estructura premium: foto, nombre, profesión, especialidad,         */
/* descripción y enlaces sociales (Instagram / WhatsApp).             */
/* ------------------------------------------------------------------ */
interface Integrante {
  id: number;
  nombre: string;
  cargo: string;          // Rol corto mostrado en la fase triángulo
  profesion: string;      // Profesión completa mostrada en la card
  especialidad: string;   // Especialidad destacada
  descripcion: string;   // Texto descriptivo
  instagram: string;     // URL de Instagram
  whatsapp: string;      // URL de WhatsApp
  foto: string;           // Ruta de la imagen (assets)
  grad: string;           // Degradado de respaldo (placeholder)
}

const INTEGRANTES: Integrante[] = [
  {
    id: 1,
    nombre: 'Santiago Gomez ',
    cargo: 'Preparación Física',
    profesion: 'Licenciado enEducación Física',
    especialidad: 'Preparación Física',
    descripcion:
      'Especialista en rendimiento físico y acondicionamiento deportivo. Diseña programas personalizados para potenciar la resistencia, fuerza y agilidad de cada atleta.',
    instagram: 'https://www.instagram.com/escandon__2?igsh=MXFwbHJxMnM1MTU0NQ==',
    whatsapp: 'https://wa.me/3172474295',
    foto: cofunder1.src,
    grad: 'linear-gradient(135deg, #E9D9B8 0%, #C8A96A 60%, #8a6d3b 100%)'
  },
  {
    id: 2,
    nombre: 'Esteban Chavez',
    cargo: 'Desarrollo Técnico',
    profesion: 'Licenciado en Educación Física',
    especialidad: 'Desarrollo Técnico',
    descripcion:
      'Enfocado en el desarrollo técnico del jugador. Perfecciona movimientos, control de balón y toma de decisiones para elevar el nivel competitivo.',
    instagram: 'https://www.instagram.com/escandon__2?igsh=MXFwbHJxMnM1MTU0NQ==',
    whatsapp: 'https://wa.me/3172474295',
    foto: cofunder2.src,
    grad: 'linear-gradient(135deg, #F0E4C8 0%, #D6C3A5 55%, #9c7f4e 100%)'
  },
  {
    id: 3,
    nombre: 'Alejandro Escandón',
    cargo: 'Tecnología & Datos',
    profesion: 'Ingeniero de Software · Full Stack Developer',
    especialidad: 'Tecnología, análisis de datos, automatización e IA',
    descripcion:
      'Lidera la transformación digital del equipo: análisis de datos deportivos, automatización de procesos e integración de inteligencia artificial para optimizar el rendimiento.',
    instagram: 'https://www.instagram.com/escandon__2?igsh=MXFwbHJxMnM1MTU0NQ==',
    whatsapp: 'https://wa.me/3172474295',
    foto: cofunder3.src,
    grad: 'linear-gradient(135deg, #EFE3C2 0%, #C8A96A 50%, #6f5530 100%)'
  }
];

/* Alias de compatibilidad para preservar la lógica existente */
const JUGADORES = INTEGRANTES;

/* ------------------------------------------------------------------ */
/* Fases de la secuencia cinematográfica                              */
/* ------------------------------------------------------------------ */
type Fase = 'idle' | 'triangulo' | 'rotando' | 'fila' | 'interactivo';

const ROTACIONES = 3;
const INTERVALO_ROT = 1100;   // Card protagonista: ~1.1s para un ritmo más ágil
const TRANS_JUG = 380;        // Transición entre jugadores: 380ms
const easeCubic = [0.65, 0, 0.35, 1] as const;

const glassCard: CSSProperties = {
  borderRadius: 'var(--ws-radius-card)',
  border: '1px solid rgba(200,169,106,0.35)',
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  boxShadow: 'var(--ws-shadow-card)'
};

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */
const EquipoFutbol: FC = () => {
  const [fase, setFase] = useState<Fase>('idle');
  const [protagonista, setProtagonista] = useState(0);
  const [activo, setActivo] = useState(0);
  const [secuenciaIniciada, setSecuenciaIniciada] = useState(false);
  // Estado final permanente: una vez true, NUNCA vuelve a false salvo
  // desmontaje. Garantiza que la sección permanezca visible tras la animación.
  const [presentationCompleted, setPresentationCompleted] = useState(false);

  // Detección de Desktop (≥1024px) — para mejoras exclusivas PC
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const contRef = useRef<HTMLDivElement | null>(null);
  const sectionElRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.35, triggerOnce: true });
  // Visibilidad de la CTA final (entrada por scroll)
  const { ref: ctaRef, inView: ctaInView } = useInView({ threshold: 0.25, triggerOnce: true });

  /* -------------------------------------------------------------- */
  /* Neutralizar el content-visibility:auto del <section> padre.    */
  /* Section.tsx aplica content-visibility:auto a todas las seccio- */
  /* nes que no son hero, lo que OCULTA el contenido al salir del   */
  /* viewport y puede reiniciar el IntersectionObserver al volver.  */
  /* Forzamos content-visibility:visible en el ancestro <section>   */
  /* para que el contenido permanezca SIEMPRE renderizado.          */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    const cont = contRef.current;
    if (!cont) return;
    const section = cont.closest('section');
    if (!section) return;
    sectionElRef.current = section;
    section.style.contentVisibility = 'visible';
    section.style.containIntrinsicSize = 'none';
    // Observar cambios por si React re-aplica estilos
    const mo = new MutationObserver(() => {
      if (section.style.contentVisibility !== 'visible') {
        section.style.contentVisibility = 'visible';
      }
    });
    mo.observe(section, { attributes: true, attributeFilter: ['style'] });
    return () => mo.disconnect();
  }, []);

  // Parallax sutil para la imagen principal (motion values acelerados por GPU)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 18 });
  const py = useSpring(my, { stiffness: 120, damping: 18 });
  const tiltX = useTransform(py, [-1, 1], [4, -4]);
  const tiltY = useTransform(px, [-1, 1], [-4, 4]);

  /* -------------------------------------------------------------- */
  /* RED VIVA — Medición real de las cards                          */
  /* Medimos las posiciones reales de las 3 cards con getBounding-  */
  /* ClientRect relativas al contenedor del grid. Esto garantiza    */
  /* que las líneas anclen EXACTAMENTE a los nodos, sin importar    */
  /* el tamaño de pantalla, y se recalculen al cambiar protagonista.*/
  /* Los nodos se sitúan en el BORDE EXTERIOR de cada foto circular,*/
  /* orientados hacia el centro del triángulo.                      */
  /* -------------------------------------------------------------- */
  const gridRef = useRef<HTMLDivElement | null>(null);
  // Refs de las fotos circulares (no de las cards completas)
  const fotoRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  // Posiciones medidas de los nodos en píxeles reales (relativas al grid)
  const [nodos, setNodos] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }
  ]);
  // Tamaño del contenedor grid (para el viewBox del SVG)
  const [gridSize, setGridSize] = useState({ w: 0, h: 0 });

  // Calcula el centro de cada nodo en el borde exterior de la foto,
  // orientado hacia el centro del triángulo.
  const medirNodos = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const gRect = grid.getBoundingClientRect();
    setGridSize({ w: gRect.width, h: gRect.height });

    // Centros de cada foto circular
    const centros: { cx: number; cy: number; r: number }[] = [];
    fotoRefs.current.forEach((f) => {
      if (!f) { centros.push({ cx: 0, cy: 0, r: 0 }); return; }
      const r = f.getBoundingClientRect();
      centros.push({
        cx: r.left - gRect.left + r.width / 2,
        cy: r.top - gRect.top + r.height / 2,
        r: r.width / 2
      });
    });

    // Centro del triángulo (baricentro de los 3 centros)
    const bcx = (centros[0].cx + centros[1].cx + centros[2].cx) / 3;
    const bcy = (centros[0].cy + centros[1].cy + centros[2].cy) / 3;

    // Cada nodo se sitúa en el borde exterior de la foto, en dirección
    // OPUESTA al baricentro (hacia afuera del triángulo). Pero las líneas
    // deben conectar los nodos SIN atravesar las cards → el nodo debe
    // estar en el borde orientado hacia la conexión.
    // En un triángulo, cada vértice conecta con los otros dos. El punto
    // del borde de la foto más cercano a ambos otros vértices es el que
    // mira hacia el baricentro. Por eso orientamos hacia el baricentro.
    const nuevos = centros.map((c) => {
      const dx = bcx - c.cx;
      const dy = bcy - c.cy;
      const dist = Math.hypot(dx, dy) || 1;
      // Nodo en el borde de la foto, hacia el centro del triángulo
      return {
        x: c.cx + (dx / dist) * c.r,
        y: c.cy + (dy / dist) * c.r
      };
    });
    setNodos(nuevos);
  }, []);

  // Medición inicial + ResizeObserver (recalcula al cambiar tamaño/protagonista)
  useLayoutEffect(() => {
    medirNodos();
    const grid = gridRef.current;
    if (!grid) return;
    const ro = new ResizeObserver(() => medirNodos());
    ro.observe(grid);
    // También observar las fotos por si cambian de tamaño
    fotoRefs.current.forEach((f) => { if (f) ro.observe(f); });
    return () => ro.disconnect();
  }, [medirNodos]);

  // Recalcular cuando cambia el protagonista (las cards se reordenan)
  useLayoutEffect(() => {
    // Pequeño delay para que el DOM se reordene antes de medir
    const t = window.setTimeout(() => medirNodos(), 50);
    return () => window.clearTimeout(t);
  }, [protagonista, medirNodos]);

  /* -------------------------------------------------------------- */
  /* Secuencia de entrada cinematográfica                           */
  /* Se ejecuta UNA sola vez. Al finalizar deja presentationCompleted*/
  /* en true y la fase en 'interactivo' — estado final permanente.  */
  /* -------------------------------------------------------------- */
  const iniciarSecuencia = useCallback(() => {
    if (secuenciaIniciada) return;
    setSecuenciaIniciada(true);

    setFase('triangulo');
    setProtagonista(0);

    let rot = 0;
    const rotar = () => {
      rot += 1;
      if (rot < ROTACIONES) {
        setProtagonista((p) => (p + 1) % JUGADORES.length);
        window.setTimeout(rotar, TRANS_JUG);
      } else {
        // Última card visible ~1.7s, luego transición elegante a fila
        window.setTimeout(() => {
          setFase('fila');
          window.setTimeout(() => {
            setFase('interactivo');
            setActivo(0);
            setPresentationCompleted(true);
          }, 800);
        }, INTERVALO_ROT);
      }
    };
    window.setTimeout(rotar, INTERVALO_ROT);
  }, [secuenciaIniciada]);

  /* -------------------------------------------------------------- */
  /* Disparo por scroll (IntersectionObserver) — una sola vez       */
  /* Si la presentación ya completó, NO reinicia (permanece visible)*/
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (inView && !secuenciaIniciada && !presentationCompleted) iniciarSecuencia();
  }, [inView, secuenciaIniciada, presentationCompleted, iniciarSecuencia]);

  /* -------------------------------------------------------------- */
  /* Disparo por navbar (evento ws:replay-equipo)                   */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    const handler = () => {
      setSecuenciaIniciada(false);
      setPresentationCompleted(false);
      setFase('idle');
      setProtagonista(0);
      setActivo(0);
      window.setTimeout(() => iniciarSecuencia(), 60);
    };
    window.addEventListener('ws:replay-equipo', handler);
    return () => window.removeEventListener('ws:replay-equipo', handler);
  }, [iniciarSecuencia]);

  /* -------------------------------------------------------------- */
  /* Gestos: parallax hover desktop sobre imagen principal          */
  /* -------------------------------------------------------------- */
  const bindHover = useGesture({
    onMove: ({ event }) => {
      const el = event.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const nx = (event.clientX - r.left) / r.width - 0.5;
      const ny = (event.clientY - r.top) / r.height - 0.5;
      mx.set(nx * 2);
      my.set(ny * 2);
    },
    onHover: ({ hovering }) => {
      if (!hovering) {
        mx.set(0);
        my.set(0);
      }
    }
  });

  /* -------------------------------------------------------------- */
  /* Click en imagen principal: zoom + rotación + glow             */
  /* -------------------------------------------------------------- */
  const [pop, setPop] = useState(false);
  const onMainClick = () => {
    setPop(true);
    window.setTimeout(() => setPop(false), 600);
  };

  /* -------------------------------------------------------------- */
  /* Render — NUEVA LÓGICA                                          */
  /* Todo está SIEMPRE MONTADO. No hay renderizado condicional que  */
  /* desmonte elementos. La visibilidad se controla únicamente con  */
  /* `animate` (opacity/transform), nunca con `{cond && <Comp/>}`.  */
  /* Esto elimina la causa raíz de la desaparición: ningún nodo se  */
  /* desmonta, así que framer-motion no puede perder su estado.     */
  /* -------------------------------------------------------------- */
  const enTriangulo = fase === 'triangulo' || fase === 'rotando';
  const mostrarFila = fase === 'fila' || fase === 'interactivo' || presentationCompleted;
  const visTriangulo = enTriangulo && !mostrarFila ? 1 : 0;
  const visFila = mostrarFila ? 1 : 0;
  const visIdle = !secuenciaIniciada ? 1 : 0;

  return (
    <Section
      id="equipo-futbol"
      title="Nuestro Equipo"
      subtitle="Talento humano que combina disciplina deportiva e innovación tecnológica."
      variant="muted"
    >
      <ParallaxProvider>
      {/* contRef + inViewRef en contenedor PERMANENTE (siempre montado).
          contentVisibility:'visible' neutraliza el content-visibility:auto
          del Section padre, que oculta el contenido al salir del viewport. */}
      <div
        ref={(node) => { contRef.current = node; inViewRef(node); }}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: isDesktop ? '560px' : '440px',
          contentVisibility: 'visible',
          containIntrinsicSize: 'none'
        }}
      >
        {/* Glow dorado de fondo que aparece en la entrada */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={secuenciaIniciada ? { opacity: 0.55, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.9, ease: easeCubic }}
          style={{
            position: 'absolute',
            inset: '-10% 0 0 0',
            margin: '0 auto',
            width: 'min(496px, 90%)',
            height: '336px',
            background: 'radial-gradient(circle at 50% 40%, rgba(200,169,106,0.35), transparent 65%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* ---------------------------------------------------------- */}
        {/* ESCENA 1 — Triángulo + rotación de protagonismo            */}
        {/* SIEMPRE MONTADA. Se desvanece por opacity al llegar a fila. */}
        {/* El SVG vive DENTRO del grid de cards (contenedor relativo)  */}
        {/* para que las líneas anclen exactamente a los nodos reales.  */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          animate={{ opacity: visTriangulo, scale: visTriangulo ? 1 : 0.96, filter: visTriangulo ? 'blur(0px)' : 'blur(8px)' }}
          transition={{ duration: 0.7, ease: easeCubic }}
          style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: visTriangulo ? 'auto' : 'none' }}
        >
          {/* ──────────────────────────────────────────────────────────── */}
          {/* RED VIVA — Conexiones entre las 3 cards                     */}
          {/* El SVG usa coordenadas en PÍXELES REALES medidos con         */}
          {/* getBoundingClientRect + ResizeObserver. Las líneas anclan    */}
          {/* EXACTAMENTE a los nodos en el borde exterior de cada foto,  */}
          {/* y se recalculan automáticamente al cambiar el protagonista. */}
          {/* Lenguaje visual = Hero (oro #C8A96A, glow, breathing).       */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div
            ref={gridRef}
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: isDesktop ? 'clamp(1.6rem, 5vw, 4rem)' : 'clamp(0.6rem, 2vw, 1.6rem)',
              rowGap: isDesktop ? 'clamp(2.4rem, 6vw, 4.8rem)' : 'clamp(0.6rem, 2vw, 1.6rem)',
              maxWidth: isDesktop ? 'clamp(560px, 82vw, 920px)' : 'clamp(288px, 88vw, 576px)',
              margin: '0 auto',
              justifyItems: 'center',
              padding: 'clamp(0.4rem, 1.6vw, 0.8rem) 0'
            }}
          >
            {/* SVG de conexiones — coordenadas en píxeles reales */}
            <svg
              aria-hidden
              viewBox={`0 0 ${gridSize.w} ${gridSize.h}`}
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 5,
                opacity: visTriangulo && isDesktop ? 1 : 0,
                transition: 'opacity 0.7s ease'
              }}
            >
              <defs>
                <filter id="tri-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="tri-node-grad">
                  <stop offset="0%" stopColor="#F5E6C8" stopOpacity="1" />
                  <stop offset="45%" stopColor="#C8A96A" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#C8A96A" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ── Líneas del triángulo — entre nodos reales ── */}
              {nodos.map((v, i) => {
                const next = nodos[(i + 1) % 3];
                const len = Math.hypot(next.x - v.x, next.y - v.y);
                return (
                  <motion.line
                    key={`ln-${i}`}
                    x1={v.x} y1={v.y} x2={next.x} y2={next.y}
                    stroke="#C8A96A"
                    strokeWidth={2}
                    strokeLinecap="round"
                    filter="url(#tri-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={visTriangulo ? { pathLength: 1, opacity: 0.42 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.55, delay: 0.25 + i * 0.18, ease: easeCubic }}
                    style={{ strokeDasharray: len }}
                  />
                );
              })}

              {/* ── Pulsos de energía — recorren las líneas cada ~4s ── */}
              {nodos.map((v, i) => {
                const next = nodos[(i + 1) % 3];
                return (
                  <motion.circle
                    key={`pulse-${i}`}
                    r={3}
                    fill="#F5E6C8"
                    filter="url(#tri-glow)"
                    initial={{ cx: v.x, cy: v.y, opacity: 0 }}
                    animate={visTriangulo ? {
                      cx: [v.x, next.x],
                      cy: [v.y, next.y],
                      opacity: [0, 0.9, 0.9, 0]
                    } : { opacity: 0 }}
                    transition={visTriangulo ? {
                      duration: 1.4,
                      delay: 0.25 + i * 0.18 + 0.15,
                      times: [0, 0.12, 0.88, 1],
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 2.6
                    } : { duration: 0.3 }}
                  />
                );
              })}

              {/* ── Nodos en el borde exterior de cada foto ── */}
              {nodos.map((v, i) => (
                <motion.g
                  key={`node-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={visTriangulo ? {
                    scale: [0, 1.5, 1],
                    opacity: [0, 1, 0.9]
                  } : { scale: 0, opacity: 0 }}
                  transition={visTriangulo ? {
                    duration: 0.5,
                    delay: 0.15 + i * 0.18,
                    ease: easeCubic
                  } : { duration: 0.3 }}
                  style={{ transformOrigin: `${v.x}px ${v.y}px` }}
                >
                  <circle cx={v.x} cy={v.y} r={9} fill="url(#tri-node-grad)" opacity={0.45} />
                  <motion.circle
                    cx={v.x} cy={v.y} r={5}
                    fill="#C8A96A"
                    filter="url(#tri-glow)"
                    animate={visTriangulo ? {
                      opacity: [0.9, 0.55, 0.9],
                      scale: [1, 1.2, 1]
                    } : { opacity: 0 }}
                    transition={visTriangulo ? {
                      duration: 2.8,
                      delay: 0.15 + i * 0.18 + 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    } : { duration: 0.3 }}
                    style={{ transformOrigin: `${v.x}px ${v.y}px` }}
                  />
                  <circle cx={v.x} cy={v.y} r={2} fill="#F5E6C8" opacity={0.95} />
                </motion.g>
              ))}
            </svg>

            {/* Card protagonista (arriba, centrada) — 130-140% de las secundarias */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  ...glassCard,
                  width: isDesktop ? 'clamp(320px, 48vw, 460px)' : 'clamp(220px, 38vw, 336px)',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  textAlign: 'center',
                  borderColor: 'rgba(200,169,106,0.7)',
                  boxShadow: '0 18px 50px rgba(200,169,106,0.35), 0 0 30px rgba(200,169,106,0.25)'
                }}
              >
                {/* Foto circular con borde dorado */}
                <div
                  ref={(el) => { fotoRefs.current[0] = el; }}
                  style={{
                    width: isDesktop ? 'clamp(160px, 28vw, 232px)' : 'clamp(108px, 19vw, 160px)',
                    height: isDesktop ? 'clamp(160px, 28vw, 232px)' : 'clamp(108px, 19vw, 160px)',
                    borderRadius: '50%',
                    margin: '0 auto 0.7rem',
                    border: '2px solid rgba(200,169,106,0.85)',
                    boxShadow: '0 10px 30px rgba(200,169,106,0.4)',
                    overflow: 'hidden',
                    position: 'relative',
                    background: JUGADORES[protagonista].grad
                  }}
                >
                  <img
                    src={JUGADORES[protagonista].foto}
                    alt={`Foto de ${JUGADORES[protagonista].nombre}, ${JUGADORES[protagonista].cargo}`}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <h3 style={{ margin: 0, fontFamily: 'var(--ws-font)', fontWeight: 700, color: 'var(--ws-text)', fontSize: 'clamp(1.05rem, 2.2vw, 1.35rem)' }}>
                  {JUGADORES[protagonista].nombre}
                </h3>
                <p style={{ margin: '0.3rem 0 0', color: 'var(--ws-muted)', fontFamily: 'var(--ws-font)', fontSize: '0.9rem' }}>
                  {JUGADORES[protagonista].cargo}
                </p>
              </div>
            </div>

            {/* Cards inferiores — hacia las esquinas (justify-self extremos) */}
            {JUGADORES.map((j, i) => {
              if (i === protagonista) return null;
              // La primera card inferior va a la izquierda, la segunda a la derecha
              const idx = i < protagonista ? i + 1 : i;
              const isLeft = idx === 1;
              return (
                <div
                  key={j.id}
                  ref={(el) => { fotoRefs.current[idx] = el; }}
                  style={{
                    width: isDesktop ? 'clamp(120px, 20vw, 176px)' : 'clamp(80px, 14vw, 116px)',
                    height: isDesktop ? 'clamp(120px, 20vw, 176px)' : 'clamp(80px, 14vw, 116px)',
                    borderRadius: '50%',
                    border: '2px solid rgba(200,169,106,0.7)',
                    boxShadow: '0 8px 24px rgba(200,169,106,0.25)',
                    justifySelf: isLeft ? 'start' : 'end',
                    overflow: 'hidden',
                    position: 'relative',
                    background: j.grad
                  }}
                >
                  <img
                    src={j.foto}
                    alt={`Foto de ${j.nombre}, ${j.cargo}`}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* ESCENA 2 — Fila de cards premium con info completa          */}
        {/* SIEMPRE MONTADA. Aparece por opacity cuando mostrarFila.    */}
        {/* Permanece visible permanentemente (presentationCompleted). */}
        {/* Cards premium: glassmorphism, foto, profesión, especialidad,*/}
        {/* descripción y botones de Instagram / WhatsApp.              */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          animate={{ opacity: visFila, y: visFila ? 0 : 40, filter: visFila ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ duration: 0.8, ease: easeCubic }}
          style={{ position: 'relative', zIndex: 3, pointerEvents: visFila ? 'auto' : 'none' }}
        >
          {/* Grid de cards premium — 3 columnas en desktop, apiladas en móvil */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isDesktop
                ? 'repeat(3, minmax(0, 1fr))'
                : 'minmax(0, 1fr)',
              gap: 'clamp(1.2rem, 2.8vw, 2.2rem)',
              maxWidth: isDesktop ? 'clamp(820px, 95vw, 1240px)' : 'clamp(280px, 92vw, 460px)',
              margin: '0 auto',
              justifyItems: 'stretch'
            }}
          >
            {JUGADORES.map((j, i) => {
              const esActivo = i === activo;
              return (
                <motion.article
                  key={j.id}
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={mostrarFila ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.35,
                      delay: 0.04 + i * 0.06,
                      ease: easeCubic
                    }
                  } : {}}
                  whileHover={isDesktop ? { y: -6, scale: 1.02 } : {}}
                  transition={{ duration: 0.25, ease: easeCubic }}
                  onMouseEnter={() => setActivo(i)}
                  aria-label={`Tarjeta de ${j.nombre}, ${j.profesion}`}
                  style={{
                    ...glassCard,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'clamp(1.1rem, 2.4vw, 1.6rem)',
                    borderRadius: '20px',
                    borderColor: esActivo
                      ? 'rgba(200,169,106,0.85)'
                      : 'rgba(200,169,106,0.35)',
                    boxShadow: esActivo
                      ? '0 0 0 1px rgba(200,169,106,0.5), 0 22px 55px rgba(200,169,106,0.28), 0 0 40px rgba(200,169,106,0.18)'
                      : 'var(--ws-shadow-card)',
                    willChange: 'transform, box-shadow, opacity',
                    cursor: 'default'
                  }}
                >
                  {/* Foto — circular en desktop, ligeramente redondeada */}
                  <div
                    style={{
                      width: isDesktop ? 'clamp(180px, 22vw, 240px)' : 'clamp(140px, 42vw, 180px)',
                      height: isDesktop ? 'clamp(180px, 22vw, 240px)' : 'clamp(140px, 42vw, 180px)',
                      borderRadius: isDesktop ? '50%' : '20px',
                      margin: '0 auto clamp(0.9rem, 2vw, 1.2rem)',
                      border: '2px solid rgba(200,169,106,0.7)',
                      boxShadow: '0 12px 30px rgba(200,169,106,0.3)',
                      overflow: 'hidden',
                      position: 'relative',
                      background: j.grad,
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={j.foto}
                      alt={`Foto de ${j.nombre}, ${j.profesion}`}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Nombre */}
                  <h3
                    style={{
                      margin: '0 0 0.25rem',
                      fontFamily: 'var(--ws-font)',
                      fontWeight: 700,
                      color: 'var(--ws-text)',
                      fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {j.nombre}
                  </h3>

                  {/* Profesión */}
                  <p
                    style={{
                      margin: '0 0 0.5rem',
                      fontFamily: 'var(--ws-font)',
                      fontWeight: 600,
                      color: 'var(--ws-accent)',
                      fontSize: 'clamp(0.85rem, 1.6vw, 0.98rem)',
                      textAlign: 'center',
                      lineHeight: 1.3
                    }}
                  >
                    {j.profesion}
                  </p>

                  {/* Especialidad */}
                  <p
                    style={{
                      margin: '0 0 0.75rem',
                      fontFamily: 'var(--ws-font)',
                      fontWeight: 600,
                      color: 'var(--ws-muted)',
                      fontSize: 'clamp(0.78rem, 1.4vw, 0.88rem)',
                      textAlign: 'center',
                      letterSpacing: '0.01em',
                      lineHeight: 1.3
                    }}
                  >
                    {j.especialidad}
                  </p>

                  {/* Descripción */}
                  <p
                    style={{
                      margin: '0 0 1.1rem',
                      fontFamily: 'var(--ws-font)',
                      color: 'var(--ws-text)',
                      opacity: 0.82,
                      fontSize: 'clamp(0.82rem, 1.5vw, 0.92rem)',
                      lineHeight: 1.6,
                      textAlign: 'center',
                      flexGrow: 1
                    }}
                  >
                    {j.descripcion}
                  </p>

                  {/* Botones sociales — Instagram + WhatsApp */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.6rem',
                      justifyContent: 'center',
                      marginTop: 'auto'
                    }}
                  >
                    <motion.a
                      href={j.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram de ${j.nombre}`}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ duration: 0.25, ease: easeCubic }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--ws-radius-btn)',
                        fontFamily: 'var(--ws-font)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#fff',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #C8A96A 0%, #8a6d3b 100%)',
                        boxShadow: '0 6px 18px rgba(200,169,106,0.3)',
                        willChange: 'transform',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <FaInstagram aria-hidden />
                      <span>Instagram</span>
                    </motion.a>

                    <motion.a
                      href={j.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp de ${j.nombre}`}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ duration: 0.25, ease: easeCubic }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--ws-radius-btn)',
                        fontFamily: 'var(--ws-font)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#fff',
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        boxShadow: '0 6px 18px rgba(37,211,102,0.3)',
                        willChange: 'transform',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <FaWhatsapp aria-hidden />
                      <span>WhatsApp</span>
                    </motion.a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* Estado idle: placeholder sutil antes de iniciar — SIEMPRE MONTADO */}
        <motion.div
          aria-hidden
          animate={{ opacity: visIdle }}
          transition={{ duration: 0.5, ease: easeCubic }}
          style={{
            height: 'clamp(224px, 42vw, 300px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <motion.div
            animate={{ opacity: visIdle ? [0.3, 0.6, 0.3] : 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 'clamp(100px, 18vw, 140px)',
              height: 'clamp(100px, 18vw, 140px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,169,106,0.25), transparent 70%)',
              filter: 'blur(8px)'
            }}
          />
        </motion.div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* CTA FINAL — "Más que un equipo, una comunidad"              */}
      {/* Continuación natural de la sección. Fade In + elevación +  */}
      {/* blur→enfoque. Fondo de partículas tenues + degradado dorado.*/}
      {/* ---------------------------------------------------------- */}
      <motion.section
        ref={ctaRef}
        aria-label="Mensaje de comunidad"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={ctaInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.8, ease: easeCubic }}
        style={{
          position: 'relative',
          marginTop: 'clamp(32px, 5.6vw, 58px)',
          padding: 'clamp(2rem, 4.8vw, 3.6rem) clamp(1.2rem, 4vw, 2.4rem)',
          borderRadius: 'var(--ws-radius-card)',
          overflow: 'hidden',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(236,229,218,0.4) 0%, rgba(214,195,165,0.25) 100%)',
          border: '1px solid rgba(200,169,106,0.18)',
          isolation: 'isolate'
        }}
      >
        {/* Fondo: red de partículas tenues + degradado dorado */}
        <svg
          aria-hidden
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5, pointerEvents: 'none', zIndex: -1 }}
        >
          <defs>
            <radialGradient id="cta-grad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(200,169,106,0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="1200" height="400" fill="url(#cta-grad)" />
          {/* Nodos brillando lentamente */}
          {[
            { x: 180, y: 90 }, { x: 420, y: 60 }, { x: 760, y: 110 }, { x: 1020, y: 80 },
            { x: 300, y: 320 }, { x: 640, y: 340 }, { x: 920, y: 300 }, { x: 1120, y: 330 }
          ].map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r={2.5}
              fill="rgba(200,169,106,0.55)"
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
              transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {/* Conexiones tenues entre nodos cercanos */}
          {[
            { x1: 180, y1: 90, x2: 420, y2: 60 },
            { x1: 420, y1: 60, x2: 760, y2: 110 },
            { x1: 760, y1: 110, x2: 1020, y2: 80 },
            { x1: 300, y1: 320, x2: 640, y2: 340 },
            { x1: 640, y1: 340, x2: 920, y2: 300 }
          ].map((ln, i) => (
            <line
              key={i}
              x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
              stroke="rgba(200,169,106,0.12)"
              strokeWidth={1}
            />
          ))}
        </svg>

        <h2
          style={{
            margin: '0 0 0.75rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 800,
            color: 'var(--ws-text)',
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            letterSpacing: '-0.01em',
            lineHeight: 1.15
          }}
        >
          Más que un equipo, una comunidad.
        </h2>
        <p
          style={{
            margin: '0 auto 1rem',
            maxWidth: '640px',
            fontFamily: 'var(--ws-font)',
            color: 'var(--ws-accent)',
            fontWeight: 600,
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)'
          }}
        >
          Cada jugador representa disciplina, identidad y compromiso con WorshipSaint.
        </p>
        <p
          style={{
            margin: '0 auto 2rem',
            maxWidth: '680px',
            fontFamily: 'var(--ws-font)',
            color: 'var(--ws-text)',
            opacity: 0.78,
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            lineHeight: 1.7
          }}
        >
          Nuestro equipo refleja los valores que impulsan cada proyecto: pasión, constancia, colaboración y crecimiento. Dentro y fuera del campo construimos una comunidad que comparte una misma visión y una misma identidad.
        </p>
        <motion.button
          type="button"
          onClick={() => {
            const target = document.getElementById('sobre-nosotros');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.3, ease: easeCubic }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.9rem 2.2rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 'var(--ws-radius-btn)',
            background: 'var(--ws-gradient-btn, linear-gradient(135deg, #C8A96A 0%, #8a6d3b 100%))',
            boxShadow: 'var(--ws-shadow-btn)',
            willChange: 'transform',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Conoce nuestra historia
        </motion.button>
      </motion.section>
      </ParallaxProvider>
    </Section>
  );
};

export default EquipoFutbol;
