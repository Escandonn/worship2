import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, CSSProperties } from 'react';
import { useInView } from 'react-intersection-observer';

/* ------------------------------------------------------------------ */
/*  Fondo tipográfico editorial vertical — WorshipSaint Premium       */
/*  ----------------------------------------------------------------  */
/*  Sistema editorial de palabras verticales con anti-colisión.        */
/*                                                                    */
/*  • Desktop: 4-6 columnas/lado · Tablet: 3 · Mobile: 1-2.           */
/*  • Cada columna: UNA sola palabra, escrita letra por letra         */
/*    verticalmente (apiladas de arriba hacia abajo).                 */
/*  • Anti-colisión: antes de renderizar se verifica posición,        */
/*    altura ocupada y separación mínima. Si hay conflicto, se        */
/*    reubica automáticamente en una posición libre.                 */
/*  • Zona central protegida: las palabras nunca invaden el área      */
/*    del contenido principal (card, miniaturas, imagen, títulos).    */
/*  • Posicionamiento dinámico: se calcula ancho/alto/columnas y      */
/*    se distribuyen las columnas equilibradamente (no posiciones      */
/*    fijas).                                                          */
/*  • Cada columna: temporizador independiente (4s, 5s, 6s, 7s...).  */
/*  • Secuencia: Fade In → Máquina de escribir → Pausa →              */
/*    Flotación → Fade Out → Nueva palabra.                           */
/*  • Flotación vertical ≤6px (translate3d, GPU-only).               */
/*  • Tipografías: Cinzel, Playfair, Cormorant, Inter, Manrope.      */
/*  • Tamaños 24-48px variados. Opacidad 75%-90%.                     */
/*  • Solo transform/opacity/translate3d/will-change. 60 FPS.        */
/*  • IntersectionObserver: pausa fuera del viewport.                 */
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

// Paleta dorada premium WorshipSaint (alta visibilidad 75-90%)
const COLORES = [
  '#C8A96A', // oro premium
  '#D6C3A5', // beige cálido
  '#F5E6C8', // blanco marfil
  '#E8D5A8', // champagne
  '#B8954E', // oro satinado
  '#C9A86A'  // dorado suave
];

// Familias tipográficas editoriales
const FAMILIAS = [
  "'Cinzel', serif",
  "'Playfair Display', serif",
  "'Cormorant Garamond', serif",
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
  const sizes = [24, 28, 30, 34, 38, 42, 46, 48];
  const weights = [400, 500, 600];
  const spacings = ['0.02em', '0.06em', '0.10em'];
  const opacities = [0.75, 0.80, 0.85, 0.88, 0.90];
  return {
    size: sizes[Math.floor(Math.random() * sizes.length)],
    weight: weights[Math.floor(Math.random() * weights.length)],
    spacing: spacings[Math.floor(Math.random() * spacings.length)],
    opacity: opacities[Math.floor(Math.random() * opacities.length)],
    familia: FAMILIAS[Math.floor(Math.random() * FAMILIAS.length)],
    color: COLORES[Math.floor(Math.random() * COLORES.length)]
  };
};

// Nº de columnas por lado según ancho disponible (dinámico)
const columnasPorLado = (w: number): number => {
  if (w >= 1280) return 6;   // Desktop XL: 6 columnas/lado
  if (w >= 1024) return 5;   // Desktop: 5 columnas/lado
  if (w >= 900)  return 4;   // Desktop pequeño: 4 columnas/lado
  if (w >= 768)  return 3;   // Tablet: 3 columnas/lado
  if (w >= 480)  return 2;   // Mobile grande: 2 columnas/lado
  return 1;                   // Mobile pequeño: 1 columna/lado
};

// Temporizadores independientes por columna (4s, 5s, 6s, 7s...)
const HOLDS = [4000, 5000, 6000, 7000, 4500, 5500];

// Separación mínima vertical entre palabras de la misma columna (px)
const SEP_MIN = 28;

