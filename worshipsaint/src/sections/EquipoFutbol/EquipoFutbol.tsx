import type { FC } from 'react';
import Section from '../Section';

const EquipoFutbol: FC = () => {
  const jugadores = [
    { nombre: 'Saint #10', rol: 'Delantero' },
    { nombre: 'Saint #7', rol: 'Extremo' },
    { nombre: 'Saint #5', rol: 'Defensa' }
  ];
  return (
    <Section
      id="equipo-futbol"
      title="Equipo de Fútbol"
      subtitle="Una alineación que representa disciplina, estilo y pasión por el juego."
      variant="muted"
    >
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {jugadores.map((j) => (
          <div
            key={j.nombre}
            style={{
              minWidth: '200px',
              padding: '1.75rem',
              borderRadius: 'var(--ws-radius-card)',
              border: '1px solid rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: 'var(--ws-shadow-card)',
              textAlign: 'center',
              transition: 'var(--ws-transition)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-elevated)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'var(--ws-shadow-card)';
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                margin: '0 auto 1.25rem',
                background: 'linear-gradient(135deg, #D6C3A5, #C8A96A)',
                boxShadow: '0 8px 25px rgba(200,169,106,0.30)'
              }}
            />
            <h3 style={{ margin: 0, fontFamily: 'var(--ws-font)', fontWeight: 600, color: 'var(--ws-text)' }}>{j.nombre}</h3>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--ws-muted)', fontFamily: 'var(--ws-font)' }}>{j.rol}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default EquipoFutbol;
