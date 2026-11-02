import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp, 
  PieChart as PieIcon, 
  Download, 
  FileSpreadsheet, 
  Plus, 
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, Novelty } from '../types/payroll';
import { calculateEmployeePayroll, calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';
import { PROJECTS_LIST } from '../data/initialData';

interface LaborCostsProjectsViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
  novelties: Novelty[];
}

export const LaborCostsProjectsView: React.FC<LaborCostsProjectsViewProps> = ({
  company,
  employees,
  parameters,
  novelties
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const { details, summary } = calculateTotalPayroll(employees, 'mensual', parameters, novelties, true);

  // Group calculations by project
  const projectSummaries = PROJECTS_LIST.map(proj => {
    const assignedCalculations = details.filter(c => c.employee.assignedProject.toLowerCase().includes(proj.name.toLowerCase()) || (proj.id === 'proj-01' && (c.employee.assignedProject.includes('Gestión') || c.employee.assignedProject.includes('Central'))));

    const totalWages = assignedCalculations.reduce((acc, c) => acc + c.totalEarnings, 0);
    const totalEmployerSec = assignedCalculations.reduce((acc, c) => acc + c.totalEmployerContributions, 0);
    const totalProvisions = assignedCalculations.reduce((acc, c) => acc + c.totalProvisions, 0);
    const totalLaborCostMonthly = assignedCalculations.reduce((acc, c) => acc + c.totalLaborCost, 0);
    const annualizedCost = totalLaborCostMonthly * 12;
    const executionPercentage = proj.budget > 0 ? (annualizedCost / proj.budget) * 100 : 0;

    return {
      proj,
      assignedCalculations,
      totalWages,
      totalEmployerSec,
      totalProvisions,
      totalLaborCostMonthly,
      annualizedCost,
      executionPercentage
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Costos Laborales Asignados por Proyecto
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Módulo especializado para Gestores de Proyectos y Dirección: Imputación de salarios, seguridad social y prestaciones a presupuestos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportPayrollToExcel(details, company, 'mensual', novelties)}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Costos por Proyecto (Excel)</span>
          </button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projectSummaries.map(({ proj, assignedCalculations, totalLaborCostMonthly, executionPercentage }) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {proj.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {assignedCalculations.length} {assignedCalculations.length === 1 ? 'persona' : 'personas'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                {proj.name}
              </h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                {proj.description}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Costo Mensual:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCOP(totalLaborCostMonthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Presupuesto Anual:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {formatCOP(proj.budget)}
                  </span>
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-semibold mb-1">
                  <span className="text-slate-500">Ejecución Proyectada</span>
                  <span className={executionPercentage > 80 ? 'text-amber-500' : 'text-emerald-600'}>
                    {executionPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, executionPercentage)}%` }}
                    className={`h-full ${executionPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 text-[11px]">Asignación formal</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" /> Imputado
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Project Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Discriminación de Costos de Nómina por Centro de Costo
            </h3>
            <p className="text-xs text-slate-500">
              Desglose de salario bruto, seguridad social patronal, parafiscales y provisiones de prestaciones sociales
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Proyecto Social</th>
                <th className="py-3 px-4">Personal Asignado</th>
                <th className="py-3 px-4 text-right">Salarios Brutos</th>
                <th className="py-3 px-4 text-right">Seguridad Social (Patronal)</th>
                <th className="py-3 px-4 text-right">Parafiscales (9%)</th>
                <th className="py-3 px-4 text-right">Prestaciones Sociales</th>
                <th className="py-3 px-4 text-right font-bold text-indigo-700 dark:text-indigo-400">Costo Mensual Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {projectSummaries.map(({ proj, assignedCalculations, totalWages, totalEmployerSec, totalProvisions, totalLaborCostMonthly }) => (
                <tr key={proj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{proj.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{proj.code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      {assignedCalculations.map(c => (
                        <div key={c.employee.id} className="text-[11px] text-slate-700 dark:text-slate-300">
                          {c.employee.fullName} <span className="text-slate-400">({c.employee.position})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {formatCOP(totalWages)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCOP(totalEmployerSec)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCOP(assignedCalculations.reduce((a, b) => a + b.parafiscalCaja + b.parafiscalSena + b.parafiscalIcbf, 0))}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCOP(totalProvisions)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700 dark:text-indigo-400 text-sm bg-indigo-50/20 dark:bg-indigo-950/20">
                    {formatCOP(totalLaborCostMonthly)}
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
