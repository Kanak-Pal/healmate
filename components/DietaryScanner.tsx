import React, { useState, useRef } from 'react';
import { Utensils, Upload, AlertTriangle, Check, Loader2, Camera } from 'lucide-react';
import { analyzeDietCompatibility } from '../services/geminiService';
import { Medication } from '../types';

interface DietaryScannerProps {
  medications: Medication[];
}

export const DietaryScanner: React.FC<DietaryScannerProps> = ({ medications }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const match = image.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        const data = await analyzeDietCompatibility(match[2], match[1], medications.map(m => m.name));
        setResult(data);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to analyze diet. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Utensils className="text-blue-600" /> Dietary Compatibility
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Check if your food interacts with your medications.</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 mb-8 flex gap-3 transition-colors">
        <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-sm">Active Medications Checked:</h4>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            {medications.length > 0 ? medications.map(m => m.name).join(", ") : "None recorded (Please add in Medications tab)"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div 
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all relative overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Food" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <Camera size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Click to upload food photo</p>
              </div>
            )}
            <input type="file" ref={fileRef} onChange={handleFile} className="hidden" accept="image/*" />
          </div>
          <button 
            onClick={analyze}
            disabled={!image || analyzing}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 flex justify-center gap-2"
          >
            {analyzing ? <Loader2 className="animate-spin" /> : 'Analyze Compatibility'}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[320px] transition-colors">
          {!result && !analyzing && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center">
              <Utensils size={40} className="mb-4 opacity-20" />
              <p>Upload a photo to see nutritional info and interactions.</p>
            </div>
          )}
          
          {analyzing && (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={32} />
              <p className="text-slate-500 dark:text-slate-400">Checking interactions...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{result.foodName}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.suitability === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  result.suitability === 'Moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {result.suitability} Suitability
                </span>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300">
                <strong>Nutrition:</strong> {result.nutrition}
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Medication Interactions</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{result.interactions}</p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Recommendation</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{result.advice}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};