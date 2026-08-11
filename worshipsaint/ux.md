# README — Rediseño Visual del Chatbot WorshipBot: Voz + Texto

## 🎯 Objetivo

Modificar **únicamente la interfaz visual del frontend actual de WorshipBot**, sin alterar la lógica existente del chatbot, servicios, APIs, manejo de mensajes ni funcionalidades internas.

El objetivo principal es que el usuario **perciba claramente que puede interactuar mediante texto y voz**, haciendo que la voz sea una capacidad principal y no una función secundaria escondida.

La interfaz actual funciona, pero la opción de voz no tiene suficiente presencia visual. Se requiere una experiencia más moderna, intuitiva y clara.

---

# 1. Problema actual

Actualmente el chatbot tiene:

* Campo para escribir mensajes.
* Botón de micrófono.
* Botón "Enviar".
* Botón superior "Voz".
* Mensajes del asistente y usuario.

Sin embargo, el usuario puede no entender fácilmente:

* Que puede hablar con WorshipBot.
* Que las respuestas del bot pueden reproducirse por voz.
* Que puede elegir entre **texto, voz o ambos**.
* Qué está ocurriendo cuando una respuesta está siendo reproducida.
* Qué opciones tiene disponibles sobre cada mensaje.

La nueva interfaz debe solucionar esto **sin modificar la funcionalidad existente**.

---

# 2. Objetivo UX principal

La interfaz debe comunicar inmediatamente:

> **"Puedes hablar con WorshipBot o escribirle. También puedes escuchar sus respuestas."**

La voz debe convertirse en una capacidad visible y recurrente dentro de la conversación.

No debe depender únicamente del botón superior `🔊 Voz`.

---

# 3. Regla principal del nuevo diseño

Cada mensaje generado por WorshipBot debe tener debajo una pequeña barra de acciones.

Ejemplo:

```text
┌──────────────────────────────────────┐
│ Hola, ¿cómo estás?                   │
│                                      │
│ Estoy aquí para ayudarte...          │
│                                      │
│ ──────────────────────────────────── │
│ 🔊 Voz       Aa Texto       ◉ Ambos  │
└──────────────────────────────────────┘
```

Las opciones deben aparecer **debajo de cada respuesta del asistente**.

### Opciones mínimas

* 🔊 **Voz**
* Aa **Texto**
* 🔊 Aa **Ambos**

Estas opciones deben tener una apariencia de controles secundarios, elegantes y discretos.

---

# 4. Comportamiento visual

## 4.1 Voz

Cuando el usuario seleccione:

**🔊 Voz**

La interfaz debe comunicar visualmente:

```text
🔊 Reproduciendo...
```

o

```text
🔊 Escuchar respuesta
```

Dependiendo del estado actual.

Cuando esté reproduciendo:

```text
🔊  Reproduciendo
     ━━━━━━━━●━━━━
```

Debe existir un estado visual claro para:

* Disponible
* Reproduciendo
* Pausado
* Detenido
* Cargando

**No implementar nueva lógica de audio.**

Solo preparar visualmente los estados para conectarse con la lógica existente.

---

# 5. Opción "Texto"

El botón:

```text
Aa Texto
```

debe representar claramente que la respuesta puede visualizarse como texto.

Por ejemplo:

```text
┌────────────┐
│ Aa Texto   │
└────────────┘
```

Debe tener un estado:

### Activo

```text
Aa Texto
```

### Inactivo

```text
Aa Texto
```

La diferencia debe ser visual mediante:

* Background
* Borde
* Opacidad
* Icono
* Estado seleccionado

No utilizar colores excesivamente llamativos.

---

# 6. Opción "Voz + Texto"

Agregar una tercera opción:

```text
🔊 Aa Ambos
```

Esta representa:

> Mostrar la respuesta en texto y reproducirla mediante voz.

Debe ser visualmente fácil de identificar.

Ejemplo:

```text
[ 🔊 Voz ] [ Aa Texto ] [ 🔊 Aa Ambos ]
```

---

# 7. Barra de acciones por mensaje

Cada respuesta del bot debe tener:

```text
Mensaje del asistente

──────────────────────────────

🔊 Voz    Aa Texto    🔊 Aa Ambos
```

La barra debe:

* Ser compacta.
* No competir visualmente con el mensaje.
* Estar integrada dentro de la tarjeta/burbuja.
* Tener separación clara del contenido.
* Utilizar iconos.
* Tener estados hover.
* Tener estados active.
* Ser responsive.

