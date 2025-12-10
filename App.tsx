import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatBot } from './components/ChatBot';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { ReportSimplifier } from './components/ReportSimplifier';
import { MedicationManager } from './components/MedicationManager';
import { DietaryScanner } from './components/DietaryScanner';
import { CareLocator } from './components/CareLocator';
import { MentalWellness } from './components/MentalWellness';
import { LabServices } from './components/LabServices';
import { HealthJournal } from './components/HealthJournal';
import { Community } from './components/Community';
import { ViewState, Medication } from './types';
import { Menu, Stethoscope, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard darkMode={darkMode} />;
      case 'chat':
        return <ChatBot />;
      case 'analysis':
        return <ImageAnalyzer />;
      case 'reports':
        return <ReportSimplifier />;
      case 'medications':
        return <MedicationManager medications={medications} setMedications={setMedications} />;
      case 'diet':
        return <DietaryScanner medications={medications} />;
      case 'locator':
        return <CareLocator />;
      case 'mental-health':
        return <MentalWellness />;
      case 'labs':
        return <LabServices />;
      case 'journal':
        return <HealthJournal />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 transition-colors">
          <div className="flex items-center gap-2">
             <div className="bg-blue-500 p-1.5 rounded-lg text-white relative">
               <Stethoscope size={18} />
               <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-white dark:border-slate-800">
                  <Heart size={6} className="text-rose-500 fill-rose-500" />
               </div>
             </div>
             <span className="font-bold text-slate-800 dark:text-white">HealMate</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;