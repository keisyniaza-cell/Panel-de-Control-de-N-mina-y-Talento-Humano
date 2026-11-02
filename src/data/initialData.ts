import { Employee, Novelty, LegalParameters, JobDescription, UserAccount, PhvaStage, CompanyInfo } from '../types/payroll';

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  legalName: 'Corporación Social Somos Uno',
  nit: '901.482.319',
  verificationDigit: '5',
  address: 'Calle 45 # 13 - 35, Oficina 402',
  city: 'Bogotá D.C.',
  country: 'Colombia',
  phone: '+57 (601) 745-9820',
  email: 'contacto@somosuno.org.co',
  legalRepresentative: 'Dra. Elena María Restrepo Morales',
  representativeDoc: 'CC 52.894.120 de Bogotá',
  payrollBank: 'Bancolombia S.A.',
  payrollAccount: 'Cta. Corriente No. 245-891044-12'
};

export const INITIAL_LEGAL_PARAMETERS: LegalParameters = {
  year: 2026,
  smlmv: 1750905, // Referencia académica ejercicio 2026
  auxTransporte: 249095, // Referencia académica ejercicio 2026
  maxWeeklyHours: 42, // Reducción a 42 horas semanales a partir del 15 de julio de 2026 (Ley 2101/2021)
  monthlyHoursDivisor: 210, // 42 hrs/sem * 5 semanas promedio = 210 hrs/mes
  saludTrabajadorPct: 0.04,
  pensionTrabajadorPct: 0.04,
  saludEmpleadorPct: 0.085,
  pensionEmpleadorPct: 0.12,
  exoneradoArt114_1: false, // Simulación académica completa sin exoneración inicial (verificable según Art. 114-1 E.T.)
  cajaCompensacionPct: 0.04,
  senaPct: 0.02,
  icbfPct: 0.03,
  arlRates: {
    clase_1: 0.00522, // 0.522% (Administrativo, financiero, oficina)
    clase_2: 0.01044, // 1.044% (Comercio, manufactura liviana)
    clase_3: 0.02436, // 2.436% (Manufactura media)
    clase_4: 0.04350, // 4.350% (Transporte, obras)
    clase_5: 0.06960, // 6.960% (Construcción, minería, alto riesgo)
  },
  cesantiasPct: 0.0833333, // 1/12
  interesesCesantiasPct: 0.12, // 12% anual (1% mensual)
  primaServiciosPct: 0.0833333, // 1/12
  vacacionesPct: 0.0416667, // 15 días hábiles al año (~1/24)
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    fullName: 'Ana María Gómez Pérez',
    documentType: 'CC',
    documentNumber: '1.018.452.980',
    position: 'Auxiliar contable',
    contractType: 'termino_indefinido',
    startDate: '2024-02-01',
    basicSalary: 2000000,
    transportAllowanceEligible: true,
    eps: 'EPS Sanitas',
    pensionFund: 'Porvenir',
    arl: 'Seguros Bolívar',
    arlRiskClass: 'clase_1',
    compensationFund: 'Compensar',
    phone: '311 458 9201',
    email: 'ana.gomez@somosuno.org.co',
    address: 'Carrera 72 # 54-18, Apto 302, Bogotá',
    assignedProject: 'Gestión Institucional y Central',
    bankName: 'Bancolombia',
    accountNumber: '458-109283-71',
    status: 'Activo'
  },
  {
    id: 'emp-002',
    fullName: 'Carlos Eduardo Ramírez Torres',
    documentType: 'CC',
    documentNumber: '80.194.520',
    position: 'Administración',
    contractType: 'termino_indefinido',
    startDate: '2023-06-15',
    basicSalary: 2500000,
    transportAllowanceEligible: true,
    eps: 'Sura EPS',
    pensionFund: 'Protección',
    arl: 'ARL Sura',
    arlRiskClass: 'clase_1',
    compensationFund: 'Colsubsidio',
    phone: '315 882 1490',
    email: 'carlos.ramirez@somosuno.org.co',
    address: 'Calle 134 # 19-45, Bogotá',
    assignedProject: 'Gestión Institucional y Central',
    bankName: 'Davivienda',
    accountNumber: '0049-2810-9482',
    status: 'Activo'
  },
  {
    id: 'emp-003',
    fullName: 'Claudia Patricia Mendoza Silva',
    documentType: 'CC',
    documentNumber: '52.748.112',
    position: 'Gerente',
    contractType: 'termino_indefinido',
    startDate: '2022-01-10',
    basicSalary: 4500000,
    transportAllowanceEligible: false, // Supera 2 SMLMV ($3.501.810)
    eps: 'Compensar EPS',
    pensionFund: 'Colpensiones',
    arl: 'Positiva Compañía de Seguros',
    arlRiskClass: 'clase_1',
    compensationFund: 'Compensar',
    phone: '310 321 7845',
    email: 'claudia.mendoza@somosuno.org.co',
    address: 'Calle 116 # 7-15, Bogotá',
    assignedProject: 'Dirección Estratégica Somos Uno',
    bankName: 'Banco de Bogotá',
    accountNumber: '190-284910-33',
    status: 'Activo'
  },
  {
    id: 'emp-004',
    fullName: 'David Fernando Lozano Morales',
    documentType: 'CC',
    documentNumber: '1.032.489.150',
    position: 'Gestor de proyectos',
    contractType: 'termino_indefinido',
    startDate: '2023-09-01',
    basicSalary: 3000000,
    transportAllowanceEligible: true,
    eps: 'Nueva EPS',
    pensionFund: 'Colfondos',
    arl: 'Seguros Bolívar',
    arlRiskClass: 'clase_1',
    compensationFund: 'Cafam',
    phone: '317 650 9314',
    email: 'david.lozano@somosuno.org.co',
    address: 'Carrera 15 # 85-30, Apto 501, Bogotá',
    assignedProject: 'Proyecto Inclusión y Desarrollo Social',
    bankName: 'BBVA Colombia',
    accountNumber: '0013-0491-8201',
    status: 'Activo'
  }
];

