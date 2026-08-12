# README — Nueva Interfaz de Registro WorshipSaint

## 1. Objetivo

Crear una **nueva interfaz de registro independiente** para WorshipSaint, manteniendo la identidad visual mostrada en la referencia proporcionada y sin modificar innecesariamente las páginas, componentes, estilos, lógica o funcionalidades existentes.

La nueva pantalla permitirá al usuario registrarse mediante:

1. **Correo electrónico y contraseña**
2. **Cuenta de Google**

La interfaz debe sentirse como una extensión natural del sitio principal: elegante, minimalista, tecnológica, espiritual y coherente con la estética actual de WorshipSaint.

---

## 2. Referencia visual

Tomar como referencia principal el diseño actual de WorshipSaint:

* Fondo crema/beige.
* Tipografía elegante y moderna.
* Texto principal oscuro.
* Dorado/beige como color de acento.
* Bordes suaves.
* Elementos minimalistas.
* Sensación premium.
* Uso de espacios amplios.
* Animaciones sutiles.
* Identidad visual basada en:

  * Tecnología
  * Conciencia
  * Fútbol
  * Espiritualidad
  * Elegancia

La nueva pantalla **NO debe parecer una plantilla genérica de login/register**.

Debe sentirse como una página perteneciente directamente al ecosistema WorshipSaint.

---

# 3. Estructura general

La nueva página tendrá una estructura similar a:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    LOGO + WorshipSaint                       │
│                                                              │
│                                                   Inicio     │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                FONDO DE PARTÍCULAS ANIMADAS                  │
│                                                              │
│                                                              │
│                     Únete a WorshipSaint                      │
│                                                              │
│              Crea tu cuenta y forma parte                    │
│                    del ecosistema.                           │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │ Nombre                       │                │
│              └──────────────────────────────┘                │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │ Correo electrónico           │                │
│              └──────────────────────────────┘                │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │ Contraseña                   │                │
│              └──────────────────────────────┘                │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │       Crear cuenta           │                │
│              └──────────────────────────────┘                │
│                                                              │
│                         ── o ──                              │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │  G  Registrarse con Google   │                │
│              └──────────────────────────────┘                │
│                                                              │
│                   ¿Ya tienes una cuenta?                     │
│                         Iniciar sesión                        │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

La composición final debe adaptarse al diseño real del proyecto.

---

# 4. Navbar

La navbar de esta página será **mucho más limpia que la del Home**.

### Debe contener únicamente:

### Centro

Logo + nombre:

```text
[LOGO] WorshipSaint
```

El logo debe utilizar el recurso existente del proyecto si está disponible.

No crear un logo nuevo.

Utilizar los assets existentes, por ejemplo:

```text
/assets/logo.png
```

si esa es la ubicación real del proyecto.

### Lado derecho

Agregar únicamente:

```text
Inicio
```

Este botón debe:

* Llevar al usuario al Home.
* Devolverlo visualmente al Hero principal.
* Mantener el estilo de WorshipSaint.
* Tener una animación hover elegante.
* No utilizar un botón visualmente pesado.

Ejemplo visual:

```text
Inicio
────────
```

El subrayado puede aparecer suavemente al pasar el cursor.

---

# 5. Navbar responsive

## Desktop

Mostrar:

```text
                 Logo + WorshipSaint                         Inicio
```

El logo y nombre deben quedar **centrados visualmente**.

El botón `Inicio` debe permanecer en el extremo derecho.

No agregar:

* e-commerce
* Equipo de Fútbol
* Servicios
* Sobre Nosotros
* Agradecimientos
* Otros enlaces

Esta página debe tener una navegación minimalista.

---

## Mobile

La navbar debe mantenerse limpia:

```text
[Logo] WorshipSaint                         Inicio
```

Reducir:

* Tamaño del logo.
* Tamaño del texto.
* Padding horizontal.

No permitir que el navbar genere scroll horizontal.

---

# 6. Fondo de partículas

Crear un **nuevo background visual de partículas**, diseñado específicamente para esta página.

No reutilizar exactamente el background del Hero actual.

El objetivo es crear una experiencia visual nueva pero coherente.

### Concepto visual

Las partículas deben representar:

* Conexiones.
* Tecnología.
* Conciencia.
* Energía.
* Ecosistema.
* Evolución.

Debe utilizar una estética muy sutil.

Evitar un efecto:

* Gamer.
* Cyberpunk.
* Neón.
* Excesivamente brillante.
* Sobrecargado.

---

# 7. Partículas Desktop

En escritorio crear:

* Pequeños puntos luminosos.
* Líneas extremadamente sutiles.
* Movimiento lento.
* Diferentes profundidades.
* Algunas partículas desplazándose lentamente.
* Variación ligera de tamaño/opacidad.

