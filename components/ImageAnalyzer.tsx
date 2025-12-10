import React, { useState, useRef } from 'react';
import { Upload, X, Scan, AlertTriangle, CheckCircle, FileUp, Loader2 } from 'lucide-react';
import { analyzeMedicalImage } from '../services/geminiService';
import { AnalysisResult } from '../types';

export const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data and mime type
      const match = selectedImage.match(/^data:(.*);base64,(.*)$/);
      if (!match) throw new Error("Invalid image format");
      
      const mimeType = match[1];
      const base64Data = match[2];

      const analysisData = await analyzeMedicalImage(base64Data, mimeType);
      setResult(analysisData);
    } catch (err) {
      setError("Failed to analyze image. Please try again with a clear medical image.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <Scan className="text-blue-600" />
          Medical Image Analysis
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Upload X-rays, skin lesions, or test results for instant AI assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all ${
              selectedImage ? 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            {selectedImage ? (
              <div className="relative w-full h-full p-4">
                <img 
                  src={selectedImage} 
                  alt="Upload preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
                <button 
                  onClick={clearSelection}
                  className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-800/90 shadow-md rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileUp size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Drop your image here</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 mb-6">Supports JPG, PNG (Max 5MB)</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Browse Files
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isAnalyzing}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              !selectedImage 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : isAnalyzing
                  ? 'bg-blue-600/80 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing Image...
              </>
            ) : (
              <>
                <Scan size={20} /> Analyze Now
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 min-h-[320px] transition-colors">
          {error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-rose-500">
              <AlertTriangle size={48} className="mb-4 opacity-50" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!result && !error && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-600">
              <Scan size={48} className="mb-4 opacity-20" />
              <p>Result will appear here after analysis</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin"></div>
               <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Consulting Gemini Medical Model...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{result.title}</h3>
                  <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    result.severity === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' :
                    result.severity === 'Moderate' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }`}>
                    Severity: {result.severity}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full text-blue-600 dark:text-blue-400">
                  <CheckCircle size={24} />
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold mb-3">Key Findings</h4>
                <ul className="space-y-2">
                  {result.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-sm uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold mb-2">Recommendation</h4>
                <p className="text-slate-700 dark:text-slate-300">{result.recommendation}</p>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                * Automated analysis provided by Gemini AI. Not a medical diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};