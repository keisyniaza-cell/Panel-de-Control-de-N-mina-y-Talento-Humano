import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  DownloadCloud, 
  CheckCircle2, 
  Info,
  Calendar,
  Lock,
  Smartphone
} from 'lucide-react';
import { 
  CompanyInfo, 
  Employee, 
  LegalParameters, 
  Novelty, 
  PayrollPeriodType, 
  UserAccount 
} from './types/payroll';
import { 
  INITIAL_COMPANY_INFO, 
  INITIAL_EMPLOYEES, 
  INITIAL_LEGAL_PARAMETERS, 
  INITIAL_NOVELTIES, 
  INITIAL_USERS 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { EmployeesView } from './views/EmployeesView';
import { PayrollLiquidationView } from './views/PayrollLiquidationView';
import { NoveltiesView } from './views/NoveltiesView';
import { SocialBenefitsView } from './views/SocialBenefitsView';
import { SecurityParafiscalesView } from './views/SecurityParafiscalesView';
import { ReportsView } from './views/ReportsView';
import { LaborCostsProjectsView } from './views/LaborCostsProjectsView';
import { NormativityView } from './views/NormativityView';
import { PhvaWorkflowView } from './views/PhvaWorkflowView';
import { JobManualView } from './views/JobManualView';
import { UserManualView } from './views/UserManualView';
import { SystemAdminView } from './views/SystemAdminView';
import { SecurityRolesView } from './views/SecurityRolesView';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('somosuno_theme');
    if (saved) return saved === 'dark';
    return false; // Default to elegant corporate light/navy theme
  });

  // State with LocalStorage persistence
  const [company, setCompany] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem('somosuno_company');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_INFO;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('somosuno_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [novelties, setNovelties] = useState<Novelty[]>(() => {
    const saved = localStorage.getItem('somosuno_novelties');
    return saved ? JSON.parse(saved) : INITIAL_NOVELTIES;
  });

  const [parameters, setParameters] = useState<LegalParameters>(() => {
    const saved = localStorage.getItem('somosuno_parameters');
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_PARAMETERS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('somosuno_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => users[0] || INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriodType>('10_dias');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);

  // Sync dark mode class to HTML tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('somosuno_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('somosuno_theme', 'light');
    }
  }, [darkMode]);

  // Persist data
  useEffect(() => {
    localStorage.setItem('somosuno_company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('somosuno_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('somosuno_novelties', JSON.stringify(novelties));
  }, [novelties]);

  useEffect(() => {
    localStorage.setItem('somosuno_parameters', JSON.stringify(parameters));
  }, [parameters]);

  useEffect(() => {
    localStorage.setItem('somosuno_users', JSON.stringify(users));
  }, [users]);

  // CRUD Handlers for Employees
  const handleAddEmployee = (emp: Employee) => {
    setEmployees(prev => [emp, ...prev]);
  };

  const handleUpdateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => (e.id === emp.id ? emp : e)));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // CRUD Handlers for Novelties
  const handleAddNovelty = (nov: Novelty) => {
    setNovelties(prev => [nov, ...prev]);
  };

  const handleUpdateNovelty = (nov: Novelty) => {
    setNovelties(prev => prev.map(n => (n.id === nov.id ? nov : n)));
  };

  const handleDeleteNovelty = (id: string) => {
    setNovelties(prev => prev.filter(n => n.id !== id));
  };

  // Restore & Reset Handlers
  const handleRestoreBackup = (data: any) => {
    if (data.organization) setCompany(data.organization);
    if (data.parameters) setParameters(data.parameters);
    if (data.employees) setEmployees(data.employees);
    if (data.novelties) setNovelties(data.novelties);
    if (data.users) setUsers(data.users);
  };

  const handleResetDatabase = () => {
    setCompany(INITIAL_COMPANY_INFO);
    setEmployees(INITIAL_EMPLOYEES);
    setNovelties(INITIAL_NOVELTIES);
    setParameters(INITIAL_LEGAL_PARAMETERS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
  };

  // Render view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            company={company}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
            currentPeriod={currentPeriod}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
      case 'employees':
        return (
          <EmployeesView
            employees={employees}
            parameters={parameters}
            userRole={currentUser.role}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        );
      case 'payroll':
        return (
          <PayrollLiquidationView
            company={company}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
            currentPeriod={currentPeriod}
            onChangePeriod={setCurrentPeriod}
            userRole={currentUser.role}
          />
        );
      case 'novelties':
        return (
          <NoveltiesView
            novelties={novelties}
            employees={employees}
            parameters={parameters}
            userRole={currentUser.role}
            onAddNovelty={handleAddNovelty}
            onUpdateNovelty={handleUpdateNovelty}
            onDeleteNovelty={handleDeleteNovelty}
          />
        );
      case 'social_benefits':
        return (
          <SocialBenefitsView
            company={company}
            employees={employees}
            parameters={parameters}
          />
        );
      case 'security_parafiscales':
        return (
          <SecurityParafiscalesView
            company={company}
            employees={employees}
            parameters={parameters}
            onUpdateParameters={setParameters}
            userRole={currentUser.role}
          />
        );
      case 'reports':
        return (
          <ReportsView
            company={company}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
            currentPeriod={currentPeriod}
          />
        );
      case 'project_costs':
        return (
          <LaborCostsProjectsView
            company={company}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
          />
        );
      case 'normativity':
        return (
          <NormativityView
            parameters={parameters}
            onUpdateParameters={setParameters}
            userRole={currentUser.role}
          />
        );
      case 'phva':
        return (
          <PhvaWorkflowView
            userRole={currentUser.role}
          />
        );
      case 'job_manual':
        return (
          <JobManualView
            company={company}
            userRole={currentUser.role}
          />
        );
      case 'user_manual':
        return (
          <UserManualView />
        );
      case 'system_admin':
        return (
          <SystemAdminView
            company={company}
            onUpdateCompany={setCompany}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
            allUsers={users}
            userRole={currentUser.role}
            onRestoreBackup={handleRestoreBackup}
            onResetDatabase={handleResetDatabase}
            onInstallPwa={() => setShowPwaInstallModal(true)}
          />
        );
      case 'roles_security':
        return (
          <SecurityRolesView
            users={users}
            currentUser={currentUser}
            onSwitchUser={setCurrentUser}
            onUpdateUser={(updated) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))}
          />
        );
      default:
        return (
          <DashboardView
            company={company}
            employees={employees}
            parameters={parameters}
            novelties={novelties}
            currentPeriod={currentPeriod}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        company={company}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={setCurrentUser}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenInstallModal={() => setShowPwaInstallModal(true)}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={currentUser.role}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Mobile Top Bar with Menu Trigger */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 text-xs font-semibold"
            >
              <Menu className="w-4 h-4 text-blue-600" />
              <span>Menú del Sistema</span>
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          {/* Render Active View */}
          {renderActiveView()}
        </main>
      </div>

      {/* PWA Install Modal / Instructions */}
      {showPwaInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Instalar Nómina Somos Uno
                </h3>
              </div>
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                La plataforma de gestión de nómina de la <strong>Corporación Social Somos Uno</strong> puede instalarse en su dispositivo como aplicación independiente para acceso sin conexión y con máxima velocidad.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">En Chrome, Edge o Android:</strong>
                    <span>Haga clic en el icono de instalación en la barra de direcciones o en el menú de tres puntos → "Instalar Nómina Somos Uno".</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <Smartphone className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white block">En iPhone / iPad (Safari):</strong>
                    <span>Presione el botón "Compartir" y elija "Agregar al inicio".</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPwaInstallModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
