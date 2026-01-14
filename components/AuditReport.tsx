
import React, { useState } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';
import { Download, ArrowLeft, AlertTriangle, ShieldAlert, CheckCircle, ClipboardList, Target, TrendingUp, User, MapPin, Award } from 'lucide-react';
import { FarmData, ModuleScore, ScoreData, AnswerValue } from '../types';

interface AuditReportProps {
  farmData: FarmData;
  scoreData: ScoreData;
  moduleScores: ModuleScore[];
  moduleImages: Record<string, string>;
  answers: Record<string, AnswerValue>;
  onBack: () => void;
}

declare const html2pdf: any;

const AuditReport: React.FC<AuditReportProps> = ({
  farmData,
  scoreData,
  moduleScores,
  moduleImages,
  onBack,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    setIsGenerating(true);
    
    // Pequeña pausa para asegurar que el DOM esté listo y las gráficas renderizadas
    setTimeout(async () => {
      const element = document.getElementById('report-content');
      if (!element) {
        setIsGenerating(false);
        return;
      }

      // Configuración de html2pdf optimizada para centrado total y visibilidad
      const opt = {
        margin: [10, 10, 10, 10], // Margen equilibrado de 10mm en todos los lados
        filename: `PorkSafe_${farmData.farmName.replace(/\s+/g, '_') || 'Auditoria'}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 3, // Mayor escala para nitidez profesional
          useCORS: true, 
          letterRendering: true,
          backgroundColor: '#ffffff',
          width: 794, // Ancho exacto A4 a 96 DPI para evitar distorsión
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      try {
        await html2pdf().from(element).set(opt).save();
      } catch (error) {
        console.error('Error al generar PDF:', error);
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const finalPercentage = parseFloat(scoreData.percentage);
  const getStatusConfig = (score: number) => {
    if (score >= 90) return { icon: <Award />, color: "border-emerald-500 bg-emerald-50", text: "ALTO CUMPLIMIENTO", textColor: "text-emerald-700", accent: "bg-emerald-600" };
    if (score >= 75) return { icon: <CheckCircle />, color: "border-blue-400 bg-blue-50", text: "DESEMPEÑO ÓPTIMO", textColor: "text-blue-700", accent: "bg-blue-600" };
    if (score >= 60) return { icon: <AlertTriangle />, color: "border-amber-400 bg-amber-50", text: "ALERTA DE RIESGO", textColor: "text-amber-700", accent: "bg-amber-500" };
    return { icon: <ShieldAlert />, color: "border-red-500 bg-red-50", text: "RIESGO CRÍTICO", textColor: "text-red-700", accent: "bg-red-600" };
  };

  const status = getStatusConfig(finalPercentage);
  const radarData = moduleScores.map(m => ({
    subject: m.title.split(':')[0].substring(0, 10),
    score: m.score,
    target: 95,
  }));

  return (
    <div className="min-h-screen bg-slate-200 py-10 flex flex-col items-center overflow-x-hidden">
      
      {/* CONTENEDOR DE CAPTURA - Diseñado para encajar perfectamente en A4 */}
      <div 
        id="report-content" 
        className="bg-white text-slate-900 border-none relative shadow-2xl" 
        style={{ 
          width: '794px', // Tamaño estándar A4
          paddingTop: '60px',
          paddingBottom: '60px',
          paddingLeft: '50px', // Padding simétrico para centrado real
          paddingRight: '50px', 
          boxSizing: 'border-box',
          minHeight: '1120px',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        {/* Header Corporativo */}
        <header className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-8">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl text-white shadow-lg ${status.accent}`}>
              <Target size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Pork Safe</h1>
              <p className="text-slate-400 font-bold tracking-[0.2em] text-[9px] uppercase mt-2">Reporte de Auditoría Técnica</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Fecha Reporte</p>
              <p className="text-slate-900 font-black text-base leading-none">{farmData.date}</p>
            </div>
          </div>
        </header>

        {/* Ficha de Granja */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
             <MapPin className="text-slate-300 shrink-0" size={20} />
             <div className="overflow-hidden">
               <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">Unidad Productora</span>
               <p className="text-sm font-black text-slate-800 leading-tight truncate">{farmData.farmName || "No especificada"}</p>
             </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
             <User className="text-slate-300 shrink-0" size={20} />
             <div className="overflow-hidden">
               <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">Auditor Responsable</span>
               <p className="text-sm font-black text-slate-800 leading-tight truncate">{farmData.auditorName || "No especificado"}</p>
             </div>
          </div>
        </div>

        {/* Puntaje Destacado */}
        <div className={`p-8 rounded-[2.5rem] border-2 mb-10 flex items-center justify-between shadow-sm ${status.color}`}>
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Status Bioseguridad</span>
            <h2 className={`text-2xl font-black ${status.textColor}`}>{status.text}</h2>
            <p className="text-[9px] font-bold text-slate-400">Puntaje oficial según criterios sanitarios</p>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-black font-mono leading-none ${status.textColor}`}>
              {scoreData.percentage}%
            </div>
          </div>
        </div>

        {/* Análisis de Gráficos */}
        <div className="grid grid-cols-12 gap-8 mb-10" style={{ pageBreakInside: 'avoid' }}>
           <div className="col-span-7 border border-slate-100 rounded-[2.5rem] p-6 bg-slate-50 flex flex-col items-center overflow-hidden">
             <h4 className="font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] mb-4">Radar de Desempeño</h4>
             <div className="h-[220px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                   <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
                   <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontBold: true, fill: '#475569' }} />
                   <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar dataKey="target" stroke="#cbd5e1" strokeDasharray="3 3" fill="#f1f5f9" fillOpacity={0.4} isAnimationActive={false} />
                   <Radar dataKey="score" stroke={finalPercentage >= 80 ? '#10b981' : '#2563eb'} strokeWidth={3} fill={finalPercentage >= 80 ? '#10b981' : '#2563eb'} fillOpacity={0.15} isAnimationActive={false} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="col-span-5 flex flex-col gap-4 justify-center">
             <h4 className="font-black text-slate-400 uppercase text-[8px] tracking-[0.3em] px-2">Cumplimiento Modular</h4>
             {moduleScores.map(m => (
               <div key={m.id} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                 <div className="flex justify-between items-center mb-1.5">
                   <span className="text-[9px] font-black text-slate-600 uppercase truncate pr-4">{m.title}</span>
                   <span className={`text-[10px] font-black ${m.score >= 80 ? 'text-emerald-600' : 'text-blue-600'}`}>{m.score.toFixed(0)}%</span>
                 </div>
                 <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                   <div className={`${m.score >= 80 ? 'bg-emerald-500' : 'bg-blue-600'} h-full`} style={{ width: `${m.score}%` }} />
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Dictamen del Auditor */}
        <div className="mb-10" style={{ pageBreakInside: 'avoid' }}>
          <div className="bg-slate-900 text-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-800">
            <div className="p-4 bg-slate-800 flex items-center gap-3 border-b border-slate-700">
              <ClipboardList size={18} className="text-blue-400" />
              <h3 className="text-[9px] font-black uppercase tracking-widest">Dictamen Profesional</h3>
            </div>
            <div className="p-8 text-xs italic leading-relaxed text-slate-200 border-l-[8px] border-blue-600 ml-4 my-4 font-light">
              {farmData.observations ? (
                <p className="whitespace-pre-wrap">"{farmData.observations}"</p>
              ) : (
                <p className="text-slate-500 font-bold opacity-50 italic uppercase tracking-wider">Sin observaciones adicionales reportadas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Desglose de Resultados */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b-2 border-slate-100 pb-3 flex items-center gap-3 uppercase tracking-tighter">
             <TrendingUp className="text-blue-600" size={24} /> Desglose Operativo
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {moduleScores.map((mod) => (
              <div key={mod.id} className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] flex gap-8 items-center shadow-sm" style={{ pageBreakInside: 'avoid' }}>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight truncate pr-6">{mod.title}</h4>
                    <span className={`text-3xl font-black font-mono shrink-0 ${mod.score >= 80 ? 'text-emerald-600' : 'text-blue-700'}`}>{mod.score.toFixed(0)}%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white py-3 rounded-xl border border-slate-100 text-center">
                      <span className="text-2xl font-black text-emerald-600 block leading-none mb-1">{mod.yes}</span>
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Aprobados</span>
                    </div>
                    <div className="bg-white py-3 rounded-xl border border-slate-100 text-center">
                       <span className="text-2xl font-black text-amber-500 block leading-none mb-1">{mod.partial}</span>
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Parciales</span>
                    </div>
                    <div className="bg-white py-3 rounded-xl border border-slate-100 text-center">
                       <span className="text-2xl font-black text-red-600 block leading-none mb-1">{mod.no}</span>
                       <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Fallidos</span>
                    </div>
                  </div>
                </div>
                {moduleImages[mod.id] && (
                  <div className="w-32 h-32 border-4 border-white rounded-[1.2rem] overflow-hidden shadow-lg bg-slate-200 shrink-0">
                    <img src={moduleImages[mod.id]} alt="Evidencia" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-30">
          <div className="flex items-center gap-3">
            <Target size={16} />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PorkSafe Platform | Reporte Final de Bioseguridad</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">ID VALIDATION: {Math.random().toString(36).substring(7).toUpperCase()}</p>
          </div>
        </footer>
      </div>

      {/* Acciones Web - Rediseño Profesional de Botones */}
      <div className="no-print mt-12 mb-32 flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-2xl">
          <button 
              onClick={downloadPDF}
              disabled={isGenerating}
              className="group relative bg-slate-950 hover:bg-black text-white font-bold py-5 px-14 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center gap-4 border border-slate-800"
          >
              <div className="bg-blue-600 p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                <Download size={20} className={isGenerating ? "animate-bounce" : ""} />
              </div>
              <span className="uppercase tracking-[0.15em] text-sm">
                {isGenerating ? "Generando Reporte..." : "Descargar Reporte PDF"}
              </span>
          </button>
          
          <button 
              onClick={onBack}
              className="text-slate-500 hover:text-slate-800 font-bold py-3 px-8 transition-all flex items-center gap-2 text-xs uppercase tracking-widest hover:bg-slate-300/50 rounded-full"
          >
              <ArrowLeft size={16} /> Volver al Tablero
          </button>
      </div>
    </div>
  );
};

export default AuditReport;
