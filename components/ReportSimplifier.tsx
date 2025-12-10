import React, { useState } from 'react';
import { FileText, ArrowRight, BookOpen, Copy, Check } from 'lucide-react';
import { simplifyMedicalReport } from '../services/geminiService';

export const ReportSimplifier: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSimplify = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setSimplifiedText('');
    try {
      const result = await simplifyMedicalReport(inputText);
      setSimplifiedText(result || "Could not generate summary.");
    } catch (error) {
      setSimplifiedText("Error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(simplifiedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-[calc(100vh-2rem)] md:h-auto flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          Report Simplifier
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Paste complex medical notes or lab reports to get a plain English summary.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Side */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Original Medical Text</span>
            <button 
              onClick={() => setInputText('')}
              className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            className="flex-1 w-full p-4 resize-none focus:outline-none text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600"
            placeholder="Paste report text here (e.g., 'Patient presents with acute pharyngitis...')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={handleSimplify}
              disabled={!inputText.trim() || isLoading}
              className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium"
            >
              {isLoading ? 'Translating...' : 'Simplify Report'} <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Output Side */}
        <div className="flex flex-col h-full bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden relative transition-colors">
          <div className="p-4 border-b border-blue-100 dark:border-blue-900/30 bg-blue-100/30 dark:bg-blue-900/20 flex justify-between items-center">
            <span className="font-semibold text-blue-900 dark:text-blue-200">Patient-Friendly Summary</span>
            {simplifiedText && (
              <button 
                onClick={copyToClipboard}
                className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-blue-200/50 dark:bg-blue-700/30 rounded w-3/4"></div>
                <div className="h-4 bg-blue-200/50 dark:bg-blue-700/30 rounded w-full"></div>
                <div className="h-4 bg-blue-200/50 dark:bg-blue-700/30 rounded w-5/6"></div>
              </div>
            ) : simplifiedText ? (
              <div className="prose prose-blue dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {simplifiedText}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-blue-300 dark:text-blue-700/50">
                <FileText size={48} className="mb-4 opacity-50" />
                <p className="text-sm">Simplified explanation will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};