Claro. El problema que señalas es principalmente de **proporción y responsive del nuevo botón**. Este README/prompt le indica a la IA que ajuste **solo ese botón**, tomando como referencia las dos capturas.

````md
# AJUSTE RESPONSIVE — BOTÓN "REGÍSTRATE CON GOOGLE"

## OBJETIVO

Corregir únicamente el tamaño, anchura y comportamiento responsive del botón:

> Regístrate con Google

El botón ya existe y visualmente funciona.

NO crear otro botón.

NO modificar su lógica.

NO modificar Firebase.

NO modificar el resto de la página.

NO modificar los botones:

- Explorar WorshipSaint
- Iniciar Proyecto Web

NO modificar navbar.

NO modificar hero.

NO modificar textos.

NO modificar fondos.

NO modificar animaciones existentes.

NO modificar el botón "Habla conmigo".

---

# 1. PROBLEMA ACTUAL

Actualmente el botón:

```text
Regístrate con Google
````

ocupa demasiado espacio horizontal.

En Desktop:

* El botón es excesivamente ancho.
* Parece una barra horizontal.
* No mantiene la misma proporción visual que los botones principales.

En Mobile:

* También ocupa demasiado ancho.
* Se extiende casi de lado a lado.
* Visualmente domina demasiado la parte inferior del hero.
* Debe tener una anchura mucho más controlada.

---

# 2. DESKTOP

En versión Desktop reducir considerablemente la anchura.

Actualmente visualmente se aproxima a:

```text
┌──────────────────────────────────────────────────────────────┐
│              Google   Regístrate con Google                  │
└──────────────────────────────────────────────────────────────┘
```

Debe convertirse en algo más compacto:

```text
        ┌────────────────────────────────┐
        │  Google  Regístrate con Google │
        └────────────────────────────────┘
```

## Anchura recomendada

Utilizar una anchura controlada, aproximadamente:

```css
width: 320px;
max-width: 100%;
```

Puede utilizarse:

```css
width: min(320px, 90%);
```

si esto encaja mejor con la arquitectura actual.

NO utilizar:

```css
width: 100%;
```

en Desktop.

NO utilizar una anchura basada en todo el contenedor del hero.

---

# 3. MOBILE

En Mobile debe reducirse todavía más.

El botón debe adaptarse al ancho de la pantalla sin convertirse en una barra gigante.

Objetivo visual:

```text
     ┌──────────────────────────────┐
     │ Google  Regístrate con Google│
     └──────────────────────────────┘
```

No:

```text
┌──────────────────────────────────────┐
│       Google Regístrate con Google   │
└──────────────────────────────────────┘
```

## Mobile

Usar una anchura aproximada:

```css
width: min(300px, 82vw);
```

o una solución equivalente basada en el sistema responsive existente.

El botón debe conservar:

* margen lateral.
* espacio alrededor.
* proporción visual.
* buena legibilidad.

---

# 4. ALTURA

No modificar innecesariamente la altura actual.

Debe mantenerse compacto.

Recomendación:

```css
min-height: 52px;
```

o adaptar la altura al diseño existente.

En mobile puede utilizarse:

```css
min-height: 52px;
```

El objetivo es que sea cómodo para tocar con el dedo.

---

# 5. POSICIÓN

Mantener el botón debajo de:

```text
Explorar WorshipSaint
Iniciar Proyecto Web
```

No cambiar la estructura vertical existente.

Debe permanecer centrado horizontalmente.

Ejemplo:

```text
        Explorar WorshipSaint

        Iniciar Proyecto Web

        Regístrate con Google
