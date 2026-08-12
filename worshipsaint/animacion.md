# README — Botón Google + Animación "Agendar Demo"

## Objetivo

Realizar **únicamente una modificación visual en el Frontend React + Tailwind CSS** para agregar un botón de registro con Google acompañado del mensaje **"Agendar Demo"**.

La referencia visual principal es la imagen proporcionada por el usuario.

**IMPORTANTE:** No modificar lógica existente, autenticación, Firebase, rutas, componentes no relacionados, colores globales, tipografías globales ni otros elementos de la interfaz.

---

## 1. Elemento principal

Crear un componente visual para el botón:

```text
        Agendar Demo
             ↓
    ┌───────────────────────┐
    │   G   Regístrate con Google │
    └───────────────────────┘
```

El botón debe mantener una apariencia moderna, limpia y coherente con el diseño actual de WorshipSaint.

### Texto del botón

**Regístrate con Google**

Debe incluir el ícono oficial/marca visual de Google a la izquierda del texto.

Encima del botón debe aparecer:

**Agendar Demo**

El texto "Agendar Demo" forma parte de la animación descrita a continuación.

---

# 2. Animación principal

La animación debe sentirse como un **elemento flotante que se desplaza suavemente de izquierda a derecha y regresa**, sin recorrer toda la pantalla.

### Posición inicial

El conjunto comienza en la zona:

```text
parte inferior izquierda
```

Pero **no debe estar pegado al borde de la pantalla**.

Debe existir un pequeño margen inferior y lateral.

---

## 3. Movimiento horizontal

El botón debe desplazarse lentamente sobre el eje X.

Ejemplo conceptual:

```text
INICIO

     [ Agendar Demo ]
     [ Google       ]
          ↓

   ────────────────→

        [ Agendar Demo ]
        [ Google       ]

              PAUSA

   ←────────────────

     [ Agendar Demo ]
     [ Google       ]
```

### Reglas del movimiento

* Movimiento exclusivamente horizontal.
* No realizar un movimiento circular.
* No modificar considerablemente la posición vertical.
* No atravesar toda la pantalla.
* No desaparecer por el lado derecho.
* No aparecer nuevamente desde otro extremo.
* El desplazamiento debe mantenerse dentro de una zona limitada cercana a su posición inicial.
* Debe parecer un pequeño movimiento flotante/atractivo.

---

# 4. Secuencia de animación

La animación debe funcionar en un ciclo infinito:

### Fase 1 — Inicio

El botón comienza en la posición inferior izquierda.

```text
[ Agendar Demo ]
[ G  Regístrate con Google ]
```

### Fase 2 — Desplazamiento

Se desplaza lentamente hacia la derecha aproximadamente entre:

```text
60px - 120px
```

dependiendo del ancho disponible.

Debe utilizar una transición suave.

### Fase 3 — Pausa

Al llegar a la posición derecha:

* detenerse brevemente;
* mostrar/revelar claramente **"Agendar Demo"** encima del botón.

### Fase 4 — Regreso

El conjunto vuelve lentamente hacia la izquierda.

### Fase 5 — Nueva pausa

Al regresar a la posición inicial:

* hacer una pequeña pausa;
* repetir nuevamente el ciclo.

---

# 5. Animación del texto "Agendar Demo"

El texto **"Agendar Demo"** debe tener una aparición sutil.

No debe aparecer bruscamente.

Usar una combinación visual de:

```css
opacity
transform
```

Por ejemplo:

```text
oculto
   ↓
fade-in + pequeño desplazamiento vertical
   ↓
visible
```

El texto debe aparecer encima del botón, centrado horizontalmente respecto al botón.

Ejemplo:

```text
        Agendar Demo
             ↓
   ┌─────────────────────┐
   │  G  Regístrate con  │
   │       Google        │
   └─────────────────────┘
```

---

# 6. Estilo del botón

Mantener la estética actual del sitio.

El botón debe:

* Tener bordes redondeados.
* Tener buena separación interna.
* Tener apariencia premium.
* Ser claramente identificable como registro con Google.
* Utilizar el logotipo/marca de Google correctamente.
* Tener una sombra sutil.
* Tener un efecto hover discreto.
* No utilizar animaciones exageradas.
* No parecer un anuncio invasivo.

No cambiar la paleta global del proyecto.

---

# 7. Responsive

La animación debe adaptarse a:

* Desktop
* Tablet
* Mobile

### Desktop

Permitir un desplazamiento horizontal ligeramente mayor.

Ejemplo:

```text
60px → 120px → 60px
```

### Mobile

Reducir la distancia del movimiento para evitar que el botón se salga de la pantalla.

Ejemplo:

```text
20px → 50px → 20px
```

El botón debe permanecer completamente visible.

**Nunca debe generar scroll horizontal.**

