import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Sun, 
  Moon, 
  UserCheck, 
  ShieldCheck, 
  DownloadCloud, 
  ChevronDown,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { CompanyInfo, UserAccount, UserRole } from '../types/payroll';

interface NavbarProps {
  company: CompanyInfo;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  company,
  currentUser,
  allUsers,
  onSwitchUser,
  darkMode,
  onToggleDarkMode,
  onOpenInstallModal
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Próximo Pago de Nómina', desc: 'Liquidación período cada 10 días programada para el día 10.', type: 'info', icon: Calendar },
    { id: 2, title: 'Consignación de Cesantías', desc: 'Plazo legal máximo: 14 de febrero de 2027 a fondos de cesantías.', type: 'warning', icon: AlertTriangle },
    { id: 3, title: 'Intereses a las Cesantías', desc: 'Reconocimiento del 12% a pagar a los trabajadores antes del 31 de enero.', type: 'info', icon: CheckCircle2 },
    { id: 4, title: 'Jornada Laboral Ley 2101', desc: 'Verificación activa: Jornada ordinaria máxima fijada en 42 horas semanales.', type: 'success', icon: ShieldCheck }
  ];

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'auxiliar_contable': return 'Auxiliar Contable';
      case 'administracion': return 'Administración';
      case 'gerente': return 'Gerente General';
      case 'gestor_proyectos': return 'Gestor de Proyectos';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'auxiliar_contable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'administracion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      case 'gerente': return 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300 dark:border-amber-700';
      case 'gestor_proyectos': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-black text-xl">
          SU
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base md:text-lg tracking-tight text-white whitespace-nowrap">
              {company.legalName}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
              Nómina Colombia 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Sistema de Gestión, Liquidación y Prestaciones Sociales
          </p>
        </div>
      </div>

      {/* Actions and User Zone */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* PWA Install Button */}
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            title="Instalar como aplicación en este dispositivo"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-amber-400" />
            <span>Instalar App</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            title="Alertas y notificaciones"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-sm">Alertas y Vencimientos</span>
                <span className="text-xs text-slate-500">{notifications.length} activas</span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex gap-3 text-left">
                    <n.icon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 md:px-3 md:py-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700/60"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-white leading-tight">{currentUser.fullName}</p>
              <p className="text-[10px] text-amber-400 font-medium">{getRoleLabel(currentUser.role)}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-slate-900 dark:text-slate-100">
              <div className="pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                  {currentUser.twoFactorEnabled && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3 h-3" /> 2FA Activo
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Simular Perfil / Cambiar Rol:
              </p>
              <div className="space-y-1">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      u.id === currentUser.id 
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <p>{u.fullName}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{getRoleLabel(u.role)}</p>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
