import React, { memo } from 'react';
import type { FC, CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/*  SacredSymbol                                                       */
/*  ------------------------------------------------------------------ */
/*  Símbolo geométrico abstracto: círculo fino con triángulo          */
/*  equilátero inscrito. Estética de geometría sagrada, premium y     */
/*  minimalista (Apple / Linear / Vercel). Líneas muy finas, dorado   */
/*  suave, opacidad baja, glow sutil. Animaciones extremadamente      */
/*  sutiles: flotación vertical, rotación lenta y respiración de      */
/*  opacidad. Nunca distrae del contenido.                             */
/* ------------------------------------------------------------------ */

export interface SacredSymbolProps {
  /** Tamaño base (px) del símbolo en desktop. Escala responsive vía CSS. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Triángulo equilátero inscrito en un círculo de radio R y centro (cx, cy).
 * Vértice superior en (cx, cy - R). Los otros dos a ±30° desde el centro
 * hacia abajo. Coordenadas precalculadas para un viewBox 0..100.
 */
const CIRCLE_CX = 50;
const CIRCLE_CY = 50;
const CIRCLE_R = 106; // margen de 4 unidades para no tocar el borde

// Vértice superior
const TOP_X = CIRCLE_CX;
const TOP_Y = CIRCLE_CY - CIRCLE_R;

// Vértices inferiores (±30° desde la vertical hacia abajo)
const BOTTOM_LEFT_X = CIRCLE_CX - CIRCLE_R * Math.sin((60 * Math.PI) / 180);
const BOTTOM_LEFT_Y = CIRCLE_CY + CIRCLE_R * Math.cos((60 * Math.PI) / 180);
const BOTTOM_RIGHT_X = CIRCLE_CX + CIRCLE_R * Math.sin((60 * Math.PI) / 180);
const BOTTOM_RIGHT_Y = BOTTOM_LEFT_Y;

const TRIANGLE_POINTS = `${TOP_X},${TOP_Y} ${BOTTOM_LEFT_X},${BOTTOM_LEFT_Y} ${BOTTOM_RIGHT_X},${BOTTOM_RIGHT_Y}`;

const SacredSymbol: FC<SacredSymbolProps> = memo(
  ({ size = 180, className, style }) => {
    // Elemento puramente decorativo: posicionado de forma absoluta y
    // centrado respecto al Hero. NO ocupa espacio en el flujo del documento,
    // NO empuja ningún elemento. Vive en la capa de fondo (zIndex 0),
    // detrás del contenido (que está en zIndex 1). Opacidad baja (15–25%)
    // para integrarse como marca de agua premium.
    const wrapperStyle: CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'clamp(190px, 100vw, 700px)',
      height: 'clamp(190px, 40vw, 400px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0,
      animation: 'wsSymbolEnter 1400ms 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      ...style
    };

    const svgStyle: CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'block',
      overflow: 'visible'
      // filter: drop-shadow ELIMINADO: drop-shadow recalcula el blur
      // gaussiano en CADA frame de animación (90s rotate + 6s breathe).
      // Reemplazado por <filter> SVG nativo (feGaussianBlur) que se
      // computa una sola vez y se cachea como textura.
    };

    return (
      <>
        <style>{`
          @keyframes wsSymbolEnter {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
            100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes wsSymbolRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes wsSymbolBreathe {
            0%, 100% { opacity: 0.34; }
            50% { opacity: 0.46; }
          }
          /* Animaciones reducidas de 4 a 2:
             - ELIMINADO wsSymbolFloat (7s): transform compuesto que
               fuerza recálculo de layout en cada frame.
             - ELIMINADO wsSymbolCircleBreathe (10s): redundante con
               wsSymbolBreathe, misma propiedad (opacity).
             Conservadas: rotate (90s, GPU-friendly) + breathe (6s opacity). */
          .ws-symbol-rotate {
            transform-origin: 50% 50%;
            animation: wsSymbolRotate 90s linear infinite;
          }
          .ws-symbol-breathe {
            animation: wsSymbolBreathe 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .ws-symbol-rotate,
            .ws-symbol-breathe {
              animation: none !important;
            }
          }
        `}</style>
        <div className={className ? `${className}` : ''} style={wrapperStyle} aria-hidden="true">
          <svg
            viewBox="0 0 100 100"
            style={svgStyle}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Filtro SVG nativo: glow dorado suave. Se computa UNA vez
                y se cachea, a diferencia de CSS drop-shadow que recalcula
                en cada frame de animación. */}
            <defs>
              <filter id="ws-symbol-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Círculo fino integrado con la red de partículas:
                mismo color (#C8A96A), grosor similar a las conexiones,
                glow dorado suave y respiración sutil de 6s.
                vectorEffect non-scaling-stroke => grosor idéntico en móvil. */}
            <circle
              className="ws-symbol-breathe"
              cx={CIRCLE_CX}
              cy={CIRCLE_CY}
              r={CIRCLE_R}
              stroke="#C8A96A"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
              filter="url(#ws-symbol-glow)"
            />
            {/* Triángulo equilátero inscrito con rotación muy lenta */}
            <polygon
              className="ws-symbol-rotate"
              points={TRIANGLE_POINTS}
              stroke="#C8A96A"
              strokeWidth={1.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#ws-symbol-glow)"
            />
          </svg>
        </div>
      </>
    );
  }
);

SacredSymbol.displayName = 'SacredSymbol';

export default SacredSymbol;
