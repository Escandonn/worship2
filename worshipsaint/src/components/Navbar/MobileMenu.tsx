import { useEffect } from 'react';
import type { FC } from 'react';
import type { NavRoute } from './navigation';
import NavItem from './NavItem';

interface MobileMenuProps {
  routes: readonly NavRoute[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Menú lateral off-canvas para tablet y móvil.
 * Se desliza desde la derecha con transición fluida, incluye un overlay
 * semitransparente que permite cerrar al hacer clic fuera, y un botón "X".
 * Gestiona el bloqueo del scroll del body mientras está abierto y el cierre
 * con la tecla Escape para accesibilidad por teclado.
 */
const MobileMenu: FC<MobileMenuProps> = ({ routes, activeId, isOpen, onClose }) => {
  // Cerrar con Escape y bloquear scroll del body.
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          backgroundColor: 'rgba(44,33,24,0.35)',
          backdropFilter: 'blur(6px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Panel lateral */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          width: 'min(82vw, 360px)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--ws-bg)',
          borderLeft: '1px solid rgba(200,169,106,0.25)',
          boxShadow: '-20px 0 60px rgba(44,33,24,0.18)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: '1.25rem 1.5rem 2rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            style={{
              width: '44px',
              height: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '14px',
              border: '1px solid rgba(44,33,24,0.12)',
              background: 'rgba(255,255,255,0.5)',
              color: 'var(--ws-text)',
              cursor: 'pointer',
              transition: 'background 0.3s ease, border-color 0.3s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="Navegación móvil">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: 0, margin: 0 }}>
            {routes.map((route) => (
              <div
                key={route.id}
                style={{
                  borderBottom: '1px solid rgba(44,33,24,0.08)'
                }}
              >
                <NavItem
                  {...route}
                  isActive={activeId === route.id}
                  onClick={onClose}
                />
              </div>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default MobileMenu;
