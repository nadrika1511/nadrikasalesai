/**
 * BOOTSTRAP DEL PRIMER SUPERADMIN
 * ================================
 * Este script se corre UNA SOLA VEZ, localmente, con Node.
 * Después de esto, todos los demás usuarios se crean desde el panel
 * de administración usando la Cloud Function `asignarRolUsuario`.
 *
 * PASOS PREVIOS (en Firebase Console):
 * 1. Ve a Authentication > Users > Add user.
 *    Crea un usuario con el correo/contraseña que usarás como superadmin.
 * 2. Ve a Configuración del proyecto (ícono de engranaje) > Cuentas de servicio.
 * 3. Haz clic en "Generar nueva clave privada". Se descarga un JSON.
 * 4. Guarda ese JSON como `serviceAccountKey.json` en esta misma carpeta (scripts/).
 *    ¡NUNCA subas ese archivo a GitHub! Agrégalo a .gitignore.
 *
 * CÓMO CORRERLO:
 *   node scripts/bootstrapSuperAdmin.js correo@ejemplo.com
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const email = process.argv[2];

if (!email) {
  console.error('Uso: node scripts/bootstrapSuperAdmin.js correo@ejemplo.com');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function main() {
  const user = await admin.auth().getUserByEmail(email);

  await admin.auth().setCustomUserClaims(user.uid, {
    empresaId: null,
    rol: 'superadmin'
  });

  console.log(`Listo. ${email} (uid: ${user.uid}) ahora es superadmin.`);
  console.log('Debe cerrar sesión y volver a iniciarla para que el nuevo rol tome efecto.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error al asignar superadmin:', err);
  process.exit(1);
});