El movimiento debe ser:

```text
LENTO
FLUIDO
ORGÁNICO
MINIMALISTA
```

No deben distraer del formulario.

Las partículas deben quedar principalmente en el fondo.

El contenido del registro siempre debe tener prioridad visual.

---

# 8. Partículas Mobile

Crear una adaptación específica para dispositivos móviles.

No simplemente reducir el canvas de desktop.

En mobile:

* Reducir considerablemente la cantidad de partículas.
* Reducir conexiones.
* Reducir cálculos innecesarios.
* Mantener animación fluida.
* Evitar consumo excesivo de CPU/GPU.
* Evitar problemas de rendimiento.

La experiencia visual debe mantenerse elegante incluso en dispositivos de menor capacidad.

---

# 9. Hero / área central

El formulario debe ocupar el centro visual de la página.

Crear una composición similar a:

```text
          ÚNETE AL ECOSISTEMA

             WorshipSaint

      Crea tu cuenta y descubre
      todo lo que tenemos para ti.

      ┌─────────────────────────┐
      │ Nombre                  │
      └─────────────────────────┘

      ┌─────────────────────────┐
      │ Correo electrónico       │
      └─────────────────────────┘

      ┌─────────────────────────┐
      │ Contraseña              │
      └─────────────────────────┘

      ┌─────────────────────────┐
      │      Crear cuenta       │
      └─────────────────────────┘

              ─── o ───

      ┌─────────────────────────┐
      │ G Registrarse con Google│
      └─────────────────────────┘

        ¿Ya tienes una cuenta?
             Iniciar sesión
```

---

# 10. Texto principal

Utilizar textos acordes a la identidad de WorshipSaint.

Propuesta:

### Eyebrow

```text
BIENVENIDO AL ECOSISTEMA
```

### Título

```text
Forma parte de WorshipSaint.
```

### Subtítulo

```text
Crea tu cuenta y descubre una nueva forma
de conectar con nuestro ecosistema.
```

El texto debe poder modificarse fácilmente desde el componente.

No introducir textos innecesariamente extensos.

---

# 11. Formulario

El formulario debe incluir inicialmente:

### Nombre

```text
Nombre
```

### Correo

```text
Correo electrónico
```

### Contraseña

```text
Contraseña
```

### Botón

```text
Crear cuenta
```

Agregar validaciones visuales claras.

Por ejemplo:

* Campo vacío.
* Correo inválido.
* Contraseña insuficiente.
* Error de registro.
* Registro exitoso.
* Estado de carga.

Los mensajes de error deben seguir la identidad visual.

Evitar alerts nativos del navegador.

---

# 12. Registro tradicional

Implementar o preparar el flujo para:

```text
Nombre
      ↓
Correo
      ↓
Contraseña
      ↓
Validación
      ↓
Firebase Authentication
      ↓
Usuario registrado
      ↓
Firestore
```

La lógica existente de Firebase debe reutilizarse si ya existe.

**No crear una segunda configuración de Firebase.**

Buscar primero si el proyecto ya posee:

```text
firebase.js
firebase.ts
firebaseConfig
auth
initializeApp
getAuth
GoogleAuthProvider
```

Si existe una implementación funcional:

> reutilizarla.

No duplicar servicios.

---

# 13. Registro con Google

Agregar un botón visualmente destacado:

```text
G   Registrarse con Google
```

Debe utilizar el flujo existente de Firebase Authentication cuando esté disponible.

Flujo esperado:

```text
Usuario
   ↓
Registrarse con Google
   ↓
Google Authentication
   ↓
Firebase Authentication
   ↓
Obtener usuario
   ↓
Guardar/actualizar información básica en Firestore
   ↓
Usuario registrado
```

No implementar OAuth manualmente si Firebase Authentication ya está configurado.

---

# 14. Diseño del botón Google

El botón Google debe tener una apariencia coherente con WorshipSaint.

No utilizar el típico botón azul genérico.

Diseño recomendado:

* Fondo claro.
* Borde fino.
* Logo G de Google.
* Texto oscuro.
* Hover elegante.
* Sombra muy ligera.
* Transición suave.

Ejemplo:

```text
┌────────────────────────────────────┐
│  G       Registrarse con Google    │
└────────────────────────────────────┘
```

El botón debe tener el mismo nivel de calidad visual que el botón principal.

---

# 15. Separador

Entre registro tradicional y Google utilizar:

```text
────────────  o  ────────────
```

Debe ser extremadamente sutil.

No utilizar elementos visualmente pesados.

---

# 16. Inputs

Los inputs deben seguir la estética del sitio.

Características:

* Border radius elegante.
* Fondo ligeramente translúcido o crema.
* Border fino.
* Color oscuro para texto.
* Placeholder discreto.
* Focus animado.
* Transiciones suaves.

