import type { User } from 'firebase/auth';
import { authRepository } from '../repositories/authRepository';
import type { CustomClaims } from '@/core/types/usuario.types';

export interface SesionActual {
  user: User;
  empresaId: string | null;
  rol: CustomClaims['rol'];
}

export const authService = {
  async login(email: string, password: string): Promise<SesionActual> {
    const credential = await authRepository.signIn(email, password);
    return authService.resolverSesion(credential.user, true);
  },

  logout() {
    return authRepository.signOut();
  },

  /**
   * Lee los custom claims (empresaId, rol) del token del usuario.
   * forceRefresh=true es necesario justo después de que un superadmin
   * le asigna claims nuevos a alguien, porque el token en caché no los trae.
   */
  async resolverSesion(user: User, forceRefresh = false): Promise<SesionActual> {
    const tokenResult = await authRepository.getIdTokenResult(user, forceRefresh);
    const claims = tokenResult.claims as Partial<CustomClaims>;

    if (!claims.rol) {
      throw new Error(
        'Este usuario no tiene un rol asignado todavía. Contacta a un superadmin.'
      );
    }

    return {
      user,
      empresaId: claims.empresaId ?? null,
      rol: claims.rol
    };
  }
};