export const INITIAL_NOVELTIES: Novelty[] = [
  {
    id: 'nov-001',
    employeeId: 'emp-001',
    date: '2026-10-14',
    type: 'incapacidad_general',
    description: 'Un día de incapacidad por enfermedad general (cuadro respiratorio agudo). Certificado EPS Sanitas.',
    days: 1,
    hours: 0,
    calculatedValue: 66667,
    documentSupportName: 'Certificado_Incapacidad_EPS_Sanitas_0049.pdf',
    status: 'Aprobada',
    createdAt: '2026-10-14T08:30:00Z'
  },
  {
    id: 'nov-002',
    employeeId: 'emp-002',
    date: '2026-10-18',
    type: 'horas_extras_diurnas',
    description: 'Dos horas extras diurnas en cierre de auditoría y archivo documental (25% de recargo).',
    days: 0,
    hours: 2,
    calculatedValue: 29762,
    documentSupportName: 'Reporte_Horas_Extras_Aprobadas_Admin.pdf',
    status: 'Aprobada',
    createdAt: '2026-10-18T18:00:00Z'
  },
  {
    id: 'nov-003',
    employeeId: 'emp-004',
    date: '2026-10-22',
    type: 'permiso_no_remunerado',
    description: 'Un día de permiso no remunerado solicitado para diligencia personal notarial.',
    days: 1,
    hours: 0,
    calculatedValue: -100000,
    documentSupportName: 'Carta_Solicitud_Permiso_No_Remunerado.pdf',
    status: 'Aprobada',
    createdAt: '2026-10-20T10:15:00Z'
  }
];