Utilizar:

```css
overflow-x: hidden;
```

únicamente donde sea necesario y sin afectar el layout general.

---

# 8. Tailwind CSS

Implementar la animación utilizando Tailwind CSS siempre que sea posible.

Si la animación requiere `@keyframes` personalizados, agregarlos de forma localizada.

Ejemplo conceptual:

```css
@keyframes demoFloat {
  0% {
    transform: translateX(0);
  }

  40% {
    transform: translateX(90px);
  }

  55% {
    transform: translateX(90px);
  }

  100% {
    transform: translateX(0);
  }
}
```

La animación debe utilizar:

```css
animation-timing-function: ease-in-out;
```

o una curva equivalente que produzca un movimiento orgánico.

---

# 9. Duración

La animación debe ser lenta y elegante.

Evitar movimientos rápidos.

Referencia aproximada:

```text
Duración total: 7s - 10s
```

Ejemplo:

```text
0s       Inicio
0s-3s    Movimiento hacia la derecha
3s-4s    Pausa
4s-7s    Regreso
7s-8s    Pausa
8s        Repetir
```

Ajustar los tiempos visualmente para conseguir una sensación premium.

---

# 10. Estructura recomendada

Crear un componente independiente, por ejemplo:

```text
components/
└── GoogleDemoButton/
    └── GoogleDemoButton.jsx
```

o adaptarlo a la estructura existente del proyecto si ya existe una organización equivalente.

El componente debe contener únicamente la presentación y animación.

No introducir lógica nueva de autenticación.

Si el botón Google ya tiene una función `onClick`, conservarla.

Ejemplo:

```jsx
<GoogleDemoButton onClick={existingGoogleHandler} />
```

---

# 11. No modificar

La IA debe respetar estrictamente estas restricciones:

* NO modificar Firebase.
* NO modificar Google Authentication.
* NO modificar servicios.
* NO modificar API.
* NO modificar rutas.
* NO modificar backend.
* NO modificar lógica de registro.
* NO modificar otros botones.
* NO modificar Navbar.
* NO modificar Hero.
* NO modificar Footer.
* NO cambiar colores globales.
* NO cambiar tipografías globales.
* NO instalar dependencias nuevas salvo que sean absolutamente necesarias.
* NO reemplazar Tailwind.
* NO crear una librería de animación.
* NO modificar componentes no relacionados.

---

# 12. Accesibilidad

El botón debe continuar siendo accesible.

Incluir:

```text
aria-label="Regístrate con Google"
```

si el contexto del componente lo requiere.

El texto debe seguir siendo legible aunque la animación esté detenida.

También respetar:

```css
prefers-reduced-motion
```

Cuando el usuario tenga activada la reducción de movimiento, desactivar o reducir considerablemente la animación.

---

# 13. Resultado visual esperado

El resultado debe transmitir la sensación de:

```text
                    Agendar Demo
                         ↓

┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│                                             │
│                                             │
│  [ G  Regístrate con Google ]               │
│       ↔ movimiento suave                   │
└─────────────────────────────────────────────┘
```

El elemento debe sentirse **flotante, elegante y discreto**.

La intención es llamar la atención del usuario hacia la posibilidad de **agendar una demo**, sin convertirse en un elemento invasivo.

---

# 14. Criterios de aceptación

La implementación será correcta únicamente si:

* [ ] Existe el botón "Regístrate con Google".
* [ ] El botón contiene el icono de Google.
* [ ] "Agendar Demo" aparece encima del botón.
* [ ] El conjunto inicia en la zona inferior izquierda.
* [ ] Se desplaza lentamente hacia la derecha.
* [ ] El desplazamiento está limitado y no cruza toda la pantalla.
* [ ] Hace una pequeña pausa.
* [ ] "Agendar Demo" aparece mediante una transición suave.
* [ ] El conjunto regresa lentamente hacia la izquierda.
* [ ] El ciclo se repite automáticamente.
* [ ] No existe movimiento vertical significativo.
* [ ] No aparece scroll horizontal.
* [ ] Funciona correctamente en desktop.
* [ ] Funciona correctamente en mobile.
* [ ] En mobile la distancia del movimiento se reduce.
* [ ] Se mantiene la lógica actual del botón Google.
* [ ] No se modifican otros componentes ni funcionalidades.
* [ ] Se respeta `prefers-reduced-motion`.

---

## Instrucción final para la IA

**Analiza primero la estructura actual del proyecto React + Tailwind y localiza el botón/componente existente de Google. Después implementa exclusivamente esta modificación visual. Reutiliza la lógica existente del botón y agrega únicamente el mensaje "Agendar Demo" y la animación solicitada. No realices refactorizaciones ni cambios adicionales fuera del alcance indicado en este README.**
