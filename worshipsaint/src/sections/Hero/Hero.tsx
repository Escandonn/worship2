import type { FC } from 'react';

/**
 * Sección Hero inicial.
 * Ocupa 100vh y presenta la marca con gradientes cálidos premium,
 * efectos de luz difuminados y CTAs con degradados.
 */
const Hero: FC = () => {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F8F6F2 0%, #ECE5DA 45%, #D6C3A5 100%)'
      }}
    >
      {/* Efectos de luz difuminados */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,169,106,0.35), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214,195,165,0.45), transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '860px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(200,169,106,0.3)',
            fontFamily: 'var(--ws-font)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--ws-text)',
            marginBottom: '1.5rem'
          }}
        >
          Premium · Minimalista · Atemporal
        </span>

        <h1
          style={{
            margin: '0 0 1.25rem',
            fontFamily: 'var(--ws-font)',
            fontWeight: 700,
            fontSize: 'clamp(2.75rem, 7vw, 4rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--ws-text)'
          }}
        >
          WorshipSaint
        </h1>

        <p
          style={{
            margin: '0 auto 2.5rem',
            fontFamily: 'var(--ws-font)',
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            color: 'var(--ws-text)',
            opacity: 0.8,
            maxWidth: '640px',
            lineHeight: 1.6
          }}
        >
          Diseño premium, minimalista y atemporal. Creamos experiencias que trascienden.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <a
            href="#tienda"
            style={{
              padding: '0.95rem 2rem',
              borderRadius: 'var(--ws-radius-btn)',
              background: 'var(--ws-gradient-btn)',
              color: 'var(--ws-text)',
              fontFamily: 'var(--ws-font)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: 'var(--ws-shadow-btn)',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--ws-shadow-btn-hover)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'var(--ws-shadow-btn)';
            }}
          >
            Explorar tienda
          </a>
          <a
            href="#sobre-nosotros"
            style={{
              padding: '0.95rem 2rem',
              borderRadius: 'var(--ws-radius-btn)',
              background: 'var(--ws-gradient-btn-secondary)',
              border: '1px solid rgba(44,33,24,0.12)',
              color: 'var(--ws-text)',
              fontFamily: 'var(--ws-font)',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: 'var(--ws-shadow-card)',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Conócenos
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
