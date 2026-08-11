/**
 * Configuración centralizada de la navegación del Navbar.
 * Cada item define el id de la sección destino, la etiqueta visible
 * y el orden de aparición. Añadir o quitar rutas aquí es suficiente
 * para que el Navbar y el Scroll Spy se actualicen automáticamente.
 */
export interface NavRoute {
  /** Identificador único de la sección (debe coincidir con el `id` del DOM). */
  id: string;
  /** Texto visible en el enlace de navegación. */
  label: string;
}

export const NAV_ROUTES: readonly NavRoute[] = [
  { id: 'tienda', label: ' e-commerce' },
  { id: 'equipo-futbol', label: 'Equipo de Fútbol' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'sobre-nosotros', label: 'Sobre Nosotros' },
  { id: 'agradecimientos', label: 'Agradecimientos' }
] as const;

/** ID de la sección hero (sección inicial, sin enlace en el navbar). */
export const HERO_SECTION_ID = 'hero';
