import React, { useState } from 'react';
import { 
  FileText, 
  PlusCircle, 
  FileCheck, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Download, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet,
  FileCheck2,
  X
} from 'lucide-react';
import { Employee, LegalParameters, Novelty, UserRole } from '../types/payroll';
import { formatCOP } from '../utils/calculations';
import { NoveltyModal } from '../components/NoveltyModal';

interface NoveltiesViewProps {
  novelties: Novelty[];
  employees: Employee[];
  parameters: LegalParameters;
  userRole: UserRole;
  onAddNovelty: (novelty: Novelty) => void;
  onUpdateNovelty: (novelty: Novelty) => void;
  onDeleteNovelty: (id: string) => void;
}

export const NoveltiesView: React.FC<NoveltiesViewProps> = ({
  novelties,
  employees,
  parameters,
  userRole,
  onAddNovelty,
  onUpdateNovelty,
  onDeleteNovelty
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNovelty, setSelectedNovelty] = useState<Novelty | null>(null);
  const [viewingSupportDoc, setViewingSupportDoc] = useState<{ name: string; desc: string; empName: string } | null>(null);

  const canManage = userRole === 'auxiliar_contable' || userRole === 'administracion' || userRole === 'gerente';

  const filteredNovelties = novelties.filter(n => {
    const matchesType = filterType === 'all' || n.type === filterType;
    const matchesEmp = filterEmployee === 'all' || n.employeeId === filterEmployee;
    return matchesType && matchesEmp;
  });

  const getEmployeeName = (id: string) => {
    return employees.find(e => e.id === id)?.fullName || id;
  };

  const getEmployeePosition = (id: string) => {
    return employees.find(e => e.id === id)?.position || '';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incapacidad_general': return 'Incapacidad Enfermedad General';
      case 'incapacidad_laboral': return 'Incapacidad ARL';
      case 'permiso_remunerado': return 'Permiso Remunerado';
      case 'permiso_no_remunerado': return 'Permiso No Remunerado';
      case 'licencia': return 'Licencia Legal';
      case 'vacaciones': return 'Vacaciones Disfrutadas';
      case 'horas_extras_diurnas': return 'Horas Extras Diurnas (HED +25%)';
      case 'horas_extras_nocturnas': return 'Horas Extras Nocturnas (HEN +75%)';
      case 'recargo_nocturno': return 'Recargo Nocturno (+35%)';
      case 'recargo_dominical_festivo': return 'Recargo Dominical/Festivo';
      case 'ausencia_injustificada': return 'Ausencia Injustificada';
      case 'bonificacion_salarial': return 'Bonificación Salarial';
      case 'bonificacion_no_salarial': return 'Bonificación No Salarial';
      default: return type.replace(/_/g, ' ');
    }
  };

  const totalOvertime = novelties
    .filter(n => n.type.includes('horas_extras') || n.type.includes('recargo'))
    .reduce((acc, n) => acc + n.calculatedValue, 0);

  const totalAbsenceDeductions = novelties
    .filter(n => n.type === 'permiso_no_remunerado' || n.type === 'ausencia_injustificada')
    .reduce((acc, n) => acc + Math.abs(n.calculatedValue), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Novedades de Nómina y Control de Ausentismo
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro con soporte documental de incapacidades, horas extras, permisos y vacaciones
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setSelectedNovelty(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Novedad</span>
          </button>
        )}
      </div>

      {/* KPI Cards for Novelties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Novedades Registradas</span>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{novelties.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Todas con soporte documental</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Horas Extras y Recargos</span>
            <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">+{formatCOP(totalOvertime)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Cálculo basado en 42h (Ley 2101)</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Descuentos por Permisos / Falta</span>
            <p className="text-2xl font-bold font-mono text-red-500 mt-1">-{formatCOP(totalAbsenceDeductions)}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Permisos no remunerados aplicados</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Filtrar por Empleado:</span>
            <select
              value={filterEmployee}
              onChange={e => setFilterEmployee(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los empleados</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.position})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Tipo:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="incapacidad_general">Incapacidades</option>
              <option value="horas_extras_diurnas">Horas Extras</option>
              <option value="permiso_no_remunerado">Permisos</option>
              <option value="vacaciones">Vacaciones</option>
            </select>
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Mostrando {filteredNovelties.length} novedades registradas
        </span>
      </div>

      {/* Novelties Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Empleado & Cargo</th>
                <th className="py-3 px-4">Tipo de Novedad</th>
                <th className="py-3 px-4">Descripción & Motivo</th>
                <th className="py-3 px-4 text-center">Días / Horas</th>
                <th className="py-3 px-4 text-right">Impacto Financiero</th>
                <th className="py-3 px-4 text-center">Soporte Adjunto</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredNovelties.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No hay novedades que coincidan con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredNovelties.map((nov) => {
                  const empName = getEmployeeName(nov.employeeId);
                  const empPos = getEmployeePosition(nov.employeeId);
                  return (
                    <tr key={nov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {nov.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{empName}</div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400">{empPos}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        {getTypeLabel(nov.type)}
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-600 dark:text-slate-400">
                        {nov.description}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        {nov.hours > 0 ? `${nov.hours} hrs` : `${nov.days} días`}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        nov.calculatedValue < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {nov.calculatedValue < 0 ? `-${formatCOP(Math.abs(nov.calculatedValue))}` : `+${formatCOP(nov.calculatedValue)}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {nov.documentSupportName ? (
                          <button
                            onClick={() => setViewingSupportDoc({
                              name: nov.documentSupportName!,
                              desc: nov.description,
                              empName
                            })}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{nov.documentSupportName}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin soporte</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          nov.status === 'Aprobada' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {nov.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canManage && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedNovelty(nov);
                                  setIsModalOpen(true);
                                }}
                                title="Editar Novedad"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteNovelty(nov.id)}
                                title="Eliminar Novedad"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Novelty Modal */}
      <NoveltyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(nov) => {
          if (selectedNovelty) {
            onUpdateNovelty(nov);
          } else {
            onAddNovelty(nov);
          }
        }}
        employees={employees}
        parameters={parameters}
        initialNovelty={selectedNovelty}
      />

      {/* Document Support Viewer Modal */}
      {viewingSupportDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Soporte Documental Radicado
                </h3>
              </div>
              <button
                onClick={() => setViewingSupportDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Documento:</span>
                <span className="font-mono font-bold">{viewingSupportDoc.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trabajador:</span>
                <span className="font-bold">{viewingSupportDoc.empName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado de Radicación:</span>
                <span className="text-emerald-600 font-bold">Verificado y Aprobado</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-1">Descripción:</span>
                <p className="text-slate-700 dark:text-slate-300 italic">{viewingSupportDoc.desc}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setViewingSupportDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
