import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, CSSProperties } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTypewriter } from 'react-simple-typewriter';

/* ------------------------------------------------------------------ */
/*  Fondo tipográfico — Lienzo dinámico (Canvas) · WorshipSaint       */
/*  ----------------------------------------------------------------  */
/*  Sistema de palabras verticales con posicionamiento LIBRE sobre     */
/*  toda la sección, como si un artista escribiera sobre un lienzo    */
/*  invisible. Sin columnas fijas, sin grid, sin posiciones           */
/*  predefinidas.                                                      */
/*                                                                    */
/*  • Cada palabra busca un espacio libre antes de dibujarse.         */
/*  • Detección de colisiones por bounding boxes (AABB).              */
/*  • Zona central protegida (card, miniaturas, líneas, nodos).       */
/*  • Nunca reutiliza continuamente las mismas coordenadas.           */
/*  • Distribución natural tipo "estrellas en el cielo".              */
/*  • Escritura vertical letra por letra (sin rotate).                */
/*  • Aparece → escribe → permanece → desvanece → libera → otra.     */
/*  • Variación orgánica: tamaño, grosor, fuente, opacidad, velocidad,*/
/*    duración y retraso.                                              */
/*  • Paleta dorada WorshipSaint (oro, champagne, marfil, bronce).   */
/*  • Responsive: desktop aprovecha todo el ancho; tablet/mobile      */
/*    reducen cantidad sin saturar ni cortar.                         */
/*  • Solo transform/opacity/translate3d/will-change. 60 FPS.        */
/*  • IntersectionObserver: pausa fuera del viewport.                 */
/* ------------------------------------------------------------------ */

const PALABRAS = [
  'DISCIPLINA', 'PASIÓN', 'FE', 'HUMILDAD', 'ESFUERZO', 'UNIDAD',
  'LIDERAZGO', 'GLORIA', 'PROPÓSITO', 'CONSTANCIA', 'FAMILIA', 'TRABAJO',
  'COMPROMISO', 'CARÁCTER', 'IDENTIDAD', 'SACRIFICIO', 'EXCELENCIA',
  'HONOR', 'SERVICIO', 'PERSEVERANCIA', 'VALENTÍA', 'RESPETO', 'LEGADO',
  'CRECIMIENTO', 'INSPIRACIÓN', 'SUPERACIÓN', 'ESPERANZA', 'EQUIPO',
  'VISIÓN', 'MISIÓN', 'AMISTAD', 'FRATERNIDAD', 'DEDICACIÓN',
  'FORTALEZA', 'ENTREGA', 'VOCACIÓN', 'CONFIANZA', 'GNOSIS', 'CÓDIGO',
  'CREATIVIDAD', 'ESTILO', 'DISEÑO', 'INNOVACIÓN', 'ELEGANCIA',
  'COMUNIDAD', 'CONCIENCIA', 'EVOLUCIÓN', 'DESARROLLO', 'FILOSOFÍA',
  'TRASCENDENCIA', 'FUTURO', 'CREAR', 'TRANSFORMAR', 'APRENDER',
  'ENSEÑAR', 'VALOR', 'CORAJE', 'LEALTAD', 'SABIDURÍA', 'EQUILIBRIO'
];

// Paleta dorada premium WorshipSaint (alta visibilidad 75-90%)
const COLORES = [
  '#C8A96A', // oro premium
  '#D6C3A5', // beige cálido
  '#F5E6C8', // blanco marfil
  '#E8D5A8', // champagne
  '#B8954E', // oro satinado
  '#C9A86A', // dorado suave
  '#A8814E'  // bronce claro
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
  const sizes = [28, 34, 38, 42, 46, 50];
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
  if (w >= 1600) return 7;   // Desktop XL: 7 columnas/lado
  if (w >= 1280) return 6;   // Desktop: 6 columnas/lado
  if (w >= 1024) return 5;   // Desktop pequeño: 5 columnas/lado
  if (w >= 900)  return 5;   // Tablet grande: 5 columnas/lado
  if (w >= 768)  return 4;   // Tablet: 4 columnas/lado
  if (w >= 600)  return 3;   // Tablet pequeña: 3 columnas/lado
  if (w >= 480)  return 3;   // Mobile grande: 3 columnas/lado
  return 2;                   // Mobile pequeño: 2 columnas/lado
};

