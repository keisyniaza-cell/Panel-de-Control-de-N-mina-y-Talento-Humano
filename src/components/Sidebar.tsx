import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  FileText, 
  PiggyBank, 
  ShieldCheck, 
  BarChart3, 
  Briefcase, 
  Scale, 
  RotateCw, 
  BookOpen, 
  HelpCircle, 
  Settings, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types/payroll';

export type ActiveTab = 
  | 'dashboard'
  | 'employees'
  | 'payroll'
  | 'novelties'
  | 'social_benefits'
  | 'security_parafiscales'
  | 'reports'
  | 'project_costs'
  | 'normativity'
  | 'phva'
  | 'job_manual'
  | 'user_manual'
  | 'system_admin'
  | 'roles_security';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  isMobileOpen,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: '1. Panel Principal', icon: LayoutDashboard, category: 'Operación' },
    { id: 'employees', label: '2. Empleados', icon: Users, category: 'Operación' },
    { id: 'payroll', label: '3. Liquidación Nómina', icon: Calculator, category: 'Operación' },
    { id: 'novelties', label: '4. Novedades y Horas Extras', icon: FileText, category: 'Operación' },
    { id: 'social_benefits', label: '5. Prestaciones Sociales', icon: PiggyBank, category: 'Obligaciones' },
    { id: 'security_parafiscales', label: '6. Seguridad & Parafiscales', icon: ShieldCheck, category: 'Obligaciones' },
    { id: 'reports', label: '7. Informes (PDF / Excel)', icon: BarChart3, category: 'Control' },
    { id: 'project_costs', label: 'Costos por Proyecto', icon: Briefcase, category: 'Control' },
    { id: 'normativity', label: '8. Normatividad & Parámetros', icon: Scale, category: 'Normativo' },
    { id: 'phva', label: '9. Flujograma PHVA', icon: RotateCw, category: 'Normativo' },
    { id: 'job_manual', label: '13. Manual de Funciones', icon: BookOpen, category: 'Institucional' },
    { id: 'user_manual', label: '15. Manual de Usuario', icon: HelpCircle, category: 'Institucional' },
    { id: 'roles_security', label: '10. Roles y Permisos (2FA)', icon: Lock, category: 'Sistema' },
    { id: 'system_admin', label: '14. Configuración & PWA', icon: Settings, category: 'Sistema' },
  ];

  const categories = ['Operación', 'Obligaciones', 'Control', 'Normativo', 'Institucional', 'Sistema'];

  const handleItemClick = (id: ActiveTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-16 bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 z-35 flex flex-col transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {categories.map((cat) => {
            const items = menuItems.filter(item => item.category === cat);
            return (
              <div key={cat} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {cat}
                </p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id as ActiveTab)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left
                        ${isActive 
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}
                      `}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 bg-slate-950/40">
          <div className="flex items-center justify-between text-slate-400 font-semibold mb-1">
            <span>Ley 2101 / 2026</span>
            <span className="text-amber-400">42 hrs/sem</span>
          </div>
          <p className="leading-snug text-[10px]">
            Simulación académica 2026 para la Corporación Social Somos Uno.
          </p>
        </div>
      </aside>
    </>
  );
};
