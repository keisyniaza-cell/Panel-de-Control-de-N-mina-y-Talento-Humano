import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  PieChart as PieIcon, 
  ShieldCheck, 
  PiggyBank, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Settings2,
  AlertCircle
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, Novelty, PayrollPeriodType } from '../types/payroll';
import { calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';
import { generateGeneralPayrollPDF } from '../utils/exportPdf';

interface DashboardViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
  novelties: Novelty[];
  currentPeriod: PayrollPeriodType;
  onNavigate: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  company,
  employees,
  parameters,
  novelties,
  currentPeriod,
  onNavigate
}) => {
  // Widget customization state
  const [enabledWidgets, setEnabledWidgets] = useState({
    kpis: true,
    costChart: true,
    distribution: true,
    upcomingDates: true,
    employeesSummary: true,
    legalAlerts: true
  });
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);

  // Calculate standard monthly payroll (academic simulation scenario)
  const monthlyCalc = calculateTotalPayroll(employees, 'mensual', parameters, novelties, false);
  // Calculate current period payroll
  const periodCalc = calculateTotalPayroll(employees, currentPeriod, parameters, novelties, true);

  const activeEmployees = employees.filter(e => e.status === 'Activo');

  // Next payment dates for 2026 (based on period)
  const upcomingPaymentDates = [
    { label: 'Corte 1 - Día 10', date: '10 de Noviembre, 2026', type: '10_dias', status: 'Próximo', amount: periodCalc.summary.totalNetSalary },
    { label: 'Corte 2 - Día 20', date: '20 de Noviembre, 2026', type: '10_dias', status: 'Programado', amount: periodCalc.summary.totalNetSalary },
    { label: 'Corte 3 - Fin de Mes', date: '30 de Noviembre, 2026', type: '10_dias', status: 'Programado', amount: periodCalc.summary.totalNetSalary },
    { label: 'Pago PILA (Seguridad Social)', date: '14 de Noviembre, 2026', type: 'PILA', status: 'Obligatorio', amount: monthlyCalc.summary.totalEmployerContributions + monthlyCalc.summary.totalHealthDeductions + monthlyCalc.summary.totalPensionDeductions }
  ];

  const handleExportExcel = () => {
    exportPayrollToExcel(monthlyCalc.details, company, currentPeriod, novelties);
  };

  const handleExportPDF = () => {
    generateGeneralPayrollPDF(monthlyCalc.details, company, currentPeriod);
  };

  // Cost proportions
  const totalCost = monthlyCalc.summary.grandTotalLaborCost || 1;
  const pSalaries = ((monthlyCalc.summary.totalEarnings) / totalCost) * 100;
  const pEmployerSec = ((monthlyCalc.summary.totalHealthEmployer + monthlyCalc.summary.totalPensionEmployer + monthlyCalc.summary.totalArlEmployer) / totalCost) * 100;
  const pParafiscales = ((monthlyCalc.summary.totalParafiscales) / totalCost) * 100;
  const pProvisions = ((monthlyCalc.summary.totalProvisions) / totalCost) * 100;

  return (
    <div className="space-y-6">
      {/* Top Header / Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>Corporación Social Somos Uno</span>
              <span>·</span>
              <span>NIT {company.nit}-{company.verificationDigit}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">
              Panel de Control de Nómina y Talento Humano
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Simulación de liquidación 2026 conforme al Código Sustantivo del Trabajo, Ley 2101 (42 horas semanales) y Ley 2466 de 2025.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowWidgetSettings(!showWidgetSettings)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-xs flex items-center gap-1.5"
              title="Personalizar Widgets"
            >
              <Settings2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Widgets</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-red-400" />
              <span>PDF Nómina</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>

        {/* Widget Customizer Toggle Tray */}
        {showWidgetSettings && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            {Object.entries(enabledWidgets).map(([key, enabled]) => (
              <button
                key={key}
                onClick={() => setEnabledWidgets(prev => ({ ...prev, [key]: !prev[key as keyof typeof enabledWidgets] }))}
                className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                  enabled 
                    ? 'bg-blue-600/30 border-blue-500 text-white' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                }`}
              >
                <span className="capitalize">{key}</span>
                <span className="text-[10px] font-bold">{enabled ? 'ON' : 'OFF'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* KPI Cards Strip */}
      {enabledWidgets.kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Empleados */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Empleados</span>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {activeEmployees.length}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>100% Contrato Indefinido</span>
                <button 
                  onClick={() => onNavigate('employees')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center"
                >
                  Ver todos <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Total Nómina Mensual */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nómina Mensual (Devengados)</span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {formatCOP(monthlyCalc.summary.totalEarnings)}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Básicos: {formatCOP(monthlyCalc.summary.totalBasicSalaries)}</span>
                <span className="text-emerald-600 font-semibold font-mono">Neto: {formatCOP(monthlyCalc.summary.totalNetSalary)}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Deducciones de Ley */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Deducciones (8%)</span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
                {formatCOP(monthlyCalc.summary.totalDeductions)}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Salud 4%: {formatCOP(monthlyCalc.summary.totalHealthDeductions)}</span>
                <span>Pensión 4%: {formatCOP(monthlyCalc.summary.totalPensionDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Costo Total Empresa */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Costo Total Mensual</span>
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-mono tracking-tight text-indigo-600 dark:text-indigo-400">
                {formatCOP(monthlyCalc.summary.grandTotalLaborCost)}
              </p>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Aportes + Provisiones</span>
                <span className="text-slate-400 font-mono text-[11px]">$19.101.946 (PDF)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Distribution Breakdown */}
        {enabledWidgets.costChart && (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Estructura Integral de Costos Laborales (Simulación 2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Distribución mensual del costo total estimado (${formatCOP(monthlyCalc.summary.grandTotalLaborCost)})
                </p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <PieIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Visual Bar Distribution */}
            <div className="mt-6 space-y-4">
              <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${pSalaries}%` }} title={`Devengados: ${pSalaries.toFixed(1)}%`} className="bg-blue-600 h-full transition-all" />
                <div style={{ width: `${pEmployerSec}%` }} title={`Seguridad Social: ${pEmployerSec.toFixed(1)}%`} className="bg-indigo-500 h-full transition-all" />
                <div style={{ width: `${pParafiscales}%` }} title={`Parafiscales: ${pParafiscales.toFixed(1)}%`} className="bg-amber-500 h-full transition-all" />
                <div style={{ width: `${pProvisions}%` }} title={`Provisiones Prestaciones: ${pProvisions.toFixed(1)}%`} className="bg-emerald-500 h-full transition-all" />
              </div>

              {/* Legend with exact amounts matching document */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Salarios y Auxilios</span>
                  </div>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCOP(monthlyCalc.summary.totalEarnings)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Básicos $12M + Auxilios $747.285 ({pSalaries.toFixed(1)}%)
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Seguridad Social Empleador</span>
                  </div>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCOP(monthlyCalc.summary.totalHealthEmployer + monthlyCalc.summary.totalPensionEmployer + monthlyCalc.summary.totalArlEmployer)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Salud 8.5% ($1.02M) + Pensión 12% ($1.44M) + ARL ($62.640)
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aportes Parafiscales (9%)</span>
                  </div>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCOP(monthlyCalc.summary.totalParafiscales)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Caja 4% ($480k) + SENA 2% ($240k) + ICBF 3% ($360k)
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prestaciones Sociales (Provisión)</span>
                  </div>
                  <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {formatCOP(monthlyCalc.summary.totalProvisions)}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cesantías + Intereses + Prima + Vacaciones ($2.752.021)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action buttons row */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Valores consolidados según Documento Académico Colombia 2026.
              </span>
              <button
                onClick={() => onNavigate('payroll')}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition"
              >
                <span>Ir al Módulo de Liquidación</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Payment Dates & Status */}
        {enabledWidgets.upcomingDates && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Calendario de Pagos
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Noviembre 2026</span>
              </div>

              <div className="mt-4 space-y-3">
                {upcomingPaymentDates.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        p.status === 'Próximo' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                          : p.status === 'Obligatorio'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{p.date}</p>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-1">
                      {formatCOP(p.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Los pagos cada 10 días distribuyen proporcionalmente el neto mensual sin aplicar recargos tributarios adicionales.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Employees Overview Cards */}
      {enabledWidgets.employeesSummary && (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Simulación de Nómina: 4 Cargos Corporativos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cálculo base mensual comparativo de devengados, deducciones ordinarias y neto a pagar
              </p>
            </div>
            <button
              onClick={() => onNavigate('employees')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Gestionar Empleados <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {monthlyCalc.details.map((calc) => (
              <div 
                key={calc.employee.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {calc.employee.position}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {calc.employee.documentType} {calc.employee.documentNumber}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {calc.employee.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {calc.employee.assignedProject}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Salario Básico:</span>
                      <span className="font-mono font-medium">{formatCOP(calc.employee.basicSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Aux. Transporte:</span>
                      <span className="font-mono font-medium">{calc.transportAllowancePeriod > 0 ? formatCOP(calc.transportAllowancePeriod) : '$0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Deducción 8%:</span>
                      <span className="font-mono text-red-500">-{formatCOP(calc.totalDeductions)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Neto a Pagar:</span>
                  <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCOP(calc.netSalary)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
