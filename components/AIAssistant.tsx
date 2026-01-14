
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AnswerValue, FarmData } from '../types';
import { AUDIT_MODULES } from '../constants';

interface AIAssistantProps {
  answers: Record<string, AnswerValue>;
  farmData: FarmData;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ answers, farmData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '¡Hola! Soy tu experto en bioseguridad porcina. Analizaré tus respuestas en tiempo real para darte recomendaciones técnicas. ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construir contexto de la auditoría actual para la IA
      const currentFailures = AUDIT_MODULES.flatMap(mod => 
        mod.questions
          .filter(q => answers[q.id] === '0')
          .map(q => `[Falla en ${mod.title}]: ${q.text}`)
      ).slice(0, 10).join('\n');

      const systemInstruction = `Eres un consultor senior en bioseguridad porcina. 
      Contexto de la granja actual: ${farmData.farmName || 'No especificada'}.
      Fallas críticas detectadas hasta ahora:
      ${currentFailures || 'Ninguna falla crítica reportada todavía.'}
      
      Instrucciones:
      1. Proporciona consejos técnicos basados en ciencia veterinaria y protocolos internacionales (OIE, normas de bienestar animal).
      2. Sé breve y directo. Usa listas cuando sea necesario.
      3. Si el usuario pregunta por soluciones a una falla, sugiere protocolos específicos de limpieza, desinfección o manejo.
      4. Si hay sospecha de enfermedades rojas (PPA, PPC), instruye el reporte inmediato.
      5. Usa Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Entendido. Por favor, continúa con la auditoría o hazme otra pregunta.' }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Hubo un inconveniente en la conexión. Reintenta en un momento.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] shadow-2xl rounded-2xl border border-slate-200 flex flex-col mb-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="text-blue-200" size={20} />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">Consultor de Bioseguridad</span>
                <span className="text-[10px] text-blue-200 opacity-80">Potenciado por Gemini 3</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm prose-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white rounded-b-2xl">
            <div className="relative flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ej: ¿Cómo desinfectar un camión?"
                className="flex-1 pl-4 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-slate-800' : 'bg-blue-600'} text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 group border-4 border-white`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && <span className="font-bold pr-1 hidden md:inline">Consultar Experto IA</span>}
      </button>
    </div>
  );
};

export default AIAssistant;
