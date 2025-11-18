import type { TranscriptFormat, TranscriptFormatResult, TranscriptResponse } from './types';

const MIME_TYPES: Record<TranscriptFormat, string> = {
  txt: 'text/plain; charset=utf-8',
  srt: 'application/x-subrip',
  vtt: 'text/vtt'
};

const DEFAULT_FORMAT: TranscriptFormat = 'txt';

export function formatTranscript(transcript: TranscriptResponse, format: TranscriptFormat = DEFAULT_FORMAT): string {
  switch (format) {
    case 'srt':
      return formatToSrt(transcript);
    case 'vtt':
      return formatToVtt(transcript);
    default:
      return formatToTxt(transcript);
  }
}

export function formatTranscriptFile(
  transcript: TranscriptResponse,
  format: TranscriptFormat = DEFAULT_FORMAT
): TranscriptFormatResult {
  const content = formatTranscript(transcript, format);
  const filename = `transcript-${transcript.videoId}.${format}`;

  return {
    content,
    filename,
    mimeType: MIME_TYPES[format]
  };
}

function pad(num: number, size = 2): string {
  return num.toString().padStart(size, '0');
}

function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(millis, 3)}`;
}

function formatToSrt(transcript: TranscriptResponse): string {
  return transcript.snippets
    .map((snippet, index) => {
      const startTime = formatTimestamp(snippet.start);
      const endTime = formatTimestamp(snippet.start + snippet.duration);
      return `${index + 1}\n${startTime} --> ${endTime}\n${snippet.text}\n`;
    })
    .join('\n');
}

function formatToVtt(transcript: TranscriptResponse): string {
  return `WEBVTT\n\n${transcript.snippets
    .map((snippet) => {
      const startTime = formatTimestamp(snippet.start);
      const endTime = formatTimestamp(snippet.start + snippet.duration);
      return `${startTime} --> ${endTime}\n${snippet.text}`;
    })
    .join('\n\n')}`;
}

function formatToTxt(transcript: TranscriptResponse): string {
  return transcript.snippets.map((snippet) => snippet.text).join('\n');
}
