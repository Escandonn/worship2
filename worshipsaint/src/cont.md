Claro. Te dejo un **README/prompt listo para darle a otra IA de desarrollo**. Está diseñado para que la IA **no toque nada fuera del botón**, pero deje preparada la arquitectura para Firebase/Google sin implementar todavía la lógica de autenticación.

````md
# CAMBIO VISUAL — BOTÓN "REGÍSTRATE CON GOOGLE"

## ROL

Actúa como Senior Frontend Developer + UX/UI Designer.

Debes realizar una modificación MUY específica sobre el proyecto existente.

---

# ⚠️ REGLA PRINCIPAL

NO modificar ninguna funcionalidad existente.

NO modificar la lógica actual.

NO modificar otros botones.

NO modificar el navbar.

NO modificar textos existentes.

NO modificar animaciones existentes.

NO modificar responsive existente.

NO modificar colores globales.

NO modificar componentes que no estén directamente relacionados con este cambio.

NO agregar Firebase todavía como dependencia funcional.

NO ejecutar autenticación todavía.

NO crear lógica de login.

NO conectar Google todavía.

El objetivo de esta tarea es:

1. Crear visualmente un nuevo botón.
2. Preparar la estructura para un futuro registro con Google.
3. Crear los servicios necesarios de forma preparada.
4. Dejar un archivo de configuración preparado para Firebase.
5. Crear documentación README.
6. No activar todavía ninguna lógica de autenticación.

---

# 1. BOTÓN "REGÍSTRATE CON GOOGLE"

Agregar un nuevo botón con el texto:

**Regístrate con Google**

El botón debe integrarse visualmente con el diseño actual de WorshipSaint.

## Diseño actual

La interfaz utiliza:

- Fondo crema / beige.
- Tonos dorados.
- Negro/marrón oscuro para textos.
- Bordes redondeados.
- Diseño elegante.
- Estética premium.
- Sensación espiritual/tecnológica.
- Elementos geométricos sutiles.
- Sombras muy suaves.
- Mucho espacio visual.
- Diseño minimalista.

El nuevo botón debe parecer parte natural de esta interfaz.

---

# 2. ESTILO DEL BOTÓN

Crear un botón premium que diga:

> Regístrate con Google

Debe tener:

- Nuevo color diferente al resto de botones existentes.
- Apariencia elegante.
- Bordes redondeados.
- Efecto hover suave.
- Transición de aproximadamente 200–300ms.
- Sombra muy sutil.
- Pequeño efecto de elevación al pasar el mouse.
- Efecto visual al hacer click.
- Buen contraste.
- Tipografía consistente con el sitio.

El color debe estar inspirado en la identidad actual pero diferenciarse claramente.

NO utilizar colores extremadamente saturados.

NO utilizar un diseño genérico de botón azul de Google.

La intención es que parezca un botón propio de WorshipSaint.

---

# 3. ICONO DE GOOGLE

El botón debe incluir el icono de Google.

Estructura visual aproximada:

[ Google ] Regístrate con Google

El icono debe estar correctamente alineado verticalmente.

El texto debe permanecer centrado.

El botón debe funcionar correctamente en:

- Desktop
- Tablet
- Mobile

---

# 4. EFECTOS

Agregar únicamente efectos relacionados con este botón.

### Hover

Cuando el usuario coloque el mouse:

- Elevación ligera.
- Cambio de tono.
- Sombra ligeramente mayor.
- Transición suave.

### Active

Al hacer click:

- Pequeña reducción de escala.
- Sensación de interacción.

### Focus

Agregar un estado `:focus-visible` accesible.

No modificar los estilos de focus del resto del proyecto.

---

# 5. UBICACIÓN

Ubicar el botón donde tenga sentido dentro del flujo visual actual de registro.

IMPORTANTE:

No mover otros elementos innecesariamente.

No cambiar el layout existente.

No modificar el hero.

No modificar el navbar.

No modificar los botones existentes.

El nuevo botón debe agregarse de forma independiente.

---

# 6. NUEVA CARPETA DE REGISTRO

Crear una carpeta específica para el futuro sistema de registro.

Por ejemplo:

```text
src/
├── registro/
│   ├── components/
│   │   └── GoogleRegisterButton.jsx
│   │
│   ├── services/
│   │   └── googleRegisterService.js
│   │
│   ├── config/
│   │   └── firebaseConfig.js
│   │
│   └── README.md
````

IMPORTANTE:

Adaptar la ubicación a la arquitectura REAL del proyecto.

NO crear una arquitectura paralela si el proyecto ya tiene una estructura establecida.

Primero analizar la estructura actual.

---

# 7. COMPONENTE

Crear un componente independiente:

```text
GoogleRegisterButton
```

Responsabilidad:

ÚNICAMENTE representar el botón y dejar preparado el punto de integración.

Por ahora NO debe ejecutar Firebase.

Ejemplo conceptual:

```jsx
<GoogleRegisterButton />
```

El componente debe estar preparado para posteriormente recibir una función:

```jsx
<GoogleRegisterButton onRegister={...} />
```

Pero NO implementar todavía la autenticación.

---

# 8. SERVICIO DE REGISTRO

Crear:

```text
googleRegisterService.js
```

Este archivo debe quedar preparado para posteriormente implementar:

```text
registerWithGoogle()
```

La función puede quedar como placeholder documentado.

Ejemplo conceptual:

```js
export const registerWithGoogle = async () => {
  // TODO:
  // Implementar autenticación mediante Firebase Authentication
};
```

IMPORTANTE:

No realizar ninguna llamada real.

No solicitar popup.

No redireccionar.

No guardar usuarios.

No escribir en Firestore.

No agregar lógica adicional.

---

# 9. FIREBASE CONFIG

Crear un archivo preparado para recibir las credenciales:

```text
firebaseConfig.js
```

Debe utilizar variables de entorno.

NUNCA escribir una API key real directamente en el código.

Ejemplo:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export default firebaseConfig;
```