export const INITIAL_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'job-001',
    title: 'Auxiliar contable',
    area: 'Contabilidad y Finanzas',
    immediateSupervisor: 'Dirección Administrativa y Financiera',
    generalObjective: 'Ejecutar las actividades operativas del proceso contable y de liquidación de nómina de la Corporación Social Somos Uno, garantizando el registro oportuno, veraz y soportado documentalmente conforme a las normas laborales y contables vigentes en Colombia.',
    keyResponsibilities: [
      'Registrar las novedades de nómina (incapacidades, horas extras, permisos, vacaciones) con sus respectivos soportes.',
      'Verificar los comprobantes de pago individuales antes y después de la dispersión de fondos.',
      'Apoyar la liquidación de salarios y consolidación de planillas de pago periódicas.',
      'Calcular deducciones legales (salud, pensión, retenciones) y provisiones de prestaciones sociales.',
      'Organizar y custodiar los documentos contables, contractuales y soportes de pago físico y digital.',
      'Generar informes periódicos de nómina y borradores de liquidación para revisión administrativa.'
    ],
    specificTasks: [
      'Ingresar al sistema cada novedad reportada por los líderes de área.',
      'Cotejar las incapacidades radicadas ante las EPS para el cobro y reconocimiento correspondiente.',
      'Calcular las horas extras diurnas, nocturnas y recargos con el divisor de jornada legal (42 horas Ley 2101).',
      'Distribuir los desprendibles de nómina a los trabajadores tras la autorización de la gerencia.',
      'Preparar los archivos planos para la Planilla Integrada de Liquidación de Aportes (PILA).'
    ],
    educationRequirements: 'Tecnólogo o estudiante avanzado de Contaduría Pública, Finanzas o Administración.',
    experienceRequirements: 'Mínimo 1 año en cargos similares de liquidación de nómina y apoyo contable en Colombia.',
    technicalSkills: [
      'Dominio de legislación laboral colombiana (CST, Ley 100, Ley 50, Ley 2101, Ley 2466).',
      'Manejo de sistemas de nómina y herramientas ofimáticas (Excel avanzado).',
      'Liquidación de aportes a la seguridad social y parafiscales.'
    ],
    softSkills: [
      'Alto nivel de atención al detalle y precisión numérica.',
      'Confidencialidad y ética en el manejo de datos salariales sensibles.',
      'Organización y cumplimiento estricto de cronogramas de pago.'
    ]
  },
  {
    id: 'job-002',
    title: 'Administración',
    area: 'Gestión Humana y Operaciones Administrativas',
    immediateSupervisor: 'Gerencia General',
    generalObjective: 'Liderar y coordinar la gestión administrativa y del talento humano en la Corporación Social Somos Uno, supervisando el cumplimiento contractual, la validación de novedades y la estricta concordancia de las liquidaciones de nómina con las directrices institucionales.',
    keyResponsibilities: [
      'Supervisar la información laboral de todos los empleados y el archivo de hojas de vida.',
      'Revisar exhaustivamente contratos de trabajo, afiliaciones al sistema de seguridad social y novedades del período.',
      'Verificar las liquidaciones de nómina preparadas por el área contable antes de enviarlas a Gerencia.',
      'Controlar y planificar los períodos de pago (cada 10 días, quincenales o mensuales) y fechas límites.',
      'Aprobar los procesos administrativos correspondientes, permisos justificados y solicitudes de vacaciones.'
    ],
    specificTasks: [
      'Auditar mensualmente la correspondencia entre los contratos suscritos y las bases salariales liquidadas.',
      'Validar las certificaciones médicas de incapacidad y gestionar trámites de reembolso ante EPS y ARL.',
      'Monitorear la actualización de tarifas parafiscales y clasificación de riesgo en ARL (Clase I a V).',
      'Coordinar con los gestores de proyectos la asignación formal de personal a cada programa social.',
      'Firmar el acta de verificación de nómina para avalar el desembolso gerencial.'
    ],
    educationRequirements: 'Profesional en Administración de Empresas, Ingeniería Industrial, Psicología Organizacional o afines.',
    experienceRequirements: 'Mínimo 2 años en administración de personal, coordinación administrativa o gestión de talento humano.',
    technicalSkills: [
      'Auditoría y control interno de nómina y prestaciones sociales.',
      'Normatividad de contratación laboral y seguridad y salud en el trabajo (SG-SST).',
      'Gestión documental y gestión presupuestal de nómina.'
    ],
    softSkills: [
      'Liderazgo y comunicación asertiva.',
      'Capacidad de resolución de conflictos y mediación laboral.',
      'Pensamiento analítico y supervisión orientada a la calidad.'
    ]
  },
  {
    id: 'job-003',
    title: 'Gerente',
    area: 'Dirección General y Representación Legal',
    immediateSupervisor: 'Junta Directiva / Asamblea General',
    generalObjective: 'Dirigir estratégicamente la Corporación Social Somos Uno, ejerciendo la supervisión integral de las obligaciones laborales, aprobando presupuestos y autorizando la dispersión de los recursos de nómina con total transparencia, solvencia y responsabilidad jurídica.',
    keyResponsibilities: [
      'Supervisar el proceso general de nómina y el estricto cumplimiento del marco legal colombiano.',
      'Autorizar los pagos definitivos de nómina, cesantías, primas y aportes a la seguridad social.',
      'Consultar informes financieros, de costos laborales y de ejecución presupuestal.',
      'Aprobar presupuestos laborales anuales y políticas de incentivos o primas extralegales.',
      'Tomar decisiones estratégicas relacionadas con la contratación, desvinculación y desarrollo del personal.'
    ],
    specificTasks: [
      'Revisar el informe consolidado mensual de costos laborales ($19.101.946 para el escenario base).',
      'Autorizar en el portal bancario corporativo la dispersión electrónica de nómina.',
      'Firmar y respaldar legalmente las políticas laborales internas y los reglamentos de trabajo.',
      'Garantizar la provisión oportuna de fondos para el pago de cesantías e intereses en los plazos de ley.',
      'Representar a la Corporación ante entidades de vigilancia laboral y tributaria (UGPP, MinTrabajo, DIAN).'
    ],
    educationRequirements: 'Profesional con especialización o maestría en Gerencia, Dirección de Entidades sin Ánimo de Lucro, Finanzas o Derecho Laboral.',
    experienceRequirements: 'Mínimo 4 años de experiencia en cargos de alta dirección o gerencia general.',
    technicalSkills: [
      'Finanzas corporativas y planeación tributaria laboral.',
      'Marco legal de entidades sin ánimo de lucro y contratación laboral colombiana.',
      'Gestión de riesgos institucionales y control de auditoría.'
    ],
    softSkills: [
      'Visión estratégica y toma de decisiones éticas.',
      'Negociación de alto nivel y relacionamiento institucional.',
      'Liderazgo transformacional y compromiso social.'
    ]
  },
  {
    id: 'job-004',
    title: 'Gestor de proyectos',
    area: 'Operaciones de Proyectos y Programas Sociales',
    immediateSupervisor: 'Dirección de Proyectos / Gerencia',
    generalObjective: 'Planificar, ejecutar y evaluar los proyectos sociales de la Corporación Social Somos Uno, monitoreando la asignación del personal a cada proyecto, controlando los costos laborales imputados y asegurando el logro de los objetivos con eficiencia presupuestal.',
    keyResponsibilities: [
      'Consultar los costos laborales asignados a cada proyecto social de la organización.',
      'Registrar la asignación de personal técnico y profesional a los diferentes frentes comunitarios.',
      'Verificar y comparar los presupuestos de personal proyectados vs. costos reales ejecutados.',
      'Generar informes periódicos de costos laborales por proyecto para cooperantes y donantes.',
      'Apoyar el seguimiento del talento humano en campo, reportando novedades oportunas al área de nómina.'
    ],
    specificTasks: [
      'Distribuir las horas y porcentajes de dedicación de los colaboradores a cada contrato social.',
      'Cotejar que los costos de nómina no sobrepasen las partidas presupuestales aprobadas por los cooperantes.',
      'Reportar horas extras o novedades derivadas de actividades de fin de semana en comunidades.',
      'Evaluar el impacto de la nómina en los entregables y cronogramas de cada iniciativa social.',
      'Validar que los informes de gastos de nómina cumplan con las normas de auditoría de los financiadores.'
    ],
    educationRequirements: 'Profesional en Ciencias Sociales, Ingeniería, Administración de Proyectos o áreas afines, con certificación en formulación de proyectos (PMI, MGA o afín).',
    experienceRequirements: 'Mínimo 2 años en formulación, gestión y seguimiento presupuestal de proyectos sociales o comunitarios.',
    technicalSkills: [
      'Metodologías de gestión de proyectos (Marco Lógico, MGA, PMI, Ágiles).',
      'Control de costos y ejecución presupuestal por centros de costo.',
      'Herramientas de reporte y análisis financiero de proyectos.'
    ],
    softSkills: [
      'Trabajo en equipo multidisciplinario y empatía social.',
      'Capacidad organizativa y gestión del tiempo.',
      'Comunicación fluida y orientación a resultados comunitarios.'
    ]
  }
];

