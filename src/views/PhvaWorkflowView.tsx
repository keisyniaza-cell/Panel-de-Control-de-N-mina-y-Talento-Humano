import React, { useState } from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Users, 
  FileCheck, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { PhvaStage, UserRole } from '../types/payroll';
import { INITIAL_PHVA_STAGES } from '../data/initialData';

interface PhvaWorkflowViewProps {
  userRole: UserRole;
}

export const PhvaWorkflowView: React.FC<PhvaWorkflowViewProps> = ({ userRole }) => {
  const [stages, setStages] = useState<PhvaStage[]>(INITIAL_PHVA_STAGES);
  const [selectedStageId, setSelectedStageId] = useState<string>('planear');

  const activeStage = stages.find(s => s.id === selectedStageId) || stages[0];

  const handleToggleChecklistItem = (stageId: string, itemId: string) => {
    setStages(prev => prev.map(stage => {
      if (stage.id !== stageId) return stage;
      const updatedChecklist = stage.checklist.map(item => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      const allCompleted = updatedChecklist.every(i => i.completed);
      const someCompleted = updatedChecklist.some(i => i.completed);

      return {
        ...stage,
        checklist: updatedChecklist,
        status: allCompleted ? 'Completado' : someCompleted ? 'En progreso' : 'Pendiente'
      };
    }));
  };

  const handleResetCycle = () => {
    setStages(INITIAL_PHVA_STAGES);
  };

  const getStageColor = (id: string) => {
    switch (id) {
      case 'planear': return 'from-blue-600 to-indigo-700 text-blue-600 border-blue-500';
      case 'hacer': return 'from-amber-500 to-amber-700 text-amber-600 border-amber-500';
      case 'verificar': return 'from-purple-600 to-indigo-700 text-purple-600 border-purple-500';
      case 'actuar': return 'from-emerald-600 to-teal-700 text-emerald-600 border-emerald-500';
      default: return 'from-slate-600 to-slate-700 text-slate-600 border-slate-500';
    }
  };

  const totalTasks = stages.reduce((acc, s) => acc + s.checklist.length, 0);
  const completedTasks = stages.reduce((acc, s) => acc + s.checklist.filter(c => c.completed).length, 0);
  const cycleProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Flujograma de Procesos con el Ciclo PHVA
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de calidad y mejora continua de la nómina: Planear → Hacer → Verificar → Actuar
          </p>
        </div>

        <button
          onClick={handleResetCycle}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reiniciar Ciclo para Siguiente Período</span>
        </button>
      </div>

      {/* Interactive Process Pipeline (Visual Flowchart) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === selectedStageId;
          const completedCount = stage.checklist.filter(c => c.completed).length;
          const totalCount = stage.checklist.length;
          const pct = Math.round((completedCount / totalCount) * 100);

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 shadow-lg ring-2 ring-blue-500 border-transparent dark:border-blue-500'
                  : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getStageColor(stage.id)} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                    {stage.letter}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    stage.status === 'Completado'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : stage.status === 'En progreso'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {stage.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-3">
                  {stage.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {stage.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Auditoría de tareas</span>
                  <span className="font-mono">{completedCount} / {totalCount} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cycle Progress Bar */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Progreso General del Ciclo de Nómina PHVA (2026)
            </h4>
            <p className="text-[11px] text-slate-400">
              {completedTasks} de {totalTasks} controles y validaciones auditadas exitosamente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold font-mono text-amber-400">{cycleProgress}%</span>
          <span className="text-xs text-slate-400 font-medium">Secuencia: P → H → V → A</span>
        </div>
      </div>

      {/* Active Stage Details & Interactive Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Fase Activa del Flujograma:
              </span>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                {activeStage.letter} — {activeStage.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {activeStage.description}
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            activeStage.status === 'Completado' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            Estado: {activeStage.status}
          </span>
        </div>

        {/* Activities and Responsibilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Actividades Obligatorias Aplicadas a la Nómina
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              {activeStage.activities.map((act, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Lista de Control (Auditoría por Perfil)
            </h4>
            <div className="space-y-2">
              {activeStage.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklistItem(activeStage.id, item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    item.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                    <span className={`text-xs ${item.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 ml-2">
                    {item.assignedRole.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