Adaptar `import.meta.env` a la tecnología REAL del proyecto.

Si el proyecto utiliza otra estrategia de variables de entorno, respetarla.

---

# 10. ARCHIVO .ENV.EXAMPLE

Crear:

```text
.env.example
```

Con:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

NO colocar valores reales.

---

# 11. IMPORTANTE SOBRE FIREBASE

El futuro registro con Google deberá utilizar:

### Firebase Authentication

para:

```text
Google Login/Register
```

Y posteriormente, si se requiere almacenar información adicional del usuario:

### Cloud Firestore

para:

```text
usuarios
perfil
fecha de registro
datos adicionales
etc.
```

NO confundir:

```text
Firebase API Key
```

con:

```text
Firestore Database
```

La API key únicamente forma parte de la configuración del proyecto Firebase.

---

# 12. NO IMPLEMENTAR TODAVÍA

En esta tarea NO implementar:

* Firebase Authentication.
* Google Provider.
* `signInWithPopup`.
* `signInWithRedirect`.
* Firestore.
* creación de documentos.
* persistencia de usuarios.
* manejo de sesiones.
* logout.
* recuperación de contraseña.
* protección de rutas.
* contexto de autenticación.
* estados globales.
* cookies.
* JWT.
* backend.
* API.

Todo eso queda para una segunda etapa.

---

# 13. DOCUMENTACIÓN

Crear:

```text
registro/README.md
```

Debe explicar:

## Registro con Google — WorshipSaint

### Objetivo

Preparar la arquitectura para implementar posteriormente el registro mediante Google utilizando Firebase Authentication.

### Estado actual

```text
UI: LISTA
Componente: LISTO
Servicio: PREPARADO
Firebase: CONFIGURACIÓN PREPARADA
Google Authentication: NO ACTIVADA
Firestore: NO ACTIVADO
```

### Estructura

Explicar cada archivo.

### Variables de entorno

Explicar cómo posteriormente se agregarán las credenciales.

### Firebase

Explicar que posteriormente se deberá:

1. Crear proyecto Firebase.
2. Registrar aplicación Web.
3. Obtener configuración.
4. Configurar variables `.env`.
5. Activar Authentication.
6. Activar proveedor Google.
7. Configurar Firestore si se requiere almacenar perfiles.

---

# 14. README PRINCIPAL

Crear además:

```text
README_REGISTRO_GOOGLE.md
```

Este archivo debe documentar exclusivamente esta funcionalidad.

Debe incluir:

* Objetivo.
* Alcance.
* Archivos creados.
* Qué está implementado.
* Qué NO está implementado.
* Configuración futura de Firebase.
* Configuración futura de Google.
* Configuración futura de Firestore.
* Variables de entorno.
* Próximos pasos.

---

# 15. SEGURIDAD

Nunca:

```text
hardcodear API keys
```

Nunca:

```text
subir .env
```

Agregar o verificar que `.gitignore` incluya:

```text
.env
.env.local
.env.*.local
```

NO modificar otras reglas del `.gitignore` si ya existen.

---

# 16. REGLA DE NO REGRESIÓN

Antes de finalizar:

Verificar que:

* La página sigue funcionando.
* Los botones existentes funcionan.
* El navbar funciona.
* Las animaciones funcionan.
* El responsive funciona.
* El hero no cambió.
* Los estilos existentes no fueron alterados.
* No existen errores de consola.
* No existen imports rotos.
* No se agregaron dependencias innecesarias.

---

# 17. RESULTADO ESPERADO

El usuario debe visualizar un nuevo botón:

```text
      [ Google ]  Regístrate con Google
```

con una estética:

**Premium + WorshipSaint + Dorado + Minimalista + Moderna**

El botón debe estar completamente integrado visualmente, pero:

> NO debe ejecutar todavía ningún proceso de autenticación.

La arquitectura debe quedar preparada para que posteriormente solamente sea necesario conectar Firebase Authentication.

---

# REGLA FINAL

Si para realizar esta tarea necesitas modificar archivos que no están relacionados con:

```text
Botón
Registro
Servicio de registro
Configuración Firebase
Variables de entorno
Documentación
```

NO los modifiques.

Prioridad absoluta:

**Cambiar únicamente lo solicitado y no afectar absolutamente nada más del proyecto.**

````

### Estructura final que debería dejar la IA

```text
src/
└── registro/
    ├── components/
    │   └── GoogleRegisterButton.jsx
    ├── services/
    │   └── googleRegisterService.js
    ├── config/
    │   └── firebaseConfig.js
    └── README.md

.env.example
README_REGISTRO_GOOGLE.md
````

**Importante:** para el futuro registro, la pieza que autentica con Google será **Firebase Authentication**; Firestore se usaría después para guardar el perfil/datos adicionales. La API key de Firebase debe quedar en variables de entorno, no escrita directamente en el código.
