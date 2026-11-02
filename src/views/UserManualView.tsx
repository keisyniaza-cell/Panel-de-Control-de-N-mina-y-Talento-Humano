import React, { useState } from 'react';
import { 
  HelpCircle, 
  LogIn, 
  UserPlus, 
  Edit3, 
  FileText, 
  Calculator, 
  PiggyBank, 
  ShieldCheck, 
  Download, 
  Printer, 
  Settings, 
  ArrowRight,
  CheckCircle2,
  BookOpen,
  ChevronRight
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const guideSteps = [
    {
      id: 1,
      title: '1. Ingreso a la Plataforma y Roles',
      icon: LogIn,
      summary: 'Acceso seguro mediante perfiles asignados (Auxiliar Contable, Administración, Gerente, Gestor de Proyectos).',
      steps: [
        'En la esquina superior derecha, haga clic sobre el avatar de usuario para verificar su perfil actual.',
        'Puede simular y alternar entre los 4 perfiles autorizados para validar permisos específicos.',
        'El sistema cuenta con soporte para doble factor de autenticación (2FA) para proteger datos sensibles de nómina.'
      ],
      tip: 'Cada rol tiene permisos específicos: el auxiliar prepara la preliquidación, la administración verifica los soportes y la gerencia autoriza la dispersión de fondos.'
    },
    {
      id: 2,
      title: '2. Registro de Empleados',
      icon: UserPlus,
      summary: 'Creación de trabajadores con identificación, salario, EPS, pensión, ARL, caja y proyecto.',
      steps: [
        'Diríjase al módulo "2. Empleados" en la barra lateral izquierda.',
        'Haga clic en el botón azul superior "+ Registrar Empleado".',
        'Complete los datos de identificación, tipo de contrato (indefinido, fijo, etc.) y fecha de ingreso.',
        'Ingrese el salario básico mensual. El sistema detectará automáticamente si devenga ≤ 2 SMLMV ($3.501.810 en 2026) para asignar el auxilio de transporte legal.',
        'Seleccione las afiliaciones a EPS, Fondo de Pensiones, ARL (Riesgo I a V) y Caja de Compensación Familiar.',
        'Haga clic en "Guardar Empleado" para registrar el trabajador en la base de datos.'
      ],
      tip: 'Puede usar el buscador en tiempo real para encontrar empleados por nombre, cédula o proyecto.'
    },
    {
      id: 3,
      title: '3. Modificación de Información',
      icon: Edit3,
      summary: 'Actualización de salarios, ascensos, cambios de cuenta bancaria o afiliaciones.',
      steps: [
        'En la tabla de empleados, ubique la fila del trabajador a modificar.',
        'Haga clic en el icono de lápiz amarillo "Editar".',
        'Modifique el salario, proyecto asignado o datos bancarios según el requerimiento.',
        'Guarde los cambios. Todas las liquidaciones y reportes futuros se recalcularán automáticamente.'
      ],
      tip: 'Si desea eliminar un empleado, el sistema le solicitará una confirmación explícita para evitar pérdidas accidentales de datos.'
    },
    {
      id: 4,
      title: '4. Registro de Novedades y Horas Extras',
      icon: FileText,
      summary: 'Gestión con soporte documental de incapacidades, horas extras, permisos y vacaciones.',
      steps: [
        'Ingrese al módulo "4. Novedades y Horas Extras".',
        'Haga clic en "+ Registrar Novedad".',
        'Seleccione el empleado correspondiente y el tipo de novedad (Incapacidad general, horas extras diurnas, nocturnas, etc.).',
        'Ingrese la cantidad de días u horas. El sistema calculará el valor monetario automáticamente usando el divisor de 42 horas semanales (Ley 2101).',
        'Adjunte o especifique el nombre del soporte documental (certificado EPS, planilla de horas extras).',
        'Haga clic en "Guardar Novedad".'
      ],
      tip: 'Una incapacidad general se liquida sobre el 66.67%, mientras que los permisos no remunerados descuentan días de salario.'
    },
    {
      id: 5,
      title: '5. Liquidación de Nómina Periódica',
      icon: Calculator,
      summary: 'Cálculo automatizado de salarios cada 10 días, quincenales o mensuales.',
      steps: [
        'Abra el módulo "3. Liquidación Nómina".',
        'Seleccione la periodicidad deseada: "Cada 10 días", "Quincenal" o "Mensual".',
        'Active el interruptor "Con Novedades Aplicadas" si desea ver el impacto de las incapacidades y horas extras del período.',
        'Revise la tabla: el sistema calcula automáticamente los básicos proporcionales, el auxilio de transporte, las deducciones de salud (4%) y pensión (4%), y el neto a pagar.',
        'Siga el flujo de visto bueno: Auxiliar (prepara) → Administración (verifica) → Gerente (autoriza).'
      ],
      tip: 'Pagar cada 10 días distribuye el valor neto mensual entre los 3 cortes del mes sin duplicar deducciones.'
    },
    {
      id: 6,
      title: '6. Cálculo de Prestaciones Sociales',
      icon: PiggyBank,
      summary: 'Provisiones contables de cesantías, intereses, prima y vacaciones con fórmulas legales.',
      steps: [
        'Ingrese al módulo "5. Prestaciones Sociales".',
        'Consulte las tarjetas explicativas con las fórmulas exactas del Código Sustantivo del Trabajo.',
        'Seleccione el período de simulación (1 mes provisión, 1 semestre para prima o 1 año).',
        'Observe cómo la base de cesantías y prima incluye el auxilio de transporte, mientras que la base de vacaciones toma únicamente el salario básico.',
        'Consulte el total de reservas que la Corporación debe provisionar mensualmente ($2.752.021 para el simulacro).'
      ],
      tip: 'Las cesantías se consignan antes del 14 de febrero y los intereses se pagan directamente antes del 31 de enero.'
    },
    {
      id: 7,
      title: '7. Seguridad Social y Parafiscales',
      icon: ShieldCheck,
      summary: 'Control de aportes patronales a salud, pensión, ARL (Riesgos I a V), Caja, SENA e ICBF.',
      steps: [
        'Ingrese al módulo "6. Seguridad & Parafiscales".',
        'Verifique la simulación de la planilla PILA mensual con base de $12.000.000.',
        'Si la Corporación aplica la exoneración del Art. 114-1 del E.T., puede activar el switch de exoneración tributaria para eximir aportes de salud patronal, SENA e ICBF en salarios menores a 10 SMLMV.',
        'Exporte la planilla consolidada a Excel para importar en operadores PILA.'
      ],
      tip: 'La tarifa de ARL se ajusta según el riesgo del centro de trabajo (0.522% para el riesgo administrativo Clase I).'
    },
    {
      id: 8,
      title: '8. Generación de Informes y Comprobantes',
      icon: Download,
      summary: 'Descarga en PDF y Excel de nómina general, desprendibles individuales y costos.',
      steps: [
        'Ingrese al módulo "7. Informes (PDF / Excel)".',
        'Seleccione cualquiera de los 12 tipos de informes disponibles en el menú lateral.',
        'Previsualice los datos en pantalla.',
        'Haga clic en "Descargar PDF" para obtener un documento con membrete oficial de la Corporación Social Somos Uno, o en "Exportar Excel" para la planilla de cálculo.'
      ],
      tip: 'Para comprobantes de pago individuales, puede imprimir directamente con formato de firmas del empleador y trabajador.'
    },
    {
      id: 9,
      title: '9. Instalación, Respaldo y Desinstalación',
      icon: Settings,
      summary: 'Instalación como App (PWA), copias de seguridad en JSON y desinstalación protegida.',
      steps: [
        'Ingrese al módulo "14. Configuración & PWA".',
        'En "Instalar App", haga clic en "Instalar en este Dispositivo" para anclar la plataforma a su escritorio o pantalla de inicio.',
        'En "Copias de Seguridad", descargue un respaldo periódico en formato JSON para custodiar los registros.',
        'Si necesita desinstalar o reiniciar la base de datos, el sistema le exigirá descargar un respaldo previo y autorizar expresamente la acción.'
      ],
      tip: 'Mantenga siempre copias de respaldo descargadas en el almacenamiento seguro de la Corporación.'
    }
  ];

  const currentStep = guideSteps.find(s => s.id === activeStepId) || guideSteps[0];
  const StepIcon = currentStep.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Manual de Usuario de la Plataforma
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Guía interactiva paso a paso para el uso eficiente y seguro de todos los módulos del sistema
          </p>
        </div>
      </div>

      {/* Guide Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Steps Menu */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">
            Contenido del Manual
          </span>
          <div className="space-y-1">
            {guideSteps.map((step) => {
              const isSelected = step.id === activeStepId;
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="truncate">{step.title}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Step Detailed Guide */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 text-xs text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Guía Paso a Paso
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentStep.summary}
              </p>
            </div>
          </div>

          {/* Steps List */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Instrucciones de Operación:
            </h4>
            <div className="space-y-3">
              {currentStep.steps.map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Tip Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
            <strong className="block mb-1 font-bold">Consejo de Buenas Prácticas:</strong>
            <p className="leading-relaxed">{currentStep.tip}</p>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setActiveStepId(prev => Math.max(1, prev - 1))}
              disabled={activeStepId === 1}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs text-slate-400">
              Paso {activeStepId} de {guideSteps.length}
            </span>
            <button
              onClick={() => setActiveStepId(prev => Math.min(guideSteps.length, prev + 1))}
              disabled={activeStepId === guideSteps.length}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
