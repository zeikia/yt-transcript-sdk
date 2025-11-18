import type { AxiosRequestConfig } from 'axios';

export type TranscriptFormat = 'txt' | 'srt' | 'vtt';

export interface TranscriptSnippet {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptResponse {
  snippets: TranscriptSnippet[];
  videoId: string;
  language: string;
  languageCode: string;
  count?: number;
  source?: string;
  responseTime?: number;
  primaryError?: string;
}

export interface TranscriptRequestOptions {
  language?: string;
  tactiqEndpoint?: string;
  tactiqRequestConfig?: AxiosRequestConfig;
  enableFallback?: boolean;
  youtubeRequestConfig?: Record<string, unknown>;
}

export interface LanguageOption {
  languageCode: string;
  name: string;
  vssId?: string;
  isTranslatable?: boolean;
}

export interface LanguagesResponse {
  languages: LanguageOption[];
  videoId: string;
  count: number;
}

export interface LanguageDetectionOptions {
  candidateLanguages?: string[];
  tactiqRequestConfig?: AxiosRequestConfig;
  tactiqEndpoint?: string;
}

export interface TranscriptFormatResult {
  content: string;
  filename: string;
  mimeType: string;
}

export interface SummaryQuestion {
  question: string;
  answer: string;
  timestamp?: string;
}

export interface TranscriptSummaryResult {
  summary: string;
  keyPoints: string[];
  topQuestions: SummaryQuestion[];
  duration: number;
}

export interface TranscriptSummaryOptions {
  title?: string;
}

export interface TranscriptClientOptions
  extends TranscriptRequestOptions,
    LanguageDetectionOptions,
    TranscriptSummaryOptions {}
