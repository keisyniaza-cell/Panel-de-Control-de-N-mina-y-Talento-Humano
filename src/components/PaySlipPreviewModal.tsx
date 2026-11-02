import React from 'react';
import { X, Printer, Download, Building2, User, Calendar, DollarSign } from 'lucide-react';
import { CompanyInfo, PayrollEmployeeCalculation, PayrollPeriodType } from '../types/payroll';
import { formatCOP } from '../utils/calculations';
import { generatePaySlipPDF } from '../utils/exportPdf';

interface PaySlipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  calc: PayrollEmployeeCalculation | null;
  company: CompanyInfo;
  periodType: PayrollPeriodType;
}

export const PaySlipPreviewModal: React.FC<PaySlipPreviewModalProps> = ({
  isOpen,
  onClose,
  calc,
  company,
  periodType
}) => {
  if (!isOpen || !calc) return null;

  const emp = calc.employee;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generatePaySlipPDF(calc, company, periodType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Vista Previa del Comprobante de Pago</span>
            <span className="text-xs text-amber-400 font-mono">({emp.fullName})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pay Slip Sheet */}
        <div className="p-8 bg-white text-slate-900 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Company Brand Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {company.legalName}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  NIT: {company.nit}-{company.verificationDigit} | {company.address} · {company.city}
                </p>
                <p className="text-[11px] text-slate-500">
                  Teléfono: {company.phone} · Email: {company.email}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                  COMPROBANTE DE PAGO
                </span>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Modalidad: {periodType === '10_dias' ? 'CADA 10 DÍAS' : periodType === 'quincenal' ? 'QUINCENAL' : 'MENSUAL'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Período: Octubre - Noviembre 2026
                </p>
              </div>
            </div>
          </div>

          {/* Employee Info Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Trabajador</span>
              <span className="font-bold text-slate-900 text-sm block">{emp.fullName}</span>
              <span className="text-slate-600 font-mono">{emp.documentType}: {emp.documentNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Cargo / Proyecto</span>
              <span className="font-bold text-blue-900 block">{emp.position}</span>
              <span className="text-slate-600 text-[11px] truncate block">{emp.assignedProject}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Salario Mensual</span>
              <span className="font-mono font-bold text-slate-900 block">{formatCOP(emp.basicSalary)}</span>
              <span className="text-slate-600 text-[11px]">Días liquidados: {calc.workedDays}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Medio de Pago</span>
              <span className="font-bold text-slate-900 block">{emp.bankName}</span>
              <span className="text-slate-600 font-mono text-[11px]">{emp.accountNumber}</span>
            </div>
          </div>

          {/* Concepts Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Concepto Liquidado</th>
                  <th className="py-2.5 px-4">Referencia / Base</th>
                  <th className="py-2.5 px-4 text-right">Devengados (+)</th>
                  <th className="py-2.5 px-4 text-right">Deducciones (-)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr>
                  <td className="py-2.5 px-4 font-medium">Salario Básico del Período</td>
                  <td className="py-2.5 px-4 text-slate-500">{calc.workedDays} días ordinarios</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold">{formatCOP(calc.basicSalaryPeriod)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                </tr>

                {calc.transportAllowancePeriod > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Auxilio Legal de Transporte</td>
                    <td className="py-2.5 px-4 text-slate-500">Conforme a ley (≤ 2 SMLMV)</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{formatCOP(calc.transportAllowancePeriod)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                  </tr>
                )}

                {calc.overtimeAndSurcharges > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Horas Extras y Recargos</td>
                    <td className="py-2.5 px-4 text-slate-500">Reportadas con soporte</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-700">{formatCOP(calc.overtimeAndSurcharges)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                  </tr>
                )}

                {calc.bonusesSalarial > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Bonificación Salarial</td>
                    <td className="py-2.5 px-4 text-slate-500">Constitutiva de salario</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">{formatCOP(calc.bonusesSalarial)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                  </tr>
                )}

                {/* Deductions */}
                <tr>
                  <td className="py-2.5 px-4 font-medium">Aporte a Salud Trabajador (4%)</td>
                  <td className="py-2.5 px-4 text-slate-500">{emp.eps} (IBC Legal)</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                  <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">{formatCOP(calc.healthDeduction)}</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-medium">Aporte a Pensión Trabajador (4%)</td>
                  <td className="py-2.5 px-4 text-slate-500">{emp.pensionFund} (IBC Legal)</td>
                  <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                  <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">{formatCOP(calc.pensionDeduction)}</td>
                </tr>

                {calc.pensionSolidarityFund > 0 && (
                  <tr>
                    <td className="py-2.5 px-4 font-medium">Fondo de Solidaridad Pensional (1%)</td>
                    <td className="py-2.5 px-4 text-slate-500">Salario superior a 4 SMLMV</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-400">-</td>
                    <td className="py-2.5 px-4 text-right font-mono text-red-600 font-bold">{formatCOP(calc.pensionSolidarityFund)}</td>
                  </tr>
                )}

                {/* Subtotals */}
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2 px-4" colSpan={2}>SUBTOTALES DEL PERÍODO</td>
                  <td className="py-2 px-4 text-right font-mono">{formatCOP(calc.totalEarnings)}</td>
                  <td className="py-2 px-4 text-right font-mono text-red-600">{formatCOP(calc.totalDeductions)}</td>
                </tr>

                {/* Net Pay Grand Row */}
                <tr className="bg-blue-50 text-blue-950 font-black border-t-2 border-blue-900 text-sm">
                  <td className="py-3 px-4" colSpan={2}>
                    TOTAL NETO RECIBIDO A CONSIGNAR
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-base text-emerald-700" colSpan={2}>
                    {formatCOP(calc.netSalary)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Social Security & Legal Footnote */}
          <div className="text-[10px] text-slate-500 space-y-1 mb-8">
            <p>
              * Certificación: Se hace constar que los descuentos por concepto de salud y pensión han sido practicados conforme a la Ley 100 de 1993 y serán consignados mediante la Planilla Integrada de Liquidación de Aportes (PILA).
            </p>
            <p>
              * Jornada ordinaria máxima aplicada: 42 horas semanales conforme al artículo 3 de la Ley 2101 de 2021.
            </p>
          </div>

          {/* Signatures Block */}
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-300 text-xs">
            <div className="text-center">
              <div className="border-b border-slate-400 h-12 mb-2"></div>
              <p className="font-bold text-slate-900">{company.legalRepresentative}</p>
              <p className="text-[11px] text-slate-500">{company.representativeDoc}</p>
              <p className="text-[11px] text-slate-600 font-semibold uppercase">{company.legalName}</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 h-12 mb-2"></div>
              <p className="font-bold text-slate-900">{emp.fullName}</p>
              <p className="text-[11px] text-slate-500">C.C. {emp.documentNumber}</p>
              <p className="text-[11px] text-slate-600 font-semibold uppercase">Firma del Trabajador en Constancia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
