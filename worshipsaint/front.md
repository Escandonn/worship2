# README — Limitar reproducción de audio MP3 en React

## Objetivo

Modificar el reproductor de audio existente en **React** para que, cuando reciba un archivo o URL `.mp3`, el usuario pueda escuchar el audio normalmente **excepto los últimos 2.8 segundos**.

### Regla principal

Si el audio dura:

```text
10 segundos
```

el usuario solamente debe poder escuchar:

```text
0s ──────────────── 7.2s | 8s | 9s | 10s
       REPRODUCIR        ❌    ❌    ❌
```

Los últimos **2.8 segundos no deben reproducirse**.

---

# ⚠️ REQUISITO CRÍTICO

La modificación debe ser **aislada**.

### NO modificar:

* Backend.
* API.
* Endpoints.
* Servicios existentes.
* Sistema de generación de audio.
* Formato de respuesta de la API.
* Autenticación.
* Base de datos.
* Astro.
* Rutas.
* Componentes que no estén relacionados con el reproductor.
* Estilos globales.
* Tailwind global.
* Configuración del proyecto.
* Dependencias existentes innecesariamente.
* Lógica de mensajes del chatbot.
* Estado global de la aplicación.
* Funcionalidad de texto.
* Funcionalidad de voz existente.
* Diseño actual de la interfaz.

### SÍ modificar únicamente:

El componente o servicio React responsable de **reproducir el MP3**.

---

# Comportamiento esperado

El reproductor actualmente recibe un audio, por ejemplo:

```js
audioUrl
```

El audio puede provenir de:

* URL.
* Blob convertido a URL.
* Archivo MP3.
* Respuesta de una API.

La implementación debe funcionar con el mecanismo que actualmente utiliza el proyecto.

## Ejemplo

Si:

```text
audio.duration = 15 segundos
```

el límite de reproducción será:

```text
13 segundos
```

Cuando `currentTime` llegue a aproximadamente `13 segundos`:

1. Detener reproducción.
2. No permitir continuar hacia los últimos 2.8 segundos.
3. Mantener el resto del funcionamiento actual.
4. No modificar físicamente el archivo MP3.

---

# Implementación recomendada

Utilizar las APIs nativas del navegador:

```js
HTMLAudioElement
```

y:

```js
currentTime
duration
timeupdate
loadedmetadata
```

No instalar una librería adicional para esta funcionalidad.

---

# Componente de referencia

Si el proyecto ya tiene un componente de audio, adaptar la lógica existente en lugar de crear otro reproductor innecesariamente.

La lógica base debe seguir este patrón:

```jsx
import { useEffect, useRef } from "react";

export default function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const stopBeforeEnd = () => {
      if (!Number.isFinite(audio.duration)) return;

      // No aplicar la lógica a audios de 2.8 segundos o menos
      if (audio.duration <= 2.8) return;
      const playbackLimit = audio.duration - 2.8;

      if (audio.currentTime >= playbackLimit) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    audio.addEventListener("timeupdate", stopBeforeEnd);

    return () => {
      audio.removeEventListener("timeupdate", stopBeforeEnd);
    };
  }, [audioUrl]);

  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      controls
      preload="metadata"
    />
  );
}
```

---

# Importante: no eliminar físicamente el MP3

NO utilizar:

* FFmpeg.
* pydub.
* procesamiento del servidor.
* conversión del archivo.
* modificación del Blob original.

El objetivo es únicamente **limitar la reproducción desde React**.

El MP3 original debe permanecer intacto.

---

# Evitar errores con audios cortos

Debe existir protección para audios cuya duración sea menor o igual a 2.8 segundos.

Ejemplo:

```text
Audio: 1.5 segundos
```

No debe ejecutarse:

```js
duration - 2
```

como límite de reproducción.

La lógica debe ignorar el recorte si:

```js
audio.duration <= 2
```

---

# Evitar memory leaks

El evento:

```js
timeupdate
```

debe eliminarse cuando el componente se desmonta o cuando cambia el audio.

Correcto:

```js
useEffect(() => {
  const audio = audioRef.current;

  if (!audio) return;

  const stopBeforeEnd = () => {
    // lógica
  };

  audio.addEventListener("timeupdate", stopBeforeEnd);

  return () => {
    audio.removeEventListener("timeupdate", stopBeforeEnd);
  };
}, [audioUrl]);
```

No dejar listeners duplicados.

---

# Compatibilidad con cambio de audio

El reproductor debe continuar funcionando si:

```text
Audio A
↓
Audio B
↓
Audio C
```

Cada nuevo audio debe recalcular automáticamente su duración y aplicar nuevamente:

```text
duración - 2.8 segundos
```

No utilizar una duración fija.

Incorrecto:

```js
const limit = 10;
```

Correcto:

```js
const limit = audio.duration - 2;
```

---

# No romper los controles existentes