---

# 8. Diseño visual

Utilizar como referencia visual la interfaz proporcionada en la imagen.

Actualmente la interfaz tiene una identidad:

* Marrón oscuro.
* Beige.
* Crema.
* Dorado.
* Blanco.
* Bordes redondeados.

Mantener esta identidad, pero llevarla a un nivel más profesional.

### Sensación buscada

**WorshipBot debe sentirse:**

* Premium
* Cálido
* Moderno
* Espiritual
* Tecnológico
* Humano
* Minimalista

Evitar que parezca:

* Un chatbot genérico.
* Una interfaz administrativa.
* Una aplicación excesivamente tecnológica.
* Un reproductor de audio tradicional.

---

# 9. Header

Actualmente existe:

```text
WorshipBot
Asistente de soporte

        🔊 Voz   −   ↗   ×
```

Mantener el concepto, pero mejorar jerarquía.

El botón:

```text
🔊 Voz
```

debe convertirse en un indicador importante del modo de interacción.

Ejemplo conceptual:

```text
┌──────────────────────────────────────┐
│ WorshipBot                  🔊 Voz   │
│ Asistente de soporte        ● Activo │
└──────────────────────────────────────┘
```

El usuario debe entender que la voz está disponible.

---

# 10. Input inferior

La parte inferior debe tener una jerarquía mucho más clara.

Actualmente:

```text
[ Escribe o graba tu mensaje... ] [ 🎙 ] [ Enviar ]
```

Rediseñarla visualmente para que las dos formas de interacción sean evidentes.

Propuesta:

```text
┌──────────────────────────────────────┐
│                                      │
│  Escribe tu mensaje...        🎙     │
│                                      │
│                         [ Enviar ]   │
└──────────────────────────────────────┘
```

O una composición equivalente.

El micrófono debe tener suficiente presencia visual.

---

# 11. Estado de grabación

Cuando el usuario active el micrófono, la interfaz debe poder representar visualmente:

```text
🔴 Grabando...

     00:07

████████████████
```

y:

```text
      🎙
   Grabando
```

Agregar animación sutil:

* Pulsación.
* Glow.
* Ondas.
* Indicador de actividad.

**Importante:** solamente modificar UI.

No desarrollar ni modificar el sistema de reconocimiento de voz.

---

# 12. Mensajes del usuario

Los mensajes del usuario deben mantenerse visualmente diferenciados.

Ejemplo:

```text
                  ┌─────────────────────┐
                  │ Hola, ¿cómo estás?  │
                  └─────────────────────┘
```

No necesitan necesariamente los mismos controles que los mensajes del asistente.

La prioridad de las acciones de voz/texto debe estar en las respuestas de WorshipBot.

---

# 13. Mensajes del asistente

Diseñar las respuestas del asistente como tarjetas/burbujas más estructuradas.

Ejemplo:

```text
┌─────────────────────────────────────┐
│                                     │
│ Hola de nuevo. Estoy muy bien,      │
│ gracias por preguntar.              │
│                                     │
│ Me siento afortunado de poder       │
│ conectarme contigo...               │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 🔊 Voz   Aa Texto   🔊 Aa Ambos     │
│                                     │
└─────────────────────────────────────┘
```

---

# 14. Microinteracciones

Agregar microinteracciones únicamente mediante CSS/JS visual cuando sea necesario.

### Hover

Los botones deben:

* Cambiar ligeramente de fondo.
* Elevarse mínimamente.
* Mostrar tooltip cuando sea necesario.

### Active

Cuando se seleccione:

```text
🔊 Voz
```

debe existir una señal visual inequívoca.

### Reproducción

Mientras se reproduce audio:

```text
🔊 Reproduciendo
```

puede utilizar:

* Animación de ondas.
* Barras de audio.
* Pulsación suave.
* Indicador circular.

No hacer animaciones exageradas.

---

# 15. Tooltip

Los iconos deben tener tooltip.

Ejemplos:

```text
🔊
Escuchar respuesta
```

```text
Aa
Ver respuesta en texto
```

```text
🔊 Aa
Escuchar y ver respuesta
```

Esto es especialmente importante para iconos que puedan ser ambiguos.

---

# 16. Responsive Design

La interfaz debe funcionar correctamente en:

### Desktop

Controles completos:

```text
🔊 Voz     Aa Texto     🔊 Aa Ambos
```

### Tablet

Reducir espacios manteniendo los labels.

### Mobile

Si no existe suficiente espacio:

