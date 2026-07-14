import type { Rol } from './empresa.types';

export interface Usuario {
  id: string;
  empresaId: string | null; // null solo para superadmin
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: number;
}

export interface CustomClaims {
  empresaId: string | null;
  rol: Rol;
}
