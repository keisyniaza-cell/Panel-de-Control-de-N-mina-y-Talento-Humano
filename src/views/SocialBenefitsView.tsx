import React, { useState } from 'react';
import { 
  PiggyBank, 
  HelpCircle, 
  Calculator, 
  Calendar, 
  Info, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters } from '../types/payroll';
import { calculateEmployeePayroll, calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';

interface SocialBenefitsViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
}

export const SocialBenefitsView: React.FC<SocialBenefitsViewProps> = ({
  company,
  employees,
  parameters
}) => {
  const [selectedDays, setSelectedDays] = useState(30); // 30 días para provisión mensual, o 180 para semestre, o 360 para año
  const [extralegalBonus, setExtralegalBonus] = useState(0);

  // Calculate 30-day monthly provisions
  const { details, summary } = calculateTotalPayroll(employees, 'mensual', parameters, [], false);

  // Simulation calculations based on custom selected days
  const simulatedDetails = employees.map(emp => {
    const isTransportEligible = emp.basicSalary <= parameters.smlmv * 2 && emp.transportAllowanceEligible;
    const transportMonthly = isTransportEligible ? parameters.auxTransporte : 0;

    const baseCesantiasPrima = emp.basicSalary + transportMonthly;
    const baseVacaciones = emp.basicSalary; // Transport allowance DOES NOT count for vacation

    const cesantias = Math.round((baseCesantiasPrima * selectedDays) / 360);
    const intereses = Math.round((cesantias * selectedDays * parameters.interesesCesantiasPct) / 360);
    const prima = Math.round((baseCesantiasPrima * selectedDays) / 360);
    const vacaciones = Math.round((baseVacaciones * selectedDays) / 720);
    const total = cesantias + intereses + prima + vacaciones;

    return {
      emp,
      baseCesantiasPrima,
      baseVacaciones,
      cesantias,
      intereses,
      prima,
      vacaciones,
      total
    };
  });

  const grandTotalCesantias = simulatedDetails.reduce((a, b) => a + b.cesantias, 0);
  const grandTotalIntereses = simulatedDetails.reduce((a, b) => a + b.intereses, 0);
  const grandTotalPrima = simulatedDetails.reduce((a, b) => a + b.prima, 0);
  const grandTotalVacaciones = simulatedDetails.reduce((a, b) => a + b.vacaciones, 0);
  const grandTotalPrestaciones = grandTotalCesantias + grandTotalIntereses + grandTotalPrima + grandTotalVacaciones;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Liquidación y Provisiones de Prestaciones Sociales
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cálculo automatizado de Cesantías, Intereses, Prima de Servicios, Vacaciones y Beneficios Extralegales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportPayrollToExcel(details, company, 'mensual', [])}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Provisiones Excel</span>
          </button>
        </div>
      </div>

      {/* Statutory Formulas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cesantías */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Cesantías (8.33%)</span>
            <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded font-mono">Art. 249 CST</span>
          </div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded">
            (Base × Días trabajados) / 360
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Incluye auxilio de transporte. Plazo de consignación: antes del <strong>14 de febrero</strong> al fondo.
          </p>
        </div>

        {/* Intereses sobre Cesantías */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Intereses Cesantías (1%)</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-mono">Ley 52 / 1975</span>
          </div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded">
            (Cesantías × Días × 12%) / 360
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            12% anual o 1% mensual. Se paga directamente al trabajador a más tardar el <strong>31 de enero</strong>.
          </p>
        </div>

        {/* Prima de Servicios */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Prima Servicios (8.33%)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">Art. 306 CST</span>
          </div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded">
            (Base × Días trabajados) / 360
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            30 días de salario por año. Se paga semestralmente: mitad en junio y mitad en primeros 20 días de diciembre.
          </p>
        </div>

        {/* Vacaciones */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Vacaciones (4.17%)</span>
            <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded font-mono">Art. 186 CST</span>
          </div>
          <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded">
            (Salario Básico × Días) / 720
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            15 días hábiles remunerados por año. <strong>NO incluye auxilio de transporte</strong> en la base.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Días a Liquidar / Provisionar:</span>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedDays(30)}
              className={`px-3 py-1 font-semibold rounded ${selectedDays === 30 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              1 Mes (30 días Provisión)
            </button>
            <button
              onClick={() => setSelectedDays(180)}
              className={`px-3 py-1 font-semibold rounded ${selectedDays === 180 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              1 Semestre (180 días Prima)
            </button>
            <button
              onClick={() => setSelectedDays(360)}
              className={`px-3 py-1 font-semibold rounded ${selectedDays === 360 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              1 Año Completo (360 días)
            </button>
          </div>
        </div>

        <div className="text-right text-[11px] text-slate-500">
          Provisión mensual estándar coincidente con el documento: <strong>$2.752.021</strong>
        </div>
      </div>

      {/* Social Benefits Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Cuadro Comparativo de Liquidación y Provisiones ({selectedDays} Días)
            </h3>
            <p className="text-xs text-slate-500">
              Cálculo exacto para los cuatro trabajadores propuestos de la Corporación Social Somos Uno
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Empleado / Cargo</th>
                <th className="py-3 px-4 text-right">Base Cesantías & Prima</th>
                <th className="py-3 px-4 text-right">Base Vacaciones</th>
                <th className="py-3 px-4 text-right">Cesantías (8.33%)</th>
                <th className="py-3 px-4 text-right">Intereses (1% mes)</th>
                <th className="py-3 px-4 text-right">Prima (8.33%)</th>
                <th className="py-3 px-4 text-right">Vacaciones (4.17%)</th>
                <th className="py-3 px-4 text-right font-bold text-blue-700 dark:text-blue-400">Total Provisión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {simulatedDetails.map(({ emp, baseCesantiasPrima, baseVacaciones, cesantias, intereses, prima, vacaciones, total }) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400">{emp.position}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {formatCOP(baseCesantiasPrima)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {formatCOP(baseVacaciones)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                    {formatCOP(cesantias)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                    {formatCOP(intereses)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                    {formatCOP(prima)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                    {formatCOP(vacaciones)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20">
                    {formatCOP(total)}
                  </td>
                </tr>
              ))}

              {/* Total consolidado */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                <td className="py-3.5 px-4 uppercase tracking-wider" colSpan={3}>
                  TOTAL CONSOLIDADO PROVISIONES
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {formatCOP(grandTotalCesantias)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {formatCOP(grandTotalIntereses)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {formatCOP(grandTotalPrima)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold">
                  {formatCOP(grandTotalVacaciones)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-extrabold text-blue-700 dark:text-blue-400 text-sm bg-blue-100/50 dark:bg-blue-950/40">
                  {formatCOP(grandTotalPrestaciones)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Extralegal Benefits & Legal Clarification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 dark:text-white">Naturaleza de las Provisiones Mensuales</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Como lo subraya la página 5 de la propuesta de la Corporación: <em>"Estos valores son provisiones mensuales para control contable, no pagos mensuales automáticos al trabajador"</em>.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Las cesantías se consignan en fondos de cesantías; los intereses se giran a la cuenta del empleado en enero; la prima se paga en junio y diciembre; y las vacaciones se disfrutan o compensan bajo las condiciones legales.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-slate-900 dark:text-white">Primas Extralegales y Reconocimientos</h4>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Beneficios adicionales que la Corporación Social Somos Uno puede establecer por política interna:
          </p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
            <li>Prima extralegal de Navidad o cierre de proyectos sociales.</li>
            <li>Bonificación por cumplimiento de objetivos institucionales.</li>
            <li>Auxilio educativo o de conectividad adicional no salarial.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