```text
🔊
Aa
🔊Aa
```

o utilizar botones compactos.

Pero **no eliminar la funcionalidad ni esconder las opciones importantes**.

---

# 17. Scroll y conversación

La nueva UI no debe romper el comportamiento actual del chat.

Mantener:

* Scroll de conversación.
* Mensajes.
* Input inferior.
* Header fijo.
* Área de conversación.
* Scroll automático cuando corresponda.

Las acciones de cada mensaje deben permanecer asociadas visualmente a ese mensaje.

---

# 18. Arquitectura visual

No crear una nueva arquitectura de aplicación.

Trabajar sobre:

```text
Frontend actual
│
├── Chat
│   ├── Header
│   ├── Messages
│   │   ├── UserMessage
│   │   └── AssistantMessage
│   │       └── MessageActions
│   │
│   └── Input
│       ├── TextInput
│       ├── VoiceButton
│       └── SendButton
```

Si el proyecto ya tiene componentes equivalentes, **reutilizarlos**.

No duplicar componentes.

---

# 19. Componente conceptual `MessageActions`

Crear o adaptar visualmente un componente equivalente a:

```text
MessageActions
```

Responsabilidad:

> Mostrar las opciones disponibles para interactuar con una respuesta del asistente.

Visualmente:

```text
[ 🔊 Voz ] [ Aa Texto ] [ 🔊 Aa Ambos ]
```

Debe soportar estados:

```text
default
hover
active
disabled
loading
playing
paused
```

---

# 20. No modificar lógica

### PROHIBIDO

Modificar:

* API.
* Endpoints.
* Servicios.
* Sistema TTS.
* Sistema STT.
* Lógica de generación de respuestas.
* Prompts.
* Backend.
* Manejo de audio.
* Manejo de texto.
* Autenticación.
* Persistencia.
* Estado funcional existente.

El trabajo es:

> **100% frontend visual/UX/UI.**

Si para representar un estado visual es necesario utilizar una variable existente, reutilizarla.

No crear una segunda implementación funcional de audio.

---

# 21. Accesibilidad

Los controles deben tener:

* `aria-label`.
* Estados accesibles.
* Focus visible.
* Tamaño mínimo apropiado para touch.
* Contraste adecuado.
* Tooltips.

Ejemplos:

```text
aria-label="Escuchar respuesta"
aria-label="Mostrar respuesta como texto"
aria-label="Escuchar y mostrar respuesta"
```

---

# 22. Animaciones

Utilizar animaciones pequeñas y elegantes.

Ejemplos:

```text
hover: 150–200ms
active: 100–150ms
```

Evitar:

* Animaciones constantes.
* Parpadeos.
* Exceso de movimiento.
* Efectos gaming.
* Gradientes excesivos.

La sensación debe ser:

> **Premium + tranquila + tecnológica + espiritual.**

---

# 23. Jerarquía de interacción

La interfaz debe comunicar esta prioridad:

### 1. Hablar

🎙️ **Habla con WorshipBot**

### 2. Escribir

⌨️ **Escribe tu mensaje**

### 3. Escuchar

🔊 **Escucha la respuesta**

### 4. Leer

Aa **Lee la respuesta**

### 5. Ambos

🔊 Aa **Escucha + lee**

---

# 24. Resultado esperado

La nueva interfaz debe hacer que un usuario que nunca haya utilizado WorshipBot entienda inmediatamente:

> **Puedo escribirle.**

> **Puedo hablarle.**

> **WorshipBot puede responderme por voz.**

> **Puedo escuchar cada respuesta.**

> **Puedo elegir voz, texto o ambos.**

Todo esto debe entenderse **sin necesidad de instrucciones externas**.

---

# 25. Criterio de aceptación

La implementación será considerada correcta cuando:

* [ ] La interfaz conserve la funcionalidad actual.
* [ ] No se modifique backend.
* [ ] No se modifiquen APIs.
* [ ] No se modifique el servicio TTS.
* [ ] No se modifique el servicio STT.
* [ ] La opción de voz tenga mayor presencia.
* [ ] El micrófono sea visualmente evidente.
* [ ] Cada respuesta del asistente tenga acciones debajo.
* [ ] Exista `Voz`.
* [ ] Exista `Texto`.
* [ ] Exista `Voz + Texto`.
* [ ] Existan estados visuales.
* [ ] Existan hover states.
* [ ] Existan estados de reproducción.
* [ ] Exista feedback visual al grabar.
* [ ] La interfaz sea responsive.
* [ ] La interfaz mantenga la identidad WorshipSaint/WorshipBot.
* [ ] La experiencia sea limpia y premium.
* [ ] No existan controles innecesarios.
* [ ] No se rompa el scroll del chat.
* [ ] No se rompa el input.
* [ ] No se duplique lógica existente.

