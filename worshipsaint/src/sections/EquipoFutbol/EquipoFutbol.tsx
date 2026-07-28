import { useEffect, useRef, useState, useCallback } from 'react';
import type { FC, CSSProperties } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useGesture } from '@use-gesture/react';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import Section from '../Section';

/* ------------------------------------------------------------------ */
/* Datos del equipo (sin imágenes reales → gradientes dorados premium) */
/* ------------------------------------------------------------------ */
interface Jugador {
  id: number;
  nombre: string;
  rol: string;
  numero: string;
  grad: string;
}

const JUGADORES: Jugador[] = [
  { id: 1, nombre: 'Saint', rol: 'Delantero', numero: '#10', grad: 'linear-gradient(135deg, #E9D9B8 0%, #C8A96A 60%, #8a6d3b 100%)' },
  { id: 2, nombre: 'Saint', rol: 'Extremo', numero: '#7', grad: 'linear-gradient(135deg, #F0E4C8 0%, #D6C3A5 55%, #9c7f4e 100%)' },
  { id: 3, nombre: 'Saint', rol: 'Defensa', numero: '#5', grad: 'linear-gradient(135deg, #EFE3C2 0%, #C8A96A 50%, #6f5530 100%)' }
];

/* ------------------------------------------------------------------ */
/* Fases de la secuencia cinematográfica                              */
/* ------------------------------------------------------------------ */
type Fase = 'idle' | 'triangulo' | 'rotando' | 'fila' | 'interactivo';

