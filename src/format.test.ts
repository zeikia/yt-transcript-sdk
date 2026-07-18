/**
 * [INPUT]: 依赖 Vitest、format.ts 与 TranscriptResponse 契约
 * [OUTPUT]: 验证字幕标准时间戳、文本输出和异常时间归一化
 * [POS]: src 的格式回归测试，防止不同字幕规范共享错误分隔符
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { describe, expect, it } from 'vitest';

import { formatTranscript, formatTranscriptFile } from './format';
import type { TranscriptResponse } from './types';

const transcript: TranscriptResponse = {
  videoId: 'dQw4w9WgXcQ',
  language: 'en',
  languageCode: 'en',
  snippets: [{ text: 'Hello world', start: 1.25, duration: 2.5 }]
};

describe('formatTranscript', () => {
  it('uses comma-delimited timestamps for SRT', () => {
    expect(formatTranscript(transcript, 'srt')).toContain(
      '00:00:01,250 --> 00:00:03,750'
    );
  });

  it('uses dot-delimited timestamps for WebVTT', () => {
    expect(formatTranscript(transcript, 'vtt')).toBe(
      'WEBVTT\n\n00:00:01.250 --> 00:00:03.750\nHello world'
    );
  });

  it('normalizes invalid and negative timestamps', () => {
    const invalidTranscript: TranscriptResponse = {
      ...transcript,
      snippets: [{ text: 'Safe timestamp', start: Number.NaN, duration: -2 }]
    };

    expect(formatTranscript(invalidTranscript, 'vtt')).toContain(
      '00:00:00.000 --> 00:00:00.000'
    );
  });

  it('returns a stable filename and MIME type', () => {
    expect(formatTranscriptFile(transcript, 'vtt')).toMatchObject({
      filename: 'transcript-dQw4w9WgXcQ.vtt',
      mimeType: 'text/vtt'
    });
  });
});
