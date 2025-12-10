import React, { useState } from 'react';
import { MapPin, Search, Navigation, Phone, Star } from 'lucide-react';
import { findNearbyMedicalFacilities } from '../services/geminiService';

export const CareLocator: React.FC = () => {
  const [query, setQuery] = useState('pharmacies');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; chunks: any[] } | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await findNearbyMedicalFacilities(query, { lat: latitude, lng: longitude });
          setResults({ text: data.text || '', chunks: data.groundingChunks });
          setLoading(false);
        }, (error) => {
          alert("Location access denied. Cannot find nearby places.");
          setLoading(false);
        });
      } else {
        alert("Geolocation not supported.");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto h-[calc(100vh-2rem)] md:h-screen flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="text-blue-600" /> Find Care
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Locate nearest pharmacies, clinics, and specialists.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 transition-colors">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for (e.g., '24hr pharmacy', 'cardiologist')"
            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-slate-400"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Locating...' : 'Find Nearby'} <Navigation size={18} />
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
        {results ? (
          <div className="p-6 overflow-y-auto">
             <div className="prose prose-blue dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-6">
               <p className="whitespace-pre-wrap">{results.text}</p>
             </div>
             
             {results.chunks && results.chunks.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {results.chunks.map((chunk, idx) => {
                   const place = chunk.web?.title ? chunk.web : chunk; // Fallback structure
                   return (
                     <div key={idx} className="border border-slate-100 dark:border-slate-700 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                       <h4 className="font-bold text-slate-800 dark:text-white mb-1">{place.title || "Result"}</h4>
                       {place.uri && (
                         <a href={place.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 mt-2">
                           View on Maps <MapPin size={14} />
                         </a>
                       )}
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <MapPin size={64} className="mb-4 opacity-20" />
            <p>Enter a search term and allow location access to find care nearby.</p>
          </div>
        )}
      </div>
    </div>
  );
};