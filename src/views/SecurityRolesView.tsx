import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  QrCode, 
  Shield, 
  AlertCircle
} from 'lucide-react';
import { UserAccount, UserRole } from '../types/payroll';

interface SecurityRolesViewProps {
  users: UserAccount[];
  currentUser: UserAccount;
  onSwitchUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
}

export const SecurityRolesView: React.FC<SecurityRolesViewProps> = ({
  users,
  currentUser,
  onSwitchUser,
  onUpdateUser
}) => {
  const [selectedUserFor2FA, setSelectedUserFor2FA] = useState<UserAccount | null>(null);
  const [simulatedToken, setSimulatedToken] = useState('');
  const [twoFaSuccess, setTwoFaSuccess] = useState(false);

  const permissionsMatrix = [
    { module: '1. Panel Principal', auxiliar: 'Lectura', admin: 'Completo', gerente: 'Completo', gestor: 'Lectura Proyectos' },
    { module: '2. Empleados', auxiliar: 'Registrar / Editar', admin: 'Completo (CRUD)', gerente: 'Completo (CRUD)', gestor: 'Solo Consulta' },
    { module: '3. Liquidación Nómina', auxiliar: 'Preliquidar', admin: 'Verificar', gerente: 'Autorizar Pagos', gestor: 'Solo Consulta' },
    { module: '4. Novedades', auxiliar: 'Registrar / Cargar', admin: 'Aprobar Soportes', gerente: 'Supervisión', gestor: 'Reportar Novedad' },
    { module: '5. Prestaciones Sociales', auxiliar: 'Calcular Provisiones', admin: 'Verificar Bases', gerente: 'Aprobar Fondos', gestor: 'Consulta' },
    { module: '6. Seguridad y Parafiscales', auxiliar: 'Preparar PILA', admin: 'Configurar Tarifas', gerente: 'Aprobar Pago', gestor: 'Consulta' },
    { module: '7. Informes (PDF/Excel)', auxiliar: 'Descargar Operativos', admin: 'Todos los Reportes', gerente: 'Todos los Reportes', gestor: 'Costos por Proyecto' },
    { module: '8. Normatividad & Parámetros', auxiliar: 'Solo Consulta', admin: 'Modificar Leyes', gerente: 'Modificar Leyes', gestor: 'Solo Consulta' },
    { module: '9. Flujograma PHVA', auxiliar: 'Checklist Hacer', admin: 'Checklist Verificar', gerente: 'Checklist Actuar', gestor: 'Checklist Verificar' },
    { module: '10. Configuración & PWA', auxiliar: 'Solo Lectura', admin: 'Backups / Restore', gerente: 'Desinstalar / Reset', gestor: 'Sin Acceso' },
  ];

  const handleToggle2FA = (user: UserAccount) => {
    onUpdateUser({
      ...user,
      twoFactorEnabled: !user.twoFactorEnabled
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Usuarios, Roles, Permisos y Autenticación de Dos Factores (2FA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control de acceso según perfil laboral, niveles de autorización y blindaje de seguridad
          </p>
        </div>
      </div>

      {/* User Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((u) => {
          const isCurrent = u.id === currentUser.id;
          return (
            <div
              key={u.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow">
                    {u.fullName.charAt(0)}
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Activo
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-3">
                  {u.fullName}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">2FA:</span>
                  <button
                    onClick={() => handleToggle2FA(u)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                      u.twoFactorEnabled 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {u.twoFactorEnabled ? 'Activado (TOTP)' : 'Desactivado'}
                  </button>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => onSwitchUser(u)}
                    className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                  >
                    Simular este Usuario
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Matriz de Permisos y Autorizaciones por Perfil
            </h3>
            <p className="text-xs text-slate-500">
              Control de acceso basado en roles (RBAC) para el cumplimiento de segregación de funciones
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Módulo de Nómina</th>
                <th className="py-3 px-4">Auxiliar Contable</th>
                <th className="py-3 px-4">Administración</th>
                <th className="py-3 px-4">Gerente General</th>
                <th className="py-3 px-4">Gestor de Proyectos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {item.module}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium text-[11px]">
                      {item.auxiliar}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium text-[11px]">
                      {item.admin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                      {item.gerente}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium text-[11px]">
                      {item.gestor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