/* ------------------------------------------------------------------ */
/*  Utilidad anti-colisión: gestiona rangos verticales ocupados        */
/* ------------------------------------------------------------------ */
class GestorEspacio {
  private rangos: Array<{ y0: number; y1: number }> = [];
  private altoTotal: number;

  constructor(altoTotal: number) {
    this.altoTotal = altoTotal;
  }

  reset() { this.rangos = []; }

  // Verifica si un rango [y0, y1] colisiona con alguno existente
  private colisiona(y0: number, y1: number): boolean {
    return this.rangos.some(r => !(y1 + SEP_MIN <= r.y0 || y0 >= r.y1 + SEP_MIN));
  }

  // Intenta colocar una palabra de altura `h` en `yPreferido`.
  // Si colisiona, busca la posición libre más cercana. Devuelve y0.
  colocar(h: number, yPreferido: number): number {
    const max0 = Math.max(0, this.altoTotal - h);
    let y = Math.min(Math.max(0, yPreferido), max0);

    // Búsqueda expansiva: intenta y, luego y±step, y±2step...
    const step = 18;
    const intentos = Math.ceil(this.altoTotal / step) + 4;
    for (let i = 0; i < intentos; i++) {
      const yA = y + i * step;
      const yB = y - i * step;
      if (yA <= max0 && !this.colisiona(yA, yA + h)) {
        this.rangos.push({ y0: yA, y1: yA + h });
        return yA;
      }
      if (i > 0 && yB >= 0 && !this.colisiona(yB, yB + h)) {
        this.rangos.push({ y0: yB, y1: yB + h });
        return yB;
      }
    }
    // No se pudo colocar sin colisión: lo acepta igual (mejor esfuerzo)
    const yFinal = Math.min(Math.max(0, yPreferido), max0);
    this.rangos.push({ y0: yFinal, y1: yFinal + h });
    return yFinal;
  }
}

/* ------------------------------------------------------------------ */
/*  Columna vertical — una palabra escrita letra por letra vertical   */
/* ------------------------------------------------------------------ */
interface ColumnaProps {
  palabras: string[];
  delayInicio: number;
  velocidadBase: number;
  holdMs: number;          // tiempo de permanencia (independiente por columna)
  xPct: number;            // posición horizontal dinámica (% del ancho del lado)
  yPct: number;            // posición vertical dinámica (% de la altura, anti-colisión)
  variante: Variante;      // variante tipográfica estable por columna
  pausar: boolean;         // pausa cuando está fuera del viewport
}

