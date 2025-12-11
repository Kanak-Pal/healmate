import React, { useState, useRef, useEffect } from 'react';
import { Heart, Camera, AlertCircle, Play, Square, Activity } from 'lucide-react';

export const HeartRateMonitor: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [bpm, setBpm] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("Ready to measure");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processingRef = useRef<number | null>(null);
  
  // Data buffers
  const brightnessBuffer = useRef<number[]>([]);
  const lastPeakTime = useRef<number>(0);
  const peaks = useRef<number[]>([]);
  
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Try to turn on torch
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any; // Cast to any for non-standard torch support
      
      if (capabilities.torch) {
        await track.applyConstraints({
            advanced: [{ torch: true } as any]
        });
      } else {
        setInstruction("Flash not supported. Please use good lighting.");
      }

      setIsScanning(true);
      setInstruction("Gently place your finger over the camera and flash.");
      setProgress(0);
      brightnessBuffer.current = [];
      peaks.current = [];
      setBpm(null);
      
      processFrame();
      
      // Auto stop after 15 seconds
      setTimeout(() => {
        if (streamRef.current) {
          stopCamera();
        }
      }, 15000);

    } catch (err) {
      console.error(err);
      setError("Could not access camera. Please ensure permissions are granted.");
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processingRef.current) {
      cancelAnimationFrame(processingRef.current);
      processingRef.current = null;
    }
    setIsScanning(false);
    
    // Finalize BPM
    if (peaks.current.length > 2) {
      // Calculate average interval
      let sumIntervals = 0;
      for (let i = 1; i < peaks.current.length; i++) {
        sumIntervals += peaks.current[i] - peaks.current[i-1];
      }
      const avgInterval = sumIntervals / (peaks.current.length - 1);
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      // Sanity check
      if (calculatedBpm > 40 && calculatedBpm < 200) {
        setBpm(calculatedBpm);
        setInstruction("Measurement Complete");
      } else {
        setError("Measurement failed. Please try again holding steady.");
      }
    } else {
        setError("Could not detect heartbeat. Ensure finger covers camera fully.");
    }
    
    setProgress(100);
  };

  const processFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw frame to canvas
    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;
    canvasRef.current.width = 50; // Downsample for performance
    canvasRef.current.height = 50;
    
    ctx.drawImage(videoRef.current, 0, 0, width, height, 0, 0, 50, 50);
    
    // Analyze center pixel average for redness
    const frame = ctx.getImageData(0, 0, 50, 50);
    const data = frame.data;
    let totalRed = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      totalRed += data[i];
    }
    const avgRed = totalRed / (data.length / 4);
    
    // Detect finger presence (simplified check: if it's bright enough)
    // Red channel should be high if flash is on and finger is red
    if (avgRed < 50) {
       setInstruction("Finger not detected. Please cover the camera/flash.");
    } else {
       setInstruction("Detecting pulse...");
    }

    // Signal Processing
    const now = Date.now();
    brightnessBuffer.current.push(avgRed);
    if (brightnessBuffer.current.length > 50) brightnessBuffer.current.shift(); // Keep recent window

    // Simple peak detection on the signal
    // Check if current value is a local maximum
    if (brightnessBuffer.current.length > 5) {
        const len = brightnessBuffer.current.length;
        const current = brightnessBuffer.current[len - 1];
        const prev = brightnessBuffer.current[len - 2];
        const prev2 = brightnessBuffer.current[len - 3];
        
        // Very basic peak detection logic
        // Real apps use FFT or more complex filtering
        if (prev > prev2 && prev > current && prev > 100) {
             const timeSinceLastPeak = now - lastPeakTime.current;
             
             // Debounce peaks (human heart rate max ~220bpm => ~272ms)
             if (timeSinceLastPeak > 270 && timeSinceLastPeak < 1500) {
                 peaks.current.push(now);
                 lastPeakTime.current = now;
                 
                 // Live BPM update (optional, might be jittery)
                 // const instantaneousBpm = Math.round(60000 / timeSinceLastPeak);
                 // setBpm(instantaneousBpm);
             } else if (lastPeakTime.current === 0) {
                 lastPeakTime.current = now;
             }
        }
    }
    
    // Update progress
    setProgress(p => Math.min(p + 0.15, 100)); // ~11-12 seconds to 100%

    processingRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-block p-4 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-4">
          <Heart size={48} className={isScanning ? "animate-pulse" : ""} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Heart Rate Monitor</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Measure your heart rate using your smartphone camera.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative transition-colors">
        {/* Main Display Area */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          
          {error ? (
             <div className="text-center text-rose-500 animate-fade-in">
               <AlertCircle size={48} className="mx-auto mb-2" />
               <p>{error}</p>
             </div>
          ) : bpm !== null && !isScanning ? (
            <div className="text-center animate-fade-in">
               <span className="text-6xl font-bold text-slate-800 dark:text-white">{bpm}</span>
               <span className="text-xl text-slate-400 dark:text-slate-500 ml-2">BPM</span>
               <div className="mt-4 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                 Measurement Complete
               </div>
            </div>
          ) : (
            <>
              {isScanning ? (
                <div className="relative w-48 h-48">
                   {/* Circular Progress */}
                   <svg className="w-full h-full transform -rotate-90">
                     <circle
                       cx="96"
                       cy="96"
                       r="88"
                       stroke="currentColor"
                       strokeWidth="12"
                       fill="transparent"
                       className="text-slate-100 dark:text-slate-800"
                     />
                     <circle
                       cx="96"
                       cy="96"
                       r="88"
                       stroke="currentColor"
                       strokeWidth="12"
                       fill="transparent"
                       strokeDasharray={553}
                       strokeDashoffset={553 - (553 * progress) / 100}
                       className="text-rose-500 transition-all duration-200 ease-linear"
                     />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <Heart size={32} className="text-rose-500 fill-rose-500 animate-pulse" />
                      <span className="text-slate-400 dark:text-slate-500 text-xs mt-2 font-mono">Analyzing...</span>
                   </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 dark:text-slate-500">
                  <Activity size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Press Start to begin</p>
                </div>
              )}
            </>
          )}
          
          <p className="mt-6 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
            {instruction}
          </p>
        </div>

        {/* Hidden Technical Elements */}
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas ref={canvasRef} className="hidden" />

        {/* Controls */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          {!isScanning ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/20 transition-all font-bold text-lg"
            >
              <Play size={24} fill="currentColor" />
              {bpm ? 'Measure Again' : 'Start Measurement'}
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all font-bold text-lg"
            >
              <Square size={24} fill="currentColor" />
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 transition-colors">
          <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Camera size={18} /> How it works
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
            Photoplethysmography (PPG) detects blood volume changes in the microvascular bed of tissue. Your phone's flash illuminates the skin, and the camera captures subtle color changes as your heart beats.
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 transition-colors">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
            <AlertCircle size={18} /> Tips for Accuracy
          </h3>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2 list-disc list-inside">
            <li>Gently cover the back camera and flash.</li>
            <li>Don't press too hard (it restricts blood flow).</li>
            <li>Remain still and quiet during the scan.</li>
            <li>Use in a well-lit room if flash fails.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};