### Focus

Cuando el usuario seleccione un campo:

```text
border-color
      +
box-shadow muy sutil
      +
transición
```

No utilizar azul estándar del navegador.

---

# 17. Botón principal

Texto:

```text
Crear cuenta
```

Debe utilizar el dorado característico de WorshipSaint.

Hover:

* Ligero cambio de tonalidad.
* Elevación mínima.
* Transformación de aproximadamente 1–2px.
* Transición suave.

No exagerar el efecto.

---

# 18. Tipografía

Mantener la tipografía actual utilizada por WorshipSaint.

No introducir una nueva familia tipográfica sin necesidad.

Jerarquía:

### Título

Grande, pesado y elegante.

### Subtítulo

Más ligero.

### Labels

Pequeños y claros.

### Inputs

Legibles y cómodos.

### Links

Dorado / beige de la identidad.

La tipografía debe mantener coherencia con:

```text
Diseño en código.
Pasión en cancha.
Conciencia en el ser.
```

---

# 19. Animaciones

La página debe tener animaciones, pero deben ser **premium y sutiles**.

### Entrada inicial

Al cargar:

```text
Navbar
   ↓
Fade + translateY

Hero
   ↓
Fade + translateY

Formulario
   ↓
Fade progresivo
```

Duración aproximada:

```text
400ms – 800ms
```

No hacer animaciones demasiado rápidas.

---

# 20. Animación ambiental

El fondo debe permanecer vivo.

Las partículas pueden:

* Desplazarse lentamente.
* Cambiar ligeramente de opacidad.
* Crear conexiones ocasionales.
* Desaparecer y aparecer suavemente.

La animación nunca debe competir con:

```text
Título
Formulario
Botón Google
Botón Crear cuenta
```

---

# 21. Responsive Design

La página debe funcionar correctamente en:

```text
Desktop
Laptop
Tablet
Mobile
```

Breakpoints deben adaptarse al proyecto existente.

### Desktop

Formulario centrado y relativamente compacto.

### Tablet

Reducir:

* Tamaño del título.
* Ancho del formulario.
* Espaciados.

### Mobile

Priorizar:

* Legibilidad.
* Inputs cómodos.
* Botones fáciles de pulsar.
* Animación ligera.

Evitar:

```text
overflow-x
```

---

# 22. Mobile Layout

En móvil el resultado esperado es similar a:

```text
┌─────────────────────────┐
│ [Logo] WorshipSaint Inicio│
├─────────────────────────┤
│                         │
│   BIENVENIDO AL          │
│   ECOSISTEMA             │
│                         │
│   Forma parte de         │
│   WorshipSaint.          │
│                         │
│   Crea tu cuenta...      │
│                         │
│ ┌─────────────────────┐ │
│ │ Nombre              │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Correo              │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Contraseña          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Crear cuenta        │ │
│ └─────────────────────┘ │
│                         │
│       ── o ──           │
│                         │
│ ┌─────────────────────┐ │
│ │ G Google            │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

---

# 23. Arquitectura

Crear la nueva funcionalidad de forma aislada.

Ejemplo conceptual:

```text
src/
├── pages/
│   └── registro/
│       └── index.astro
│
├── components/
│   └── registro/
│       ├── RegisterForm.jsx
│       ├── GoogleRegister.jsx
│       └── ParticleBackground.jsx
│
├── styles/
│   └── registro.css
│
└── services/
    └── firebase/
```

**Adaptar esta estructura a la arquitectura real del proyecto.**

No crear carpetas duplicadas si ya existen equivalentes.

---

# 24. Separación de responsabilidades

El componente visual no debe contener toda la lógica.

Separar:

```text
UI
↓
Formulario
↓
Servicio Authentication
↓
Firebase
```

Ejemplo conceptual:

```text
RegisterPage
     ↓
RegisterForm
     ↓
authService
     ↓
Firebase
```

Y:

```text
GoogleRegister
     ↓
authService
     ↓
Firebase Authentication
```

---

# 25. Reutilización

Antes de crear cualquier archivo nuevo:

1. Revisar componentes existentes.
2. Revisar estilos existentes.
3. Revisar Firebase.
4. Revisar servicios de autenticación.
5. Revisar configuración de rutas.
6. Revisar assets.
7. Revisar tipografías.

Reutilizar todo lo que sea compatible.

---

# 26. Restricciones importantes

### NO modificar

No modificar sin necesidad:

* Home.
* Hero existente.
* Navbar global.
* Tienda.
* Equipo de fútbol.
* Servicios.
* Sobre nosotros.
* Agradecimientos.
* Firebase existente.
* Variables globales.
* Colores globales.
* Componentes no relacionados.

### NO hacer

No:

* Cambiar la identidad general del sitio.
* Reemplazar la tipografía global.
* Crear otra configuración de Firebase.
* Duplicar autenticación.
* Instalar dependencias innecesarias.
* Crear un sistema de partículas pesado.
* Utilizar librerías grandes solamente para el background si puede realizarse con CSS/Canvas.
* Romper rutas existentes.
* Cambiar el comportamiento del Home.

---

# 27. Performance

La animación debe ser optimizada.

Prioridades:

```text
Desktop
   ↓
