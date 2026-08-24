import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function createFirebaseApp(): FirebaseApp {
  if (app) return app;

  app = initializeApp(firebaseConfig);
  return app;
}

function createFirebaseAuth(): Auth {
  if (auth) return auth;

  const firebaseApp = createFirebaseApp();
  auth = getAuth(firebaseApp);
  return auth;
}

try {
  const firebaseApp = createFirebaseApp();
  const firebaseAuth = createFirebaseAuth();

  console.log('[Firebase] Conexión exitosa.', {
    projectId: firebaseApp.options.projectId,
    authDomain: firebaseApp.options.authDomain
  });
} catch (error) {
  console.error('[Firebase] Error de conexión.', {
    error,
    config: {
      apiKey: firebaseConfig.apiKey ? '***' : undefined,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId
    }
  });
}

export const getFirebaseApp = (): FirebaseApp => createFirebaseApp();
export const getFirebaseAuth = (): Auth => createFirebaseAuth();
export { app, auth };
