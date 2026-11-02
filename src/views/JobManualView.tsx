import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Briefcase, 
  UserCheck, 
  FileText, 
  Plus, 
  Trash2,
  X
} from 'lucide-react';
import { CompanyInfo, JobDescription, UserRole } from '../types/payroll';
import { INITIAL_JOB_DESCRIPTIONS } from '../data/initialData';
import { generateJobDescriptionPDF } from '../utils/exportPdf';

interface JobManualViewProps {
  company: CompanyInfo;
  userRole: UserRole;
}

export const JobManualView: React.FC<JobManualViewProps> = ({ company, userRole }) => {
  const [jobs, setJobs] = useState<JobDescription[]>(INITIAL_JOB_DESCRIPTIONS);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [editJobData, setEditJobData] = useState<JobDescription>(jobs[0]);
  const [saveToast, setSaveToast] = useState(false);

  const canEdit = userRole === 'administracion' || userRole === 'gerente';
  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const handleSelectJob = (job: JobDescription) => {
    setSelectedJobId(job.id);
    setIsEditing(false);
    setEditJobData(job);
  };

  const handleStartEdit = () => {
    if (!canEdit) return;
    setEditJobData({ ...activeJob });
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setJobs(prev => prev.map(j => (j.id === editJobData.id ? editJobData : j)));
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDownloadPDF = (job: JobDescription) => {
    generateJobDescriptionPDF(job, company);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Manual Institucional de Funciones y Responsabilidades
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fichas descriptivas de cargo, competencias, responsabilidades y perfiles requeridos para la Corporación Social Somos Uno
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Editar Manual del Cargo</span>
            </button>
          )}
          <button
            onClick={() => handleDownloadPDF(activeJob)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar en PDF</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Manual de funciones actualizado y guardado correctamente.</span>
        </div>
      )}

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Job Selector */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block px-2">
            Cargos de la Organización
          </span>
          <div className="space-y-1.5">
            {jobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <button
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex flex-col ${
                    isSelected 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  <span className="font-bold text-sm">{job.title}</span>
                  <span className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {job.area}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Job Profile Sheet */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-base text-blue-600 dark:text-blue-400">
                  Modificar Manual de: {editJobData.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Título del Cargo</label>
                  <input
                    type="text"
                    value={editJobData.title}
                    onChange={e => setEditJobData({ ...editJobData, title: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Área / Departamento</label>
                  <input
                    type="text"
                    value={editJobData.area}
                    onChange={e => setEditJobData({ ...editJobData, area: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Objetivo General del Cargo</label>
                <textarea
                  rows={3}
                  value={editJobData.generalObjective}
                  onChange={e => setEditJobData({ ...editJobData, generalObjective: e.target.value })}
                  className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Responsabilidades Principales (una por línea)</label>
                <textarea
                  rows={6}
                  value={editJobData.keyResponsibilities.join('\n')}
                  onChange={e => setEditJobData({ ...editJobData, keyResponsibilities: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Requisitos de Educación</label>
                  <input
                    type="text"
                    value={editJobData.educationRequirements}
                    onChange={e => setEditJobData({ ...editJobData, educationRequirements: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Experiencia Requerida</label>
                  <input
                    type="text"
                    value={editJobData.experienceRequirements}
                    onChange={e => setEditJobData({ ...editJobData, experienceRequirements: e.target.value })}
                    className="w-full p-2 rounded-lg border bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
              {/* Job Header */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Ficha Técnica de Funciones · Corporación Social Somos Uno
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {activeJob.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Área: <strong>{activeJob.area}</strong> · Jefe Inmediato: <strong>{activeJob.immediateSupervisor}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadPDF(activeJob)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Descargar Ficha PDF</span>
                </button>
              </div>

              {/* General Objective */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  1. Objetivo General del Cargo
                </h4>
                <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeJob.generalObjective}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                  2. Responsabilidades Principales y Actividades en Nómina
                </h4>
                <div className="space-y-2">
                  {activeJob.keyResponsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 leading-normal">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile & Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">Requisitos del Perfil</h5>
                  <p><strong>Educación:</strong> {activeJob.educationRequirements}</p>
                  <p><strong>Experiencia:</strong> {activeJob.experienceRequirements}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">Competencias y Habilidades</h5>
                  <p><strong>Técnicas:</strong> {activeJob.technicalSkills.join(', ')}</p>
                  <p><strong>Blandas:</strong> {activeJob.softSkills.join(', ')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
