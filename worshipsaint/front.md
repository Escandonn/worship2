# PROMPT — Eliminar IDs de secciones de la URL

## Objetivo

Modificar el sistema de navegación del sitio **WorshipSaint** para que al navegar entre secciones mediante el navbar, botones o enlaces internos, **nunca aparezcan identificadores de sección (`#hash`) en la URL**.

### Comportamiento actual

Actualmente las URLs quedan así:

```text
https://www.worshipsaint.com/#hero
https://www.worshipsaint.com/#equipo-futbol
https://www.worshipsaint.com/#tienda
https://www.worshipsaint.com/#servicios
https://www.worshipsaint.com/#sobre-nosotros
```

### Comportamiento esperado

Las URLs deben permanecer siempre limpias:

```text
https://www.worshipsaint.com/
```

Al hacer clic en cualquier sección:

```text
Tienda
Equipo de Fútbol
Servicios
Sobre Nosotros
```

la página debe hacer scroll o ejecutar la animación correspondiente, pero **la URL no debe modificarse**.

---

# REQUISITOS

## 1. No utilizar navegación mediante hash

Eliminar o reemplazar cualquier navegación como:

```html
<a href="#hero">
<a href="#equipo-futbol">
<a href="#tienda">
<a href="#servicios">
<a href="#sobre-nosotros">
```

No utilizar:

```javascript
window.location.hash
```

ni:

```javascript
location.hash
```

para controlar la navegación.

---

# 2. Mantener el scroll hacia las secciones

El usuario debe seguir pudiendo hacer clic en las opciones del navbar y ser llevado visualmente a la sección correspondiente.

Ejemplo:

```javascript
document.querySelector('[data-section="tienda"]')
```

debe desplazarse hacia:

```html
<section id="tienda">
```

pero sin agregar:

```text
#tienda
```

a la URL.

Utilizar una navegación basada en JavaScript, por ejemplo:

```javascript
document.getElementById('tienda')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
});
```

El `id` de las secciones puede mantenerse internamente para permitir el scroll.

**IMPORTANTE:** eliminar el `#` de la URL NO significa eliminar los `id` de las secciones HTML.

---

# 3. Mantener los IDs internos

Conservar:

```html
<section id="hero">
<section id="equipo-futbol">
<section id="tienda">
<section id="servicios">
<section id="sobre-nosotros">
```

Estos IDs pueden seguir utilizándose internamente para localizar las secciones.

Lo que debe desaparecer es únicamente su aparición en la URL.

---

# 4. Navbar

Modificar los enlaces del navbar para que no utilicen:

```html
href="#hero"
href="#equipo-futbol"
href="#tienda"
href="#servicios"
href="#sobre-nosotros"
```

En su lugar, utilizar botones o enlaces controlados por JavaScript.

Ejemplo:

```html
<button data-section="hero">
    Inicio
</button>

<button data-section="equipo-futbol">
    Equipo de Fútbol
</button>

<button data-section="tienda">
    Tienda
</button>

<button data-section="servicios">
    Servicios
</button>

<button data-section="sobre-nosotros">
    Sobre Nosotros
</button>
```

---

# 5. Crear un sistema centralizado de navegación

Implementar una única función responsable de navegar entre secciones.

Ejemplo:

```javascript
function navigateToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    // No modificar la URL
}
```

Después:

```javascript
document.querySelectorAll('[data-section]').forEach(button => {
    button.addEventListener('click', () => {
        const sectionId = button.dataset.section;

        navigateToSection(sectionId);
    });
});
```

---

# 6. Eliminar hashes existentes

Revisar todo el proyecto y localizar cualquier código que utilice:

```javascript
window.location.hash
```

```javascript
location.hash
```

```javascript
history.pushState(...)
```

```javascript
history.replaceState(...)
```

si está siendo utilizado para generar o mantener hashes de secciones.

También revisar:

```html
href="#..."
```

y cualquier router o sistema de navegación que genere automáticamente URLs con `#`.

---

# 7. Carga inicial

Si el usuario entra directamente a:

```text
https://www.worshipsaint.com/
```

debe comenzar normalmente en la sección Hero.

No debe ser necesario:

```text
/#hero
```

