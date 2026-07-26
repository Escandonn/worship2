import type { FC } from 'react';
import Section from '../Section';

const Servicios: FC = () => {
  const servicios = [
    { titulo: 'Diseño de Marca', desc: 'Identidad visual completa y coherente.' },
    { titulo: 'Desarrollo Web', desc: 'Sitios rápidos, accesibles y escalables.' },
    { titulo: 'Merchandising', desc: 'Productos premium con acabados de lujo.' }
  ];
  return (
    <Section
      id="servicios"
      title="Servicios"
      subtitle="Soluciones integrales de diseño y desarrollo para marcas con ambición."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {servicios.map((s) => (
          <div
            key={s.titulo}
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--ws-radius-card)',
              border: '1px solid rgba(44,33,24,0.08)',
              background: 'var(--ws-gradient-card)',
              boxShadow: 'var(--ws-shadow-card)',
              textAlign: 'left',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,169,106,0.4)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-elevated)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(44,33,24,0.08)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-card)';
            }}
          >
            <h3 style={{ margin: 0, fontFamily: 'var(--ws-font)', fontWeight: 600, color: 'var(--ws-accent)' }}>{s.titulo}</h3>
            <p style={{ margin: '0.75rem 0 0', color: 'var(--ws-text)', opacity: 0.8, fontFamily: 'var(--ws-font)', lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Servicios;
