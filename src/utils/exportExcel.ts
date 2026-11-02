import * as XLSX from 'xlsx';
import { CompanyInfo, Novelty, PayrollEmployeeCalculation, PayrollPeriodType } from '../types/payroll';

export const exportPayrollToExcel = (
  calculations: PayrollEmployeeCalculation[],
  company: CompanyInfo,
  periodType: PayrollPeriodType,
  novelties: Novelty[] = []
) => {
  const wb = XLSX.utils.book_new();

  // 1. Sheet: Nómina General
  const generalData = calculations.map((c, index) => ({
    'No.': index + 1,
    'Nombre Completo': c.employee.fullName,
    'Documento': `${c.employee.documentType} ${c.employee.documentNumber}`,
    'Cargo': c.employee.position,
    'Proyecto Asignado': c.employee.assignedProject,
    'Días Liquidados': c.workedDays,
    'Salario Básico Período': c.basicSalaryPeriod,
    'Auxilio Transporte': c.transportAllowancePeriod,
    'Horas Extras y Recargos': c.overtimeAndSurcharges,
    'Bonificaciones': c.bonusesSalarial + c.bonusesNonSalarial,
    'TOTAL DEVENGADO': c.totalEarnings,
    'Salud Trabajador (4%)': c.healthDeduction,
    'Pensión Trabajador (4%)': c.pensionDeduction,
    'Fondo Solidaridad Pensional': c.pensionSolidarityFund,
    'TOTAL DEDUCCIONES': c.totalDeductions,
    'NETO A PAGAR': c.netSalary,
    'Entidad Bancaria': c.employee.bankName,
    'No. Cuenta': c.employee.accountNumber
  }));

  const wsGeneral = XLSX.utils.json_to_sheet(generalData);
  XLSX.utils.book_append_sheet(wb, wsGeneral, 'Nómina General');

  // 2. Sheet: Prestaciones Sociales
  const prestacionesData = calculations.map(c => ({
    'Empleado': c.employee.fullName,
    'Cargo': c.employee.position,
    'Salario Base': c.employee.basicSalary,
    'Base Prestaciones (Inc. Auxilio)': c.basicSalaryPeriod + c.transportAllowancePeriod,
    'Provisión Cesantías (8.33%)': c.provisionCesantias,
    'Provisión Intereses (1% mensual / 12% anual)': c.provisionInteresesCesantias,
    'Provisión Prima Servicios (8.33%)': c.provisionPrima,
    'Provisión Vacaciones (4.17%)': c.provisionVacaciones,
    'TOTAL PROVISIÓN MES': c.totalProvisions
  }));

  const wsPrestaciones = XLSX.utils.json_to_sheet(prestacionesData);
  XLSX.utils.book_append_sheet(wb, wsPrestaciones, 'Prestaciones Sociales');

  // 3. Sheet: Seguridad Social y Parafiscales
  const parafiscalesData = calculations.map(c => ({
    'Empleado': c.employee.fullName,
    'Cargo': c.employee.position,
    'IBC Cotización': c.basicSalaryPeriod + c.overtimeAndSurcharges + c.bonusesSalarial,
    'Salud Empleador (8.5%)': c.healthEmployer,
    'Pensión Empleador (12%)': c.pensionEmployer,
    'ARL Empleador': c.arlEmployer,
    'Caja Compensación (4%)': c.parafiscalCaja,
    'SENA (2%)': c.parafiscalSena,
    'ICBF (3%)': c.parafiscalIcbf,
    'TOTAL APORTES EMPLEADOR': c.totalEmployerContributions
  }));

  const wsSeguridad = XLSX.utils.json_to_sheet(parafiscalesData);
  XLSX.utils.book_append_sheet(wb, wsSeguridad, 'Seguridad Social & Parafiscales');

  // 4. Sheet: Novedades
  const novedadesData = novelties.map(n => {
    const matchedEmp = calculations.find(c => c.employee.id === n.employeeId);
    return {
      'Fecha': n.date,
      'Empleado': matchedEmp?.employee.fullName || n.employeeId,
      'Tipo de Novedad': n.type.replace(/_/g, ' ').toUpperCase(),
      'Días': n.days || 0,
      'Horas': n.hours || 0,
      'Valor Calculado': n.calculatedValue,
      'Estado': n.status,
      'Soporte Documental': n.documentSupportName || 'No adjunto',
      'Descripción': n.description
    };
  });

  const wsNovedades = XLSX.utils.json_to_sheet(novedadesData.length > 0 ? novedadesData : [{ 'Estado': 'Sin novedades registradas' }]);
  XLSX.utils.book_append_sheet(wb, wsNovedades, 'Novedades de Nómina');

  // 5. Sheet: Resumen Costos Totales de Empresa
  const resumenCostosData = calculations.map(c => ({
    'Empleado': c.employee.fullName,
    'Cargo': c.employee.position,
    'Salario y Devengados': c.totalEarnings,
    'Seguridad Social Empleador': c.healthEmployer + c.pensionEmployer + c.arlEmployer,
    'Parafiscales (9%)': c.parafiscalCaja + c.parafiscalSena + c.parafiscalIcbf,
    'Provisiones Prestaciones Sociales': c.totalProvisions,
    'COSTO LABORAL TOTAL EMPRESA': c.totalLaborCost
  }));

  const wsResumen = XLSX.utils.json_to_sheet(resumenCostosData);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Costo Laboral Total');

  // Save the workbook
  XLSX.writeFile(wb, `Nomina_Corporacion_Social_Somos_Uno_${periodType}_2026.xlsx`);
};
