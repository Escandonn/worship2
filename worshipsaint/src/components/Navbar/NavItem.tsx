import type { FC, MouseEvent } from 'react';
import type { NavRoute } from './navigation';

interface NavItemProps extends NavRoute {
  /** Indica si esta sección es la actualmente visible (Scroll Spy). */
  isActive: boolean;
  /** Callback al hacer clic (permite cerrar el menú móvil, etc.). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Enlace individual de navegación.
 * Usa anclas `#id` para scroll suave nativo y expone estados de foco/hover
 * accesibles. El indicador activo se anima con un subrayado dorado.
 */
const NavItem: FC<NavItemProps> = ({ id, label, isActive, onClick }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick?.(event);
  };

  return (
    <li style={{ listStyle: 'none' }}>
      <button
        type="button"
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.5rem 0.25rem',
          fontFamily: 'var(--ws-font)',
          fontSize: '0.95rem',
          fontWeight: isActive ? 600 : 500,
          letterSpacing: '0.01em',
          color: isActive ? 'var(--ws-accent)' : 'var(--ws-text)',
          opacity: isActive ? 1 : 0.75,
          textDecoration: 'none',
          transition: 'var(--ws-transition)',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {label}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: '-2px',
            height: '2px',
            width: isActive ? '100%' : '0%',
            backgroundColor: 'var(--ws-accent)',
            borderRadius: '2px',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </button>
    </li>
  );
};

export default NavItem;
