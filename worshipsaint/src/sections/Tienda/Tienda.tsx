import type { FC } from 'react';
import Section from '../Section';

const Tienda: FC = () => {
  const productos = [
    { nombre: 'Camiseta Saint', precio: '$49' },
    { nombre: 'Hoodie Dorado', precio: '$89' },
    { nombre: 'Gorra Minimal', precio: '$35' }
  ];
  return (
    <Section
      id="tienda"
      title="Tienda"
      subtitle="Piezas seleccionadas con materiales premium y acabados de alta gama."
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        {productos.map((p) => (
          <article
            key={p.nombre}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--ws-radius-card)',
              border: '1px solid rgba(44,33,24,0.08)',
              background: 'var(--ws-gradient-card)',
              boxShadow: 'var(--ws-shadow-card)',
              textAlign: 'left',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-elevated)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-card)';
            }}
          >
            <div
              style={{
                height: '140px',
                borderRadius: '20px',
                marginBottom: '1.25rem',
                background: 'linear-gradient(135deg, #ECE5DA, #D6C3A5)'
              }}
            />
            <h3 style={{ margin: 0, fontFamily: 'var(--ws-font)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--ws-text)' }}>{p.nombre}</h3>
            <p style={{ margin: '0.5rem 0 1.25rem', color: 'var(--ws-accent)', fontWeight: 700, fontFamily: 'var(--ws-font)' }}>{p.precio}</p>
            <button
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--ws-radius-btn)',
                border: 'none',
                background: 'var(--ws-gradient-btn)',
                color: 'var(--ws-text)',
                fontFamily: 'var(--ws-font)',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--ws-shadow-btn)',
                transition: 'var(--ws-transition)'
              }}
            >
              Comprar
            </button>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Tienda;
