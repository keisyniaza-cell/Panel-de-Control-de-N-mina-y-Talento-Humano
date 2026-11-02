import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyInfo, JobDescription, PayrollEmployeeCalculation, PayrollPeriodType } from '../types/payroll';
import { formatCOP } from './calculations';

export const generatePaySlipPDF = (
  calc: PayrollEmployeeCalculation,
  company: CompanyInfo,
  periodType: PayrollPeriodType,
  periodName: string = 'Período Regular 2026'
) => {
  const doc = new jsPDF();
  const emp = calc.employee;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Deep Navy #0f172a
  doc.rect(0, 0, 210, 32, 'F');

  // Gold accent bar
  doc.setFillColor(217, 119, 6); // Warm Amber Gold #d97706
  doc.rect(0, 32, 210, 2, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(company.legalName.toUpperCase(), 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${company.nit}-${company.verificationDigit} | ${company.city} - ${company.country}`, 14, 21);
  doc.text(`COMPROBANTE INDIVIDUAL DE PAGO DE NÓMINA - ${periodType === '10_dias' ? 'CADA 10 DÍAS' : periodType === 'quincenal' ? 'QUINCENAL' : 'MENSUAL'}`, 14, 28);

  // Employee Information Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL TRABAJADOR Y CONTRATO', 14, 42);

  autoTable(doc, {
    startY: 45,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', cellWidth: 35 },
      3: { cellWidth: 60 }
    },
    body: [
      ['Trabajador:', emp.fullName, 'Identificación:', `${emp.documentType} ${emp.documentNumber}`],
      ['Cargo:', emp.position, 'Proyecto:', emp.assignedProject],
      ['Tipo Contrato:', emp.contractType.replace('_', ' ').toUpperCase(), 'Fecha de Ingreso:', emp.startDate],
      ['Salario Básico Mes:', formatCOP(emp.basicSalary), 'Días Liquidados:', `${calc.workedDays} de ${calc.periodDays} días`],
      ['EPS / Fondo Pensión:', `${emp.eps} / ${emp.pensionFund}`, 'ARL / Caja Comp.:', `${emp.arl} (${emp.arlRiskClass.toUpperCase()}) / ${emp.compensationFund}`],
      ['Entidad Bancaria:', `${emp.bankName} - Cta: ${emp.accountNumber}`, 'Período Liquidado:', periodName]
    ]
  });

  // Table of Concepts (Devengados vs Deducciones)
  const currentY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DE CONCEPTOS LIQUIDADOS', 14, currentY);

  const earningsRows = [
    ['Salario Ordinario Período', `${calc.workedDays} días`, formatCOP(calc.basicSalaryPeriod), ''],
    ['Auxilio de Transporte de Ley', calc.transportAllowancePeriod > 0 ? 'Conforme norma' : 'No aplica', formatCOP(calc.transportAllowancePeriod), ''],
  ];

  if (calc.overtimeAndSurcharges > 0) {
    earningsRows.push(['Horas Extras y Recargos', 'Reportado en novedades', formatCOP(calc.overtimeAndSurcharges), '']);
  }
  if (calc.bonusesSalarial > 0) {
    earningsRows.push(['Bonificación Salarial', 'Período actual', formatCOP(calc.bonusesSalarial), '']);
  }
  if (calc.bonusesNonSalarial > 0) {
    earningsRows.push(['Auxilio / Bono No Salarial', 'Pactado', formatCOP(calc.bonusesNonSalarial), '']);
  }

  const deductionsRows = [
    ['Aporte Salud Trabajador (4%)', 'IBC período', '', formatCOP(calc.healthDeduction)],
    ['Aporte Pensión Trabajador (4%)', 'IBC período', '', formatCOP(calc.pensionDeduction)],
  ];

  if (calc.pensionSolidarityFund > 0) {
    deductionsRows.push(['Fondo de Solidaridad Pensional', 'Salario > 4 SMLMV', '', formatCOP(calc.pensionSolidarityFund)]);
  }

  const combinedRows = [
    ...earningsRows,
    ...deductionsRows,
    ['SUBTOTALES', '', formatCOP(calc.totalEarnings), formatCOP(calc.totalDeductions)],
    ['TOTAL NETO A PAGAR', 'TRANSFERENCIA BANCARIA ELECTRÓNICA', '', formatCOP(calc.netSalary)]
  ];

  autoTable(doc, {
    startY: currentY + 4,
    theme: 'striped',
    head: [['CONCEPTO', 'DETALLE / BASE', 'DEVENGADOS (+)', 'DEDUCCIONES (-)']],
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    body: combinedRows,
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 50 },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    didParseCell: (data) => {
      if (data.row.index === combinedRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [240, 249, 255];
        data.cell.styles.textColor = [15, 23, 42];
      }
    }
  });

  // Employer information and legal note
  const footerY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Nota de validez: Liquidación efectuada conforme al Código Sustantivo del Trabajo, Ley 100 de 1993, Ley 50 de 1990 y Ley 2101 de 2021.', 14, footerY);
  doc.text('Los descuentos de Salud y Pensión fueron retenidos y se consignarán oportunamente en la planilla PILA mensual.', 14, footerY + 5);

  // Signatures
  const sigY = footerY + 28;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, sigY, 90, sigY);
  doc.line(120, sigY, 196, sigY);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CORPORACIÓN SOCIAL SOMOS UNO', 14, sigY + 5);
  doc.text(emp.fullName.toUpperCase(), 120, sigY + 5);

  doc.setFont('helvetica', 'normal');
  doc.text('Firma Empleador / Representante Legal', 14, sigY + 10);
  doc.text(`Firma Trabajador - C.C. ${emp.documentNumber}`, 120, sigY + 10);

  doc.save(`Comprobante_Nomina_${emp.fullName.replace(/\s+/g, '_')}_2026.pdf`);
};

export const generateGeneralPayrollPDF = (
  calculations: PayrollEmployeeCalculation[],
  company: CompanyInfo,
  periodType: PayrollPeriodType
) => {
  const doc = new jsPDF('landscape');

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 26, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 26, 297, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${company.legalName.toUpperCase()} - PLANILLA GENERAL DE NÓMINA`, 14, 12);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${company.nit}-${company.verificationDigit} | Período: ${periodType.replace('_', ' ').toUpperCase()} | Ejercicio 2026 Colombia`, 14, 20);

  const tableData = calculations.map(c => [
    c.employee.fullName,
    c.employee.documentNumber,
    c.employee.position,
    formatCOP(c.basicSalaryPeriod),
    formatCOP(c.transportAllowancePeriod),
    formatCOP(c.overtimeAndSurcharges),
    formatCOP(c.totalEarnings),
    formatCOP(c.healthDeduction),
    formatCOP(c.pensionDeduction),
    formatCOP(c.totalDeductions),
    formatCOP(c.netSalary),
    formatCOP(c.totalLaborCost)
  ]);

  const totalDevengado = calculations.reduce((acc, c) => acc + c.totalEarnings, 0);
  const totalDeducciones = calculations.reduce((acc, c) => acc + c.totalDeductions, 0);
  const totalNeto = calculations.reduce((acc, c) => acc + c.netSalary, 0);
  const totalCostoEmpresa = calculations.reduce((acc, c) => acc + c.totalLaborCost, 0);

  tableData.push([
    'TOTALES CONSOLIDADOS',
    '',
    '',
    formatCOP(calculations.reduce((acc, c) => acc + c.basicSalaryPeriod, 0)),
    formatCOP(calculations.reduce((acc, c) => acc + c.transportAllowancePeriod, 0)),
    formatCOP(calculations.reduce((acc, c) => acc + c.overtimeAndSurcharges, 0)),
    formatCOP(totalDevengado),
    formatCOP(calculations.reduce((acc, c) => acc + c.healthDeduction, 0)),
    formatCOP(calculations.reduce((acc, c) => acc + c.pensionDeduction, 0)),
    formatCOP(totalDeducciones),
    formatCOP(totalNeto),
    formatCOP(totalCostoEmpresa)
  ]);

  autoTable(doc, {
    startY: 34,
    theme: 'grid',
    head: [[
      'EMPLEADO', 'CÉDULA', 'CARGO', 'BÁSICO', 'AUX. TRANS.', 'EXTRAS/REC', 
      'TOTAL DEV.', 'SALUD (4%)', 'PENSIÓN (4%)', 'TOTAL DED.', 'NETO A PAGAR', 'COSTO EMPRESA'
    ]],
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    body: tableData,
    bodyStyles: { fontSize: 7 },
    didParseCell: (data) => {
      if (data.row.index === tableData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.textColor = [15, 23, 42];
      }
    }
  });

  doc.save(`Nomina_General_Somos_Uno_${periodType}_2026.pdf`);
};

export const generateJobDescriptionPDF = (job: JobDescription, company: CompanyInfo) => {
  const doc = new jsPDF();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 30, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(company.legalName.toUpperCase(), 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`MANUAL DE FUNCIONES Y RESPONSABILIDADES - ${job.title.toUpperCase()}`, 14, 22);

  autoTable(doc, {
    startY: 38,
    theme: 'plain',
    body: [
      ['Cargo:', job.title, 'Área:', job.area],
      ['Jefe Inmediato:', job.immediateSupervisor, 'Código:', job.id]
    ],
    bodyStyles: { fontSize: 8.5 }
  });

  let curY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. OBJETIVO GENERAL DEL CARGO', 14, curY);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const splitObj = doc.splitTextToSize(job.generalObjective, 180);
  doc.text(splitObj, 14, curY + 6);

  curY += 8 + (splitObj.length * 4.5);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. RESPONSABILIDADES PRINCIPALES', 14, curY);

  const respData = job.keyResponsibilities.map((r, i) => [`${i + 1}.`, r]);
  autoTable(doc, {
    startY: curY + 3,
    theme: 'plain',
    body: respData,
    bodyStyles: { fontSize: 8, textColor: [51, 65, 85] },
    columnStyles: { 0: { cellWidth: 10, fontStyle: 'bold' }, 1: { cellWidth: 170 } }
  });

  curY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. REQUISITOS DEL PERFIL Y COMPETENCIAS', 14, curY);

  autoTable(doc, {
    startY: curY + 3,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    body: [
      ['Educación Requerida:', job.educationRequirements],
      ['Experiencia Laboral:', job.experienceRequirements],
      ['Competencias Técnicas:', job.technicalSkills.join(', ')],
      ['Competencias Blandas:', job.softSkills.join(', ')]
    ]
  });

  doc.save(`Manual_Funciones_${job.title.replace(/\s+/g, '_')}_Somos_Uno.pdf`);
};
