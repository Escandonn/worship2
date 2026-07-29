import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, CSSProperties } from 'react';
import { useInView } from 'react-intersection-observer';

/* ------------------------------------------------------------------ */
/*  Fondo tipográfico editorial — WorshipSaint Premium                */
/*  ----------------------------------------------------------------  */
/*  Slots verticales distribuidos a lo largo de TODA la altura de la  */
/*  sección. Cada slot aloja una palabra que se escribe (typewriter   */
/*  manual idéntico al Hero), permanece, se desvanece con blur leve  */
/*  y es reemplazada por otra. Los slots están desfasados en tiempo.  */
/*                                                                    */
/*  • Responsive: Desktop 4-5 slots/lado, Tablet 3-4, Mobile 2-3.     */
/*  • Distribución vertical con separación amplia (flex space-evenly).*/
/*  • Tipografías editoriales variadas (Playfair, Cormorant, Cinzel, */
/*    Inter, Manrope) con pesos Regular/Medium/SemiBold.             */
/*  • Tamaños 22-46px.                                               */
/*  • Paleta dorada premium, opacidad 65%-90% (alta legibilidad).    */
/*  • Glow muy sutil.                                                */
/*  • Deriva vertical ≤8px (translate3d, GPU-only).                  */
/*  • Solo transform/opacity/translate3d/will-change.                */
/*  • IntersectionObserver: no anima fuera del viewport.             */
/*  • overflow hidden → sin scroll horizontal.                       */
/* ------------------------------------------------------------------ */

const PALABRAS = [
  'DISCIPLINA', 'GNOSIS', 'VISIÓN', 'EXCELENCIA', 'CREATIVIDAD', 'CÓDIGO',
  'PASIÓN', 'CONSTANCIA', 'LIDERAZGO', 'PROPÓSITO', 'ESTILO', 'HONOR',
  'UNIDAD', 'CRECER', 'SERVICIO', 'FE', 'DISEÑO', 'INNOVACIÓN',
  'ELEGANCIA', 'COMUNIDAD', 'CONCIENCIA', 'CARÁCTER', 'HUMILDAD',
  'COMPROMISO', 'EVOLUCIÓN', 'DESARROLLO', 'FILOSOFÍA', 'IDENTIDAD',
  'TRASCENDENCIA', 'LEGADO', 'MISIÓN', 'FUTURO', 'CREAR', 'TRANSFORMAR',
  'APRENDER', 'ENSEÑAR', 'PERSEVERANCIA', 'SUPERACIÓN', 'VALOR', 'EQUIPO'
];

// Paleta dorada premium WorshipSaint (alta visibilidad)
const COLORES = [
  '#C8A96A', // dorado elegante
  '#D6C3A5', // beige cálido
  '#F5E6C8', // blanco cálido
  '#E8D5A8', // champagne
  '#B8954E', // oro satinado
  '#C9A86A'  // dorado suave
];

// Familias tipográficas editoriales
const FAMILIAS = [
  "'Playfair Display', serif",
  "'Cormorant Garamond', serif",
  "'Cinzel', serif",
  "'Inter', sans-serif",
  "'Manrope', sans-serif"
];

interface Variante {
  size: number;
  weight: number;
  spacing: string;
  opacity: number;
  familia: string;
  color: string;
}

// Genera una variante aleatoria estable (no cambia por palabra)
const nuevaVariante = (): Variante => {
  const sizes = [22, 26, 30, 34, 38, 42, 46];
  const weights = [400, 500, 600];
  const spacings = ['0.04em', '0.08em', '0.12em', '0.16em'];
  const opacities = [0.65, 0.72, 0.78, 0.82, 0.88, 0.90];
  return {
    size: sizes[Math.floor(Math.random() * sizes.length)],
    weight: weights[Math.floor(Math.random() * weights.length)],
    spacing: spacings[Math.floor(Math.random() * spacings.length)],
    opacity: opacities[Math.floor(Math.random() * opacities.length)],
    familia: FAMILIAS[Math.floor(Math.random() * FAMILIAS.length)],
    color: COLORES[Math.floor(Math.random() * COLORES.length)]
  };
};

