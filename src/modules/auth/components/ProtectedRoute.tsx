import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { Rol } from '@/core/types/empresa.types';

interface ProtectedRouteProps {
  children: ReactNode;
  rolesPermitidos?: Rol[]; // si se omite, cualquier usuario autenticado puede entrar
}

export function ProtectedRoute({ children, rolesPermitidos }: ProtectedRouteProps) {
  const { user, rol, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 24 }}>Cargando sesión...</div>;
  }

  if (!user || !rol) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <>{children}</>;
}