para mostrar el Hero.

---

# 8. Si el usuario entra con una URL antigua

Si alguien entra utilizando una URL antigua como:

```text
https://www.worshipsaint.com/#equipo-futbol
```

el sistema debe:

1. Detectar el hash existente.
2. Desplazarse a la sección correspondiente.
3. Eliminar el hash inmediatamente de la URL.

Resultado:

```text
https://www.worshipsaint.com/
```

Ejemplo conceptual:

```javascript
const hash = window.location.hash;

if (hash) {
    const section = document.querySelector(hash);

    if (section) {
        section.scrollIntoView({
            behavior: 'instant',
            block: 'start'
        });

        history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search
        );
    }
}
```

Adaptar esta lógica al framework/arquitectura existente.

---

# 9. No romper las animaciones existentes

El proyecto actualmente puede tener:

* animaciones al hacer scroll
* navegación mediante navbar
* animaciones de entrada
* efectos de transición
* sección Hero
* sección Equipo de Fútbol
* sección Tienda
* sección Servicios
* sección Sobre Nosotros
* menú responsive/mobile
* navegación mediante botones
* efectos cinematográficos

No eliminar ni modificar estas funcionalidades.

El cambio debe limitarse al sistema que genera los hashes en la URL.

---

# 10. Navegación móvil

Aplicar exactamente el mismo comportamiento al menú mobile.

Ejemplo:

```text
☰
  Inicio
  Equipo de Fútbol
  Tienda
  Servicios
  Sobre Nosotros
```

Al seleccionar una sección:

```text
https://www.worshipsaint.com/
```

debe mantenerse limpia.

Cerrar también el menú mobile después de realizar la navegación si esa funcionalidad ya existe.

---

# 11. Compatibilidad con Astro / React / JavaScript

Antes de modificar código:

1. Identificar si la navegación está implementada en:

   * HTML
   * JavaScript
   * React
   * Astro
   * componentes
   * router
2. Identificar todos los lugares donde se generan hashes.
3. Determinar cuál es el sistema central de navegación actual.
4. Modificar la implementación existente en lugar de crear sistemas duplicados.

No introducir React Router, Vue Router ni otra librería innecesaria.

---

# 12. Requisito crítico

La URL nunca debe terminar así:

```text
/#hero
/#equipo-futbol
/#tienda
/#servicios
/#sobre-nosotros
```

Debe permanecer:

```text
https://www.worshipsaint.com/
```

durante toda la navegación interna.

El scroll debe ocurrir **sin navegación de URL**.

---

# 13. Verificación final

Después de realizar los cambios probar:

### Caso 1

Entrar:

```text
https://www.worshipsaint.com/
```

Resultado:

```text
https://www.worshipsaint.com/
```

---

### Caso 2

Hacer clic en:

```text
Equipo de Fútbol
```

Debe desplazarse a:

```text
#equipo-futbol
```

internamente, pero la barra del navegador debe continuar mostrando:

```text
https://www.worshipsaint.com/
```

---

### Caso 3

Hacer clic en:

```text
Tienda
```

Debe hacer scroll a la tienda.

URL:

```text
https://www.worshipsaint.com/
```

---

### Caso 4

Entrar manualmente a:

```text
https://www.worshipsaint.com/#equipo-futbol
```

Debe:

1. Ir al Equipo de Fútbol.
2. Eliminar `#equipo-futbol`.
3. Dejar:

```text
https://www.worshipsaint.com/
```

---

# REGLA PRINCIPAL

**NO eliminar los IDs de las secciones HTML.**

Solo eliminar el uso de esos IDs como hashes de navegación en la URL.

La navegación debe funcionar mediante:

```text
Click
 ↓
JavaScript
 ↓
Buscar sección por ID
 ↓
scrollIntoView()
 ↓
URL permanece limpia
```

## Resultado final

El sitio debe tener una navegación interna moderna y limpia:

```text
https://www.worshipsaint.com/
```

sin mostrar nunca:

```text
#hero
#equipo-futbol
#tienda
#servicios
#sobre-nosotros
```

Mantener intactos el diseño, las animaciones, el responsive, las secciones y toda la funcionalidad existente.