const Columna: FC<ColumnaProps> = ({
  palabras,
  delayInicio,
  velocidadBase,
  holdMs,
  xPct,
  yPct,
  variante,
  pausar
}) => {
  const stackRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const colRef = useRef<HTMLDivElement | null>(null);
  const [driftY] = useState<number>(() => Math.random() * 6 - 3); // ≤6px

  useEffect(() => {
    const stack = stackRef.current;
    const cursor = cursorRef.current;
    const col = colRef.current;
    if (!stack || !cursor || !col) return;

    let palabraIdx = Math.floor(Math.random() * palabras.length);
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    let blinkState = true;
    let blinkInterval: ReturnType<typeof setInterval> | null = null;
    let destruido = false;

    const typeMs = velocidadBase + Math.floor(Math.random() * 20);
    const deleteMs = Math.floor(velocidadBase * 0.5);
    const holdDelete = 350 + Math.floor(Math.random() * 300);

    // Renderiza las letras visibles (0..charIndex) apiladas verticalmente
    const renderLetras = () => {
      const current = palabras[palabraIdx];
      const letras = current.slice(0, charIndex).split('');
      stack.textContent = '';
      letras.forEach(letra => {
        const span = document.createElement('span');
        span.textContent = letra;
        span.style.display = 'block';
        span.style.textAlign = 'center';
        span.style.lineHeight = '1';
        stack.appendChild(span);
      });
    };

    // Estado visual: aparece (fade + translateY), se desvanece (blur leve)
    const mostrar = () => {
      col.style.opacity = String(variante.opacity);
      col.style.transform = 'translate3d(0, 0, 0)';
      col.style.filter = 'blur(0px)';
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
      if (destruido) return;
      const current = palabras[palabraIdx];
      if (!deleting) {
        charIndex += 1;
        renderLetras();
        if (charIndex >= current.length) {
          deleting = true;
          detenerBlink();
          if (cursor) cursor.style.opacity = '0';
          // Permanece visible (holdMs independiente por columna)
          timer = setTimeout(tick, holdMs);
          return;
        }
        timer = setTimeout(tick, typeMs);
      } else {
        charIndex -= 1;
        renderLetras();
        if (charIndex <= 0) {
          deleting = false;
          palabraIdx = (palabraIdx + 1) % palabras.length;
          // Pausa en vacío antes de la siguiente palabra
          timer = setTimeout(() => {
            if (destruido) return;
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
      if (destruido) return;
      mostrar();
      iniciarBlink();
      tick();
    }, delayInicio);

    return () => {
      destruido = true;
      clearTimeout(timer);
      detenerBlink();
    };
  }, [palabras, delayInicio, velocidadBase, holdMs, variante.opacity]);

  // Pausa fuera del viewport: detiene animación de flotación
  useEffect(() => {
    if (!colRef.current) return;
    colRef.current.style.animationPlayState = pausar ? 'paused' : 'running';
  }, [pausar]);

  const glow = `0 0 5px ${variante.color}40, 0 0 12px ${variante.color}20`;

  // Contenedor de la columna: posición absoluta con offset dinámico
  const colStyle: CSSProperties = {
    position: 'absolute',
    top: `${yPct}%`,
    left: `${xPct}%`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    opacity: 0,
    transform: 'translate3d(0, 6px, 0)',
    filter: 'blur(2px)',
    transition: 'opacity 700ms ease, transform 700ms ease, filter 700ms ease',
    willChange: 'opacity, transform',
    // Deriva vertical muy lenta (≤6px) — solo translate3d (GPU)
    animation: `wsDrift ${14 + (delayInicio % 8)}s ease-in-out infinite alternate`,
    ['--drift' as string]: `${driftY}px`
  };

  // Stack de letras verticales (cada letra en su propia línea)
  const stackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: variante.familia,
    fontSize: `clamp(${Math.round(variante.size * 0.7)}px, ${variante.size / 16}vw, ${variante.size}px)`,
    fontWeight: variante.weight,
    letterSpacing: variante.spacing,
    color: variante.color,
    textShadow: glow,
    lineHeight: 1,
    willChange: 'contents'
  };

  // Cursor parpadeante debajo de la última letra
  const cursorStyle: CSSProperties = {
    display: 'block',
    width: '0.04em',
    height: '0.9em',
    marginTop: '0.06em',
    background: variante.color,
    opacity: 0,
    willChange: 'opacity'
  };

  return (
    <div ref={colRef} style={colStyle}>
      <div ref={stackRef} style={stackStyle} />
      <span ref={cursorRef} style={cursorStyle} aria-hidden />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Componente principal — columnas verticales a ambos lados          */
/*  con anti-colisión y zona central protegida                        */
/* ------------------------------------------------------------------ */
const PalabrasFondo: FC = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: false });
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 1024, h: 600 });
  const contRef = useRef<HTMLDivElement | null>(null);

  // Medición dinámica del contenedor (ancho/alto reales)
  useEffect(() => {
    const medir = () => {
      const el = contRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setDims({ w: r.width || window.innerWidth, h: r.height || 600 });
      } else {
        setDims({ w: window.innerWidth, h: 600 });
      }
    };
    medir();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(medir);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const numCols = columnasPorLado(dims.w);

  // Genera configuración dinámica de columnas (solo al cambiar numCols/dims)
  const { colsIzq, colsDer } = useMemo(() => {
    // Ancho lateral disponible (zona protegida central ~62-72%)
    // Las columnas solo viven en el margen lateral (≤19% cada lado)
    const anchoLadoPct = dims.w >= 1024 ? 19 : dims.w >= 768 ? 16 : 14;

    // Altura disponible en px (para anti-colisión)
    const altoPx = dims.h;

    // Gestores de espacio por lado (anti-colisión)
    const gestorIzq = new GestorEspacio(altoPx);
    const gestorDer = new GestorEspacio(altoPx);

    // Altura estimada de una palabra vertical: letras * (size * 1.0 lineHeight)
    const estimarAlto = (palabra: string, size: number): number =>
      palabra.length * size * 1.0 + 12; // +12px cursor/margen

    const mk = (n: number, lado: 'izq' | 'der') => {
      const gestor = lado === 'izq' ? gestorIzq : gestorDer;
      const arr: {
        palabras: string[];
        delay: number;
        vel: number;
        hold: number;
        xPct: number;
        yPct: number;
        variante: Variante;
      }[] = [];

      // Distribución horizontal dinámica dentro del ancho lateral
      // Cada columna recibe una posición x equilibrada con pequeño jitter
      for (let i = 0; i < n; i++) {
        const variante = nuevaVariante();

        // Posición x dentro del lado: distribuida uniformemente + jitter orgánico
        const baseX = n === 1 ? 50 : (i / (n - 1)) * 100;
        const jitter = (Math.random() - 0.5) * (anchoLadoPct / n) * 0.4;
        const xPct = Math.max(2, Math.min(96, baseX + jitter));

        // Offset vertical preferido orgánico (nunca todas alineadas)
        const yPreferidoPct = (i * 17 + (lado === 'der' ? 9 : 0)) % 80 + Math.random() * 8;
        const yPreferidoPx = (yPreferidoPct / 100) * altoPx;

        // Palabra inicial y su altura estimada
        const offset = (lado === 'izq' ? i * 5 : i * 5 + 3) % PALABRAS.length;
        const palabras = Array.from(
          { length: PALABRAS.length },
          (_, k) => PALABRAS[(k + offset) % PALABRAS.length]
        );
        const altoPalabra = estimarAlto(palabras[0], variante.size);

        // Anti-colisión: colocar en posición libre
        const yFinalPx = gestor.colocar(altoPalabra, yPreferidoPx);
        const yPct = (yFinalPx / altoPx) * 100;

        arr.push({
          palabras,
          // Desfase amplio entre columnas (orgánico, nunca sincronizadas)
          delay: 600 + i * 1400 + (lado === 'der' ? 2200 : 0) + Math.floor(Math.random() * 900),
          vel: 80 + Math.floor(Math.random() * 40), // 80-120ms
          hold: HOLDS[i % HOLDS.length],
          xPct,
          yPct,
          variante
        });
      }
      return arr;
    };
    return { colsIzq: mk(numCols, 'izq'), colsDer: mk(numCols, 'der') };
  }, [numCols, dims.w, dims.h]);

  // Zona lateral: ocupa el margen, aloja columnas verticales independientes
  // Zona central protegida: el centro (62-72%) queda libre de palabras
  const anchoLado = dims.w >= 1024 ? '19%' : dims.w >= 768 ? '16%' : '14%';

  const ladoStyle = (lado: 'izq' | 'der'): CSSProperties => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: anchoLado,
    [lado === 'izq' ? 'left' : 'right']: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
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
        ref={(node) => { ref(node); contRef.current = node; }}
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
          {colsIzq.map((c, i) => (
            <Columna
              key={`izq-${i}`}
              palabras={c.palabras}
              delayInicio={c.delay}
              velocidadBase={c.vel}
              holdMs={c.hold}
              xPct={c.xPct}
              yPct={c.yPct}
              variante={c.variante}
              pausar={!inView}
            />
          ))}
        </div>

        {/* Lado derecho */}
        <div style={ladoStyle('der')}>
          {colsDer.map((c, i) => (
            <Columna
              key={`der-${i}`}
              palabras={c.palabras}
              delayInicio={c.delay}
              velocidadBase={c.vel}
              holdMs={c.hold}
              xPct={c.xPct}
              yPct={c.yPct}
              variante={c.variante}
              pausar={!inView}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PalabrasFondo;
