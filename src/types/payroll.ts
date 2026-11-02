export type ContractType = 
  | 'termino_indefinido' 
  | 'termino_fijo' 
  | 'obra_o_labor' 
  | 'aprendizaje';

export type ArlRiskClass = 'clase_1' | 'clase_2' | 'clase_3' | 'clase_4' | 'clase_5';

export type UserRole = 
  | 'auxiliar_contable' 
  | 'administracion' 
  | 'gerente' 
  | 'gestor_proyectos';

export type PayrollPeriodType = '10_dias' | 'quincenal' | 'mensual';

export interface Employee {
  id: string;
  fullName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PAS';
  documentNumber: string;
  position: 'Auxiliar contable' | 'Administración' | 'Gerente' | 'Gestor de proyectos' | string;
  contractType: ContractType;
  startDate: string;
  basicSalary: number;
  transportAllowanceEligible: boolean;
  eps: string;
  pensionFund: string;
  arl: string;
  arlRiskClass: ArlRiskClass;
  compensationFund: string;
  phone: string;
  email: string;
  address: string;
  assignedProject: string;
  bankName: string;
  accountNumber: string;
  status: 'Activo' | 'Inactivo' | 'En vacaciones' | 'Incapacitado';
}

export type NoveltyType = 
  | 'incapacidad_general'
  | 'incapacidad_laboral'
  | 'permiso_remunerado'
  | 'permiso_no_remunerado'
  | 'licencia'
  | 'vacaciones'
  | 'horas_extras_diurnas'
  | 'horas_extras_nocturnas'
  | 'horas_extras_festivas_diurnas'
  | 'horas_extras_festivas_nocturnas'
  | 'recargo_nocturno'
  | 'recargo_dominical_festivo'
  | 'ausencia_injustificada'
  | 'llegada_tarde'
  | 'bonificacion_salarial'
  | 'bonificacion_no_salarial'
  | 'comision';

export interface Novelty {
  id: string;
  employeeId: string;
  date: string;
  type: NoveltyType;
  description: string;
  days: number;
  hours: number;
  calculatedValue: number;
  documentSupportName?: string;
  documentSupportUrl?: string;
  status: 'Aprobada' | 'Pendiente' | 'Rechazada';
  createdAt: string;
}

export interface LegalParameters {
  year: number;
  smlmv: number; // $1.750.905 (referencia 2026)
  auxTransporte: number; // $249.095 (referencia 2026)
  maxWeeklyHours: number; // 42 horas conforme a Ley 2101 de 2021 a partir del 15 de julio de 2026
  monthlyHoursDivisor: number; // 210 horas (o 220 según liquidación estándar)
  saludTrabajadorPct: number; // 4%
  pensionTrabajadorPct: number; // 4%
  saludEmpleadorPct: number; // 8.5%
  pensionEmpleadorPct: number; // 12%
  exoneradoArt114_1: boolean; // Exoneración de SENA, ICBF y Salud patronal para < 10 SMLMV
  cajaCompensacionPct: number; // 4%
  senaPct: number; // 2%
  icbfPct: number; // 3%
  arlRates: Record<ArlRiskClass, number>;
  cesantiasPct: number; // 8.3333% (1 mes por año)
  interesesCesantiasPct: number; // 12% anual (1% mensual)
  primaServiciosPct: number; // 8.3333% (1 mes por año)
  vacacionesPct: number; // 4.1667% (15 días hábiles por año)
}

export interface PayrollEmployeeCalculation {
  employee: Employee;
  periodDays: number;
  workedDays: number;
  // Devengados
  basicSalaryPeriod: number;
  transportAllowancePeriod: number;
  overtimeAndSurcharges: number;
  bonusesSalarial: number;
  bonusesNonSalarial: number;
  totalEarnings: number;
  // Deducciones
  healthDeduction: number;
  pensionDeduction: number;
  pensionSolidarityFund: number;
  otherDeductions: number;
  totalDeductions: number;
  // Neto a pagar
  netSalary: number;
  // Aportes Empleador (Costo Empresa)
  healthEmployer: number;
  pensionEmployer: number;
  arlEmployer: number;
  parafiscalCaja: number;
  parafiscalSena: number;
  parafiscalIcbf: number;
  totalEmployerContributions: number;
  // Provisiones Prestaciones Sociales (Costo Empresa)
  provisionCesantias: number;
  provisionInteresesCesantias: number;
  provisionPrima: number;
  provisionVacaciones: number;
  totalProvisions: number;
  // Costo Laboral Total de la Empresa
  totalLaborCost: number;
  // Novedades aplicadas en este período
  appliedNovelties: Novelty[];
}

export interface JobDescription {
  id: string;
  title: string;
  area: string;
  immediateSupervisor: string;
  generalObjective: string;
  keyResponsibilities: string[];
  specificTasks: string[];
  educationRequirements: string;
  experienceRequirements: string;
  technicalSkills: string[];
  softSkills: string[];
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

export interface PhvaStage {
  id: 'planear' | 'hacer' | 'verificar' | 'actuar';
  letter: string;
  title: string;
  description: string;
  activities: string[];
  checklist: { id: string; label: string; completed: boolean; assignedRole: UserRole }[];
  status: 'Completado' | 'En progreso' | 'Pendiente';
}

export interface CompanyInfo {
  legalName: string;
  nit: string;
  verificationDigit: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  legalRepresentative: string;
  representativeDoc: string;
  payrollBank: string;
  payrollAccount: string;
}
