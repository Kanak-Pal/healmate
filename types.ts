export type ViewState = 'dashboard' | 'chat' | 'analysis' | 'reports' | 'medications' | 'diet' | 'locator' | 'mental-health' | 'journal' | 'labs' | 'community';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AnalysisResult {
  title: string;
  findings: string[];
  recommendation: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Unknown';
}

export interface HealthMetric {
  date: string;
  value: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: 'Great' | 'Good' | 'Okay' | 'Bad' | 'Awful';
  notes: string;
  sleepHours: number;
}

export type CompanionCharacter = 'ZenBot' | 'HealthPup' | 'CareKitty' | 'WiseOwl';