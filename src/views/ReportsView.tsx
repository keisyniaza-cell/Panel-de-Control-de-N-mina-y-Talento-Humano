import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  CheckCircle, 
  Calendar, 
  Building, 
  Users, 
  DollarSign,
  Briefcase,
  ShieldCheck,
  PiggyBank
} from 'lucide-react';
import { CompanyInfo, Employee, LegalParameters, Novelty, PayrollEmployeeCalculation, PayrollPeriodType } from '../types/payroll';
import { calculateEmployeePayroll, calculateTotalPayroll, formatCOP } from '../utils/calculations';
import { exportPayrollToExcel } from '../utils/exportExcel';
import { generateGeneralPayrollPDF, generatePaySlipPDF } from '../utils/exportPdf';
import { PaySlipPreviewModal } from '../components/PaySlipPreviewModal';

interface ReportsViewProps {
  company: CompanyInfo;
  employees: Employee[];
  parameters: LegalParameters;
  novelties: Novelty[];
  currentPeriod: PayrollPeriodType;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  company,
  employees,
  parameters,
  novelties,
  currentPeriod
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [paySlipModalCalc, setPaySlipModalCalc] = useState<PayrollEmployeeCalculation | null>(null);

  const { details, summary } = calculateTotalPayroll(employees, currentPeriod, parameters, novelties, true);
  const selectedEmpCalc = details.find(d => d.employee.id === selectedEmpId) || details[0];

  const reportsList = [
    { id: 'rep-1', title: '1. Nómina General Consolidada', desc: 'Resumen completo de salarios, devengados, deducciones y netos del período.', icon: FileText, category: 'Nómina' },
    { id: 'rep-2', title: '2. Nómina Individual por Empleado', desc: 'Detalle de un empleado específico con desprendible oficial de pago.', icon: Users, category: 'Individual' },
    { id: 'rep-3', title: '3. Comprobantes de Pago', desc: 'Generación de recibos de pago con firma del trabajador y empleador.', icon: Printer, category: 'Individual' },
    { id: 'rep-4', title: '4. Informe de Devengados y Deducciones', desc: 'Discriminación de aportes del 4% en salud y pensión vs ingresos brutos.', icon: DollarSign, category: 'Contable' },
    { id: 'rep-5', title: '5. Horas Extras y Recargos', desc: 'Registro de horas diurnas, nocturnas y festivas con base en 42h (Ley 2101).', icon: Calendar, category: 'Novedades' },
    { id: 'rep-6', title: '6. Incapacidades, Permisos y Ausencias', desc: 'Consolidado de novedades que afectan la jornada y los pagos laborales.', icon: Calendar, category: 'Novedades' },
    { id: 'rep-7', title: '7. Cesantías e Intereses sobre Cesantías', desc: 'Provisiones acumuladas para consignación a fondos y pago directo en enero.', icon: PiggyBank, category: 'Prestaciones' },
    { id: 'rep-8', title: '8. Primas de Servicios Legales y Extralegales', desc: 'Provisión para liquidación semestral de junio y diciembre (Art. 306 CST).', icon: PiggyBank, category: 'Prestaciones' },
    { id: 'rep-9', title: '9. Seguridad Social y Riesgos Laborales', desc: 'Planilla integrada para liquidación de aportes (PILA) de EPS, AFP y ARL.', icon: ShieldCheck, category: 'Seguridad Social' },
    { id: 'rep-10', title: '10. Aportes Parafiscales (Caja, SENA, ICBF)', desc: 'Cálculo del 9% parafiscal sobre la base de nómina y aplicación Art. 114-1.', icon: ShieldCheck, category: 'Parafiscales' },
    { id: 'rep-11', title: '11. Costos Laborales por Proyecto', desc: 'Distribución de costos de nómina entre los programas sociales de Somos Uno.', icon: Briefcase, category: 'Proyectos' },
    { id: 'rep-12', title: '12. Historial de Pagos y Liquidaciones', desc: 'Trazabilidad y auditoría de desembolsos bancarios anteriores.', icon: CheckCircle, category: 'Auditoría' },
  ];

  const handleDownloadExcel = () => {
    exportPayrollToExcel(details, company, currentPeriod, novelties);
  };