const ROTACIONES = 3;
const INTERVALO_ROT = 2500;
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

  const contRef = useRef<HTMLDivElement | null>(null);
  const sectionElRef = useRef<HTMLElement | null>(null);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.35, triggerOnce: true });

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
        window.setTimeout(rotar, INTERVALO_ROT);
      } else {
        window.setTimeout(() => {
          setFase('fila');
          window.setTimeout(() => {
            setFase('interactivo');
            setActivo(0);
            setPresentationCompleted(true);
          }, 700);
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
      title="Equipo de Fútbol"
      subtitle="Una alineación que representa disciplina, estilo y pasión por el juego."
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
          minHeight: '440px',
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
            width: 'min(620px, 90%)',
            height: '420px',
            background: 'radial-gradient(circle at 50% 40%, rgba(200,169,106,0.35), transparent 65%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* ---------------------------------------------------------- */}
        {/* ESCENA 1 — Triángulo + rotación de protagonismo            */}
        {/* SIEMPRE MONTADA. Se desvanece por opacity al llegar a fila. */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          animate={{ opacity: visTriangulo, scale: visTriangulo ? 1 : 0.96, filter: visTriangulo ? 'blur(0px)' : 'blur(8px)' }}
          transition={{ duration: 0.7, ease: easeCubic }}
          style={{ position: 'absolute', inset: 0, zIndex: 2, minHeight: '440px', pointerEvents: visTriangulo ? 'auto' : 'none' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              maxWidth: '760px',
              margin: '0 auto',
              justifyItems: 'center'
            }}
          >
            {/* Card protagonista (arriba, centrada) — sin key dinámica */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  ...glassCard,
                  width: 'clamp(220px, 38vw, 300px)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  borderColor: 'rgba(200,169,106,0.7)',
                  boxShadow: '0 18px 50px rgba(200,169,106,0.35), 0 0 30px rgba(200,169,106,0.25)'
                }}
              >
                <div
                  style={{
                    width: 'clamp(120px, 22vw, 170px)',
                    height: 'clamp(120px, 22vw, 170px)',
                    borderRadius: '50%',
                    margin: '0 auto 1rem',
                    background: JUGADORES[protagonista].grad,
                    boxShadow: '0 10px 30px rgba(200,169,106,0.4)'
                  }}
                />
                <h3 style={{ margin: 0, fontFamily: 'var(--ws-font)', fontWeight: 700, color: 'var(--ws-text)', fontSize: 'clamp(1.1rem, 2.4vw, 1.4rem)' }}>
                  {JUGADORES[protagonista].nombre} {JUGADORES[protagonista].numero}
                </h3>
                <p style={{ margin: '0.4rem 0 0', color: 'var(--ws-muted)', fontFamily: 'var(--ws-font)', fontSize: '0.95rem' }}>
                  {JUGADORES[protagonista].rol}
                </p>
              </div>
            </div>

            {/* Cards inferiores (solo foto pequeña, sin texto) */}
            {JUGADORES.map((j, i) => {
              if (i === protagonista) return null;
              return (
                <div
                  key={j.id}
                  style={{
                    width: 'clamp(110px, 20vw, 150px)',
                    height: 'clamp(110px, 20vw, 150px)',
                    borderRadius: '50%',
                    background: j.grad,
                    boxShadow: '0 8px 24px rgba(200,169,106,0.25)'
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* ESCENA 2 — Fila de miniaturas + imagen protagonista        */}
        {/* SIEMPRE MONTADA. Aparece por opacity cuando mostrarFila.    */}
        {/* Permanece visible permanentemente (presentationCompleted). */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          animate={{ opacity: visFila, y: visFila ? 0 : 40, filter: visFila ? 'blur(0px)' : 'blur(10px)' }}
          transition={{ duration: 0.8, ease: easeCubic }}
          style={{ position: 'relative', zIndex: 3, pointerEvents: visFila ? 'auto' : 'none' }}
        >
          {/* Imagen protagonista */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)'
            }}
          >
            <Parallax speed={-8} style={{ width: 'min(90%, 520px)' }}>
              <div {...bindHover()} style={{ width: '100%' }}>
                <motion.div
                  onClick={onMainClick}
                  animate={pop ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                  transition={{ duration: 0.6, ease: easeCubic }}
                  style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    aspectRatio: '4 / 5',
                    borderRadius: 'var(--ws-radius-card)',
                    overflow: 'hidden',
                    border: '1px solid rgba(200,169,106,0.5)',
                    boxShadow: pop
                      ? '0 0 50px rgba(200,169,106,0.55), 0 20px 60px rgba(200,169,106,0.35)'
                      : '0 18px 50px rgba(200,169,106,0.3)',
                    cursor: 'pointer',
                    position: 'relative',
                    background: JUGADORES[activo].grad,
                    willChange: 'transform, box-shadow'
                  }}
                  aria-label={`Imagen principal de ${JUGADORES[activo].nombre} ${JUGADORES[activo].numero}`}
                >
                  {/* Overlay de info — crossfade por animate, sin key dinámica */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '1.5rem',
                      background: 'linear-gradient(180deg, transparent 40%, rgba(44,33,24,0.55) 100%)'
                    }}
                  >
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                      <div style={{ fontFamily: 'var(--ws-font)', fontWeight: 700, fontSize: 'clamp(1.2rem, 3vw, 1.6rem)' }}>
                        {JUGADORES[activo].nombre} {JUGADORES[activo].numero}
                      </div>
                      <div style={{ fontFamily: 'var(--ws-font)', opacity: 0.85, fontSize: '0.95rem' }}>
                        {JUGADORES[activo].rol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Parallax>
          </div>

          {/* Miniaturas */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(0.75rem, 2vw, 1.5rem)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {JUGADORES.map((j, i) => {
              const esActivo = i === activo;
              return (
                <motion.button
                  key={j.id}
                  type="button"
                  onClick={() => setActivo(i)}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.94 }}
                  animate={{
                    scale: esActivo ? 1.08 : 1,
                    y: esActivo ? -4 : 0,
                    boxShadow: esActivo
                      ? '0 0 0 3px rgba(200,169,106,0.9), 0 12px 30px rgba(200,169,106,0.4)'
                      : '0 6px 18px rgba(200,169,106,0.18)'
                  }}
                  transition={{ duration: 0.4, ease: easeCubic }}
                  aria-label={`Seleccionar ${j.nombre} ${j.numero}`}
                  aria-pressed={esActivo}
                  style={{
                    width: 'clamp(64px, 14vw, 88px)',
                    height: 'clamp(64px, 14vw, 88px)',
                    borderRadius: '50%',
                    border: esActivo ? '2px solid rgba(200,169,106,0.9)' : 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: j.grad,
                    willChange: 'transform, box-shadow'
                  }}
                />
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
            height: '440px',
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
              width: 'clamp(120px, 22vw, 170px)',
              height: 'clamp(120px, 22vw, 170px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,169,106,0.25), transparent 70%)',
              filter: 'blur(8px)'
            }}
          />
        </motion.div>
      </div>
      </ParallaxProvider>
    </Section>
  );
};

export default EquipoFutbol;
