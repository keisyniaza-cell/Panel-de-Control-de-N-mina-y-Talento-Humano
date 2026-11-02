import React, { useState } from 'react';
import { 
  Calculator, 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, Novelty, PayrollEmployeeCalculation, PayrollPeriodType, UserRole } from '../types/payroll';
import { calculateEmployeePayroll, calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';
import { generateGeneralPayrollPDF, generatePaySlipPDF } from '../utils/exportPdf';
import { PaySlipPreviewModal } from '../components/PaySlipPreviewModal';

interface PayrollLiquidationViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
  novelties: Novelty[];
  currentPeriod: PayrollPeriodType;
  onChangePeriod: (period: PayrollPeriodType) => void;
  userRole: UserRole;
}

export const PayrollLiquidationView: React.FC<PayrollLiquidationViewProps> = ({
  company,
  employees,
  parameters,
  novelties,
  currentPeriod,
  onChangePeriod,
  userRole
}) => {
  const [applyNovelties, setApplyNovelties] = useState(false);
  const [selectedCalcForModal, setSelectedCalcForModal] = useState<PayrollEmployeeCalculation | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<{
    prepared: boolean;
    verified: boolean;
    authorized: boolean;
  }>({
    prepared: true,
    verified: false,
    authorized: false
  });

  // Calculate based on toggle
  const { details, summary } = calculateTotalPayroll(
    employees,
    currentPeriod,
    parameters,
    novelties,
    applyNovelties
  );

  const handleExportExcel = () => {
    exportPayrollToExcel(details, company, currentPeriod, novelties);
  };

  const handleExportPDF = () => {
    generateGeneralPayrollPDF(details, company, currentPeriod);
  };

  const handleSinglePaySlipPDF = (calc: PayrollEmployeeCalculation) => {
    generatePaySlipPDF(calc, company, currentPeriod);
  };

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Liquidación de Nómina y Dispersión de Salarios
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cálculo automatizado de salarios, auxilios, horas extras, deducciones de ley y neto a pagar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Periodicidad de pago selector */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            Periodicidad de Pago
          </label>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onChangePeriod('10_dias')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                currentPeriod === '10_dias'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Cada 10 días (3 pagos/mes)
            </button>
            <button
              onClick={() => onChangePeriod('quincenal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                currentPeriod === 'quincenal'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Quincenal (15 días)
            </button>
            <button
              onClick={() => onChangePeriod('mensual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                currentPeriod === 'mensual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Mensual (30 días)
            </button>
          </div>
        </div>

        {/* Novedades Toggle (Base scenario vs Novelties scenario) */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            Escenario de Simulación
          </label>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setApplyNovelties(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                !applyNovelties
                  ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Escenario Base (Sin novedades)
            </button>
            <button
              onClick={() => setApplyNovelties(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                applyNovelties
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <span>Con Novedades Aplicadas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Approvals Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Flujo de Verificación y Aprobación de Nómina
            </h4>
            <p className="text-[11px] text-slate-500">
              Auxiliar contable prepara · Administración verifica · Gerente autoriza desembolso
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Preparada</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => {
              if (userRole === 'administracion' || userRole === 'gerente') {
                setApprovalStatus(p => ({ ...p, verified: !p.verified }));
              }
            }}
            disabled={userRole !== 'administracion' && userRole !== 'gerente'}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition ${
              approvalStatus.verified
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {approvalStatus.verified ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>Verificada (Admin)</span>
          </button>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => {
              if (userRole === 'gerente') {
                setApprovalStatus(p => ({ ...p, authorized: !p.authorized }));
              }
            }}
            disabled={userRole !== 'gerente'}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1 transition ${
              approvalStatus.authorized
                ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {approvalStatus.authorized ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>Autorizada (Gerencia)</span>
          </button>
        </div>
      </div>

      {/* Main Liquidation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Planilla de Liquidación del Período ({currentPeriod === '10_dias' ? '10 Días' : currentPeriod === 'quincenal' ? '15 Días' : '30 Días'})
            </span>
            <span className="text-xs text-slate-500 font-mono">
              · {applyNovelties ? 'Con Novedades' : 'Escenario Base'}
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {details.length} trabajadores liquidados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3">Empleado</th>
                <th className="py-3 px-3">Cargo</th>
                <th className="py-3 px-3 text-right">Básico Período</th>
                <th className="py-3 px-3 text-right">Aux. Transporte</th>
                <th className="py-3 px-3 text-right">Extras / Recargos</th>
                <th className="py-3 px-3 text-right font-bold text-blue-700 dark:text-blue-400">Total Devengado</th>
                <th className="py-3 px-3 text-right">Salud (4%)</th>
                <th className="py-3 px-3 text-right">Pensión (4%)</th>
                <th className="py-3 px-3 text-right font-bold text-red-600">Total Deducción</th>
                <th className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">Neto a Pagar</th>
                <th className="py-3 px-3 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {details.map((calc) => (
                <tr key={calc.employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 dark:text-white">{calc.employee.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {calc.employee.documentType} {calc.employee.documentNumber}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">
                    {calc.employee.position}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-medium">
                    {formatCOP(calc.basicSalaryPeriod)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                    {calc.transportAllowancePeriod > 0 ? formatCOP(calc.transportAllowancePeriod) : '$0'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {calc.overtimeAndSurcharges > 0 ? (
                      <span className="text-blue-600 font-bold">+{formatCOP(calc.overtimeAndSurcharges)}</span>
                    ) : (
                      <span className="text-slate-400">$0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20">
                    {formatCOP(calc.totalEarnings)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">
                    -{formatCOP(calc.healthDeduction)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-red-600">
                    -{formatCOP(calc.pensionDeduction)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-600 bg-red-50/40 dark:bg-red-950/20">
                    -{formatCOP(calc.totalDeductions)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                    {formatCOP(calc.netSalary)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedCalcForModal(calc)}
                        title="Ver Comprobante Individual"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSinglePaySlipPDF(calc)}
                        title="Descargar Comprobante PDF"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Summary Row */}
              <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                <td className="py-3.5 px-3 uppercase tracking-wider" colSpan={2}>
                  TOTALES PERÍODO ({currentPeriod.toUpperCase()})
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  {formatCOP(summary.totalBasicSalaries)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  {formatCOP(summary.totalTransportAllowances)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono">
                  -
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-blue-700 dark:text-blue-400 text-sm">
                  {formatCOP(summary.totalEarnings)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-red-600">
                  -{formatCOP(summary.totalHealthDeductions)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-red-600">
                  -{formatCOP(summary.totalPensionDeductions)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-red-600 text-sm">
                  -{formatCOP(summary.totalDeductions)}
                </td>
                <td className="py-3.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 text-base font-black">
                  {formatCOP(summary.totalNetSalary)}
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="text-[10px] text-slate-400">4 de 4</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Slip Modal */}
      <PaySlipPreviewModal
        isOpen={!!selectedCalcForModal}
        onClose={() => setSelectedCalcForModal(null)}
        calc={selectedCalcForModal}
        company={company}
        periodType={currentPeriod}
      />
    </div>
  );
};
