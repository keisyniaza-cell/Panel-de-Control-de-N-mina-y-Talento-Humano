import { Employee, LegalParameters, Novelty, PayrollEmployeeCalculation, PayrollPeriodType } from '../types/payroll';

export const formatCOP = (val: number): string => {
  if (isNaN(val)) return '$0';
  const rounded = Math.round(val);
  return '$ ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatCOPNoSymbol = (val: number): string => {
  if (isNaN(val)) return '0';
  const rounded = Math.round(val);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const getDaysForPeriod = (period: PayrollPeriodType): number => {
  switch (period) {
    case '10_dias':
      return 10;
    case 'quincenal':
      return 15;
    case 'mensual':
      return 30;
    default:
      return 30;
  }
};

/**
 * Calculates hourly rate based on current legal weekly work hours (42h Ley 2101 de 2021)
 */
export const calculateHourlyRate = (basicSalary: number, parameters: LegalParameters): number => {
  const divisor = parameters.monthlyHoursDivisor || 210;
  return basicSalary / divisor;
};

/**
 * Calculate novelty monetary impact
 */
export const calculateNoveltyAmount = (
  employee: Employee,
  novelty: Partial<Novelty>,
  parameters: LegalParameters
): number => {
  const hourlyRate = calculateHourlyRate(employee.basicSalary, parameters);
  const dailyRate = employee.basicSalary / 30;

  switch (novelty.type) {
    case 'horas_extras_diurnas':
      // +25%
      return Math.round(hourlyRate * 1.25 * (novelty.hours || 0));
    case 'horas_extras_nocturnas':
      // +75%
      return Math.round(hourlyRate * 1.75 * (novelty.hours || 0));
    case 'horas_extras_festivas_diurnas':
      // +100%
      return Math.round(hourlyRate * 2.0 * (novelty.hours || 0));
    case 'horas_extras_festivas_nocturnas':
      // +150%
      return Math.round(hourlyRate * 2.5 * (novelty.hours || 0));
    case 'recargo_nocturno':
      // +35% adicional
      return Math.round(hourlyRate * 0.35 * (novelty.hours || 0));
    case 'recargo_dominical_festivo':
      // +75% (o +100% reforma laboral)
      return Math.round(hourlyRate * 0.75 * (novelty.hours || 0));
    case 'permiso_no_remunerado':
      // Descuenta días
      return -Math.round(dailyRate * (novelty.days || 0));
    case 'ausencia_injustificada':
      // Descuenta día más proporcional dominical
      return -Math.round(dailyRate * 1.167 * (novelty.days || 0));
    case 'llegada_tarde':
      return -Math.round(hourlyRate * (novelty.hours || 0));
    case 'incapacidad_general':
      // Primeros 2 días a cargo de empresa al 66.67% (no menor a salario mínimo)
      // En la simulación académica, el cálculo contable reconoce 66.67% o compensación base
      return Math.round(dailyRate * 0.6667 * (novelty.days || 0));
    case 'incapacidad_laboral':
      return Math.round(dailyRate * 1.0 * (novelty.days || 0));
    case 'bonificacion_salarial':
    case 'bonificacion_no_salarial':
    case 'comision':
      return novelty.calculatedValue || 0;
    default:
      return 0;
  }
};

/**
 * Calculates payroll for a single employee for a given period, with optional novelties toggle
 */
export const calculateEmployeePayroll = (
  employee: Employee,
  period: PayrollPeriodType,
  parameters: LegalParameters,
  novelties: Novelty[] = [],
  includeNovelties: boolean = false
): PayrollEmployeeCalculation => {
  const periodDays = getDaysForPeriod(period);
  const periodRatio = periodDays / 30; // 10/30 = 1/3, 15/30 = 0.5, 30/30 = 1.0

  // Filter novelties for this employee
  const employeeNovelties = includeNovelties 
    ? novelties.filter(n => n.employeeId === employee.id && n.status === 'Aprobada')
    : [];

  let workedDays = periodDays;
  let overtimeAndSurcharges = 0;
  let bonusesSalarial = 0;
  let bonusesNonSalarial = 0;
  let noveltyDeductions = 0;

  if (includeNovelties) {
    for (const nov of employeeNovelties) {
      if (nov.type.includes('horas_extras') || nov.type.includes('recargo')) {
        overtimeAndSurcharges += nov.calculatedValue;
      } else if (nov.type === 'bonificacion_salarial' || nov.type === 'comision') {
        bonusesSalarial += nov.calculatedValue;
      } else if (nov.type === 'bonificacion_no_salarial') {
        bonusesNonSalarial += nov.calculatedValue;
      } else if (nov.type === 'permiso_no_remunerado' || nov.type === 'ausencia_injustificada') {
        workedDays = Math.max(0, workedDays - (nov.days || 1));
        noveltyDeductions += Math.abs(nov.calculatedValue);
      }
    }
  }

  // Base salary for the period
  const basicSalaryPeriod = Math.round(employee.basicSalary * periodRatio);

  // Auxilio de Transporte eligibility: basic salary <= 2 SMLMV
  const maxSalaryForTransport = parameters.smlmv * 2;
  const isEligibleForTransport = employee.basicSalary <= maxSalaryForTransport && employee.transportAllowanceEligible;
  const transportAllowancePeriod = isEligibleForTransport 
    ? Math.round(parameters.auxTransporte * periodRatio)
    : 0;

  // Earnings
  const totalEarnings = basicSalaryPeriod + transportAllowancePeriod + overtimeAndSurcharges + bonusesSalarial + bonusesNonSalarial;

  // IBC (Ingreso Base de Cotización): basic salary + salarial bonuses + overtime (Transport allowance is EXCLUDED by law)
  // When novelties are applied, subtract unpaid absences from IBC
  let ibcPeriod = basicSalaryPeriod + overtimeAndSurcharges + bonusesSalarial;
  if (noveltyDeductions > 0) {
    ibcPeriod = Math.max(0, ibcPeriod - noveltyDeductions);
  }

  // Deductions from employee
  const healthDeduction = Math.round(ibcPeriod * parameters.saludTrabajadorPct);
  const pensionDeduction = Math.round(ibcPeriod * parameters.pensionTrabajadorPct);

  // Fondo de Solidaridad Pensional (if salary > 4 SMLMV)
  let pensionSolidarityFund = 0;
  if (employee.basicSalary > parameters.smlmv * 4) {
    pensionSolidarityFund = Math.round(ibcPeriod * 0.01);
  }

  const otherDeductions = 0;
  const totalDeductions = healthDeduction + pensionDeduction + pensionSolidarityFund + otherDeductions;

  // Net salary to pay
  const netSalary = totalEarnings - totalDeductions - (includeNovelties ? noveltyDeductions : 0);

  // Employer Contributions
  // Exoneration Art 114-1 Estatuto Tributario applies if employee earns < 10 SMLMV
  const isExempt114_1 = parameters.exoneradoArt114_1 && employee.basicSalary < parameters.smlmv * 10;

  const healthEmployer = isExempt114_1 ? 0 : Math.round(ibcPeriod * parameters.saludEmpleadorPct);
  const pensionEmployer = Math.round(ibcPeriod * parameters.pensionEmpleadorPct);

  // ARL based on risk class
  const arlRate = parameters.arlRates[employee.arlRiskClass] || parameters.arlRates.clase_1;
  const arlEmployer = Math.round(ibcPeriod * arlRate);

  // Parafiscales
  const parafiscalCaja = Math.round(ibcPeriod * parameters.cajaCompensacionPct);
  const parafiscalSena = isExempt114_1 ? 0 : Math.round(ibcPeriod * parameters.senaPct);
  const parafiscalIcbf = isExempt114_1 ? 0 : Math.round(ibcPeriod * parameters.icbfPct);

  const totalEmployerContributions = healthEmployer + pensionEmployer + arlEmployer + parafiscalCaja + parafiscalSena + parafiscalIcbf;

  // Social Benefits Provisions (Base includes Transport Allowance for Cesantías and Prima)
  const baseForCesantiasPrima = ibcPeriod + transportAllowancePeriod;
  const baseForVacaciones = ibcPeriod; // Vacaciones do NOT include transport allowance

  // Formulas from document:
  // Cesantías: Base * days / 360  (For 30 days = 30/360 = 1/12 = 8.3333%)
  // Intereses: Cesantías * days * 12% / 360 (For 30 days = 1% of Base)
  // Prima: Base * days / 360
  // Vacaciones: Base * days / 720 (For 30 days = 30/720 = 1/24 = 4.1667%)
  const provisionCesantias = Math.round((baseForCesantiasPrima * periodDays) / 360);
  const provisionInteresesCesantias = Math.round((provisionCesantias * periodDays * parameters.interesesCesantiasPct) / 360);
  const provisionPrima = Math.round((baseForCesantiasPrima * periodDays) / 360);
  const provisionVacaciones = Math.round((baseForVacaciones * periodDays) / 720);

  const totalProvisions = provisionCesantias + provisionInteresesCesantias + provisionPrima + provisionVacaciones;

  // Total Labor Cost = Total Earnings + Employer Contributions + Social Benefits Provisions
  const totalLaborCost = totalEarnings + totalEmployerContributions + totalProvisions;

  return {
    employee,
    periodDays,
    workedDays,
    basicSalaryPeriod,
    transportAllowancePeriod,
    overtimeAndSurcharges,
    bonusesSalarial,
    bonusesNonSalarial,
    totalEarnings,
    healthDeduction,
    pensionDeduction,
    pensionSolidarityFund,
    otherDeductions,
    totalDeductions,
    netSalary,
    healthEmployer,
    pensionEmployer,
    arlEmployer,
    parafiscalCaja,
    parafiscalSena,
    parafiscalIcbf,
    totalEmployerContributions,
    provisionCesantias,
    provisionInteresesCesantias,
    provisionPrima,
    provisionVacaciones,
    totalProvisions,
    totalLaborCost,
    appliedNovelties: employeeNovelties
  };
};

/**
 * Calculates complete payroll summary for an array of employees
 */
export const calculateTotalPayroll = (
  employees: Employee[],
  period: PayrollPeriodType,
  parameters: LegalParameters,
  novelties: Novelty[] = [],
  includeNovelties: boolean = false
) => {
  const activeEmployees = employees.filter(e => e.status !== 'Inactivo');
  const details = activeEmployees.map(emp => 
    calculateEmployeePayroll(emp, period, parameters, novelties, includeNovelties)
  );

  const summary = details.reduce(
    (acc, cur) => {
      acc.totalBasicSalaries += cur.basicSalaryPeriod;
      acc.totalTransportAllowances += cur.transportAllowancePeriod;
      acc.totalEarnings += cur.totalEarnings;
      acc.totalHealthDeductions += cur.healthDeduction;
      acc.totalPensionDeductions += cur.pensionDeduction;
      acc.totalDeductions += cur.totalDeductions;
      acc.totalNetSalary += cur.netSalary;
      // Employer
      acc.totalHealthEmployer += cur.healthEmployer;
      acc.totalPensionEmployer += cur.pensionEmployer;
      acc.totalArlEmployer += cur.arlEmployer;
      acc.totalParafiscalCaja += cur.parafiscalCaja;
      acc.totalParafiscalSena += cur.parafiscalSena;
      acc.totalParafiscalIcbf += cur.parafiscalIcbf;
      acc.totalParafiscales += (cur.parafiscalCaja + cur.parafiscalSena + cur.parafiscalIcbf);
      acc.totalEmployerContributions += cur.totalEmployerContributions;
      // Provisions
      acc.totalProvisionCesantias += cur.provisionCesantias;
      acc.totalProvisionIntereses += cur.provisionInteresesCesantias;
      acc.totalProvisionPrima += cur.provisionPrima;
      acc.totalProvisionVacaciones += cur.provisionVacaciones;
      acc.totalProvisions += cur.totalProvisions;
      // Total Labor Cost
      acc.grandTotalLaborCost += cur.totalLaborCost;
      return acc;
    },
    {
      totalEmployees: activeEmployees.length,
      totalBasicSalaries: 0,
      totalTransportAllowances: 0,
      totalEarnings: 0,
      totalHealthDeductions: 0,
      totalPensionDeductions: 0,
      totalDeductions: 0,
      totalNetSalary: 0,
      totalHealthEmployer: 0,
      totalPensionEmployer: 0,
      totalArlEmployer: 0,
      totalParafiscalCaja: 0,
      totalParafiscalSena: 0,
      totalParafiscalIcbf: 0,
      totalParafiscales: 0,
      totalEmployerContributions: 0,
      totalProvisionCesantias: 0,
      totalProvisionIntereses: 0,
      totalProvisionPrima: 0,
      totalProvisionVacaciones: 0,
      totalProvisions: 0,
      grandTotalLaborCost: 0
    }
  );

  return { details, summary };
};
