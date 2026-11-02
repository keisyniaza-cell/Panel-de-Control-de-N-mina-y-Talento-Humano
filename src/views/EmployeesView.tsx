import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Building, 
  Shield, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { Employee, LegalParameters, UserRole } from '../types/payroll';
import { formatCOP } from '../utils/calculations';
import { EmployeeModal } from '../components/EmployeeModal';

interface EmployeesViewProps {
  employees: Employee[];
  parameters: LegalParameters;
  userRole: UserRole;
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  parameters,
  userRole,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterContract, setFilterContract] = useState<string>('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Can this role edit/create?
  const canEdit = userRole === 'auxiliar_contable' || userRole === 'administracion' || userRole === 'gerente';
  const canDelete = userRole === 'administracion' || userRole === 'gerente';

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.documentNumber.includes(searchTerm) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.assignedProject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPos = filterPosition === 'all' || emp.position === filterPosition;
      const matchesContract = filterContract === 'all' || emp.contractType === filterContract;

      return matchesSearch && matchesPos && matchesContract;
    });
  }, [employees, searchTerm, filterPosition, filterContract]);

  const uniquePositions = Array.from(new Set(employees.map(e => e.position)));

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      onDeleteEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Gestión de Empleados y Talento Humano
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registro, contratación, afiliaciones a seguridad social y asignación a proyectos institucionales
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Empleado</span>
          </button>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cédula, cargo o proyecto..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">Cargo:</span>
            <select
              value={filterPosition}
              onChange={e => setFilterPosition(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los cargos</option>
              {uniquePositions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">Contrato:</span>
            <select
              value={filterContract}
              onChange={e => setFilterContract(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los contratos</option>
              <option value="termino_indefinido">Término Indefinido</option>
              <option value="termino_fijo">Término Fijo</option>
              <option value="obra_o_labor">Obra o Labor</option>
              <option value="aprendizaje">Aprendizaje</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Trabajador / Identificación</th>
                <th className="py-3 px-4">Cargo & Proyecto</th>
                <th className="py-3 px-4">Contrato & Ingreso</th>
                <th className="py-3 px-4 text-right">Salario Básico</th>
                <th className="py-3 px-4">Aux. Transporte</th>
                <th className="py-3 px-4">Seguridad Social</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron trabajadores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {emp.documentType}: {emp.documentNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{emp.position}</span>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{emp.assignedProject}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="capitalize">{emp.contractType.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-slate-400">{emp.startDate}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatCOP(emp.basicSalary)}
                    </td>
                    <td className="py-3 px-4">
                      {emp.transportAllowanceEligible ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          {formatCOP(parameters.auxTransporte)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No aplica</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">
                        {emp.eps} · {emp.pensionFund}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {emp.arl} ({emp.arlRiskClass.toUpperCase()})
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        emp.status === 'Activo' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          title="Ver Ficha Completa"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            title="Editar Empleado"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setEmployeeToDelete(emp)}
                            title="Eliminar Registro"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(emp) => {
          if (selectedEmployee) {
            onUpdateEmployee(emp);
          } else {
            onAddEmployee(emp);
          }
        }}
        initialEmployee={selectedEmployee}
        smlmv={parameters.smlmv}
      />

      {/* View Detailed Employee File Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Ficha Laboral del Trabajador
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {viewingEmployee.fullName}
                </h3>
              </div>
              <button
                onClick={() => setViewingEmployee(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Identificación</span>
                <span className="font-bold">{viewingEmployee.documentType} {viewingEmployee.documentNumber}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Cargo</span>
                <span className="font-bold">{viewingEmployee.position}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Salario Básico</span>
                <span className="font-bold font-mono text-emerald-600">{formatCOP(viewingEmployee.basicSalary)}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Tipo de Contrato</span>
                <span className="font-bold capitalize">{viewingEmployee.contractType.replace(/_/g, ' ')}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Fecha de Ingreso</span>
                <span className="font-bold">{viewingEmployee.startDate}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px]">Auxilio Transporte</span>
                <span className="font-bold">{viewingEmployee.transportAllowanceEligible ? 'Aplica (≤ 2 SMLMV)' : 'No aplica'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Afiliaciones a Entidades</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>EPS:</strong> {viewingEmployee.eps}</div>
                <div><strong>Pensión:</strong> {viewingEmployee.pensionFund}</div>
                <div><strong>ARL:</strong> {viewingEmployee.arl} ({viewingEmployee.arlRiskClass})</div>
                <div><strong>Caja Compensación:</strong> {viewingEmployee.compensationFund}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contacto y Pago</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>Teléfono:</strong> {viewingEmployee.phone || 'No registrado'}</div>
                <div><strong>Correo:</strong> {viewingEmployee.email}</div>
                <div><strong>Dirección:</strong> {viewingEmployee.address || 'No registrada'}</div>
                <div><strong>Banco & Cuenta:</strong> {viewingEmployee.bankName} - {viewingEmployee.accountNumber}</div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/60">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirmar Eliminación</h3>
                <p className="text-xs text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              ¿Está seguro de que desea eliminar a <strong>{employeeToDelete.fullName}</strong> ({employeeToDelete.position}) de la base de datos de nómina?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-500/20"
              >
                Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
