/**
 * [INPUT]: 接收 YouTube 原始视频 ID 或公开页面 URL
 * [OUTPUT]: 对外提供严格的视频 ID 提取与 URL 有效性判断
 * [POS]: src 的输入边界层，先验证受信主机再把规范化 ID 交给转录模块
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
const RAW_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com'
]);
const PATH_BASED_ROUTES = new Set(['embed', 'live', 'shorts', 'v']);

function asVideoId(value: string | null | undefined): string | null {
  return value && RAW_VIDEO_ID_PATTERN.test(value) ? value : null;
}

export function getVideoId(input: string): string | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();

  if (RAW_VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'youtu.be' || hostname === 'www.youtu.be') {
      return asVideoId(url.pathname.split('/').filter(Boolean)[0]);
    }

    if (!YOUTUBE_HOSTS.has(hostname)) {
      return null;
    }

    if (url.pathname === '/watch') {
      return asVideoId(url.searchParams.get('v'));
    }

    const [route, id] = url.pathname.split('/').filter(Boolean);
    return PATH_BASED_ROUTES.has(route) ? asVideoId(id) : null;
  } catch {
    return null;
  }
}

export function validateYouTubeUrl(input: string): boolean {
  return Boolean(getVideoId(input));
}
