import React, { useState, useEffect, useRef } from 'react';
import { Smile, MessageCircle, Phone, Calendar, User, Mic, MicOff } from 'lucide-react';
import { createMentalHealthSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';

export const MentalWellness: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: "Hi, I'm here to listen. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<Chat | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = createMentalHealthSession();
      setSession(s);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const send = async () => {
    if (!input.trim() || !session) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    try {
      const res = await session.sendMessage({ message: input });
      setMessages(p => [...p, { id: Date.now().toString(), role: 'model', text: res.text || "", timestamp: new Date() }]);
    } catch (e) {
      // error handling
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceInput = () => {
    if (isListening) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] md:h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Left Panel: Chat */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Smile className="text-blue-600" /> AI Companion
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">A safe space to share your thoughts.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'}`}>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                className="w-full p-3 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                placeholder="Type here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button 
                onClick={handleVoiceInput}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
            <button onClick={send} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <MessageCircle />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Consultants */}
      <div className="w-80 bg-slate-50 dark:bg-slate-950 p-6 hidden lg:block overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <User size={18} /> Speak to a Professional
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">Dr</div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm">Dr. Sarah Smith</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clinical Psychologist</p>
                </div>
              </div>
              <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center justify-center gap-2 transition-colors">
                <Calendar size={14} /> Book Session
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30">
          <h4 className="text-rose-800 dark:text-rose-300 font-bold text-sm mb-2 flex items-center gap-2">
            <Phone size={14} /> Crisis Support
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 mb-2">If you are in danger, please call emergency services immediately.</p>
          <div className="text-lg font-bold text-rose-600 dark:text-rose-400">988</div>
        </div>
      </div>
    </div>
  );
};