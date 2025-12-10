import React, { useState } from 'react';
import { Plus, Trash2, Clock, Pill, CheckCircle } from 'lucide-react';
import { Medication } from '../types';

interface MedicationManagerProps {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({ medications, setMedications }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState<Omit<Medication, 'id'>>({ name: '', dosage: '', frequency: 'Daily', time: '08:00' });

  const handleAdd = () => {
    if (!newMed.name) return;
    setMedications([...medications, { ...newMed, id: Date.now().toString() }]);
    setNewMed({ name: '', dosage: '', frequency: 'Daily', time: '08:00' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Pill className="text-blue-600" />
            Medication Manager
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Track your prescriptions and get dosage reminders.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Add Medication
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 animate-slide-down transition-colors">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Add New Medication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Medication Name" 
              value={newMed.name}
              onChange={e => setNewMed({...newMed, name: e.target.value})}
              className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              placeholder="Dosage (e.g., 50mg)" 
              value={newMed.dosage}
              onChange={e => setNewMed({...newMed, dosage: e.target.value})}
              className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select 
              value={newMed.frequency}
              onChange={e => setNewMed({...newMed, frequency: e.target.value})}
              className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Daily</option>
              <option>Twice Daily</option>
              <option>Weekly</option>
              <option>As Needed</option>
            </select>
            <input 
              type="time" 
              value={newMed.time}
              onChange={e => setNewMed({...newMed, time: e.target.value})}
              className="p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600">Save Medication</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" /> Today's Schedule
          </h3>
          <div className="space-y-4">
            {medications.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-center py-8">No medications scheduled.</p>
            ) : (
              medications.sort((a,b) => a.time.localeCompare(b.time)).map(med => (
                <div key={med.id} className="flex items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group transition-colors">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm text-slate-700 dark:text-slate-300 font-mono text-sm border border-slate-100 dark:border-slate-800">
                    {med.time}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-slate-800 dark:text-white">{med.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{med.dosage} • {med.frequency}</p>
                  </div>
                  <button className="p-2 text-slate-300 dark:text-slate-600 hover:text-green-500 dark:hover:text-green-400 transition-colors">
                    <CheckCircle size={24} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* All Medications List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">My Cabinet</h3>
          <div className="space-y-3">
             {medications.map(med => (
               <div key={med.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                     <Pill size={14} />
                   </div>
                   <div>
                     <p className="font-medium text-slate-800 dark:text-white">{med.name}</p>
                     <p className="text-xs text-slate-400 dark:text-slate-500">{med.dosage}</p>
                   </div>
                 </div>
                 <button onClick={() => handleDelete(med.id)} className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 p-2">
                   <Trash2 size={16} />
                 </button>
               </div>
             ))}
             {medications.length === 0 && (
               <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                 Click "Add Medication" to build your list.
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};