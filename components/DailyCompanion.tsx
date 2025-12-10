import React, { useState, useEffect } from 'react';
import { Bot, Dog, Cat, Bird, Edit2, X, RefreshCw } from 'lucide-react';
import { getCompanionMessage } from '../services/geminiService';
import { CompanionCharacter } from '../types';

interface DailyCompanionProps {
  stats: {
    heartRate: number;
    steps: number;
    sleepScore: number;
  };
}

const characters: { id: CompanionCharacter; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'ZenBot', label: 'Zen Bot', icon: <Bot size={40} />, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  { id: 'HealthPup', label: 'Health Pup', icon: <Dog size={40} />, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'CareKitty', label: 'Care Kitty', icon: <Cat size={40} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'WiseOwl', label: 'Wise Owl', icon: <Bird size={40} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
];

export const DailyCompanion: React.FC<DailyCompanionProps> = ({ stats }) => {
  const [character, setCharacter] = useState<CompanionCharacter>('ZenBot');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      setLoading(true);
      const msg = await getCompanionMessage(stats, character);
      setMessage(msg || "I'm here to help you stay healthy!");
      setLoading(false);
    };

    fetchMessage();
  }, [character, stats.steps, stats.sleepScore]); // Refetch if character or major stats change

  const activeChar = characters.find(c => c.id === character) || characters[0];

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mb-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      {isEditing ? (
        <div className="relative z-10 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Choose Your Companion</h3>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  setCharacter(char.id);
                  setIsEditing(false);
                }}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  character === char.id 
                    ? 'border-blue-400 bg-white/10' 
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`${char.color} ${char.bg} p-3 rounded-full mb-2`}>
                  {char.icon}
                </div>
                <span className="font-medium text-sm">{char.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Character Animation */}
          <div className="relative group cursor-pointer" onClick={() => setIsEditing(true)}>
             <div className={`w-24 h-24 ${activeChar.bg} ${activeChar.color} rounded-full flex items-center justify-center shadow-lg animate-[bounce_3s_infinite] border-4 border-white/20`}>
                {activeChar.icon}
             </div>
             <div className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
               <Edit2 size={12} />
             </div>
          </div>

          {/* Speech Bubble */}
          <div className="flex-1 bg-white/10 backdrop-blur-sm p-5 rounded-2xl rounded-tl-none border border-white/10 relative">
             <div className="absolute top-4 -left-2 w-4 h-4 bg-white/10 border-l border-b border-white/10 transform rotate-45"></div>
             
             {loading ? (
               <div className="flex items-center gap-2 text-slate-300">
                 <RefreshCw className="animate-spin" size={16} />
                 <span className="text-sm">Connecting to {activeChar.label}...</span>
               </div>
             ) : (
               <div>
                  <h4 className="font-bold text-blue-300 text-sm mb-1">{activeChar.label} says:</h4>
                  <p className="text-lg leading-relaxed font-light">"{message}"</p>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};