---

# 26. Prompt para la IA desarrolladora

> **Actúa como Senior Frontend Engineer + UX/UI Designer especializado en interfaces conversacionales de voz.**
>
> Analiza el frontend existente de WorshipBot y realiza **exclusivamente una mejora visual y de UX/UI**.
>
> El objetivo principal es hacer que el usuario tenga mucho más presente que puede interactuar con WorshipBot mediante **voz y texto**, y que también puede escuchar las respuestas del asistente.
>
> **NO MODIFIQUES LA LÓGICA EXISTENTE.**
>
> No cambies APIs, endpoints, backend, servicios TTS, STT, prompts, generación de respuestas, autenticación, persistencia ni lógica funcional.
>
> Trabaja únicamente sobre la capa visual/frontend.
>
> ---
>
> ### Cambio principal
>
> Cada mensaje generado por WorshipBot debe mostrar debajo una barra de acciones:
>
> **🔊 Voz | Aa Texto | 🔊 Aa Ambos**
>
> Estas opciones deben integrarse visualmente dentro de cada burbuja de respuesta.
>
> Deben tener estados:
>
> * Default
> * Hover
> * Active
> * Disabled
> * Loading
> * Playing
> * Paused
>
> La interfaz debe reutilizar la lógica/estados existentes siempre que sea posible.
>
> ---
>
> ### Voz
>
> La voz debe dejar de parecer una función secundaria.
>
> El usuario debe identificar inmediatamente:
>
> **"Puedo hablar con WorshipBot."**
>
> y:
>
> **"Puedo escuchar la respuesta de WorshipBot."**
>
> El botón de micrófono debe tener mayor presencia visual.
>
> El header también debe comunicar claramente que la función de voz está disponible.
>
> ---
>
> ### Durante grabación
>
> Crear un estado visual elegante:
>
> `🔴 Grabando...`
>
> con indicador de actividad, animación sutil y contador si el frontend ya dispone de dicha información.
>
> No implementar un nuevo sistema de grabación.
>
> ---
>
> ### Durante reproducción
>
> Mostrar visualmente:
>
> `🔊 Reproduciendo`
>
> y utilizar una animación sutil como ondas o barras de audio.
>
> No crear una nueva lógica de reproducción.
>
> ---
>
> ### Diseño
>
> Mantener la identidad visual actual basada en:
>
> * Marrón oscuro
> * Beige
> * Crema
> * Dorado
> * Blanco
> * Bordes redondeados
>
> Llevarla a un nivel más premium.
>
> La interfaz debe transmitir:
>
> **WorshipBot = humano + espiritual + tecnológico + moderno + cálido.**
>
> Evitar apariencia de chatbot genérico.
>
> ---
>
> ### Referencia visual
>
> Utiliza la captura proporcionada como referencia de la interfaz actual.
>
> No copies literalmente el diseño. Analiza sus problemas de jerarquía visual y mejora la experiencia.
>
> ---
>
> ### Importante
>
> Antes de modificar archivos:
>
> 1. Analiza la estructura actual.
> 2. Identifica los componentes del chat.
> 3. Identifica dónde se renderizan los mensajes.
> 4. Identifica el componente/input de voz existente.
> 5. Identifica los estados existentes de audio.
> 6. Reutiliza componentes y estilos cuando sea posible.
>
> No crear una arquitectura paralela.
>
> ---
>
> ### Resultado esperado
>
> La interfaz final debe sentirse como un **chatbot conversacional multimodal**, donde texto y voz tengan la misma importancia.
>
> La experiencia ideal es:
>
> ```text
> Usuario escribe o habla
>          ↓
> WorshipBot responde
>          ↓
> ┌──────────────────────────────┐
> │ Respuesta del asistente      │
> │                              │
> │ Contenido de la respuesta    │
> │                              │
> │ ──────────────────────────── │
> │ 🔊 Voz  Aa Texto  🔊 Aa Ambos│
> └──────────────────────────────┘
> ```
>
> El resultado debe ser **limpio, intuitivo, responsive, accesible, premium y visualmente coherente con WorshipBot**.
>
> **No agregues funcionalidades nuevas de backend. El alcance es exclusivamente frontend + UX/UI.**
