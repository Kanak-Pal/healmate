import React, { useState } from 'react';
import { Beaker, Calendar, FileText, CheckCircle, ChevronRight } from 'lucide-react';

export const LabServices: React.FC = () => {
  const [scheduled, setScheduled] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Beaker className="text-blue-600" /> Lab & Diagnostics
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Schedule home tests and view analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Booking Card */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Book Home Blood Test</h3>
          {!scheduled ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Test Type</label>
                  <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white">
                    <option>Full Blood Count (FBC)</option>
                    <option>Lipid Profile</option>
                    <option>Diabetes Screen (HbA1c)</option>
                    <option>Vitamin D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                  <input type="date" className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
                </div>
              </div>
              <button 
                onClick={() => setScheduled(true)}
                className="bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 font-medium w-full sm:w-auto"
              >
                Schedule Phlebotomist
              </button>
            </div>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} />
              </div>
              <h4 className="text-green-800 dark:text-green-300 font-bold">Booking Confirmed!</h4>
              <p className="text-green-700 dark:text-green-400 text-sm mt-1">A phlebotomist will arrive on the selected date.</p>
              <button onClick={() => setScheduled(false)} className="text-sm text-green-700 dark:text-green-400 underline mt-4">Book another</button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">Why Home Testing?</h3>
          <ul className="space-y-3">
            {[
              "Convenient & private",
              "Professional phlebotomists",
              "Results in 24-48 hours",
              "AI-analyzed reports"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 text-sm">
                <CheckCircle size={14} className="text-indigo-600 dark:text-indigo-400" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Reports</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { name: "General Health Panel", date: "Oct 12, 2024", status: "Normal" },
            { name: "Lipid Profile", date: "Aug 05, 2024", status: "Action Required" }
          ].map((report, i) => (
            <div key={i} className="py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 px-2 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white">{report.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  report.status === 'Normal' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                }`}>
                  {report.status}
                </span>
                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};