// Temporizadores independientes por columna (4s, 6s, 5s, 7s, 4.5s, 5.5s, 6.5s)
const HOLDS = [4000, 6000, 5000, 7000, 4500, 5500, 6500];

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
  // driftY se calcula tras el montaje para evitar Math.random() en SSR.
  const [driftY, setDriftY] = useState<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setDriftY(Math.random() * 6 - 3); }, []); // ≤6px

  // Motor de máquina de escribir (react-simple-typewriter).
  // Reemplaza la lógica manual de setTimeout encadenados por un hook
  // optimizado que gestiona escritura/borrado/pausas/loop internamente.
  // typeSpeed/deleteSpeed/delaySpeed derivan de las props existentes para
  // conservar el comportamiento visual (velocidad y pausas por columna).
  const [texto] = useTypewriter({
    words: palabras,
    loop: 0,                          // infinito
    typeSpeed: velocidadBase,         // ms por letra al escribir
    deleteSpeed: Math.floor(velocidadBase * 0.5), // ms por letra al borrar
    delaySpeed: holdMs                 // pausa entre frases (permanencia)
  });

  // Arranque con desfase independiente (mantiene el stagger por columna)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delayInicio);
    return () => clearTimeout(t);
  }, [delayInicio]);

  // Renderiza las letras visibles apiladas verticalmente (una por línea).
  // El texto lo provee el hook; aquí solo se proyecta al layout vertical.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const letras = texto.split('');
    stack.textContent = '';
    letras.forEach(letra => {
      const span = document.createElement('span');
      span.textContent = letra;
      span.style.display = 'block';
      span.style.textAlign = 'center';
      span.style.lineHeight = '1';
      stack.appendChild(span);
    });
  }, [texto]);

  // Estado visual: aparece (fade + translateY) y se desvanece (blur leve).
  // Se controla por visibilidad de columna + pausa fuera del viewport.
  useEffect(() => {
    const col = colRef.current;
    if (!col) return;
    const op = visible && !pausar ? variante.opacity : 0;
    col.style.opacity = String(op);
    col.style.transform = visible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 6px, 0)';
    col.style.filter = visible ? 'blur(0px)' : 'blur(2px)';
  }, [visible, pausar, variante.opacity]);

  // Cursor parpadeante mediante CSS (sin setInterval) — solo cuando escribe
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.opacity = visible && !pausar ? '0.85' : '0';
  }, [visible, pausar]);

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

  // Cursor parpadeante debajo de la última letra (CSS-driven, sin JS)
  const cursorStyle: CSSProperties = {
    display: 'block',
    width: '0.04em',
    height: '0.9em',
    marginTop: '0.06em',
    background: variante.color,
    opacity: 0,
    animation: 'wsBlink 0.96s steps(1, end) infinite',
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
  // Estado de montaje: evita el hydration mismatch derivado de Math.random()
  // y de dimensiones reales (getBoundingClientRect) que difieren servidor/cliente.
  // En el servidor y primer render del cliente NO se genera config aleatoria.
  const [mounted, setMounted] = useState(false);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 1024, h: 600 });
  const contRef = useRef<HTMLDivElement | null>(null);

  // Marca montado (solo cliente) → habilita la generación de columnas.
  useEffect(() => { setMounted(true); }, []);

  // Medición dinámica del contenedor (ancho/alto reales) — solo en cliente
  useEffect(() => {
    if (!mounted) return;
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
  }, [mounted]);

  const numCols = columnasPorLado(dims.w);

  // Genera configuración dinámica de columnas (solo al cambiar numCols/dims).
  // Se omite hasta el montaje para evitar Math.random() en SSR (hydration mismatch).
  const { colsIzq, colsDer } = useMemo(() => {
    if (!mounted) return { colsIzq: [], colsDer: [] };
    // Ancho lateral disponible (zona protegida central ~52-64%)
    // Las columnas viven en el margen lateral (≤24% cada lado en desktop)
    const anchoLadoPct = dims.w >= 1280 ? 24 : dims.w >= 1024 ? 22 : dims.w >= 768 ? 19 : 16;

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
  }, [mounted, numCols, dims.w, dims.h]);

  // Zona lateral: ocupa el margen, aloja columnas verticales independientes
  // Zona central protegida: el centro (52-64%) queda libre de palabras
  const anchoLado = dims.w >= 1280 ? '24%' : dims.w >= 1024 ? '22%' : dims.w >= 768 ? '19%' : '16%';

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
        @keyframes wsBlink {
          0%, 49%   { opacity: 0.85; }
          50%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes wsDrift { 0%,100% { transform: translate3d(0,0,0); } }
          @keyframes wsBlink { 0%,100% { opacity: 0.85; } }
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
