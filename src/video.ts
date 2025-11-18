const VIDEO_ID_PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const RAW_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function getVideoId(input: string): string | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();

  if (RAW_VIDEO_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(VIDEO_ID_PATTERN);
  return match ? match[1] : null;
}

export function validateYouTubeUrl(input: string): boolean {
  return Boolean(getVideoId(input));
}
