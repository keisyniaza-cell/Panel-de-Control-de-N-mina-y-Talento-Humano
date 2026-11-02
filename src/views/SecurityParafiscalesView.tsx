import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Settings2, 
  FileText, 
  Building, 
  FileSpreadsheet, 
  AlertTriangle,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, UserRole } from '../types/payroll';
import { calculateEmployeePayroll, calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';

interface SecurityParafiscalesViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
  onUpdateParameters: (params: LegalParameters) => void;
  userRole: UserRole;
}

export const SecurityParafiscalesView: React.FC<SecurityParafiscalesViewProps> = ({
  company,
  employees,
  parameters,
  onUpdateParameters,
  userRole
}) => {
  const [showConfig, setShowConfig] = useState(false);

  // Can this role edit parameters?
  const canConfig = userRole === 'administracion' || userRole === 'gerente';

  // Calculate using current parameters
  const { details, summary } = calculateTotalPayroll(employees, 'mensual', parameters, [], false);

  const toggleExoneration = () => {
    if (!canConfig) return;
    onUpdateParameters({
      ...parameters,
      exoneradoArt114_1: !parameters.exoneradoArt114_1
    });
  };

  const handleUpdateArlRate = (clase: keyof typeof parameters.arlRates, val: number) => {
    if (!canConfig) return;
    onUpdateParameters({
      ...parameters,
      arlRates: {
        ...parameters.arlRates,
        [clase]: val
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Seguridad Social Integral y Aportes Parafiscales
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control de aportes a Salud, Pensión, ARL (Riesgos I a V), Caja de Compensación, SENA e ICBF
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canConfig && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{showConfig ? 'Ocultar Parámetros' : 'Ajustar Tarifas'}</span>
            </button>
          )}
          <button
            onClick={() => exportPayrollToExcel(details, company, 'mensual', [])}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar PILA Excel</span>
          </button>
        </div>
      </div>

      {/* Exemption Notice / Tax Rule */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Régimen de Exoneración de Aportes (Art. 114-1 Estatuto Tributario)
            </h4>
            <p className="text-[11px] text-slate-500 max-w-2xl mt-0.5">
              Las personas jurídicas que declaran renta están exoneradas de aportar Salud patronal (8.5%), SENA (2%) e ICBF (3%) por trabajadores que devenguen menos de 10 SMLMV.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {parameters.exoneradoArt114_1 ? 'Exoneración Activa (Aporte reducido)' : 'Sin Exoneración (Aporte pleno 9%)'}
          </span>
          <button
            onClick={toggleExoneration}
            disabled={!canConfig}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              parameters.exoneradoArt114_1 ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            } ${!canConfig ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              parameters.exoneradoArt114_1 ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Config Drawer if open */}
      {showConfig && (
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Parámetros y Tarifas de Cotización
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-500 mb-1">Salud Empleador</label>
              <input
                type="number"
                step="0.005"
                value={parameters.saludEmpleadorPct}
                onChange={e => onUpdateParameters({ ...parameters, saludEmpleadorPct: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded border bg-white dark:bg-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400">Actual: {(parameters.saludEmpleadorPct * 100).toFixed(1)}%</span>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Pensión Empleador</label>
              <input
                type="number"
                step="0.005"
                value={parameters.pensionEmpleadorPct}
                onChange={e => onUpdateParameters({ ...parameters, pensionEmpleadorPct: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded border bg-white dark:bg-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400">Actual: {(parameters.pensionEmpleadorPct * 100).toFixed(1)}%</span>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Caja Compensación</label>
              <input
                type="number"
                step="0.005"
                value={parameters.cajaCompensacionPct}
                onChange={e => onUpdateParameters({ ...parameters, cajaCompensacionPct: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 rounded border bg-white dark:bg-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400">Actual: {(parameters.cajaCompensacionPct * 100).toFixed(1)}%</span>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">ARL Clase I (Oficina)</label>
              <input
                type="number"
                step="0.00001"
                value={parameters.arlRates.clase_1}
                onChange={e => handleUpdateArlRate('clase_1', parseFloat(e.target.value) || 0)}
                className="w-full p-2 rounded border bg-white dark:bg-slate-900 font-mono"
              />
              <span className="text-[10px] text-slate-400">Actual: {(parameters.arlRates.clase_1 * 100).toFixed(3)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Rates Matrix Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seguridad Social Integral */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              1. Seguridad Social Integral
            </span>
            <span className="text-xs font-mono text-blue-600">Total: {formatCOP(summary.totalHealthEmployer + summary.totalPensionEmployer + summary.totalArlEmployer)}</span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Salud Empleador (8.5%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalHealthEmployer)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Pensión Empleador (12%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalPensionEmployer)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">Riesgos Laborales ARL (Clase I 0.522%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalArlEmployer)}</span>
            </div>
          </div>
        </div>

        {/* Aportes Parafiscales */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              2. Aportes Parafiscales (9%)
            </span>
            <span className="text-xs font-mono text-amber-600">Total: {formatCOP(summary.totalParafiscales)}</span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Caja de Compensación Familiar (4%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalParafiscalCaja)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">SENA (Servicio Nacional de Aprendizaje - 2%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalParafiscalSena)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 dark:text-slate-400">ICBF (Instituto Colombiano Bienestar Familiar - 3%):</span>
              <span className="font-mono font-bold">{formatCOP(summary.totalParafiscalIcbf)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed PILA Table by Employee */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Liquidación Detallada de Aportes Patronales (PILA Mensual)
            </h3>
            <p className="text-xs text-slate-500">
              Base de cotización salarial conforme al documento de referencia ($12.000.000 básico)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Empleado & Cargo</th>
                <th className="py-3 px-4 text-right">IBC Período</th>
                <th className="py-3 px-4 text-right">Salud Emp. (8.5%)</th>
                <th className="py-3 px-4 text-right">Pensión Emp. (12%)</th>
                <th className="py-3 px-4 text-right">ARL Emp.</th>
                <th className="py-3 px-4 text-right">Caja (4%)</th>
                <th className="py-3 px-4 text-right">SENA (2%)</th>
                <th className="py-3 px-4 text-right">ICBF (3%)</th>
                <th className="py-3 px-4 text-right font-bold text-indigo-700 dark:text-indigo-400">Total Empleador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {details.map((c) => (
                <tr key={c.employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{c.employee.fullName}</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400">{c.employee.position}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    {formatCOP(c.basicSalaryPeriod)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.healthEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.pensionEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.arlEmployer)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.parafiscalCaja)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.parafiscalSena)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {formatCOP(c.parafiscalIcbf)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20">
                    {formatCOP(c.totalEmployerContributions)}
                  </td>
                </tr>
              ))}

              {/* Total Consolidated Row */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                <td className="py-3.5 px-4 uppercase tracking-wider">
                  TOTALES PATRONALES
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {formatCOP(summary.totalBasicSalaries)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalHealthEmployer)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalPensionEmployer)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalArlEmployer)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalParafiscalCaja)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalParafiscalSena)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono">
                  {formatCOP(summary.totalParafiscalIcbf)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-indigo-700 dark:text-indigo-400 text-sm bg-indigo-100/50 dark:bg-indigo-950/40">
                  {formatCOP(summary.totalEmployerContributions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
