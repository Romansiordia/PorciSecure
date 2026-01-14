
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { LayoutDashboard, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, FileText, ClipboardList } from 'lucide-react';
import { ModuleScore, ScoreData } from '../types';

interface DashboardPreviewProps {
  moduleScores: ModuleScore[];
  scoreData: ScoreData;
  observations: string;
  onUpdateObservations: (val: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({ 
  moduleScores, 
  scoreData, 
  observations,
  onUpdateObservations,
  onContinue, 
  onBack 
}) => {
  const COLORS = ['#059669', '#d97706', '#dc2626']; // Si, Parcial, No

  const pieData = [
    { name: 'Cumple', value: moduleScores.reduce((acc, m) => acc + m.yes, 0) },
    { name: 'Parcial', value: moduleScores.reduce((acc, m) => acc + m.partial, 0) },
    { name: 'Falla', value: moduleScores.reduce((acc, m) => acc + m.no, 0) },
  ].filter(d => d.value > 0);

  const getBarColor = (score: number) => {
    if (score >= 90) return '#059669';
    if (score >= 70) return '#2563eb';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Análisis de Desempeño
          </h2>
          <p className="text-slate-500 text-sm">Revisión de comportamiento previo al reporte final</p>
        </div>
        <button 
          onClick={onBack}
          className="text-blue-600 font-bold text-sm hover:underline"
        >
          ← Volver al Formulario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KPI Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Puntaje Global</span>
          <div className="relative w-40 h-40 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                 strokeDasharray={440}
                 strokeDashoffset={440 - (440 * parseFloat(scoreData.percentage)) / 100}
                 className={parseFloat(scoreData.percentage) > 70 ? 'text-blue-600' : 'text-red-500'}
               />
             </svg>
             <span className="absolute text-4xl font-black text-slate-800">{scoreData.percentage}%</span>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            {scoreData.answeredCount} de {scoreData.totalQuestions} preguntas respondidas
          </p>
        </div>

        {/* Bar Chart Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Cumplimiento por Módulo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleScores} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="title" tick={{fontSize: 10, fontWeight: 600}} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                  {moduleScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Distribución de Hallazgos</h3>
          <div className="h-56 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 pr-4">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}} />
                  <span className="text-xs font-bold text-slate-600">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Areas List */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500" />
            Áreas de Atención Inmediata
          </h3>
          <div className="space-y-3">
            {moduleScores.filter(m => m.score < 70).map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white p-2 rounded-xl">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-red-900 uppercase tracking-tight leading-none">{m.title}</p>
                    <p className="text-[10px] text-red-700 font-bold mt-1">Crítico: {m.no} Fallas detectadas</p>
                  </div>
                </div>
                <span className="text-sm font-black text-red-600">{m.score.toFixed(0)}%</span>
              </div>
            ))}
            {moduleScores.every(m => m.score >= 70) && (
              <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
                <CheckCircle2 size={40} className="text-green-500 mb-2 opacity-50" />
                <p className="text-sm font-bold">No se detectan áreas críticas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW: Professional Observations Box */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
            <ClipboardList size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Observaciones del Auditor</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Notas técnicas y comentarios profesionales</p>
          </div>
        </div>
        <textarea
          value={observations}
          onChange={(e) => onUpdateObservations(e.target.value)}
          placeholder="Agrega aquí comentarios sobre el manejo, condiciones sanitarias específicas o recomendaciones inmediatas observadas durante la auditoría..."
          className="w-full h-40 bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-slate-700 placeholder-slate-400 resize-none shadow-inner"
        ></textarea>
        <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <FileText size={12} />
          Este texto aparecerá en la sección de "Comentarios del Profesional" en el PDF final.
        </div>
      </div>

      <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black mb-1">¿Todo listo para el reporte final?</h3>
          <p className="text-blue-100 text-sm opacity-90">Puedes regresar al formulario para corregir observaciones o proceder a generar el PDF oficial.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={onContinue}
            className="flex-1 md:flex-none bg-white text-blue-700 font-black py-4 px-8 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            Generar PDF Oficial <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
