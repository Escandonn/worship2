# Registro con Google — WorshipSaint

## Objetivo

Preparar la arquitectura para implementar posteriormente el registro mediante Google utilizando Firebase Authentication.

## Estado actual

```text
UI: LISTA
Componente: LISTO
Servicio: PREPARADO
Firebase: CONFIGURACIÓN PREPARADA
Google Authentication: NO ACTIVADA
Firestore: NO ACTIVADO
```

## Estructura

```text
src/registro/
├── components/
│   └── GoogleRegisterButton.tsx
├── services/
│   └── googleRegisterService.ts
└── config/
    └── firebaseConfig.ts
```

## Archivos

### GoogleRegisterButton.tsx
Componente visual del botón "Regístrate con Google".
- Estilo premium coherente con WorshipSaint.
- Prepara el punto de integración con `onRegister`.
- No ejecuta Firebase todavía.

### googleRegisterService.ts
Servicio placeholder para el registro con Google.
- Expone `registerWithGoogle()`.
- Lanza error controlado hasta que se implemente Firebase.

### firebaseConfig.ts
Configuración preparada para Firebase.
- Usa variables de entorno.
- No incluye credenciales hardcodeadas.

## Variables de entorno

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Próximos pasos

1. Crear proyecto Firebase.
2. Registrar aplicación Web.
3. Obtener configuración.
4. Configurar variables `.env`.
5. Activar Authentication.
6. Activar proveedor Google.
7. Implementar `registerWithGoogle()`.
8. Configurar Firestore si se requiere almacenar perfiles.
