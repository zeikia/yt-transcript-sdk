/**
 * [INPUT]: 依赖 Vitest 与 video.ts 的公开视频 ID 解析接口
 * [OUTPUT]: 验证受支持 URL 形态、原始 ID 和不受信主机拒绝策略
 * [POS]: src 的输入边界回归测试，保护解析能力与主机校验不被弱化
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import { describe, expect, it } from 'vitest';

import { getVideoId, validateYouTubeUrl } from './video';

const videoId = 'dQw4w9WgXcQ';

describe('getVideoId', () => {
  it.each([
    videoId,
    `https://www.youtube.com/watch?v=${videoId}&feature=shared`,
    `https://youtu.be/${videoId}?si=example`,
    `https://www.youtube.com/shorts/${videoId}`,
    `https://www.youtube.com/live/${videoId}`,
    `https://www.youtube-nocookie.com/embed/${videoId}`,
    `music.youtube.com/watch?v=${videoId}`
  ])('extracts an ID from %s', (input) => {
    expect(getVideoId(input)).toBe(videoId);
  });

  it.each([
    '',
    'not-a-video?',
    `https://example.com/watch?v=${videoId}`,
    `https://youtube.com.example.com/watch?v=${videoId}`,
    'https://www.youtube.com/watch?v=too-short'
  ])('rejects invalid input %s', (input) => {
    expect(getVideoId(input)).toBeNull();
    expect(validateYouTubeUrl(input)).toBe(false);
  });
});
