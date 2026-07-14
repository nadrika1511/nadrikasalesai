import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/modules/auth/components/LoginPage';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';

// Placeholder temporal: se reemplaza en el módulo de Dashboard
function DashboardPlaceholder() {
  return <div style={{ padding: 24 }}>Dashboard (módulo siguiente)</div>;
}

function NoAutorizadoPage() {
  return <div style={{ padding: 24 }}>No tienes permiso para ver esta página.</div>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/no-autorizado" element={<NoAutorizadoPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Ejemplo de ruta restringida solo a superadmin, la usaremos en el módulo Empresas */}
      <Route
        path="/empresas"
        element={
          <ProtectedRoute rolesPermitidos={['superadmin']}>
            <div style={{ padding: 24 }}>Gestión de Empresas (módulo futuro)</div>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
