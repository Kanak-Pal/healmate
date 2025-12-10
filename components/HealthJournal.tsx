import React, { useState } from 'react';
    import { BookHeart, Moon, Activity, Smartphone, Save } from 'lucide-react';
    import { JournalEntry } from '../types';
    
    export const HealthJournal: React.FC = () => {
      const [mood, setMood] = useState<JournalEntry['mood']>('Good');
      const [notes, setNotes] = useState('');
      const [sleep, setSleep] = useState(7);
      const [entries, setEntries] = useState<JournalEntry[]>([]);
    
      const handleSave = () => {
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString(),
          mood,
          notes,
          sleepHours: sleep
        };
        setEntries([newEntry, ...entries]);
        setNotes('');
        alert("Daily entry saved!");
      };
    
      return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookHeart className="text-blue-600" /> Daily Journal
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Track your habits, sleep, and well-being.</p>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How are you feeling?</label>
                <div className="flex justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                  {['Awful', 'Bad', 'Okay', 'Good', 'Great'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m as any)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${mood === m ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-700 dark:text-blue-300 font-bold ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
    
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Moon size={16} /> Sleep Duration (Hours)
                </label>
                <input 
                  type="range" min="0" max="12" step="0.5" 
                  value={sleep} onChange={e => setSleep(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 dark:accent-blue-500"
                />
                <div className="text-right text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{sleep} hrs</div>
              </div>
    
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Notes</label>
                <textarea 
                  className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="Any symptoms, workouts, or thoughts?"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
    
              <button onClick={handleSave} className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Save Entry
              </button>
            </div>
    
            <div className="space-y-6">
               <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                    <Smartphone size={18} /> Digital Wellbeing
                  </h3>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-indigo-700 dark:text-indigo-300 text-sm">Screen Time</span>
                    <span className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">4h 12m</span>
                  </div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
               </div>
    
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 transition-colors">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4">Recent Entries</h3>
                 <div className="space-y-4">
                   {entries.length === 0 ? (
                     <p className="text-slate-400 dark:text-slate-500 text-sm italic">No entries yet.</p>
                   ) : (
                     entries.map(e => (
                       <div key={e.id} className="pb-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                         <div className="flex justify-between mb-1">
                           <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{e.date}</span>
                           <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{e.mood}</span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{e.notes || "No notes."}</p>
                       </div>
                     ))
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
      );
    };