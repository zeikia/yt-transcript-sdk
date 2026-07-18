/**
 * [INPUT]: 依赖 Vitest、axios 与 youtube-transcript 的可控模块替身
 * [OUTPUT]: 验证主源失败后的回退响应、来源标识和毫秒到秒归一化
 * [POS]: src 的网络边界回归测试，不发起真实第三方请求
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import axios from 'axios';
import { fetchTranscript } from 'youtube-transcript';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getTranscript } from './transcript';

vi.mock('axios', () => ({ default: { post: vi.fn() } }));
vi.mock('youtube-transcript', () => ({ fetchTranscript: vi.fn() }));

describe('getTranscript fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('normalizes fallback millisecond timestamps to seconds', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('primary unavailable'));
    vi.mocked(fetchTranscript).mockResolvedValue([
      { text: 'Hello', offset: 1360, duration: 1680, lang: 'en' },
      { text: 'World', offset: 3040, duration: 3240, lang: 'en' }
    ]);

    const result = await getTranscript('dQw4w9WgXcQ', { language: 'en' });

    expect(result.source).toBe('youtube-transcript-backup');
    expect(result.primaryError).toBe('primary unavailable');
    expect(result.snippets).toEqual([
      { text: 'Hello', start: 1.36, duration: 1.68 },
      { text: 'World', start: 3.04, duration: 3.24 }
    ]);
  });
});
