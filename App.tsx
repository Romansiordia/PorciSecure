
import React, { useState, useEffect, useMemo } from 'react';
import { FileBarChart, RotateCcw, Trash2, ShieldCheck, ClipboardCheck, LayoutDashboard, Presentation } from 'lucide-react';
import AuditForm from './components/AuditForm.tsx';
import AuditReport from './components/AuditReport.tsx';
import DashboardPreview from './components/DashboardPreview.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import { AUDIT_MODULES, TOTAL_QUESTIONS } from './constants.ts';
import { AnswerValue, FarmData, ScoreData, ModuleScore } from './types.ts';

function App() {
  const [view, setView] = useState<'form' | 'dashboard' | 'report'>('form');
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [moduleImages, setModuleImages] = useState<Record<string, string>>({});
  const [farmData, setFarmData] = useState<FarmData>({
    farmName: '',
    auditorName: '',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    observations: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('porksafe_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.farmData) setFarmData(parsed.farmData);
      } catch (e) {
        console.error("Error loading data", e);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { answers, farmData };
    localStorage.setItem('porksafe_data', JSON.stringify(dataToSave));
  }, [answers, farmData]);

  const handleAnswer = (id: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (moduleId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setModuleImages(prev => ({
        ...prev,
        [moduleId]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (moduleId: string) => {
    setModuleImages(prev => {
      const next = { ...prev };
      delete next[moduleId];
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro? Se borrarán todos los datos de la auditoría actual.')) {
      setAnswers({});
      setModuleImages({});
      setFarmData({
        farmName: '',
        auditorName: '',
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        observations: ''
      });
      localStorage.removeItem('porksafe_data');
      setView('form');
    }
  };

  const calculations = useMemo(() => {
    let globalEarned = 0;
    let globalTotal = 0;
    let answeredCount = 0;

    const modScores: ModuleScore[] = AUDIT_MODULES.map(mod => {
      let modEarned = 0;
      let modTotal = 0;
      let yes = 0;
      let partial = 0;
      let no = 0;

      mod.questions.forEach(q => {
        const val = answers[q.id];
        if (val && val !== 'NA') {
          modEarned += parseInt(val);
          modTotal += 100;
        }
        if (val === '100') yes++;
        if (val === '50') partial++;
        if (val === '0') no++;
        if (val) answeredCount++;
      });

      return {
        id: mod.id,
        title: mod.title,
        score: modTotal === 0 ? 0 : (modEarned / modTotal) * 100,
        earned: modEarned,
        total: modTotal,
        yes,
        partial,
        no
      };
    });

    modScores.forEach(m => {
      globalEarned += m.earned;
      globalTotal += m.total;
    });

    const globalPercentage = globalTotal === 0 ? 0 : (globalEarned / globalTotal) * 100;

    const scoreData: ScoreData = {
      percentage: globalPercentage.toFixed(1),
      earned: globalEarned,
      totalPossible: globalTotal,
      answeredCount,
      totalQuestions: TOTAL_QUESTIONS
    };

    return { modScores, scoreData };
  }, [answers]);

  const loadTestData = () => {
    const mockAnswers: Record<string, AnswerValue> = {};
    AUDIT_MODULES.forEach(mod => {
        mod.questions.forEach(q => {
            const r = Math.random();
            if (r < 0.75) mockAnswers[q.id] = "100";
            else if (r < 0.90) mockAnswers[q.id] = "50";
            else if (r < 0.98) mockAnswers[q.id] = "0";
            else mockAnswers[q.id] = "NA";
        });
    });
    setAnswers(mockAnswers);
    setFarmData(prev => ({
      ...prev,
      farmName: "Granja Experimental El Vergel",
      auditorName: "Dr. Roberto Casas",
      observations: "Se observa un buen cumplimiento general, sin embargo, el control de roedores requiere atención inmediata debido a la temporada de lluvias."
    }));
  };

  const scoreColor = 
    parseFloat(calculations.scoreData.percentage) >= 90 ? 'text-green-400' : 
    parseFloat(calculations.scoreData.percentage) >= 70 ? 'text-blue-400' : 
    parseFloat(calculations.scoreData.percentage) >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
              <ShieldCheck className="text-blue-500 w-8 h-8" /> 
              <span className="hidden sm:inline">PORK SAFE AUDIT</span>
              <span className="sm:hidden">PORK SAFE</span>
            </h1>
            <div className="flex gap-2">
              <div className="bg-blue-600/30 px-3 py-1.5 rounded-xl text-[10px] font-black border border-blue-500/30 flex items-center gap-1.5 uppercase tracking-wider">
                <ClipboardCheck size={12} />
                {calculations.scoreData.answeredCount} / {calculations.scoreData.totalQuestions}
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between px-1">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Status de Bioseguridad</span>
              <div className={`text-3xl font-black font-mono leading-none ${scoreColor}`}>
                {calculations.scoreData.percentage}%
              </div>
            </div>
            <div className="text-right">
               <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{farmData.date}</span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700/50 h-2 rounded-full mt-4 overflow-hidden border border-white/5 shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)] ${
                parseFloat(calculations.scoreData.percentage) >= 90 ? 'bg-green-500' : 
                parseFloat(calculations.scoreData.percentage) >= 70 ? 'bg-blue-500' : 
                parseFloat(calculations.scoreData.percentage) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${calculations.scoreData.percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
        {view === 'form' && (
          <>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <LayoutDashboard size={120} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Nombre de la Unidad de Producción</label>
                    <input 
                        type="text" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder-slate-300"
                        value={farmData.farmName}
                        onChange={(e) => setFarmData(prev => ({...prev, farmName: e.target.value}))}
                        placeholder="Ej. Hacienda La Bonita"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Médico Veterinario / Auditor</label>
                    <input 
                        type="text" 
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder-slate-300"
                        value={farmData.auditorName}
                        onChange={(e) => setFarmData(prev => ({...prev, auditorName: e.target.value}))}
                        placeholder="Nombre completo"
                    />
                  </div>
               </div>
               <div className="mt-8 flex flex-wrap justify-between items-center border-t border-slate-100 pt-6 gap-4">
                   <div className="flex gap-2">
                     <button 
                         onClick={loadTestData}
                         className="text-xs bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-black flex items-center gap-2 transition-all px-4 py-2.5 rounded-xl uppercase tracking-wider"
                     >
                         <RotateCcw size={16} /> Cargar Mock
                     </button>
                   </div>
                   <button 
                       onClick={handleReset}
                       className="text-xs bg-red-50 text-red-500 hover:bg-red-500 hover:text-white font-black flex items-center gap-2 transition-all px-4 py-2.5 rounded-xl uppercase tracking-wider"
                   >
                       <Trash2 size={16} /> Reiniciar Auditoría
                   </button>
               </div>
            </div>

            <AuditForm 
              answers={answers}
              moduleImages={moduleImages}
              onAnswer={handleAnswer}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
            />
          </>
        )}

        {view === 'dashboard' && (
          <DashboardPreview 
            moduleScores={calculations.modScores}
            scoreData={calculations.scoreData}
            observations={farmData.observations || ''}
            onUpdateObservations={(val) => setFarmData(prev => ({...prev, observations: val}))}
            onContinue={() => setView('report')}
            onBack={() => setView('form')}
          />
        )}

        {view === 'report' && (
          <AuditReport 
            farmData={farmData}
            scoreData={calculations.scoreData}
            moduleScores={calculations.modScores}
            moduleImages={moduleImages}
            answers={answers}
            onBack={() => setView('dashboard')}
          />
        )}
      </div>

      <AIAssistant answers={answers} farmData={farmData} />

      {view === 'form' && (
        <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40">
            <div className="max-w-4xl mx-auto flex gap-4 justify-center">
              <button 
                  onClick={() => setView('dashboard')}
                  className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base group"
              >
                  <Presentation size={20} className="group-hover:scale-110 transition-transform" /> 
                  VER ANÁLISIS GRÁFICO
              </button>
              <button 
                  onClick={() => setView('report')}
                  className="w-full max-w-xs bg-blue-700 hover:bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base group"
              >
                  <FileBarChart size={20} className="group-hover:rotate-12 transition-transform" /> 
                  FINALIZAR REPORTE
              </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;