import type { FC } from 'react';
import Section from '../Section';

const SobreNosotros: FC = () => {
  return (
    <Section
      id="sobre-nosotros"
      title="Sobre Nosotros"
      subtitle="WorshipSaint nace de la convicción de que el diseño y la fe pueden coexistir con excelencia."
      variant="accent"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            height: '280px',
            borderRadius: 'var(--ws-radius-card)',
            background: 'var(--ws-gradient-premium)',
            boxShadow: 'var(--ws-shadow-elevated)'
          }}
        />
        <div
          style={{
            color: 'var(--ws-text)',
            fontFamily: 'var(--ws-font)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            textAlign: 'left'
          }}
        >
          <p style={{ margin: 0, opacity: 0.85 }}>
            Somos un colectivo creativo enfocado en construir marcas con propósito.
            Combinamos estética minimalista, ingeniería moderna y valores sólidos
            para entregar productos que perduran.
          </p>
          <p style={{ marginTop: '1rem', opacity: 0.85 }}>
            Cada proyecto es una oportunidad para elevar el estándar: desde la
            tipografía hasta el último píxel, todo importa.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default SobreNosotros;
