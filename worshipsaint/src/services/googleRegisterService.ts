/**
 * Servicio de registro con Google.
 *
 * Estado actual: preparado para Firebase Authentication.
 *
 * TODO:
 * - Instalar Firebase SDK cuando se active la feature.
 * - Implementar registerWithGoogle() con signInWithPopup / signInWithRedirect.
 * - Manejar errores y sesión.
 * - Persistir perfil en Firestore si es necesario.
 */

export type GoogleRegisterResult = {
  user: {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
  };
  credential: unknown;
};

export const registerWithGoogle = async (): Promise<GoogleRegisterResult> => {
  // TODO: Implementar autenticación con Firebase Authentication.
  throw new Error('registerWithGoogle no implementado todavía.');
};
