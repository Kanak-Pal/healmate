import React from 'react';
import { Activity, MessageSquare, ScanLine, FileText, Heart, Pill, Utensils, MapPin, Smile, BookHeart, Beaker, Users, Stethoscope, Sun, Moon } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, setIsOpen, darkMode, toggleTheme }) => {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
    { id: 'chat', label: 'Health Assistant', icon: <MessageSquare size={20} /> },
    { id: 'heart-rate', label: 'Heart Rate', icon: <Heart size={20} /> },
    { id: 'analysis', label: 'Image Analysis', icon: <ScanLine size={20} /> },
    { id: 'medications', label: 'Medications', icon: <Pill size={20} /> },
    { id: 'diet', label: 'Diet & Food', icon: <Utensils size={20} /> },
    { id: 'locator', label: 'Find Care', icon: <MapPin size={20} /> },
    { id: 'mental-health', label: 'Mental Wellness', icon: <Smile size={20} /> },
    { id: 'labs', label: 'Lab Services', icon: <Beaker size={20} /> },
    { id: 'journal', label: 'Health Journal', icon: <BookHeart size={20} /> },
    { id: 'community', label: 'Community', icon: <Users size={20} /> },
    { id: 'reports', label: 'Report Simplifier', icon: <FileText size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto flex flex-col`}>
        <div className="p-6 flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 transition-colors">
          <div className="bg-blue-500 p-2.5 rounded-xl text-white relative shadow-sm">
            <Stethoscope size={24} />
            <div className="absolute -top-1.5 -right-1.5 bg-white dark:bg-slate-800 rounded-full p-1 border-2 border-white dark:border-slate-800 shadow-sm transition-colors">
              <Heart size={10} className="text-rose-500 fill-rose-500" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">HealMate</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Personal Health AI</p>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm ring-1 ring-blue-100 dark:ring-blue-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`${currentView === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
           {/* Theme Toggle */}
           <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 mb-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'left-4.5 translate-x-1' : 'left-0.5'}`}></div>
            </div>
          </button>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-1">Medical Disclaimer</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
              HealMate is an experimental tool. Never disregard professional medical advice.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};