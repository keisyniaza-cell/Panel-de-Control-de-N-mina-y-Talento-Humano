import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Employee, ContractType, ArlRiskClass } from '../types/payroll';
import { formatCOP } from '../utils/calculations';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialEmployee?: Employee | null;
  smlmv: number;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmployee,
  smlmv
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    documentType: 'CC',
    documentNumber: '',
    position: 'Auxiliar contable',
    contractType: 'termino_indefinido',
    startDate: new Date().toISOString().split('T')[0],
    basicSalary: 2000000,
    transportAllowanceEligible: true,
    eps: 'EPS Sanitas',
    pensionFund: 'Porvenir',
    arl: 'Seguros Bolívar',
    arlRiskClass: 'clase_1',
    compensationFund: 'Compensar',
    phone: '',
    email: '',
    address: '',
    assignedProject: 'Gestión Institucional y Central',
    bankName: 'Bancolombia',
    accountNumber: '',
    status: 'Activo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialEmployee) {
      setFormData(initialEmployee);
    } else {
      setFormData({
        fullName: '',
        documentType: 'CC',
        documentNumber: '',
        position: 'Auxiliar contable',
        contractType: 'termino_indefinido',
        startDate: new Date().toISOString().split('T')[0],
        basicSalary: 2000000,
        transportAllowanceEligible: true,
        eps: 'EPS Sanitas',
        pensionFund: 'Porvenir',
        arl: 'Seguros Bolívar',
        arlRiskClass: 'clase_1',
        compensationFund: 'Compensar',
        phone: '',
        email: '',
        address: '',
        assignedProject: 'Gestión Institucional y Central',
        bankName: 'Bancolombia',
        accountNumber: '',
        status: 'Activo'
      });
    }
    setErrors({});
  }, [initialEmployee, isOpen]);

  if (!isOpen) return null;

  const handleSalaryChange = (val: number) => {
    const isUnder2SMLMV = val <= smlmv * 2;
    setFormData(prev => ({
      ...prev,
      basicSalary: val,
      transportAllowanceEligible: isUnder2SMLMV
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'El nombre completo es requerido';
    if (!formData.documentNumber?.trim()) newErrors.documentNumber = 'El número de identificación es requerido';
    if (!formData.basicSalary || formData.basicSalary <= 0) newErrors.basicSalary = 'El salario debe ser mayor a 0';
    if (!formData.email?.trim()) newErrors.email = 'El correo electrónico es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const employeeToSave: Employee = {
      ...(formData as Employee),
      id: initialEmployee ? initialEmployee.id : `emp-${Date.now()}`
    };

    onSave(employeeToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {initialEmployee ? 'Modificar Información del Empleado' : 'Registrar Nuevo Empleado'}
            </h3>
            <p className="text-xs text-slate-400">
              Corporación Social Somos Uno · Nómina y Seguridad Social Colombia
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-slate-900 dark:text-slate-100 text-xs">
          {/* Section 1: Identificación y Contrato */}
          <div>
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
              1. Identificación y Contratación
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName || ''}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Ana María Gómez Pérez"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1">Tipo de Documento</label>
                <select
                  value={formData.documentType || 'CC'}
                  onChange={e => setFormData({ ...formData, documentType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="PAS">Pasaporte (PAS)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Número de Documento *</label>
                <input
                  type="text"
                  required
                  value={formData.documentNumber || ''}
                  onChange={e => setFormData({ ...formData, documentNumber: e.target.value })}
                  placeholder="Ej. 1.018.452.980"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.documentNumber && <p className="text-red-500 text-[10px] mt-0.5">{errors.documentNumber}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1">Cargo *</label>
                <select
                  value={formData.position || 'Auxiliar contable'}
                  onChange={e => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Auxiliar contable">Auxiliar contable</option>
                  <option value="Administración">Administración</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Gestor de proyectos">Gestor de proyectos</option>
                  <option value="Coordinador de Campo">Coordinador de Campo</option>
                  <option value="Facilitador Social">Facilitador Social</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tipo de Contrato</label>
                <select
                  value={formData.contractType || 'termino_indefinido'}
                  onChange={e => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="termino_indefinido">Término Indefinido</option>
                  <option value="termino_fijo">Término Fijo</option>
                  <option value="obra_o_labor">Obra o Labor</option>
                  <option value="aprendizaje">Contrato de Aprendizaje</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Estado del Trabajador</label>
                <select
                  value={formData.status || 'Activo'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En vacaciones">En vacaciones</option>
                  <option value="Incapacitado">Incapacitado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Proyecto Asignado</label>
                <input
                  type="text"
                  value={formData.assignedProject || ''}
                  onChange={e => setFormData({ ...formData, assignedProject: e.target.value })}
                  placeholder="Ej. Gestión Institucional y Central"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Salario y Beneficios */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
              2. Remuneración Salarial
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Salario Básico Mensual ($ COP) *</label>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  required
                  value={formData.basicSalary || ''}
                  onChange={e => handleSalaryChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Equivalente formateado: <strong className="text-slate-800 dark:text-slate-200">{formatCOP(formData.basicSalary || 0)}</strong>
                </p>
                {errors.basicSalary && <p className="text-red-500 text-[10px] mt-0.5">{errors.basicSalary}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Auxilio de Transporte</span>
                    <p className="text-[11px] text-slate-500">
                      Tope legal: Salarios ≤ 2 SMLMV ({formatCOP(smlmv * 2)})
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="transportCheckbox"
                    checked={formData.transportAllowanceEligible || false}
                    onChange={e => setFormData({ ...formData, transportAllowanceEligible: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer mt-0.5"
                  />
                </div>
                <div className="mt-2 text-[11px]">
                  {formData.transportAllowanceEligible ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      Tiene derecho al auxilio legal ($249.095 en 2026)
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">
                      Exento de auxilio de transporte (&gt; 2 SMLMV o vive en lugar de trabajo)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Afiliaciones a Seguridad Social */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
              3. Afiliaciones a Seguridad Social y Parafiscales
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">EPS (Salud)</label>
                <input
                  type="text"
                  value={formData.eps || ''}
                  onChange={e => setFormData({ ...formData, eps: e.target.value })}
                  placeholder="Ej. EPS Sanitas, Sura EPS"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Fondo de Pensiones</label>
                <input
                  type="text"
                  value={formData.pensionFund || ''}
                  onChange={e => setFormData({ ...formData, pensionFund: e.target.value })}
                  placeholder="Ej. Porvenir, Protección, Colpensiones"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">ARL (Riesgos Laborales)</label>
                <input
                  type="text"
                  value={formData.arl || ''}
                  onChange={e => setFormData({ ...formData, arl: e.target.value })}
                  placeholder="Ej. Seguros Bolívar, Sura, Positiva"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Clase de Riesgo ARL</label>
                <select
                  value={formData.arlRiskClass || 'clase_1'}
                  onChange={e => setFormData({ ...formData, arlRiskClass: e.target.value as ArlRiskClass })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="clase_1">Clase I (0.522%) - Administrativo / Oficina</option>
                  <option value="clase_2">Clase II (1.044%) - Comercio / Almacén</option>
                  <option value="clase_3">Clase III (2.436%) - Manufactura liviana</option>
                  <option value="clase_4">Clase IV (4.350%) - Transporte / Obras</option>
                  <option value="clase_5">Clase V (6.960%) - Construcción / Alto riesgo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Caja de Compensación Familiar (4%)</label>
                <input
                  type="text"
                  value={formData.compensationFund || ''}
                  onChange={e => setFormData({ ...formData, compensationFund: e.target.value })}
                  placeholder="Ej. Compensar, Colsubsidio, Cafam"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Contacto y Datos Bancarios */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
              4. Contacto y Dispersión de Nómina
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Teléfono Móvil</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ej. 311 458 9201"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@somosuno.org.co"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1">Dirección de Residencia</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ej. Carrera 72 # 54-18, Bogotá"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Entidad Bancaria</label>
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Ej. Bancolombia, Davivienda"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-1">Número de Cuenta para Pago</label>
                <input
                  type="text"
                  value={formData.accountNumber || ''}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Ej. Cta. Ahorros 458-109283-71"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Empleado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
