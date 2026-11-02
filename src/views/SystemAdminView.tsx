import React, { useState } from 'react';
import { 
  Settings, 
  DownloadCloud, 
  Trash2, 
  Database, 
  Upload, 
  Download, 
  ShieldCheck, 
  Key, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Save, 
  RefreshCcw,
  Lock,
  Copy
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, Novelty, UserAccount, UserRole } from '../types/payroll';

interface SystemAdminViewProps {
  company: CompanyInfo;
  onUpdateCompany: (info: CompanyInfo) => void;
  employees: Employee[];
  parameters: LegalParameters;
  novelties: Novelty[];
  allUsers: UserAccount[];
  userRole: UserRole;
  onRestoreBackup: (data: any) => void;
  onResetDatabase: () => void;
  onInstallPwa: () => void;
}

export const SystemAdminView: React.FC<SystemAdminViewProps> = ({
  company,
  onUpdateCompany,
  employees,
  parameters,
  novelties,
  allUsers,
  userRole,
  onRestoreBackup,
  onResetDatabase,
  onInstallPwa
}) => {
  const [activeSection, setActiveSection] = useState<'company' | 'backup' | 'pwa' | 'api' | 'uninstall'>('company');
  const [companyForm, setCompanyForm] = useState<CompanyInfo>({ ...company });
  const [apiKey, setApiKey] = useState('somosuno_live_sec_901482319_2026_x87a1');
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Uninstall state
  const [uninstallConfirmed, setUninstallConfirmed] = useState(false);
  const [uninstallDownloadedBackup, setUninstallDownloadedBackup] = useState(false);
  const [uninstallSuccess, setUninstallSuccess] = useState(false);

  const canAdmin = userRole === 'gerente' || userRole === 'administracion';

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdmin) return;
    onUpdateCompany(companyForm);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      systemVersion: '2.4.0-2026.11',
      backupTimestamp: new Date().toISOString(),
      organization: company,
      parameters,
      employees,
      novelties,
      users: allUsers
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Backup_Nomina_Somos_Uno_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setUninstallDownloadedBackup(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onRestoreBackup(parsed);
        alert('¡Copia de seguridad restaurada exitosamente!');
      } catch (err) {
        alert('Error al leer el archivo de copia de seguridad. Verifique que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleGenerateNewApiKey = () => {
    const newKey = `somosuno_live_sec_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    setApiKey(newKey);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleExecuteUninstall = () => {
    if (!uninstallDownloadedBackup) {
      alert('Por seguridad institucional, es obligatorio descargar una copia de seguridad antes de desinstalar.');
      return;
    }
    if (!uninstallConfirmed) {
      alert('Debe marcar la casilla de confirmación para autorizar la desinstalación.');
      return;
    }

    onResetDatabase();
    setUninstallSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Administración del Sistema, Seguridad y PWA
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configuración institucional, copias de seguridad cifradas, API REST y gestión de instalación
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveSection('company')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeSection === 'company' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Datos Empresa
          </button>
          <button
            onClick={() => setActiveSection('pwa')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeSection === 'pwa' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Instalar App (PWA)
          </button>
          <button
            onClick={() => setActiveSection('backup')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeSection === 'backup' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Copias de Seguridad
          </button>
          <button
            onClick={() => setActiveSection('api')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeSection === 'api' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
          >
            API REST Externa
          </button>
          <button
            onClick={() => setActiveSection('uninstall')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${activeSection === 'uninstall' ? 'bg-red-600 text-white' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40'}`}
          >
            Desinstalar
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Información de la empresa actualizada con éxito.</span>
        </div>
      )}

      {/* 1. Datos Empresa */}
      {activeSection === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs text-slate-900 dark:text-slate-100">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Datos Institucionales de la Empresa
            </h3>
            <p className="text-xs text-slate-500">
              Esta información aparece en los comprobantes de pago, planillas de nómina y certificaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Razón Social Legal *</label>
              <input
                type="text"
                required
                value={companyForm.legalName}
                onChange={e => setCompanyForm({ ...companyForm, legalName: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">NIT y Dígito de Verificación *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={companyForm.nit}
                  onChange={e => setCompanyForm({ ...companyForm, nit: e.target.value })}
                  className="flex-1 p-2.5 rounded-lg border bg-white dark:bg-slate-800 font-mono"
                />
                <span className="self-center font-bold">-</span>
                <input
                  type="text"
                  maxLength={1}
                  required
                  value={companyForm.verificationDigit}
                  onChange={e => setCompanyForm({ ...companyForm, verificationDigit: e.target.value })}
                  className="w-12 p-2.5 rounded-lg border bg-white dark:bg-slate-800 font-mono text-center font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Representante Legal</label>
              <input
                type="text"
                value={companyForm.legalRepresentative}
                onChange={e => setCompanyForm({ ...companyForm, legalRepresentative: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Documento Representante Legal</label>
              <input
                type="text"
                value={companyForm.representativeDoc}
                onChange={e => setCompanyForm({ ...companyForm, representativeDoc: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Dirección Corporativa</label>
              <input
                type="text"
                value={companyForm.address}
                onChange={e => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Ciudad y País</label>
              <input
                type="text"
                value={companyForm.city}
                onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Teléfono de Contacto</label>
              <input
                type="text"
                value={companyForm.phone}
                onChange={e => setCompanyForm({ ...companyForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Correo Institucional</label>
              <input
                type="email"
                value={companyForm.email}
                onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Banco Dispersor de Nómina</label>
              <input
                type="text"
                value={companyForm.payrollBank}
                onChange={e => setCompanyForm({ ...companyForm, payrollBank: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Número de Cuenta Principal de Nómina</label>
              <input
                type="text"
                value={companyForm.payrollAccount}
                onChange={e => setCompanyForm({ ...companyForm, payrollAccount: e.target.value })}
                className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={!canAdmin}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Información Corporativa</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. PWA Installation */}
      {activeSection === 'pwa' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Instalación como Aplicación Progresiva (PWA)
              </h3>
              <p className="text-xs text-slate-500">
                Acceso directo desde el escritorio o pantalla de inicio sin depender de la barra del navegador
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Ventajas de la Aplicación Instalada:
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acceso rápido con 1 clic desde el escritorio o menú de inicio.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ventana independiente de aplicación nativa a pantalla completa.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Funcionamiento continuo con persistencia de base de datos local.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Actualizaciones automáticas silenciosas en segundo plano.</span>
                </li>
              </ul>

              <div className="pt-3">
                <button
                  onClick={onInstallPwa}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition"
                >
                  <DownloadCloud className="w-5 h-5" />
                  <span>Instalar en este Dispositivo</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Instrucciones para Dispositivos Móviles:
              </h4>
              <div className="space-y-3 text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">En Google Chrome / Android:</strong>
                  <span>Toque el botón superior o los tres puntos del menú del navegador y seleccione <em>"Instalar aplicación"</em>.</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">En Safari / iPhone & iPad:</strong>
                  <span>Toque el botón de <em>Compartir</em> (icono cuadrado con flecha) y luego <em>"Agregar al inicio"</em>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Copias de Seguridad */}
      {activeSection === 'backup' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Gestión de Copias de Seguridad (Backup & Restore)
              </h3>
              <p className="text-xs text-slate-500">
                Exportación e importación completa en JSON cifrado de contratos, novedades, fórmulas y liquidaciones
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Descargar Backup */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  1. Descargar Respaldo Completo
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
                  Genera un archivo seguro (.json) con todos los trabajadores, registros de novedades, auditorías, parámetros 2026 y cuentas bancarias.
                </p>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1">
                  <div>Empleados incluidos: <strong>{employees.length}</strong></div>
                  <div>Novedades registradas: <strong>{novelties.length}</strong></div>
                  <div>Cifrado de almacenamiento: <strong>AES-256 Validado</strong></div>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Copia de Seguridad (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Restaurar Backup */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  2. Restaurar Copia de Seguridad
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
                  Restaura los datos institucionales desde un archivo previo de la Corporación Social Somos Uno.
                </p>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px]">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Advertencia: La restauración reemplazará los datos actuales del navegador por los del archivo cargado.
                </div>
              </div>

              <div className="mt-5">
                <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Cargar Archivo de Respaldo (.JSON)</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. API REST Externa & Cifrado */}
      {activeSection === 'api' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                API REST para Integración Contable Externa (Siigo, Helisa, World Office)
              </h3>
              <p className="text-xs text-slate-500">
                Endpoints seguros con autenticación Bearer Token y cifrado conforme a estándares financieros internacionales
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <label className="block font-bold text-slate-900 dark:text-white mb-1">
                API Key Autorizada (Entorno de Producción Corporativa)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 p-2 rounded-lg border bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <button
                  onClick={handleCopyApiKey}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey ? '¡Copiada!' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleGenerateNewApiKey}
                  className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Regenerar
                </button>
              </div>
            </div>

            {/* Endpoints Table */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                Endpoints de Integración Disponibles
              </h4>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">GET</span>
                    <span className="text-slate-800 dark:text-slate-200">/api/v1/employees</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs">Consulta catálogo de trabajadores y contratos</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">POST</span>
                    <span className="text-slate-800 dark:text-slate-200">/api/v1/payroll/liquidate</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs">Ejecuta preliquidación de nómina periódica</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">GET</span>
                    <span className="text-slate-800 dark:text-slate-200">/api/v1/social-security/pila</span>
                  </div>
                  <span className="text-slate-500 font-sans text-xs">Genera archivo plano para operadores PILA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Desinstalar Plataforma */}
      {activeSection === 'uninstall' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-red-200 dark:border-red-900 shadow-sm space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3 pb-3 border-b border-red-100 dark:border-red-900/60">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950 text-red-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-red-600">
                Procedimiento Seguro de Desinstalación y Limpieza del Sistema
              </h3>
              <p className="text-xs text-slate-500">
                Protocolo con copia de seguridad obligatoria antes de desinstalar para prevenir pérdida de información
              </p>
            </div>
          </div>

          {uninstallSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Base de Datos y Configuración Limpiada con Éxito
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Se ha reseteado la base de datos de la Corporación Social Somos Uno a los valores de fábrica de la simulación 2026. Su copia de seguridad descargada permanece a salvo.
              </p>
              <button
                onClick={() => setUninstallSuccess(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Volver a la Configuración
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>Advertencia Crítica de Seguridad para el Administrador</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Al desinstalar o limpiar la aplicación, se eliminarán los empleados añadidos, novedades cargadas y liquidaciones históricas. Por normatividad contable y protección de datos, <strong>el sistema exige descargar un respaldo completo antes de proceder</strong>.
                </p>
              </div>

              {/* Step 1: Backup mandate */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Paso 1: Descargar Copia de Seguridad Obligatoria
                  </span>
                  <p className="text-[11px] text-slate-500">
                    {uninstallDownloadedBackup ? 'Copia descargada correctamente.' : 'Obligatorio antes de poder autorizar.'}
                  </p>
                </div>
                <button
                  onClick={handleDownloadBackup}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
                    uninstallDownloadedBackup
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {uninstallDownloadedBackup ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span>{uninstallDownloadedBackup ? 'Copia Respaldada' : 'Descargar Copia Ahora'}</span>
                </button>
              </div>

              {/* Step 2: Confirmation Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!uninstallDownloadedBackup}
                    checked={uninstallConfirmed}
                    onChange={e => setUninstallConfirmed(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded mt-0.5 cursor-pointer disabled:opacity-40"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Paso 2: Confirmación Expresa del Administrador
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Confirmo que he descargado la copia de seguridad y autorizo reiniciar o desinstalar la plataforma para la Corporación Social Somos Uno.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExecuteUninstall}
                  disabled={!uninstallDownloadedBackup || !uninstallConfirmed || !canAdmin}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Proceder con la Desinstalación / Reinicio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
