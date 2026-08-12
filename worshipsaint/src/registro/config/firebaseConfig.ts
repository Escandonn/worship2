/**
 * Configuración de Firebase para WorshipSaint.
 *
 * Estado actual: preparada con variables de entorno.
 *
 * TODO:
 * - Crear proyecto Firebase.
 * - Registrar aplicación Web.
 * - Completar variables en .env.
 * - Activar Authentication > Google.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export default firebaseConfig;