// Nº de slots por lado según ancho
const slotsPorLado = (w: number): number => {
  if (w >= 1024) return 5;   // Desktop: 4-5
  if (w >= 768) return 4;    // Tablet: 3-4
  if (w >= 480) return 3;    // Mobile grande: 3
  return 2;                   // Mobile pequeño: 2-3
};

/* ------------------------------------------------------------------ */
/*  Slot individual — una palabra que se escribe, permanece,          */
/*  se desvanece con blur leve y es reemplazada por otra.             */
/* ------------------------------------------------------------------ */
interface SlotProps {
  palabras: string[];
  delayInicio: number;
  velocidadBase: number;
  alineacion: 'start' | 'center' | 'end';
}

const Slot: FC<SlotProps> = ({ palabras, delayInicio, velocidadBase, alineacion }) => {
  const textoRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const variante = useMemo<Variante>(() => nuevaVariante(), []);
  const [driftY] = useState<number>(() => Math.random() * 8 - 4);

  useEffect(() => {
    const texto = textoRef.current;
    const cursor = cursorRef.current;
    const slot = slotRef.current;
    if (!texto || !cursor || !slot) return;

    let palabraIdx = Math.floor(Math.random() * palabras.length);
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    let blinkState = true;
    let blinkInterval: ReturnType<typeof setInterval> | null = null;

    const typeMs = velocidadBase + Math.floor(Math.random() * 20);
    const deleteMs = Math.floor(velocidadBase * 0.5);
    const holdType = 1800 + Math.floor(Math.random() * 1200);
    const holdDelete = 300 + Math.floor(Math.random() * 300);

    // Estado visual: aparece (fade + translateY), se desvanece (blur leve)
    const mostrar = () => {
      slot.style.opacity = '1';
      slot.style.transform = 'translate3d(0, 0, 0)';
      slot.style.filter = 'blur(0px)';
    };
    const desvanecer = () => {
      slot.style.opacity = '0';
      slot.style.transform = 'translate3d(0, -6px, 0)';
      slot.style.filter = 'blur(2px)';
    };

    const iniciarBlink = () => {
      if (blinkInterval) return;
      blinkInterval = setInterval(() => {
        blinkState = !blinkState;
        if (cursor) cursor.style.opacity = blinkState ? '0.85' : '0';
      }, 480);
    };
    const detenerBlink = () => {
      if (blinkInterval) { clearInterval(blinkInterval); blinkInterval = null; }
    };

    const tick = () => {
      const current = palabras[palabraIdx];
      if (!deleting) {
        charIndex += 1;
        if (texto) texto.textContent = current.slice(0, charIndex);
        if (charIndex >= current.length) {
          deleting = true;
          detenerBlink();
          if (cursor) cursor.style.opacity = '0';
          timer = setTimeout(tick, holdType);
          return;
        }
        timer = setTimeout(tick, typeMs);
      } else {
        charIndex -= 1;
        if (texto) texto.textContent = current.slice(0, charIndex);
        if (charIndex <= 0) {
          deleting = false;
          palabraIdx = (palabraIdx + 1) % palabras.length;
          // Pequeña pausa en vacío antes de la siguiente
          timer = setTimeout(() => {
            mostrar();
            iniciarBlink();
            tick();
          }, holdDelete);
          return;
        }
        timer = setTimeout(tick, deleteMs);
      }
    };

    // Arranque con desfase independiente
    timer = setTimeout(() => {
      mostrar();
      iniciarBlink();
      tick();
    }, delayInicio);

    return () => {
      clearTimeout(timer);
      detenerBlink();
    };
  }, [palabras, delayInicio, velocidadBase]);

  const glow = `0 0 5px ${variante.color}40, 0 0 12px ${variante.color}20`;

  const slotStyle: CSSProperties = {
    display: 'flex',
    justifyContent: alineacion,
    alignItems: 'center',
    flex: '1 1 0',
    minHeight: 0,
    opacity: 0,
    transform: 'translate3d(0, 6px, 0)',
    filter: 'blur(2px)',
    transition: 'opacity 700ms ease, transform 700ms ease, filter 700ms ease',
    willChange: 'opacity, transform',
    // Deriva vertical muy lenta (≤8px) — solo translate3d (GPU)
    animation: `wsDrift ${14 + (delayInicio % 8)}s ease-in-out infinite alternate`,
    ['--drift' as string]: `${driftY}px`
  };

  const textStyle: CSSProperties = {
    fontFamily: variante.familia,
    fontSize: `clamp(${variante.size * 0.7}px, ${variante.size / 16}vw, ${variante.size}px)`,
    fontWeight: variante.weight,
    letterSpacing: variante.spacing,
    color: variante.color,
    opacity: variante.opacity,
    textShadow: glow,
    whiteSpace: 'nowrap',
    display: 'inline-block',
    lineHeight: 1.1
  };

  const cursorStyle: CSSProperties = {
    display: 'inline-block',
    width: '0.04em',
    marginLeft: '0.08em',
    height: '0.9em',
    verticalAlign: 'baseline',
    background: variante.color,
    opacity: 0,
    willChange: 'opacity'
  };

  return (
    <div ref={slotRef} style={slotStyle}>
      <span style={textStyle} ref={textoRef} />
      <span style={cursorStyle} ref={cursorRef} aria-hidden />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Componente principal — fondo editorial a ambos lados             */
/* ------------------------------------------------------------------ */
const PalabrasFondo: FC = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: false });
  const [numSlots, setNumSlots] = useState<number>(5);

  useEffect(() => {
    const update = () => setNumSlots(slotsPorLado(window.innerWidth));
    update();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Genera configuración estable de slots (solo al cambiar numSlots)
  const { slotsIzq, slotsDer } = useMemo(() => {
    const mk = (n: number, lado: 'izq' | 'der') => {
      const arr: { palabras: string[]; delay: number; vel: number; align: 'start' | 'center' | 'end' }[] = [];
      for (let i = 0; i < n; i++) {
        // Cada slot recorre una porción distinta de la lista (rotación variada)
        const offset = (lado === 'izq' ? i * 5 : i * 5 + 3) % PALABRAS.length;
        const palabras = Array.from(
          { length: PALABRAS.length },
          (_, k) => PALABRAS[(k + offset) % PALABRAS.length]
        );
        arr.push({
          palabras,
          // Desfase amplio entre slots (orgánico, nunca sincronizados)
          delay: 600 + i * 1400 + (lado === 'der' ? 2200 : 0) + Math.floor(Math.random() * 900),
          vel: 80 + Math.floor(Math.random() * 40), // 80-120ms (Hero 55ms → más lento)
          align: lado === 'izq' ? 'end' : 'start'
        });
      }
      return arr;
    };
    return { slotsIzq: mk(numSlots, 'izq'), slotsDer: mk(numSlots, 'der') };
  }, [numSlots]);

  // Zona lateral: ocupa el margen, distribuye slots verticalmente
  const ladoStyle = (lado: 'izq' | 'der'): CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: numSlots >= 5 ? '17%' : numSlots >= 4 ? '15%' : '12%',
    [lado === 'izq' ? 'left' : 'right']: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    padding: 'clamp(0.5rem, 2vh, 1.5rem) 0',
    opacity: inView ? 1 : 0,
    transition: 'opacity 800ms ease',
    willChange: 'opacity'
  });

  return (
    <>
      <style>{`
        @keyframes wsDrift {
          0%   { transform: translate3d(0, calc(var(--drift, 0px) * -1), 0); }
          100% { transform: translate3d(0, var(--drift, 0px), 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes wsDrift { 0%,100% { transform: translate3d(0,0,0); } }
        }
      `}</style>
      <div
        ref={ref}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {/* Lado izquierdo */}
        <div style={ladoStyle('izq')}>
          {slotsIzq.map((s, i) => (
            <Slot
              key={`izq-${i}`}
              palabras={s.palabras}
              delayInicio={s.delay}
              velocidadBase={s.vel}
              alineacion={s.align}
            />
          ))}
        </div>

        {/* Lado derecho */}
        <div style={ladoStyle('der')}>
          {slotsDer.map((s, i) => (
            <Slot
              key={`der-${i}`}
              palabras={s.palabras}
              delayInicio={s.delay}
              velocidadBase={s.vel}
              alineacion={s.align}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PalabrasFondo;
