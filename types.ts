
export type AnswerValue = '100' | '50' | '0' | 'NA';

export interface Question {
  id: string;
  text: string;
}

export interface Module {
  id: string;
  title: string;
  questions: Question[];
}

export interface FarmData {
  farmName: string;
  auditorName: string;
  date: string;
  observations?: string;
}

export interface ScoreData {
  percentage: string; // Fixed to 1 decimal string
  earned: number;
  totalPossible: number;
  answeredCount: number;
  totalQuestions: number;
}

export interface ModuleScore {
  id: string;
  title: string;
  score: number;
  earned: number;
  total: number;
  yes: number;
  partial: number;
  no: number;
}
