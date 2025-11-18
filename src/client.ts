import { detectAvailableLanguages, getTranscript } from './transcript';
import { formatTranscript, formatTranscriptFile } from './format';
import { summarizeTranscript } from './summary';
import type {
  LanguageDetectionOptions,
  LanguagesResponse,
  TranscriptClientOptions,
  TranscriptFormat,
  TranscriptFormatResult,
  TranscriptRequestOptions,
  TranscriptResponse,
  TranscriptSummaryOptions,
  TranscriptSummaryResult,
  TranscriptSnippet
} from './types';

export class TranscriptClient {
  constructor(private readonly defaults: TranscriptClientOptions = {}) {}

  async getTranscript(
    videoId: string,
    language?: string,
    overrides: TranscriptRequestOptions = {}
  ): Promise<TranscriptResponse> {
    return getTranscript(videoId, {
      ...this.defaults,
      ...overrides,
      language: overrides.language || language || this.defaults.language
    });
  }

  async detectLanguages(
    videoId: string,
    overrides: LanguageDetectionOptions = {}
  ): Promise<LanguagesResponse> {
    const merged: LanguageDetectionOptions = {
      candidateLanguages: overrides.candidateLanguages || this.defaults.candidateLanguages,
      tactiqEndpoint: overrides.tactiqEndpoint || this.defaults.tactiqEndpoint,
      tactiqRequestConfig: overrides.tactiqRequestConfig || this.defaults.tactiqRequestConfig
    };

    return detectAvailableLanguages(videoId, merged);
  }

  summarize(
    transcript: TranscriptResponse | TranscriptSnippet[],
    options: TranscriptSummaryOptions = {}
  ): TranscriptSummaryResult {
    const snippets = Array.isArray(transcript) ? transcript : transcript.snippets;
    const baseTitle = !Array.isArray(transcript)
      ? `YouTube Video ${transcript.videoId}`
      : undefined;
    const title = options.title || this.defaults.title || baseTitle;

    return summarizeTranscript(snippets, { title });
  }

  format(transcript: TranscriptResponse, formatType: TranscriptFormat = 'txt'): string {
    return formatTranscript(transcript, formatType);
  }

  formatToFile(
    transcript: TranscriptResponse,
    formatType: TranscriptFormat = 'txt'
  ): TranscriptFormatResult {
    return formatTranscriptFile(transcript, formatType);
  }
}