```

No mover:

```text
SCROLL
```

ni modificar su funcionamiento.

---

# 6. ESPACIADO

El botón debe tener una separación visual adecuada respecto a:

```text
Iniciar Proyecto Web
```

Evitar que quede pegado.

Usar el sistema de spacing existente.

Si actualmente existe:

```css
gap
margin
padding
```

reutilizarlo antes de crear nuevos valores.

---

# 7. RESPONSIVE

Crear únicamente los ajustes necesarios para:

### Desktop

```text
>= 1024px
```

Botón:

```css
width: 320px;
max-width: 100%;
```

### Tablet

```text
768px - 1023px
```

Botón:

```css
width: 300px;
max-width: 90%;
```

### Mobile

```text
< 768px
```

Botón:

```css
width: min(300px, 82vw);
max-width: 100%;
```

Los valores anteriores son referencias.

Si el proyecto ya tiene breakpoints establecidos, UTILIZAR LOS BREAKPOINTS EXISTENTES.

NO crear un sistema responsive paralelo.

---

# 8. IMPORTANTE — NO MODIFICAR EL CONTENEDOR PADRE

No solucionar el problema cambiando:

```text
hero
hero-content
container
buttons-container
section
```

si eso afecta otros elementos.

La corrección debe aplicarse preferiblemente directamente al componente:

```text
GoogleRegisterButton
```

o a su clase específica.

Por ejemplo:

```css
.google-register-button {
    width: min(320px, 90%);
}
```

Y mediante media queries:

```css
@media (max-width: 768px) {
    .google-register-button {
        width: min(300px, 82vw);
    }
}
```

Adaptar la sintaxis al proyecto.

---

# 9. NO USAR

No utilizar:

```css
width: 100%;
```

para el botón.

No utilizar:

```css
flex: 1;
```

No hacer que ocupe todo el ancho del contenedor.

No modificar el ancho de:

```text
Explorar WorshipSaint
Iniciar Proyecto Web
```

No modificar el ancho del hero.

---

# 10. ICONO GOOGLE

Mantener el icono actual de Google.

No cambiarlo.

No aumentar innecesariamente su tamaño.

Debe permanecer aproximadamente:

```css
width: 20px;
height: 20px;
```

El icono y el texto deben permanecer centrados como grupo.

Ejemplo:

```text
        [ G ]  Regístrate con Google
```

---

# 11. TEXTO

Mantener exactamente:

> Regístrate con Google

No cambiar a:

* Registrarse con Google
* Crear cuenta con Google
* Continuar con Google
* Google Login

Debe permanecer:

**Regístrate con Google**

---

# 12. RESPONSIVE VISUAL

Validar especialmente las siguientes resoluciones:

### Desktop

```text
1920x1080
1440x900
1366x768
```

### Tablet

```text
1024x768
768x1024
```

### Mobile

```text
390x844
375x812
360x800
```

---

# 13. CRITERIO VISUAL

El botón debe sentirse como:

**un tercer CTA compacto**

y NO como:

**una barra de navegación o contenedor de pantalla completa.**

Jerarquía:

```text
┌─────────────────────────────┐
│   Explorar WorshipSaint     │
└─────────────────────────────┘

┌─────────────────────────────┐
│   Iniciar Proyecto Web      │
└─────────────────────────────┘

        ┌───────────────────────┐
        │ G Regístrate con Google│
        └───────────────────────┘
```

El tercer botón debe tener una presencia visual menor que los CTA principales.

---

# 14. REGLA DE NO REGRESIÓN

Después del cambio verificar:

* Desktop correcto.
* Mobile correcto.
* Tablet correcto.
* Botón centrado.
* Texto centrado.
* Icono centrado.
* No overflow horizontal.
* No scroll horizontal.
* No afecta al hero.
* No afecta al navbar.
* No afecta "Habla conmigo".
* No afecta "Explorar WorshipSaint".
* No afecta "Iniciar Proyecto Web".
* No afecta el fondo.
* No afecta las animaciones.
* No afecta el responsive existente.

---

# 15. CAMBIAR ÚNICAMENTE

La modificación debe limitarse a:

```text
GoogleRegisterButton
```

y sus estilos específicos.

No modificar ningún otro componente salvo que sea absolutamente necesario para integrar correctamente el botón.

---

# RESULTADO FINAL

El botón debe pasar de ser una barra:

```text
┌───────────────────────────────────────────────────────────┐
│                 Regístrate con Google                     │
└───────────────────────────────────────────────────────────┘
```

a un botón compacto y premium:

```text
          ┌──────────────────────────────┐
          │  G  Regístrate con Google    │
          └──────────────────────────────┘
```

Debe verse correctamente tanto en **PC como en móvil**, manteniendo exactamente el diseño actual del resto de WorshipSaint.

```

**Punto clave:** en tu captura de PC yo lo dejaría alrededor de **320 px**, y en móvil alrededor de **82vw con máximo de 300 px**. Así deja de parecer una barra y pasa a funcionar visualmente como un tercer CTA.
```