60 FPS aproximadamente

Mobile
   ↓
animación reducida
```

Implementar:

* `requestAnimationFrame` si se utiliza Canvas.
* Limpieza de listeners.
* Limpieza del Canvas.
* Reducción de partículas en mobile.
* `devicePixelRatio` controlado.
* Pausar animación cuando la pestaña no esté visible cuando sea conveniente.

Considerar:

```javascript
prefers-reduced-motion
```

Si el usuario tiene activada la reducción de movimiento, disminuir o desactivar animaciones.

---

# 28. Accesibilidad

Los inputs deben tener:

```text
label
aria-label cuando sea necesario
autocomplete
```

Usar:

```text
autocomplete="name"
autocomplete="email"
autocomplete="new-password"
```

Los botones deben ser accesibles mediante teclado.

Mantener suficiente contraste.

No depender exclusivamente del color para mostrar errores.

---

# 29. Estados de UI

El formulario debe contemplar:

### Inicial

```text
Crear cuenta
```

### Loading

```text
Creando cuenta...
```

El botón debe quedar temporalmente deshabilitado para evitar registros duplicados.

### Error

Mostrar mensaje elegante debajo o cerca del formulario.

### Éxito

Mostrar confirmación visual y continuar con el flujo existente.

### Google loading

Mostrar:

```text
Conectando con Google...
```

sin bloquear permanentemente la interfaz.

---

# 30. Ruta

Crear una ruta independiente para el registro.

Ejemplo:

```text
/registro
```

o la convención equivalente utilizada por el proyecto.

No modificar las rutas actuales.

El botón:

```text
Inicio
```

debe llevar al Home.

---

# 31. Resultado visual esperado

La pantalla final debe transmitir:

```text
WorshipSaint
       +
Tecnología
       +
Elegancia
       +
Conciencia
       +
Minimalismo
```

Debe sentirse como una experiencia premium.

No debe parecer:

```text
❌ Bootstrap
❌ Material UI genérico
❌ Login empresarial
❌ Plantilla gratuita
❌ Dashboard
```

Debe parecer:

```text
✓ WorshipSaint
✓ Moderno
✓ Elegante
✓ Tecnológico
✓ Espiritual
✓ Minimalista
✓ Premium
```

---

# 32. Checklist de implementación

* [ ] Crear nueva página de registro.
* [ ] Mantener navbar exclusiva para registro.
* [ ] Centrar logo + WorshipSaint.
* [ ] Agregar botón `Inicio`.
* [ ] Crear nuevo background de partículas.
* [ ] Optimizar partículas para desktop.
* [ ] Optimizar partículas para mobile.
* [ ] Crear composición central.
* [ ] Crear título y subtítulo.
* [ ] Crear input de nombre.
* [ ] Crear input de correo.
* [ ] Crear input de contraseña.
* [ ] Crear botón `Crear cuenta`.
* [ ] Crear separador `o`.
* [ ] Crear botón `Registrarse con Google`.
* [ ] Reutilizar Firebase existente.
* [ ] Reutilizar Authentication existente.
* [ ] Reutilizar Firestore existente si corresponde.
* [ ] Agregar estados loading.
* [ ] Agregar estados error.
* [ ] Agregar estado éxito.
* [ ] Agregar validaciones.
* [ ] Agregar responsive.
* [ ] Agregar accesibilidad.
* [ ] Agregar `prefers-reduced-motion`.
* [ ] Verificar que no exista overflow horizontal.
* [ ] Verificar desktop.
* [ ] Verificar tablet.
* [ ] Verificar mobile.
* [ ] Verificar que Home siga funcionando.
* [ ] Verificar que las demás páginas no hayan sido afectadas.

---

# 33. Regla principal para la implementación

> **Crear una experiencia de registro completamente nueva, pero visualmente perteneciente a WorshipSaint.**

La prioridad debe ser:

```text
1. Identidad visual
2. Experiencia de usuario
3. Responsive
4. Performance
5. Integración con Firebase
6. Mantenibilidad
```

No realizar modificaciones fuera del alcance de esta nueva página.

Antes de finalizar, revisar el proyecto existente y utilizar sus componentes, assets, tipografía, configuración Firebase y estilos cuando sea posible.

El resultado debe quedar listo para producción y no simplemente como un prototipo visual.
