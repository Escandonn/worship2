import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { NAV_ROUTES } from './navigation';
import Logo from './Logo';
import NavItem from './NavItem';
import MobileMenu from './MobileMenu';

const MOBILE_BREAKPOINT = 1024;

/**
 * Navbar principal de WorshipSaint.
 *
 * Responsabilidades:
 *  - Permanecer fijo (sticky) en la parte superior.
 *  - Aplicar efecto glassmorphism + sombra al hacer scroll.
 *  - Implementar Scroll Spy para resaltar el enlace de la sección visible.
 *  - Mostrar menú horizontal en escritorio y hamburguesa off-canvas en móvil.
 *
 * El componente es presentacional y se integra en `index.astro` como cliente
 * (`client:load`) porque depende de eventos de scroll y resize.
 */
const Navbar: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(NAV_ROUTES[0]?.id ?? '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar viewport móvil (<1024px) para renderizar solo ahí el menú lateral.
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Cerrar el menú si se pasa a escritorio mientras está abierto.
  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  // Detectar scroll para activar glassmorphism.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll Spy: observa qué sección está visible.
  useEffect(() => {
    const sections = NAV_ROUTES.map((r) => document.getElementById(r.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 80,
        width: '100%',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(1rem, 4vw, 3rem)',
        backgroundColor: scrolled ? 'rgba(248,246,242,0.70)' : 'transparent',
        backdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(30px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 35px rgba(44,33,24,0.08)' : 'none',
        transition: 'background-color 0.4s ease-in-out, box-shadow 0.4s ease-in-out, border-color 0.4s ease-in-out, backdrop-filter 0.4s ease-in-out'
      }}
    >
      <a href="#hero" aria-label="WorshipSaint — inicio" style={{ textDecoration: 'none' }}>
        <Logo />
      </a>

      {/* Navegación escritorio */}
      <nav aria-label="Navegación principal" className="ws-nav-desktop">
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
            padding: 0,
            margin: 0
          }}
        >
          {NAV_ROUTES.map((route) => (
            <NavItem key={route.id} {...route} isActive={activeId === route.id} />
          ))}
        </ul>
      </nav>

      {/* Botón hamburguesa móvil */}
      <button
        type="button"
        className="ws-nav-burger"
        onClick={() => setMenuOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        aria-controls="ws-mobile-menu"
        style={{
          width: '44px',
          height: '44px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '14px',
          border: '1px solid rgba(44,33,24,0.12)',
          background: 'rgba(255,255,255,0.5)',
          color: 'var(--ws-text)',
          cursor: 'pointer'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      {isMobile && (
        <MobileMenu
          routes={NAV_ROUTES}
          activeId={activeId}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 1023px) {
          .ws-nav-desktop { display: none !important; }
          .ws-nav-burger { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
