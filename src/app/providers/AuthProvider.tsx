import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { authRepository } from '@/modules/auth/repositories/authRepository';
import { authService, type SesionActual } from '@/modules/auth/services/authService';
import type { Rol } from '@/core/types/empresa.types';

interface AuthContextValue {
  user: User | null;
  empresaId: string | null;
  rol: Rol | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [rol, setRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authRepository.subscribeToAuthChanges(async (firebaseUser) => {
      setError(null);

      if (!firebaseUser) {
        setUser(null);
        setEmpresaId(null);
        setRol(null);
        setLoading(false);
        return;
      }

      try {
        const sesion: SesionActual = await authService.resolverSesion(firebaseUser);
        setUser(sesion.user);
        setEmpresaId(sesion.empresaId);
        setRol(sesion.rol);
      } catch (e) {
        // Usuario autenticado en Firebase pero sin claims asignados todavía
        setUser(firebaseUser);
        setEmpresaId(null);
        setRol(null);
        setError(e instanceof Error ? e.message : 'Error al resolver la sesión');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const sesion = await authService.login(email, password);
      setUser(sesion.user);
      setEmpresaId(sesion.empresaId);
      setRol(sesion.rol);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    setEmpresaId(null);
    setRol(null);
  }

  return (
    <AuthContext.Provider value={{ user, empresaId, rol, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
