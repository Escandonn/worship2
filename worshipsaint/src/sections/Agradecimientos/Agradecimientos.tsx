import type { FC } from 'react';

/**
 * Sección de Agradecimientos — funciona como footer premium.
 * Fondo oscuro cálido (#2C2118) con texto claro (#ECE5DA).
 */
const Agradecimientos: FC = () => {
  const gracias = ['Familia', 'Comunidad', 'Colaboradores', 'Clientes'];
  return (
    <footer
      id="agradecimientos"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 4rem)',
        scrollMarginTop: '72px',
        background: 'linear-gradient(180deg, #2C2118, #1C150F)',
        color: 'var(--ws-footer-text)'
      }}
    >
      <h2
        style={{
          margin: '0 0 1rem',
          fontFamily: 'var(--ws-font)',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05
        }}
      >
        Agradecimientos
      </h2>
      <p
        style={{
          margin: '0 0 2.5rem',
          fontFamily: 'var(--ws-font)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--ws-secondary)',
          maxWidth: '640px'
        }}
      >
        A todos los que hacen posible este camino, gracias.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {gracias.map((g) => (
          <span
            key={g}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid rgba(200,169,106,0.4)',
              color: 'var(--ws-accent)',
              fontFamily: 'var(--ws-font)',
              fontWeight: 600
            }}
          >
            {g}
          </span>
        ))}
      </div>

      <p
        style={{
          marginTop: '3rem',
          color: 'rgba(236,229,218,0.5)',
          fontFamily: 'var(--ws-font)',
          fontSize: '0.9rem'
        }}
      >
        © {new Date().getFullYear()} WorshipSaint. Hecho con propósito.
      </p>
    </footer>
  );
};

export default Agradecimientos;
