Diseña un navbar moderno, minimalista y completamente responsive para la marca "WorshipSaint".

## Estructura

### Lado izquierdo
- Logotipo de WorshipSaint.
- Nombre de la marca: "WorshipSaint" con una tipografía elegante, moderna y de alto contraste.

### Lado derecho
Incluye los siguientes enlaces de navegación:

- Tienda
- Equipo de Fútbol
- Servicios
- Sobre Nosotros
- Agradecimientos

## Estilo visual

- Diseño premium y limpio.
- Inspiración en Apple, Stripe y Vercel.
- Fondo transparente al inicio y con efecto glassmorphism al hacer scroll.
- Altura aproximada de 72 px.
- Espaciado amplio entre elementos.
- Animaciones suaves al pasar el cursor (hover).
- Indicador de página activa.
- Bordes ligeramente redondeados.
- Sombra sutil cuando el usuario hace scroll.

## Colores

- Fondo: Negro (#0B0B0B)
- Texto principal: Blanco (#FFFFFF)
- Color de acento: Dorado (#D4AF37)
- Hover: Dorado con transición suave.

## Tipografía

- Títulos: Space Grotesk o Sora.
- Navegación: Inter.

## Responsive

- En escritorio: menú horizontal.
- En tablet y móvil: botón hamburguesa con animación.
- Menú lateral deslizable (off-canvas) con transición fluida.
- Cierre mediante botón "X" o al hacer clic fuera del menú.

## Accesibilidad

- Navegación mediante teclado.
- Etiquetas ARIA.
- Alto contraste.
- Estados de foco visibles.

## Tecnologías

- Astro
- React
- Tailwind CSS
- TypeScript

El componente debe estar organizado, reutilizable, escalable y listo para producción, siguiendo buenas prácticas de arquitectura y separación de componentes.

## Navegación entre secciones

Cada opción del Navbar debe desplazarse suavemente hacia una sección específica de la página utilizando scroll suave (smooth scroll).

Cada sección debe ocupar exactamente el alto completo de la pantalla (100vh) para brindar una experiencia inmersiva.

## Estructura del proyecto

Cada sección debe estar completamente desacoplada y ubicada en su propia carpeta para facilitar futuras mejoras independientes.

Ejemplo de estructura:

src/
├── components/
│   └── Navbar/
│       ├── Navbar.tsx
│       ├── NavItem.tsx
│       ├── MobileMenu.tsx
│       ├── Logo.tsx
│       ├── navigation.ts
│       └── index.ts
│
├── sections/
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   ├── HeroContent.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Tienda/
│   │   ├── Tienda.tsx
│   │   └── index.ts
│   │
│   ├── EquipoFutbol/
│   │   ├── EquipoFutbol.tsx
│   │   └── index.ts
│   │
│   ├── Servicios/
│   │   ├── Servicios.tsx
│   │   └── index.ts
│   │
│   ├── SobreNosotros/
│   │   ├── SobreNosotros.tsx
│   │   └── index.ts
│   │
│   └── Agradecimientos/
│       ├── Agradecimientos.tsx
│       └── index.ts

## Comportamiento

- Cada sección debe tener un id único.
- El Navbar debe navegar utilizando enlaces tipo #id.
- Implementar scroll-behavior: smooth.
- Resaltar automáticamente el enlace activo según la sección visible (Scroll Spy).
- El Navbar permanecerá fijo (sticky) durante toda la navegación.
- Cada sección debe tener `min-height: 100vh`.
- La transición entre secciones debe ser fluida y profesional.
- La arquitectura debe seguir principios SOLID y permitir que cada sección evolucione sin afectar las demás.
