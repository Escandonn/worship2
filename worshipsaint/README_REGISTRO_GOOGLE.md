# Registro con Google — WorshipSaint

## Objetivo

Preparar la arquitectura para implementar posteriormente el registro mediante Google utilizando Firebase Authentication.

## Alcance

- UI del botón "Regístrate con Google".
- Servicio placeholder para registro.
- Configuración de Firebase preparada con variables de entorno.
- Documentación de próximos pasos.

## Archivos creados

```text
src/registro/
├── components/
│   └── GoogleRegisterButton.tsx
├── services/
│   └── googleRegisterService.ts
├── config/
│   └── firebaseConfig.ts
└── README.md

.env.example
README_REGISTRO_GOOGLE.md
```

## Qué está implementado

- Botón visual "Regístrate con Google" integrado con la estética WorshipSaint.
- Servicio `registerWithGoogle()` preparado como placeholder.
- Configuración de Firebase lista para recibir credenciales por variables de entorno.

## Qué NO está implementado

- Firebase Authentication.
- Google Provider.
- Firestore.
- Lógica de login/logout.
- Protección de rutas.
- Persistencia de usuarios.

## Variables de entorno

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Configuración futura

1. Crear proyecto Firebase.
2. Registrar aplicación Web.
3. Obtener configuración.
4. Configurar variables `.env`.
5. Activar Authentication.
6. Activar proveedor Google.
7. Implementar `registerWithGoogle()`.
8. Configurar Firestore si se requiere almacenar perfiles.
