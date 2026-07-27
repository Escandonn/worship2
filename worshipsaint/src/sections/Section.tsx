import { useEffect, useRef, useState } from 'react';
import type { FC, ReactNode, CSSProperties } from 'react';

interface SectionProps {
  /** ID único de la sección (coincide con el navbar). */
  id: string;
  /** Título visible de la sección. */
  title: string;
  /** Subtítulo o descripción corta. */
  subtitle?: string;
  /** Contenido específico de la sección. */
  children?: ReactNode;
  /** Variante de acento visual. */
  variant?: 'default' | 'accent' | 'muted';
}

const VARIANTS: Record<NonNullable<SectionProps['variant']>, CSSProperties> = {
  default: { background: 'radial-gradient(120% 80% at 50% 0%, rgba(200,169,106,0.10), transparent 60%)' },
  accent: { background: 'radial-gradient(120% 80% at 50% 100%, rgba(214,195,165,0.18), transparent 60%)' },
  muted: { background: 'linear-gradient(180deg, rgba(236,229,218,0.45), transparent 70%)' }
};

/**
 * Contenedor base de sección con animación IntersectionObserver.
 * Las secciones aparecen con Fade Up + Blur + TranslateY + Opacity al hacer scroll.
 */
const Section: FC<SectionProps> = ({ id, title, subtitle, children, variant = 'default' }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Se anima una sola vez
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
        filter: isVisible ? 'blur(0px)' : 'blur(10px)',
        transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1), filter 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform, filter',
        ...VARIANTS[variant]
      }}
    >
      <div style={{ maxWidth: '1100px', width: '100%', textAlign: 'center' }}>
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--ws-font)',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--ws-text)'
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              marginTop: '1rem',
              fontFamily: 'var(--ws-font)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--ws-muted)',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {subtitle}
          </p>
        )}
        <div style={{ marginTop: '2.5rem' }}>{children}</div>
      </div>
    </section>
  );
};

export default Section;
