import React, { useState, useEffect } from 'react';
import { X, Save, Upload, FileText, AlertCircle } from 'lucide-react';
import { Employee, LegalParameters, Novelty, NoveltyType } from '../types/payroll';
import { calculateHourlyRate, calculateNoveltyAmount, formatCOP } from '../utils/calculations';

interface NoveltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novelty: Novelty) => void;
  employees: Employee[];
  parameters: LegalParameters;
  initialNovelty?: Novelty | null;
}

export const NoveltyModal: React.FC<NoveltyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employees,
  parameters,
  initialNovelty
}) => {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<NoveltyType>('horas_extras_diurnas');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(2);
  const [calculatedValue, setCalculatedValue] = useState(0);
  const [documentSupportName, setDocumentSupportName] = useState('');
  const [status, setStatus] = useState<'Aprobada' | 'Pendiente' | 'Rechazada'>('Aprobada');

  const selectedEmployee = employees.find(e => e.id === employeeId) || employees[0];

  useEffect(() => {
    if (initialNovelty) {
      setEmployeeId(initialNovelty.employeeId);
      setDate(initialNovelty.date);
      setType(initialNovelty.type);
      setDescription(initialNovelty.description);
      setDays(initialNovelty.days || 0);
      setHours(initialNovelty.hours || 0);
      setCalculatedValue(initialNovelty.calculatedValue || 0);
      setDocumentSupportName(initialNovelty.documentSupportName || '');
      setStatus(initialNovelty.status);
    } else {
      setEmployeeId(employees[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setType('horas_extras_diurnas');
      setDescription('');
      setDays(0);
      setHours(2);
      setDocumentSupportName('Soporte_Novedad_Documento.pdf');
      setStatus('Aprobada');
    }
  }, [initialNovelty, isOpen, employees]);

  // Recalculate estimated value when type, days, hours, or employee change
  useEffect(() => {
    if (selectedEmployee) {
      const val = calculateNoveltyAmount(
        selectedEmployee,
        {
          employeeId,
          date,
          type,
          description,
          days,
          hours,
          status
        },
        parameters
      );
      setCalculatedValue(val);
    }
  }, [selectedEmployee, type, days, hours, parameters, date, description, status]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const noveltyToSave: Novelty = {
      id: initialNovelty ? initialNovelty.id : `nov-${Date.now()}`,
      employeeId,
      date,
      type,
      description,
      days,
      hours,
      calculatedValue,
      documentSupportName: documentSupportName || 'Soporte_Novedad_Adjunto.pdf',
      status,
      createdAt: initialNovelty ? initialNovelty.createdAt : new Date().toISOString()
    };
    onSave(noveltyToSave);
    onClose();
  };

  const isHoursType = type.includes('horas_extras') || type.includes('recargo') || type === 'llegada_tarde';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {initialNovelty ? 'Editar Novedad Laboral' : 'Registrar Novedad de Nómina'}
            </h3>
            <p className="text-xs text-slate-400">
              Incapacidades, horas extras, permisos y vacaciones con soporte documental
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-900 dark:text-slate-100">
          {/* Empleado y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Empleado Relacionado *</label>
              <select
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Fecha de la Novedad *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
              </input>
            </div>
          </div>

          {/* Tipo de Novedad */}
          <div>
            <label className="block font-semibold mb-1">Tipo de Novedad *</label>
            <select
              value={type}
              onChange={e => {
                const newType = e.target.value as NoveltyType;
                setType(newType);
                if (newType.includes('horas_extras') || newType.includes('recargo')) {
                  setHours(2);
                  setDays(0);
                } else {
                  setDays(1);
                  setHours(0);
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <optgroup label="Incapacidades y Licencias">
                <option value="incapacidad_general">Incapacidad Enfermedad General (66.67%)</option>
                <option value="incapacidad_laboral">Incapacidad Laboral ARL (100%)</option>
                <option value="licencia">Licencia Remunerada / Maternidad / Paternidad / Luto</option>
              </optgroup>
              <optgroup label="Permisos y Ausencias">
                <option value="permiso_no_remunerado">Permiso No Remunerado (Deduce días)</option>
                <option value="permiso_remunerado">Permiso Remunerado</option>
                <option value="ausencia_injustificada">Ausencia Injustificada (Deduce día + dominical)</option>
                <option value="llegada_tarde">Llegada Tarde (Deduce horas)</option>
              </optgroup>
              <optgroup label="Descansos">
                <option value="vacaciones">Vacaciones Disfrutadas</option>
              </optgroup>
              <optgroup label="Horas Extras y Recargos (Ley 2101 / Ley 2466)">
                <option value="horas_extras_diurnas">Horas Extras Diurnas (+25%)</option>
                <option value="horas_extras_nocturnas">Horas Extras Nocturnas (+75%)</option>
                <option value="horas_extras_festivas_diurnas">Horas Extras Festivas Diurnas (+100%)</option>
                <option value="horas_extras_festivas_nocturnas">Horas Extras Festivas Nocturnas (+150%)</option>
                <option value="recargo_nocturno">Recargo Nocturno a partir de 7:00 PM (+35%)</option>
                <option value="recargo_dominical_festivo">Recargo Dominical / Festivo (+75% / +100%)</option>
              </optgroup>
              <optgroup label="Compensaciones Adicionales">
                <option value="bonificacion_salarial">Bonificación Salarial Constitutiva</option>
                <option value="bonificacion_no_salarial">Bonificación No Salarial (Mera liberalidad)</option>
                <option value="comision">Comisión por Gestión / Proyectos</option>
              </optgroup>
            </select>
          </div>

          {/* Días u Horas */}
          <div className="grid grid-cols-2 gap-3">
            {isHoursType ? (
              <div>
                <label className="block font-semibold mb-1">Cantidad de Horas *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="48"
                  required
                  value={hours}
                  onChange={e => setHours(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold mb-1">Cantidad de Días *</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="30"
                  required
                  value={days}
                  onChange={e => setDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Estado de Aprobación</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aprobada">Aprobada</option>
                <option value="Pendiente">Pendiente de Aprobación</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold mb-1">Descripción y Justificación *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describa el motivo de la novedad, fechas exactas y contexto..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Soporte Documental */}
          <div>
            <label className="block font-semibold mb-1">Soporte Documental (PDF, Certificado o Planilla)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={documentSupportName}
                onChange={e => setDocumentSupportName(e.target.value)}
                placeholder="Nombre del archivo de soporte adjunto"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[11px]"
              />
              <label className="cursor-pointer px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Examinar</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setDocumentSupportName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Calculated Impact Preview */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Impacto Financiero Estimado en Nómina
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Basado en salario básico de {formatCOP(selectedEmployee?.basicSalary || 0)} y divisor de 42h (Ley 2101)
              </p>
            </div>
            <div className={`text-base font-extrabold font-mono ${calculatedValue < 0 ? 'text-red-600' : 'text-blue-700 dark:text-blue-400'}`}>
              {calculatedValue < 0 ? `-${formatCOP(Math.abs(calculatedValue))}` : `+${formatCOP(calculatedValue)}`}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Novedad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