  const handleDownloadPDF = () => {
    if (selectedReportId === 'rep-2' || selectedReportId === 'rep-3') {
      if (selectedEmpCalc) {
        generatePaySlipPDF(selectedEmpCalc, company, currentPeriod);
      }
    } else {
      generateGeneralPayrollPDF(details, company, currentPeriod);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Centro de Informes y Exportaciones Oficiales
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generación instantánea en formatos PDF y Excel (.xlsx) de los 12 informes del sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Reports Grid Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Side: Report Catalog */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">
            Catálogo de Informes
          </span>
          <div className="space-y-1">
            {reportsList.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedReportId === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2.5 ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{r.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Report Preview */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {/* Active Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {reportsList.find(r => r.id === selectedReportId)?.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">
                {reportsList.find(r => r.id === selectedReportId)?.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {reportsList.find(r => r.id === selectedReportId)?.desc}
              </p>
            </div>

            {(selectedReportId === 'rep-2' || selectedReportId === 'rep-3') && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Empleado:</span>
                <select
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.position})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Conditional Preview depending on report selected */}
          {selectedReportId === 'rep-2' || selectedReportId === 'rep-3' ? (
            /* Individual Report Preview */
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedEmpCalc?.employee.fullName}</h4>
                  <p className="text-slate-500">{selectedEmpCalc?.employee.position} · {selectedEmpCalc?.employee.assignedProject}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{selectedEmpCalc?.employee.documentType} {selectedEmpCalc?.employee.documentNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Neto Liquidado</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCOP(selectedEmpCalc?.netSalary || 0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Salario Ordinario</span>
                  <span className="font-mono font-medium">{formatCOP(selectedEmpCalc?.basicSalaryPeriod || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Aux. Transporte</span>
                  <span className="font-mono font-medium">{formatCOP(selectedEmpCalc?.transportAllowancePeriod || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Deducción Salud (4%)</span>
                  <span className="font-mono text-red-500">-{formatCOP(selectedEmpCalc?.healthDeduction || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Deducción Pensión (4%)</span>
                  <span className="font-mono text-red-500">-{formatCOP(selectedEmpCalc?.pensionDeduction || 0)}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  onClick={() => setPaySlipModalCalc(selectedEmpCalc)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Ver Formato Oficial Imprimible</span>
                </button>
              </div>
            </div>
          ) : (
            /* General Consolidated Preview */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Empleado</th>
                    <th className="py-2.5 px-3">Cargo</th>
                    <th className="py-2.5 px-3 text-right">Básico</th>
                    <th className="py-2.5 px-3 text-right">Devengado</th>
                    <th className="py-2.5 px-3 text-right">Deducciones</th>
                    <th className="py-2.5 px-3 text-right">Neto a Pagar</th>
                    <th className="py-2.5 px-3 text-right">Costo Empresa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {details.map((c) => (
                    <tr key={c.employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold">{c.employee.fullName}</td>
                      <td className="py-2.5 px-3 text-slate-500">{c.employee.position}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatCOP(c.basicSalaryPeriod)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-blue-600 font-semibold">{formatCOP(c.totalEarnings)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-red-500">-{formatCOP(c.totalDeductions)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">{formatCOP(c.netSalary)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-indigo-600 font-semibold">{formatCOP(c.totalLaborCost)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                    <td className="py-3 px-3 uppercase" colSpan={2}>Totales Período</td>
                    <td className="py-3 px-3 text-right font-mono">{formatCOP(summary.totalBasicSalaries)}</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-600">{formatCOP(summary.totalEarnings)}</td>
                    <td className="py-3 px-3 text-right font-mono text-red-500">-{formatCOP(summary.totalDeductions)}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 text-sm">{formatCOP(summary.totalNetSalary)}</td>
                    <td className="py-3 px-3 text-right font-mono text-indigo-600 text-sm">{formatCOP(summary.grandTotalLaborCost)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Quick PDF & Excel Download Buttons for Active Report */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Corporación Social Somos Uno · Todos los reportes cumplen estándares DIAN, UGPP y CST.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-red-400" />
                <span>Descargar {reportsList.find(r => r.id === selectedReportId)?.title.split('.')[1]} (PDF)</span>
              </button>
              <button
                onClick={handleDownloadExcel}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium flex items-center gap-2 shadow-sm transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Descargar Libro Completo (Excel)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Slip Modal */}
      <PaySlipPreviewModal
        isOpen={!!paySlipModalCalc}
        onClose={() => setPaySlipModalCalc(null)}
        calc={paySlipModalCalc}
        company={company}
        periodType={currentPeriod}
      />
    </div>
  );
};
