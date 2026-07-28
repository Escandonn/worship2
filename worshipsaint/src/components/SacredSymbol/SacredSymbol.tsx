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
      width: 'clamp(150px, 32vw, 320px)',
      height: 'clamp(150px, 32vw, 320px)',
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
      overflow: 'visible',
      filter: 'drop-shadow(0 0 5px rgba(200,169,106,0.25))'
    };

    return (
      <>
        <style>{`
          @keyframes wsSymbolEnter {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.94); }
            100% { opacity: 0.22; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes wsSymbolFloat {
            0%, 100% { transform: translate(-50%, -50%) translateY(0); }
            50% { transform: translate(-50%, -50%) translateY(-5px); }
          }
          @keyframes wsSymbolRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes wsSymbolBreathe {
            0%, 100% { opacity: 0.18; }
            50% { opacity: 0.26; }
          }
          .ws-symbol-float {
            animation: wsSymbolFloat 7s ease-in-out infinite;
          }
          .ws-symbol-rotate {
            transform-origin: 50% 50%;
            animation: wsSymbolRotate 90s linear infinite;
          }
          .ws-symbol-breathe {
            animation: wsSymbolBreathe 6s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .ws-symbol-float,
            .ws-symbol-rotate,
            .ws-symbol-breathe {
              animation: none !important;
            }
          }
        `}</style>
        <div className={className ? `ws-symbol-float ${className}` : 'ws-symbol-float'} style={wrapperStyle} aria-hidden="true">
          <svg
            viewBox="0 0 100 100"
            style={svgStyle}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Círculo fino con respiración de opacidad */}
            <circle
              className="ws-symbol-breathe"
              cx={CIRCLE_CX}
              cy={CIRCLE_CY}
              r={CIRCLE_R}
              stroke="var(--ws-accent, #C8A96A)"
              strokeWidth={1.1}
              vectorEffect="non-scaling-stroke"
            />
            {/* Triángulo equilátero inscrito con rotación muy lenta */}
            <polygon
              className="ws-symbol-rotate"
              points={TRIANGLE_POINTS}
              stroke="var(--ws-accent, #C8A96A)"
              strokeWidth={1.1}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </>
    );
  }
);

SacredSymbol.displayName = 'SacredSymbol';

export default SacredSymbol;
