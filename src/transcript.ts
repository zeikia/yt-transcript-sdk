import axios, { type AxiosRequestConfig } from 'axios';
import { YouTubeTranscriptApi } from 'youtube-transcript-js-api';

import { DEFAULT_LANGUAGE_PROBE_ORDER, DEFAULT_TACTIQ_ENDPOINT, LANGUAGE_DISPLAY_NAMES } from './constants';
import type {
  LanguageDetectionOptions,
  LanguageOption,
  LanguagesResponse,
  TranscriptRequestOptions,
  TranscriptResponse,
  TranscriptSnippet
} from './types';

const DEFAULT_LANGUAGE = 'en';
const YOUTUBE_URL_PREFIX = 'https://www.youtube.com/watch?v=';

async function fetchFromTactiq(
  videoId: string,
  language: string,
  endpoint: string,
  requestConfig?: AxiosRequestConfig
): Promise<TranscriptSnippet[]> {
  const videoUrl = `${YOUTUBE_URL_PREFIX}${videoId}`;
  const config: AxiosRequestConfig = {
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    },
    ...requestConfig
  };

  const response = await axios.post(
    endpoint,
    {
      langCode: language || DEFAULT_LANGUAGE,
      videoUrl
    },
    config
  );

  const captions = response.data?.captions ?? [];

  if (!Array.isArray(captions) || captions.length === 0) {
    return [];
  }

  return captions.map((caption: any) => ({
    text: caption.text ?? '',
    start: typeof caption.start === 'number' ? caption.start : caption.offset ?? 0,
    duration: typeof caption.dur === 'number' ? caption.dur : caption.duration ?? 0
  }));
}

async function fetchFromYoutubeAPI(videoId: string, language: string): Promise<TranscriptSnippet[]> {
  const api = new YouTubeTranscriptApi();
  const transcript = await api.getTranscript(`${YOUTUBE_URL_PREFIX}${videoId}`, [language, DEFAULT_LANGUAGE] as any);

  return transcript.map((entry: any) => ({
    text: entry.text ?? '',
    start: typeof entry.start === 'number' ? entry.start : entry.offset ?? 0,
    duration: typeof entry.duration === 'number' ? entry.duration : 0
  }));
}

function createResponse(
  videoId: string,
  language: string,
  snippets: TranscriptSnippet[],
  source: string,
  responseTime: number,
  fallbackMessage?: string
): TranscriptResponse {
  return {
    snippets,
    videoId,
    language,
    languageCode: language,
    count: snippets.length,
    source,
    responseTime,
    primaryError: fallbackMessage
  };
}

export async function getTranscript(
  videoId: string,
  options: TranscriptRequestOptions = {}
): Promise<TranscriptResponse> {
  const language = options.language || DEFAULT_LANGUAGE;
  const tactiqEndpoint = options.tactiqEndpoint || DEFAULT_TACTIQ_ENDPOINT;
  const enableFallback = options.enableFallback ?? true;
  const startTime = Date.now();

  try {
    const snippets = await fetchFromTactiq(videoId, language, tactiqEndpoint, options.tactiqRequestConfig);

    if (snippets.length > 0) {
      return createResponse(videoId, language, snippets, 'tactiq-primary', Date.now() - startTime);
    }

    if (!enableFallback) {
      throw new Error('Primary transcript service returned empty result');
    }

    const fallbackSnippets = await fetchFromYoutubeAPI(videoId, language);
    return createResponse(
      videoId,
      language,
      fallbackSnippets,
      'youtube-transcript-js-api-backup',
      Date.now() - startTime,
      'Empty result from primary'
    );
  } catch (primaryError) {
    if (!enableFallback) {
      throw primaryError instanceof Error ? primaryError : new Error(String(primaryError));
    }

    const fallbackSnippets = await fetchFromYoutubeAPI(videoId, language);
    return createResponse(
      videoId,
      language,
      fallbackSnippets,
      'youtube-transcript-js-api-backup',
      Date.now() - startTime,
      primaryError instanceof Error ? primaryError.message : String(primaryError)
    );
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function detectAvailableLanguages(
  videoId: string,
  options: LanguageDetectionOptions = {}
): Promise<LanguagesResponse> {
  const candidateLanguages = options.candidateLanguages || DEFAULT_LANGUAGE_PROBE_ORDER;
  const detected: LanguageOption[] = [];
  const tactiqEndpoint = options.tactiqEndpoint || DEFAULT_TACTIQ_ENDPOINT;

  for (let i = 0; i < candidateLanguages.length; i += 4) {
    const batch = candidateLanguages.slice(i, i + 4);
    const results = await Promise.all(
      batch.map(async (code) => {
        try {
          const snippets = await fetchFromTactiq(videoId, code, tactiqEndpoint, {
            timeout: options.tactiqRequestConfig?.timeout ?? 8000,
            ...(options.tactiqRequestConfig || {})
          });

          if (snippets.length > 0 && snippets.some((snippet) => snippet.text?.trim().length > 0)) {
            return {
              languageCode: code,
              name: LANGUAGE_DISPLAY_NAMES[code] || code.toUpperCase(),
              vssId: code,
              isTranslatable: true
            } satisfies LanguageOption;
          }

          return null;
        } catch {
          return null;
        }
      })
    );

    results.forEach((result) => {
      if (result) {
        detected.push(result);
      }
    });

    if (detected.length >= 3) {
      break;
    }

    if (i + 4 < candidateLanguages.length) {
      await sleep(150);
    }
  }

  if (!detected.length) {
    detected.push({
      languageCode: DEFAULT_LANGUAGE,
      name: LANGUAGE_DISPLAY_NAMES[DEFAULT_LANGUAGE],
      vssId: DEFAULT_LANGUAGE,
      isTranslatable: true
    });
  }

  return {
    languages: detected,
    videoId,
    count: detected.length
  };
}