export const INITIAL_PHVA_STAGES: PhvaStage[] = [
  {
    id: 'planear',
    letter: 'P',
    title: 'PLANEAR',
    description: 'Organizar contratos, salarios, fechas, calendario de pago y obligaciones laborales.',
    activities: [
      'Identificar empleados activos y modalidades de contrato (indefinido, fijo, etc.).',
      'Establecer salarios básicos mensuales y auxilio de transporte para salarios ≤ 2 SMLMV.',
      'Definir calendario y periodicidad de pagos (cada 10 días, quincenal o mensual).',
      'Identificar obligaciones legales de seguridad social, parafiscales y fechas de vencimiento PILA.',
      'Proyectar presupuestos y reservas para prestaciones sociales del período.'
    ],
    checklist: [
      { id: 'chk-p1', label: 'Contratos laborales y carpetas de empleados actualizadas', completed: true, assignedRole: 'administracion' },
      { id: 'chk-p2', label: 'Calendario de corte y fechas de pago 2026 configurado', completed: true, assignedRole: 'administracion' },
      { id: 'chk-p3', label: 'Parámetros legales 2026 validados (SMLMV $1.750.905, Auxilio $249.095, 42h)', completed: true, assignedRole: 'auxiliar_contable' },
      { id: 'chk-p4', label: 'Presupuesto de costos laborales por proyecto aprobado', completed: true, assignedRole: 'gerente' }
    ],
    status: 'Completado'
  },
  {
    id: 'hacer',
    letter: 'H',
    title: 'HACER',
    description: 'Registrar novedades, calcular devengados y deducciones, liquidar prestaciones y realizar pagos.',
    activities: [
      'Registrar todas las novedades del personal con sus soportes digitales.',
      'Calcular salarios, auxilio de transporte, horas extras, recargos y bonificaciones.',
      'Aplicar deducciones de ley (salud 4%, pensión 4%, fondo de solidaridad).',
      'Liquidar provisiones de cesantías, intereses, prima y vacaciones.',
      'Generar archivos de dispersión bancaria y comprobantes individuales de nómina.'
    ],
    checklist: [
      { id: 'chk-h1', label: 'Novedades del período ingresadas con soporte documental', completed: true, assignedRole: 'auxiliar_contable' },
      { id: 'chk-h2', label: 'Preliquidación de nómina ejecutada sin diferencias matemáticas', completed: true, assignedRole: 'auxiliar_contable' },
      { id: 'chk-h3', label: 'Comprobantes de pago individuales generados para revisión', completed: false, assignedRole: 'auxiliar_contable' },
      { id: 'chk-h4', label: 'Dispersión bancaria de salarios efectuada oportunamente', completed: false, assignedRole: 'gerente' }
    ],
    status: 'En progreso'
  },
  {
    id: 'verificar',
    letter: 'V',
    title: 'VERIFICAR',
    description: 'Revisar cálculos, comparar pagos con contratos, verificar aportes a seguridad social e informes.',
    activities: [
      'Auditar cálculos de devengados y deducciones frente a novedades y contratos.',
      'Comparar planilla de seguridad social (PILA) con los valores liquidados.',
      'Verificar soportes médicos de incapacidades y planillas de horas extras.',
      'Revisar informes de costos laborales asignados por centro de costo o proyecto.',
      'Validar comprobantes firmados y constancias de transferencia bancaria.'
    ],
    checklist: [
      { id: 'chk-v1', label: 'Auditoría cruzada de liquidación vs contratos efectuada', completed: false, assignedRole: 'administracion' },
      { id: 'chk-v2', label: 'Planilla PILA conciliada con nómina del período', completed: false, assignedRole: 'administracion' },
      { id: 'chk-v3', label: 'Informe de costos laborales revisado por Gestor de Proyectos', completed: false, assignedRole: 'gestor_proyectos' },
      { id: 'chk-v4', label: 'Acta de visto bueno gerencial suscrita', completed: false, assignedRole: 'gerente' }
    ],
    status: 'Pendiente'
  },
  {
    id: 'actuar',
    letter: 'A',
    title: 'ACTUAR',
    description: 'Corregir errores, actualizar información, mejorar procedimientos e implementar controles.',
    activities: [
      'Ajustar diferencias identificadas en el período siguiente o en nómina complementaria.',
      'Actualizar parámetros normativos cuando el Gobierno Nacional expida nuevos decretos.',
      'Fortalecer controles de asistencia, reportes de incapacidad y horas extras.',
      'Capacitar a los líderes de proyecto en la radicación oportuna de novedades.',
      'Reiniciar el ciclo PHVA para el siguiente corte de liquidación.'
    ],
    checklist: [
      { id: 'chk-a1', label: 'Retroalimentación de novedades y tiempos de entrega analizada', completed: false, assignedRole: 'administracion' },
      { id: 'chk-a2', label: 'Ajustes a procedimientos contables documentados', completed: false, assignedRole: 'auxiliar_contable' },
      { id: 'chk-a3', label: 'Actualización de normas laborales en la plataforma', completed: false, assignedRole: 'administracion' },
      { id: 'chk-a4', label: 'Lecciones aprendidas aplicadas al siguiente período', completed: false, assignedRole: 'gerente' }
    ],
    status: 'Pendiente'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-001',
    username: 'auxiliar.contable',
    fullName: 'Ana María Gómez Pérez',
    email: 'ana.gomez@somosuno.org.co',
    role: 'auxiliar_contable',
    twoFactorEnabled: false
  },
  {
    id: 'usr-002',
    username: 'administracion',
    fullName: 'Carlos Eduardo Ramírez Torres',
    email: 'carlos.ramirez@somosuno.org.co',
    role: 'administracion',
    twoFactorEnabled: true
  },
  {
    id: 'usr-003',
    username: 'gerente',
    fullName: 'Claudia Patricia Mendoza Silva',
    email: 'claudia.mendoza@somosuno.org.co',
    role: 'gerente',
    twoFactorEnabled: true
  },
  {
    id: 'usr-004',
    username: 'gestor.proyectos',
    fullName: 'David Fernando Lozano Morales',
    email: 'david.lozano@somosuno.org.co',
    role: 'gestor_proyectos',
    twoFactorEnabled: false
  }
];