El usuario debe poder seguir utilizando:

* Play.
* Pause.
* Volumen.
* Mute.
* Barra de reproducción.
* Cambio de audio.
* Controles actuales.
* Estilos actuales.

La única modificación funcional debe ser:

> Impedir que el audio reproduzca los últimos 2 segundos.

---

# Caso especial: usuario arrastra la barra

Es importante controlar también el caso donde el usuario intenta mover manualmente el reproductor hacia los últimos 2 segundos.

Por ejemplo:

```text
Duración: 20s

0 ───────────────────────────── 18s │ 19s │ 20s
                                  ↑
                              LÍMITE
```

Si el usuario intenta hacer:

```js
audio.currentTime = 19;
```

la implementación debe evitar que pueda escuchar esa sección.

Se recomienda agregar control mediante el evento:

```js
seeking
```

Ejemplo:

```js
const preventSeekingBeyondLimit = () => {
  if (!Number.isFinite(audio.duration)) return;

  if (audio.duration <= 2) return;

  const playbackLimit = audio.duration - 2;

  if (audio.currentTime > playbackLimit) {
    audio.currentTime = playbackLimit;
  }
};
```

Y registrar:

```js
audio.addEventListener(
  "seeking",
  preventSeekingBeyondLimit
);
```

También eliminarlo correctamente:

```js
return () => {
  audio.removeEventListener(
    "timeupdate",
    stopBeforeEnd
  );

  audio.removeEventListener(
    "seeking",
    preventSeekingBeyondLimit
  );
};
```

---

# Comportamiento final esperado

Para un audio de:

```text
30 segundos
```

debe ocurrir:

```text
0s ───────────────────────────────── 28s │ 29s │ 30s
              REPRODUCIBLE                 ❌     ❌
```

Si llega a:

```text
28s
```

debe detenerse.

Si el usuario intenta saltar a:

```text
29s
```

debe impedirse.

---

# Restricción arquitectónica

Antes de modificar código:

1. Identificar dónde se crea actualmente el reproductor.
2. Identificar cómo llega `audioUrl`, `Blob` o `File`.
3. Identificar si ya existe un componente `AudioPlayer`.
4. Reutilizar el componente existente.
5. Implementar la lógica en el punto mínimo necesario.
6. No duplicar lógica de reproducción.
7. No crear una nueva arquitectura si no es necesaria.

---

# No instalar dependencias

No agregar:

```bash
npm install ...
```

No utilizar librerías externas.

La solución debe utilizar exclusivamente:

```text
React
+
HTMLAudioElement
+
JavaScript
```

---

# Validación

Después de implementar la modificación, comprobar:

## Test 1 — Audio normal

```text
Duración: 10 segundos
```

Resultado:

```text
Se reproducen: 0s → 8s
No se reproducen: 8s → 10s
```

## Test 2 — Audio largo

```text
Duración: 60 segundos
```

Resultado:

```text
Límite: 58 segundos
```

## Test 3 — Audio corto

```text
Duración: 2 segundos
```

No debe romperse.

## Test 4 — Audio menor a 2 segundos

```text
Duración: 1 segundo
```

No debe producir errores.

## Test 5 — Cambiar de audio

Comprobar:

```text
Audio A → Audio B
```

El nuevo audio debe calcular nuevamente:

```js
duration - 2
```

## Test 6 — Arrastrar la barra

Intentar desplazarse manualmente a los últimos 2 segundos.

Debe impedirse la reproducción de esa parte.

## Test 7 — Reproducir nuevamente

Después de llegar al límite:

```text
pause
```

El reproductor debe continuar funcionando normalmente cuando se vuelva a reproducir.

---

# Criterio de aceptación

La implementación será considerada correcta si:

* El MP3 original no se modifica.
* Los últimos 2 segundos no se escuchan.
* El usuario no puede saltar manualmente a esos 2 segundos.
* Los audios menores o iguales a 2 segundos no generan errores.
* Los controles actuales continúan funcionando.
* Cambiar de audio continúa funcionando.
* No se agregan dependencias.
* No se modifica el backend.
* No se modifica la API.
* No se modifica Astro salvo que sea estrictamente necesario para mantener el componente React existente.
* No se modifica el diseño.
* No se rompe ninguna funcionalidad existente.
* No quedan listeners duplicados.
* El cambio queda limitado al reproductor de audio.

---

# Entrega

Al finalizar:

1. Mostrar qué archivo(s) fueron modificados.
2. Explicar brevemente qué se cambió.
3. No modificar archivos que no sean necesarios.
4. No realizar refactorizaciones adicionales.
5. No cambiar nombres de componentes, props o APIs existentes.
6. Mantener completamente compatible la integración actual.

## Regla final

**Modificar únicamente el comportamiento de reproducción del MP3 para ocultar/bloquear los últimos 2 segundos. Todo lo demás debe permanecer exactamente igual.**
