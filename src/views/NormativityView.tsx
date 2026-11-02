import React, { useState } from 'react';
import { 
  Scale, 
  BookOpen, 
  Settings2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  FileCheck,
  Percent,
  TrendingUp
} from 'lucide-react';
import { LegalParameters, UserRole } from '../types/payroll';
import { COLOMBIAN_LABOR_LAWS, INITIAL_LEGAL_PARAMETERS } from '../data/initialData';
import { formatCOP } from '../utils/calculations';

interface NormativityViewProps {
  parameters: LegalParameters;
  onUpdateParameters: (params: LegalParameters) => void;
  userRole: UserRole;
}

export const NormativityView: React.FC<NormativityViewProps> = ({
  parameters,
  onUpdateParameters,
  userRole
}) => {
  const [formData, setFormData] = useState<LegalParameters>({ ...parameters });
  const [activeTab, setActiveTab] = useState<'compendio' | 'parametros'>('compendio');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canEdit = userRole === 'administracion' || userRole === 'gerente';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    onUpdateParameters(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (!canEdit) return;
    setFormData({ ...INITIAL_LEGAL_PARAMETERS });
    onUpdateParameters({ ...INITIAL_LEGAL_PARAMETERS });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Marco Legal y Configuración de Parámetros Normativos
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Legislación laboral colombiana aplicable (CST, Ley 100, 50, 52, 2101 de 2021 y Ley 2466 de 2025)
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('compendio')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'compendio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Compendio de Leyes
          </button>
          <button
            onClick={() => setActiveTab('parametros')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'parametros'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Actualizar Parámetros 2026</span>
          </button>
        </div>
      </div>

      {activeTab === 'compendio' ? (
        /* Compendio Normativo */
        <div className="space-y-4">
          {/* 2026 Highlights Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Ley 2101 de 2021 (Jornada Máxima)
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                42 Horas Semanales (15 de julio de 2026)
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                El divisor legal mensual pasa a 210 horas, incrementando el valor unitario de la hora ordinaria y de las horas extras.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                Ley 2466 de 2025 (Reforma Laboral)
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                Recargo Nocturno desde las 7:00 PM
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                Jornada diurna de 6:00 a.m. a 7:00 p.m. y recargo por trabajo en domingos y días festivos al 100%.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                Referencia Ejercicio 2026
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                SMLMV: {formatCOP(parameters.smlmv)}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                Auxilio de transporte: {formatCOP(parameters.auxTransporte)} · Total mínimo con auxilio: {formatCOP(parameters.smlmv + parameters.auxTransporte)}.
              </p>
            </div>
          </div>

          {/* Law Accordion / List */}
          <div className="space-y-3">
            {COLOMBIAN_LABOR_LAWS.map((law, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{law.norma}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                      {law.año}
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Vigente y Aplicable</span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {law.descripcion}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <strong className="text-slate-900 dark:text-white block mb-0.5">Artículos Clave:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{law.articulosClave}</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block mb-0.5">Aplicación Directa en Nómina:</strong>
                    <span className="text-slate-600 dark:text-slate-400">{law.aplicacionNomina}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Formulario para Actualizar Parámetros Legales */
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-xs text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Parámetros Legales Configurables del Sistema
              </h3>
              <p className="text-xs text-slate-500">
                Al modificar estos valores, toda la nómina, devengados, prestaciones y costos laborales se actualizarán en tiempo real.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Parámetros guardados y aplicados
              </span>
            )}
          </div>

          {/* Section 1: Salario Mínimo y Auxilio */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              1. Salario Mínimo Legal y Auxilio de Transporte
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Año de Vigencia</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 2026 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">SMLMV ($ COP) *</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={formData.smlmv}
                  onChange={e => setFormData({ ...formData, smlmv: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Formateado: {formatCOP(formData.smlmv)}</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Auxilio de Transporte ($ COP) *</label>
                <input
                  type="number"
                  step="1000"
                  required
                  value={formData.auxTransporte}
                  onChange={e => setFormData({ ...formData, auxTransporte: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Formateado: {formatCOP(formData.auxTransporte)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Jornada Laboral (Ley 2101) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              2. Jornada Laboral Ordinaria y Divisor de Horas (Ley 2101 de 2021)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Jornada Máxima Semanal (Horas)</label>
                <input
                  type="number"
                  step="1"
                  min="36"
                  max="48"
                  value={formData.maxWeeklyHours}
                  onChange={e => {
                    const hrs = parseInt(e.target.value) || 42;
                    setFormData({
                      ...formData,
                      maxWeeklyHours: hrs,
                      monthlyHoursDivisor: hrs === 42 ? 210 : hrs === 44 ? 220 : hrs === 46 ? 230 : 240
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">42 horas legales a partir de julio de 2026</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Divisor Mensual para Cálculo de Hora Ordinaria</label>
                <input
                  type="number"
                  step="1"
                  value={formData.monthlyHoursDivisor}
                  onChange={e => setFormData({ ...formData, monthlyHoursDivisor: parseInt(e.target.value) || 210 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">210 horas en 2026 (frente a 240h tradicionales)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Porcentajes de Seguridad Social y Parafiscales */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
              3. Porcentajes de Seguridad Social y Parafiscales
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold mb-1">Salud Trabajador</label>
                <input
                  type="number"
                  step="0.005"
                  value={formData.saludTrabajadorPct}
                  onChange={e => setFormData({ ...formData, saludTrabajadorPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">Ley 100: {(formData.saludTrabajadorPct * 100).toFixed(1)}%</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pensión Trabajador</label>
                <input
                  type="number"
                  step="0.005"
                  value={formData.pensionTrabajadorPct}
                  onChange={e => setFormData({ ...formData, pensionTrabajadorPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">Ley 100: {(formData.pensionTrabajadorPct * 100).toFixed(1)}%</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Salud Empleador</label>
                <input
                  type="number"
                  step="0.005"
                  value={formData.saludEmpleadorPct}
                  onChange={e => setFormData({ ...formData, saludEmpleadorPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">Patronal: {(formData.saludEmpleadorPct * 100).toFixed(1)}%</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pensión Empleador</label>
                <input
                  type="number"
                  step="0.005"
                  value={formData.pensionEmpleadorPct}
                  onChange={e => setFormData({ ...formData, pensionEmpleadorPct: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-400">Patronal: {(formData.pensionEmpleadorPct * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={!canEdit}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Valores 2026</span>
            </button>
            <button
              type="submit"
              disabled={!canEdit}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Guardar y Recalcular Nómina</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