export const COLOMBIAN_LABOR_LAWS = [
  {
    norma: 'Código Sustantivo del Trabajo (CST)',
    año: '1950',
    descripcion: 'Estatuto rector que regula las relaciones laborales individuales entre empleadores y trabajadores en Colombia.',
    articulosClave: 'Art. 22 (Contrato de trabajo), Art. 127 (Elementos integrantes del salario), Art. 132 (Formas de remuneración), Art. 186 (Vacaciones anuales remuneradas), Art. 249 (Regla general de cesantías), Art. 306 (Prima de servicios legal).',
    aplicacionNomina: 'Fija las bases para liquidar salarios, descansos obligatorios, licencias, régimen sancionatorio y causales de despido.'
  },
  {
    norma: 'Ley 50 de 1990',
    año: '1990',
    descripcion: 'Reforma sustancial al régimen de cesantías e intermediación laboral.',
    articulosClave: 'Art. 98 al 106 (Régimen tradicional vs. régimen liquidación anual con consignación a fondos privados de cesantías).',
    aplicacionNomina: 'Establece la obligación de liquidar cesantías a 31 de diciembre y consignarlas en el fondo elegido por el empleado a más tardar el 14 de febrero.'
  },
  {
    norma: 'Ley 52 de 1975',
    año: '1975',
    descripcion: 'Régimen de reconocimiento y pago de intereses sobre cesantías a favor de los trabajadores.',
    articulosClave: 'Art. 1 (Interés del 12% anual o proporcional sobre el saldo acumulado de cesantías al 31 de diciembre o fecha de retiro).',
    aplicacionNomina: 'Obliga a pagar los intereses directamente al trabajador a más tardar el 31 de enero de cada año o en la liquidación final.'
  },
  {
    norma: 'Ley 100 de 1993',
    año: '1993',
    descripcion: 'Creación del Sistema de Seguridad Social Integral en Colombia (Salud, Pensiones y Riesgos Laborales).',
    articulosClave: 'Libro I (Sistema General de Pensiones), Libro II (Sistema General de Seguridad Social en Salud). Cotización pensión 16% (12% empleador, 4% trabajador). Cotización salud 12.5% (8.5% empleador, 4% trabajador).',
    aplicacionNomina: 'Marco legal para las deducciones obligatorias al empleado y los aportes a cargo del empleador en cada nómina.'
  },
  {
    norma: 'Ley 789 de 2002',
    año: '2002',
    descripcion: 'Medidas de protección social, aportes parafiscales y flexibilización de jornada y recargos.',
    articulosClave: 'Art. 46 (Cajas de Compensación Familiar 4%), SENA 2%, ICBF 3%. Modificaciones a recargos nocturnos e indemnizaciones.',
    aplicacionNomina: 'Determina las tarifas parafiscales del 9% sobre la nómina mensual y sus condiciones de exigibilidad.'
  },
  {
    norma: 'Ley 2101 de 2021',
    año: '2021',
    descripcion: 'Reducción gradual de la jornada laboral ordinaria sin disminuir el salario ni los derechos adquiridos.',
    articulosClave: 'Cronograma: 47h en 2023, 46h en 2024, 44h en 2025, y 42 horas semanales a partir del 15 de julio de 2026.',
    aplicacionNomina: 'Modifica el divisor para calcular el valor de la hora ordinaria de trabajo y de las horas extras (210 horas en 2026 frente a las tradicionales 240 horas).'
  },
  {
    norma: 'Ley 2466 de 2025',
    año: '2025',
    descripcion: 'Reforma laboral de garantías laborales y condiciones de trabajo digno en Colombia.',
    articulosClave: 'Jornada diurna de 6:00 a.m. a 7:00 p.m., recargo nocturno a partir de las 7:00 p.m. (+35%), recargo por trabajo dominical y festivo al 100%, fortalecimiento de estabilidad laboral.',
    aplicacionNomina: 'Impacto directo en el cálculo de horas extras nocturnas y recargos dominicales en las liquidaciones a partir de 2025-2026.'
  },
  {
    norma: 'Decreto 1072 de 2015',
    año: '2015',
    descripcion: 'Decreto Único Reglamentario del Sector Trabajo.',
    articulosClave: 'Libro 2, Parte 2 (Reglamentaciones laborales, seguridad y salud en el trabajo, tercerización y aportes PILA).',
    aplicacionNomina: 'Compila normas aplicables a la liquidación de prestaciones, incapacidades y registro contable de nómina.'
  }
];

export const PROJECTS_LIST = [
  { id: 'proj-01', code: 'PROJ-SOMOS-01', name: 'Gestión Institucional y Central', budget: 150000000, description: 'Sede administrativa, finanzas y dirección estratégica de la Corporación.' },
  { id: 'proj-02', code: 'PROJ-SOMOS-02', name: 'Proyecto Inclusión y Desarrollo Social', budget: 280000000, description: 'Intervención comunitaria y fortalecimiento a poblaciones vulnerables.' },
  { id: 'proj-03', code: 'PROJ-SOMOS-03', name: 'Dirección Estratégica Somos Uno', budget: 120000000, description: 'Alianzas, formulación y cooperación internacional.' },
  { id: 'proj-04', code: 'PROJ-SOMOS-04', name: 'Formación Comunitaria y Emprendimiento', budget: 190000000, description: 'Capacitación técnica y desarrollo de microempresas barriales.' }
];
