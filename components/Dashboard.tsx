import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Heart, Activity, Footprints, Moon, Droplets, Plus, Minus } from 'lucide-react';
import { DailyCompanion } from './DailyCompanion';

interface DashboardProps {
  darkMode?: boolean;
}

const heartRateData = [
  { time: '08:00', bpm: 68 },
  { time: '10:00', bpm: 72 },
  { time: '12:00', bpm: 85 },
  { time: '14:00', bpm: 75 },
  { time: '16:00', bpm: 70 },
  { time: '18:00', bpm: 78 },
  { time: '20:00', bpm: 65 },
];

const sleepData = [
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 7.2 },
  { day: 'Wed', hours: 6.8 },
  { day: 'Thu', hours: 7.5 },
  { day: 'Fri', hours: 8.0 },
  { day: 'Sat', hours: 9.0 },
  { day: 'Sun', hours: 7.5 },
];

export const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [waterIntake, setWaterIntake] = useState(1250);
  const waterGoal = 2500;

  // Mock current stats for the companion to use
  const currentStats = {
    heartRate: 72,
    steps: 8432,
    sleepScore: 85
  };

  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, waterGoal + 1000));
  };

  const axisColor = darkMode ? '#475569' : '#94a3b8';
  const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
  const tooltipBg = darkMode ? '#1e293b' : '#fff';
  const tooltipText = darkMode ? '#f8fafc' : '#0f172a';

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">Welcome back, Alex</h2>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">Here's your daily health overview.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/50 self-start md:self-auto transition-colors">
          Status: Healthy
        </div>
      </div>

      {/* AI Daily Companion */}
      <DailyCompanion stats={currentStats} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Heart Rate', value: '72 bpm', icon: <Heart className="text-rose-500" />, change: '+2% from yesterday' },
          { label: 'Steps', value: '8,432', icon: <Footprints className="text-orange-500" />, change: '1.2km remaining' },
          { label: 'Sleep Score', value: '85', icon: <Moon className="text-indigo-500" />, change: 'Optimal Rest' },
          { label: 'Activity', value: '45 min', icon: <Activity className="text-blue-500" />, change: 'Moderate Intensity' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</span>
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors">{stat.icon}</div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Heart Rate Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: tooltipText }}
                  labelStyle={{ color: tooltipText }}
                />
                <Line type="monotone" dataKey="bpm" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: darkMode ? '#1e293b' : '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Sleep Duration</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepData}>
                <defs>
                  <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: tooltipText }}
                  labelStyle={{ color: tooltipText }}
                />
                <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSleep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hydration Tracker Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Droplets className="text-blue-500" /> Hydration Tracker
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Daily Goal: {waterGoal}ml</p>
            
            <div className="relative h-8 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-out flex items-center justify-end pr-3"
                style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
              >
                <span className="text-xs text-white font-bold drop-shadow-sm">{Math.round((waterIntake / waterGoal) * 100)}%</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span>0ml</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{waterIntake}ml consumed</span>
              <span>{waterGoal}ml</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-center">
             <button 
               onClick={() => setWaterIntake(Math.max(0, waterIntake - 250))}
               className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-500 transition-colors border border-slate-200 dark:border-slate-700"
               title="Remove 250ml"
             >
               <Minus size={20} />
             </button>
             <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => handleAddWater(250)}
                  className="px-5 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium flex items-center gap-2 border border-blue-100 dark:border-blue-900/30"
                >
                  <Plus size={18} /> Add Glass (250ml)
                </button>
                <button 
                  onClick={() => handleAddWater(500)}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
                >
                   <Plus size={18} /> Add Bottle (500ml)
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};