import React, { useState } from 'react';
import { Camera, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { AUDIT_MODULES } from '../constants';
import { AnswerValue } from '../types';

interface AuditFormProps {
  answers: Record<string, AnswerValue>;
  moduleImages: Record<string, string>;
  onAnswer: (id: string, value: AnswerValue) => void;
  onImageUpload: (moduleId: string, file: File) => void;
  onImageRemove: (moduleId: string) => void;
}

const AuditForm: React.FC<AuditFormProps> = ({
  answers,
  moduleImages,
  onAnswer,
  onImageUpload,
  onImageRemove,
}) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleImageChange = (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(moduleId, e.target.files[0]);
    }
  };

  const getModuleStatus = (moduleId: string) => {
    const module = AUDIT_MODULES.find((m) => m.id === moduleId);
    if (!module) return false;
    return module.questions.every((q) => answers[q.id] !== undefined);
  };

  return (
    <div className="space-y-4">
      {AUDIT_MODULES.map((module) => {
        const isActive = activeModule === module.id;
        const isComplete = getModuleStatus(module.id);
        const answeredCount = module.questions.filter((q) => answers[q.id] !== undefined).length;
        const totalCount = module.questions.length;

        return (
          <div
            key={module.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <button
              onClick={() => setActiveModule(isActive ? null : module.id)}
              className={`w-full p-4 text-left flex items-center justify-between transition-colors ${
                isActive ? 'bg-blue-50 border-b border-blue-100' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isComplete
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isComplete ? <CheckCircle2 size={18} /> : module.id.replace('mod_', '')}
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">{module.title}</span>
                  <span className="text-xs text-slate-500">
                    {answeredCount} / {totalCount} contestadas
                  </span>
                </div>
              </div>
              {isActive ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {isActive && (
              <div className="divide-y divide-slate-100 animate-in fade-in duration-200">
                {module.questions.map((q) => (
                  <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <p className="text-slate-800 mb-3 font-medium text-sm md:text-base">
                      {q.text}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Sí', val: '100', color: 'text-green-700 border-green-200 peer-checked:bg-green-600 peer-checked:text-white bg-green-50' },
                        { label: 'Parcial', val: '50', color: 'text-yellow-700 border-yellow-200 peer-checked:bg-yellow-500 peer-checked:text-white bg-yellow-50' },
                        { label: 'No', val: '0', color: 'text-red-700 border-red-200 peer-checked:bg-red-600 peer-checked:text-white bg-red-50' },
                        { label: 'N/A', val: 'NA', color: 'text-slate-600 border-slate-200 peer-checked:bg-slate-500 peer-checked:text-white bg-slate-100' },
                      ].map((opt) => (
                        <label key={`${q.id}-${opt.val}`} className="cursor-pointer relative">
                          <input
                            type="radio"
                            name={q.id}
                            value={opt.val}
                            checked={answers[q.id] === opt.val}
                            onChange={() => onAnswer(q.id, opt.val as AnswerValue)}
                            className="peer sr-only"
                          />
                          <div
                            className={`text-center py-2 rounded-lg text-xs md:text-sm font-bold border transition-all hover:opacity-90 ${opt.color}`}
                          >
                            {opt.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    📸 Evidencia fotográfica del módulo (Opcional):
                  </label>
                  {!moduleImages[module.id] ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="text-center text-slate-500">
                        <Camera className="mx-auto mb-2 opacity-50" size={32} />
                        <span className="text-sm font-medium">Tocar para tomar o subir foto</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(module.id, e)}
                      />
                    </label>
                  ) : (
                    <div className="relative group">
                      <img
                        src={moduleImages[module.id]}
                        alt={`Evidencia ${module.title}`}
                        className="w-full h-64 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      <button
                        onClick={() => onImageRemove(module.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AuditForm;
