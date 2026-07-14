import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp();
}

interface AsignarRolInput {
  uid: string;
  empresaId: string | null; // null solo para superadmin
  rol: 'superadmin' | 'admin_empresa' | 'vendedor' | 'operador' | 'lectura';
  nombre: string;
  email: string;
}

/**
 * Solo un superadmin puede invocar esta función.
 * Asigna los custom claims (empresaId, rol) al usuario indicado
 * y crea/actualiza su documento en Firestore.
 */
export const asignarRolUsuario = onCall<AsignarRolInput>(async (request) => {
  const callerClaims = request.auth?.token;

  if (!request.auth || callerClaims?.rol !== 'superadmin') {
    throw new HttpsError(
      'permission-denied',
      'Solo un superadmin puede asignar roles.'
    );
  }

  const { uid, empresaId, rol, nombre, email } = request.data;

  if (!uid || !rol) {
    throw new HttpsError('invalid-argument', 'uid y rol son obligatorios.');
  }

  if (rol !== 'superadmin' && !empresaId) {
    throw new HttpsError(
      'invalid-argument',
      'empresaId es obligatorio para cualquier rol que no sea superadmin.'
    );
  }

  await getAuth().setCustomUserClaims(uid, { empresaId: empresaId ?? null, rol });

  if (empresaId) {
    await getFirestore()
      .doc(`empresas/${empresaId}/usuarios/${uid}`)
      .set(
        {
          nombre,
          email,
          rol,
          activo: true,
          createdAt: Date.now()
        },
        { merge: true }
      );
  }

  return { success: true };
});
