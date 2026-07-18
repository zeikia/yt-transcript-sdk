/**
 * [INPUT]: 依赖 types.ts 的转录数据与输出格式契约
 * [OUTPUT]: 对外提供 TXT、SRT、WebVTT 文本及文件描述格式化能力
 * [POS]: src 的纯格式转换层，不负责抓取数据或执行文件系统写入
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
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

function formatTimestamp(seconds: number, decimalMarker: ',' | '.'): string {
  const normalizedSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const totalMilliseconds = Math.round(normalizedSeconds * 1000);
  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((totalMilliseconds % 60_000) / 1000);
  const millis = totalMilliseconds % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}${decimalMarker}${pad(millis, 3)}`;
}

function formatToSrt(transcript: TranscriptResponse): string {
  return transcript.snippets
    .map((snippet, index) => {
      const startTime = formatTimestamp(snippet.start, ',');
      const endTime = formatTimestamp(snippet.start + snippet.duration, ',');
      return `${index + 1}\n${startTime} --> ${endTime}\n${snippet.text}\n`;
    })
    .join('\n');
}

function formatToVtt(transcript: TranscriptResponse): string {
  return `WEBVTT\n\n${transcript.snippets
    .map((snippet) => {
      const startTime = formatTimestamp(snippet.start, '.');
      const endTime = formatTimestamp(snippet.start + snippet.duration, '.');
      return `${startTime} --> ${endTime}\n${snippet.text}`;
    })
    .join('\n\n')}`;
}

function formatToTxt(transcript: TranscriptResponse): string {
  return transcript.snippets.map((snippet) => snippet.text).join('\n');
}
