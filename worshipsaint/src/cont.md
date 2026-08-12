# Prompt `.md` — Ajuste exclusivo del botón Google en móvil

````md
# AJUSTE RESPONSIVE — BOTÓN "REGÍSTRATE CON GOOGLE"

## Objetivo

Realizar **únicamente un ajuste visual en la versión móvil** de la interfaz mostrada.

En dispositivos móviles:

1. Eliminar/ocultar visualmente el botón:
   **"Explorar WorshipSaint"**
2. Dar mayor protagonismo visual al botón:
   **"Regístrate con Google"**
3. Mantener exactamente igual el resto de la interfaz, diseño, colores, fondos, tipografías, animaciones y lógica existente.

---

## RESTRICCIÓN PRINCIPAL

⚠️ **NO modificar ningún otro aspecto del proyecto.**

La modificación debe limitarse exclusivamente al comportamiento visual responsive de estos botones.

### NO modificar:

- Colores globales.
- Fondos.
- Gradientes.
- Tipografías.
- Tamaños de títulos.
- Textos existentes.
- Animaciones.
- Navbar.
- Hero.
- Footer.
- Chat.
- Iconos.
- Espaciados generales.
- Layout de escritorio.
- Lógica de autenticación.
- Firebase.
- Google Authentication.
- Eventos `onClick`.
- Funciones JavaScript/React.
- APIs.
- Rutas.
- Componentes no relacionados.
- Dependencias.
- Estructura del proyecto.
- Configuración de build.
- Variables de entorno.
- Otros archivos que no sean estrictamente necesarios.

**No crear lógica adicional.**

---

# COMPORTAMIENTO EN MÓVIL

Utilizar exclusivamente estilos responsive para conseguir el resultado.

En pantallas móviles:

### 1. Ocultar

Ocultar:

```text
Explorar WorshipSaint
````

El botón no debe ocupar espacio visual en el layout móvil.

### 2. Priorizar Google

El botón:

```text
Regístrate con Google
```

debe adquirir mayor protagonismo visual.

Debe mantenerse integrado con el diseño actual de WorshipSaint.

El objetivo visual es que sea claramente una de las acciones principales de la pantalla móvil.

---

# ESTILO DEL BOTÓN GOOGLE

Partir del botón existente.

**No rediseñarlo desde cero.**

Modificar únicamente los estilos necesarios para darle mayor prioridad visual en móvil.

Debe conservar:

* Icono de Google.
* Texto "Regístrate con Google".
* Funcionalidad actual.
* Evento actual.
* Integración actual.
* Posición dentro de la estructura existente.

Puede ajustarse únicamente:

* Ancho.
* Altura.
* Fondo.
* Contraste.
* Border.
* Border-radius.
* Sombra.
* Peso visual.

El nuevo estilo debe ser coherente con la estética existente mostrada en la captura.

### Importante

No introducir colores completamente nuevos que rompan la paleta existente.

El botón debe destacar utilizando la **misma identidad visual actual**, pero con mayor contraste/prioridad.

---

# RESPONSIVE

Aplicar el cambio exclusivamente mediante breakpoint móvil.

Ejemplo conceptual:

```css
@media (max-width: 768px) {
    /* únicamente ajustes del botón Google */
}
```

El breakpoint puede adaptarse al sistema responsive que ya utiliza el proyecto.

**No crear un nuevo sistema responsive.**

---

# ESCRITORIO

En desktop:

**NO CAMBIAR NADA.**

El botón:

```text
Explorar WorshipSaint
```

debe permanecer visible exactamente como está actualmente.

El botón:

```text
Regístrate con Google
```

debe conservar su apariencia actual en desktop.

---

# MOBILE — RESULTADO ESPERADO

La jerarquía visual debe quedar aproximadamente así:

```text
        [ contenido existente ]

        [ Iniciar Proyecto Web ]

              SCROLL

   [  REGÍSTRATE CON GOOGLE  ]
```

El botón:

```text
Explorar WorshipSaint
```

NO debe aparecer en móvil.

El botón Google debe tener suficiente presencia visual para que el usuario lo identifique fácilmente como acción principal.

---

# REGLA DE NO REGRESIÓN

Antes de modificar:

1. Identificar exactamente dónde se renderizan ambos botones.
2. Identificar sus clases actuales.
3. Identificar qué estilos existentes los controlan.
4. Modificar únicamente lo estrictamente necesario.
5. No duplicar componentes.
6. No crear nuevas funciones.
7. No modificar la lógica existente.

Después de modificar:

* Verificar desktop.
* Verificar móvil.
* Confirmar que Google sigue ejecutando exactamente la misma acción.
* Confirmar que "Explorar WorshipSaint" sigue funcionando en desktop.
* Confirmar que ningún otro elemento visual fue alterado.

---

# ARCHIVOS

Modificar **únicamente el archivo o archivos estrictamente necesarios** para conseguir este cambio.

No realizar refactorizaciones.

No limpiar código no relacionado.

No cambiar nombres de clases existentes si no es necesario.

No crear archivos adicionales.

---

# CRITERIO FINAL

La implementación será considerada correcta únicamente si:

### Desktop

```text
Explorar WorshipSaint     → visible
Regístrate con Google      → sin cambios funcionales ni visuales relevantes
```

### Mobile

```text
Explorar WorshipSaint     → oculto
Regístrate con Google      → visualmente priorizado
```

Todo lo demás debe permanecer exactamente igual.

**IMPORTANTE: esto es un cambio exclusivamente visual/responsive. NO agregar lógica, autenticación, Firebase, eventos ni funcionalidades nuevas.**

```
```
